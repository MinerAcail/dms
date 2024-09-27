import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import FormInput from "./form";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/middleware/context/authContext";

export const CREATE_SUB_MUTATION = gql`
  mutation createSubChurch($subChurchName: String!,,$branch:Boolean!) {
    createSubChurch(subChurchName: $subChurchName,branch:$branch) {
      id
      name
    }
  }
`;

const FormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

/////////here leader/////////okey
const LeaderForm = () => {
  const { user } = useAuth();

  const subChurch = user?.types === "subChurch";
  let branch:boolean = false;
  if (subChurch) {
    branch= true
  }

  const [createSubChurch, { loading }] = useMutation(CREATE_SUB_MUTATION);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      setErrorMessages([]); // Clear error messages before making the mutation
      console.log(values);

      const { data, errors } = await createSubChurch({
        variables: { subChurchName: values.name,branch }, // Corrected variable name
      });

      if (errors) {
        throw new ApolloError({
          graphQLErrors: errors,
        });
      }

      // Handle successful submission here
      console.log("Mutation response:", data);
      // Reset the form after a successful submission
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
    <main className="w-10/12 m-auto flex flex-col justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-3">
            <FormInput
              control={form.control}
              name={"name"}
              placeholder={`${subChurch ? "Media" : "Dominion"}`}
              label={`${subChurch ? "Sub Branch" : "Sub Church Name"}`}
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

export default LeaderForm;

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
