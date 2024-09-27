import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import FormInput from "./form";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const SIGN_UP = gql`
  mutation createLeader($input: CreateLeaderInput!) {
    createLeader(input: $input) {
      id
      name
      token
      types
    }
  }
`;

const FormSchema = z.object({
  name: z.string().min(1, "name is required").max(100),
  phoneNumber: z.string().min(1, "Phone Number is required").max(12),
  email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(4, "Password must have than 8 characters"),
  confirmPassword: z.string().min(1, "Password confirmation is required"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

const SignUpForm = () => {
  const [signUpMutation, { loading }] = useMutation(SIGN_UP);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    console.log(values);

    try {
      setErrorMessages([]); // Clear error messages before making the mutation

      const { data, errors } = await signUpMutation({
        variables: { input: values },
      });

      if (errors) {
        throw new ApolloError({
          graphQLErrors: errors,
        });
      }

      // Reset the form to its initial state
      form.reset();
      console.log(data);
    } catch (error) {
      if (error instanceof ApolloError) {
        // Handle ApolloError and display errors to the user
        const errorMessages = error.graphQLErrors.map((err) => err.message);
        setErrorMessages(errorMessages);
        console.error("GraphQL errors:", errorMessages);

        // Set error messages in your form state or display them to the user
      } else {
        console.error("Other error:", error);
      }
    }
  };

  return (
    <main className="w-6/12 m-auto flex flex-col justify-center items-center">
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
              name={"phoneNumber"}
              placeholder={"23444"}
              label={"User phone Number"}
            />
            <FormInput
              control={form.control}
              name={"email"}
              placeholder={"mail@example.com"}
              label={"Email"}
            />
            <FormInput
              control={form.control}
              name={"password"}
              placeholder={"Enter your password"}
              label={"Password"}
              type="password"
            />
            <FormInput
              control={form.control}
              name={"confirmPassword"}
              placeholder={"Confirm Password"}
              label={"Re-Enter your password"}
              type="password"
            />
        {errorMessages.length > 0 && (
          <div className="mt-4 text-red-500">
            {errorMessages.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
        )}
          </div>

        <Button
          disabled={loading}
          className="flex justify-center items-center mt-6 p-6 "
          type="submit"
        >
          {loading ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Sign up
            </>
          ) : (
            "Sign up"
          )}
        </Button>
      </form>
        <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
          or
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          If you don&apos;t have an account, please&nbsp;
          <Button variant="link" className="text-blue-500 hover:underline">
            Sign in
          </Button>
        </p>
      </Form>
    </main>
  );
};

export default SignUpForm;



