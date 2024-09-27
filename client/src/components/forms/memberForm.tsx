import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import FormInput from "./form";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useParams } from "react-router-dom";
import { useAuth } from "@/middleware/context/authContext";
import { _ARRAY_MEMBERS_QUERY } from "../CareList/list";



export const CREATE_LEADER_MUTATION = gql`
  mutation createMember($input: CreateMemberInput) {
    createMember(input: $input) {
      id
      name
      phoneNumber
      types
    }
  }
`;

const FormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  location: z.string().min(1, "Location is required"),
  phoneNumber: z.string().min(1, "phoneNumber is required"),
  day: z.string().min(1, "Day is required"),
});

/////////here leader/////////okey
const MemberForm = () => {
  const { memberid } = useParams();
  const { user } = useAuth();
  const mleaderID = user?.id;

  const [createMember, { loading }] = useMutation(CREATE_LEADER_MUTATION);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
      phoneNumber: "",
      day: "",
    },
  });

  useEffect(() => {
    // Clear the success message after 5 seconds
    if (successMessage) {
      const timerId = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      // Clean up the timer on component unmount
      return () => clearTimeout(timerId);
    }
  }, [successMessage]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      setErrorMessages([]); // Clear error messages before making the mutation
      console.log(values);
      const storedUserData = localStorage.getItem("userData");
      const cleanedStoredUserData = storedUserData?.replace(/^"|"$/g, ''); // Remove surrounding double quotes


      const { data, errors } = await createMember({
        variables: {
          input: {
            name: values.name,
            email: values.email,
            location: values.location,
            phoneNumber: values.phoneNumber,
            day: values.day,
            churchId: memberid ? memberid :user?.subChurchID,
          },
        },
        refetchQueries: [{ query: _ARRAY_MEMBERS_QUERY, variables: { mleaderID }}],
        
      });

      if (errors) {
        throw new ApolloError({
          graphQLErrors: errors,
        });
      }

      // Handle successful submission here
      console.log("Mutation response:", data);
      setSuccessMessage(
        `${data.createMember.name} has been successfully created.`
      );

      // Reset the form after a successful submission
      form.reset();
      form.reset();
    } catch (error) {
      if (error instanceof ApolloError) {
        const errorMessages = error.graphQLErrors.map((err) => err.message);
        setErrorMessages(errorMessages);
        console.error("GraphQL errors:", errorMessages);
      } else {
        console.error("Other error:", error);
      }
    }
  };

  return (
    <main className="w-6/12 m-auto flex flex-col justify-center items-center">
      {successMessage && (
        <div className="text-fuchsia-900 font-bold mb-4">{successMessage}</div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-3">
            <FormInput
              control={form.control}
              name={"name"}
              placeholder={"John"}
              label={"User Name"}
            />
            <FormInput
              control={form.control}
              name={"email"}
              placeholder={"mail@example.com"}
              label={"Email"}
            />
            <FormInput
              control={form.control}
              name={"day"}
              placeholder={"Day"}
              label={"Monday Tuesday Wednesday Thursday Friday Saturday Sunday"}
            />
            <FormInput
              control={form.control}
              name={"phoneNumber"}
              placeholder={"Phone Number"}
              label={"Phone Number"}
            />
            <FormInput
              control={form.control}
              name={"location"}
              placeholder={"Location"}
              label={"Location"}
            />
          </div>

          {errorMessages.length > 0 && (
            <div className="mt-4 text-red-500">
              {errorMessages.map((message, index) => (
                <p key={index}>{message}</p>
              ))}
            </div>
          )}
          <p className="text-center text-sm text-gray-600 mt-2">
            Please make sure to fill in all the required information
            <Button
              disabled={loading}
              className="flex justify-center items-center mt-6 p-6"
              type="submit"
            >
              {loading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </p>
        </form>
      </Form>
    </main>
  );
};

export default MemberForm;

/* import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { HandMetal } from 'lucide-react';

const Navbar = () => {
  return (
    <div className=' bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>
      <div className='container flex items-center justify-between'>
        <Link href='/'>
          <HandMetal />
        </Link>
        <Link className={buttonVariants()} href='/sign-in'>
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Navbar; */
