import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import FormInput from "./form";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

import { useAuth } from "@/middleware/context/authContext";



export const UPDATE_LEADER_MUTATION = gql`
 mutation UpdateLeader($inputProfile: updateLeaderProfileInput!, $memberId: String!) {
  updateLeader(input: $inputProfile, memberId: $memberId) {
    id
    name
    types
    subChurchID
    token
    phoneNumber
    day
  }
}
`;

const FormSchema = z.object({
  name: z.string().optional() ,
  email: z.string().optional(),
  location: z.string().optional(),
  phoneNumber: z.string(),
  oldpassword: z.string().min(1, "Your old password is required"),
  password: z.string().optional(),
});


/////////here leader/////////okey
const LeaderProfile = () => {
 
  const { user,login } = useAuth();
  const [updateLeader, { loading }] = useMutation(UPDATE_LEADER_MUTATION);

  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
      phoneNumber: "",
      oldpassword: "",
      password: "",

      
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
    const inputProfile = {
      // Only include fields with values
      ...(values.name && { name: values.name }),
      ...(values.email && { email: values.email }),
      ...(values.location && { location: values.location }),
      ...(values.phoneNumber && { phoneNumber: values.phoneNumber }),
      oldpassword: values.oldpassword,
      ...(values.password && { password: values.password }),
    };
    try {
      setErrorMessages([]); // Clear error messages before making the mutation
    

      const { data, errors } = await updateLeader({
        variables: {
          inputProfile,
          memberId: user?.id || "", // Pass the user's ID as memberId
        },
      });

      if (errors) {
        throw new ApolloError({ 
          graphQLErrors: errors,
        });
      }

      // Handle successful submission here
      if (data && data.updateLeader) {
        login(data.updateLeader); // Update user profile data in context
        setSuccessMessage(`${data.updateLeader.name} profile has been updated.`);
      }

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
              <FormInput
              control={form.control}
              name={"oldpassword"}
              placeholder={"Old Password"}
              label={"Old password"}
            />
             <FormInput
              control={form.control}
              name={"password"}
              placeholder={"Password"}
              label={"password"}
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

export default LeaderProfile;

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
