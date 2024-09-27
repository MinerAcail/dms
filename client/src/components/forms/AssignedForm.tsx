import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Form } from '../ui/form';
import { Button } from '../ui/button';
import FormInput from './form';
import { useParams } from 'react-router-dom';

const ASSIGNED_MEMBER_MUTATION = gql`
 mutation AssignLeader($input:assignLeaderInput){
  assignLeader(input:$input){
    id
    name
    phoneNumber
    types
    password
    token
    createdAt
    updatedAt
  }
}
`;

const FormSchema = z.object({
  types: z.string().min(1, 'Types is required').max(100),
  password: z
  .string()
  .min(1, "Password is required")
  .min(4, "Password must have than 8 characters")
});

const Assigned = () => {
  const { assignid } = useParams();

  const [assignLeader, { loading }] = useMutation(ASSIGNED_MEMBER_MUTATION);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      types: '',
      password: '',
     
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

      const { data, errors } = await assignLeader({
        variables: {
          input: {
            types: values.types,
            password: values.password,
            memberId: assignid,
          },
        }, 
      });

      if (errors) {
        throw new ApolloError({
          graphQLErrors: errors,
        });
      }
      
      // Handle successful submission here
      console.log("Mutation response:", data);
      // Reset the form after a successful submission
      setSuccessMessage(`${data.assignLeader.name} has been successfully as ${data.assignLeader.types}.`);

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
    <main className='m-auto flex flex-col justify-center items-center'>
       {successMessage && (
        <div className="text-fuchsia-900 font-bold mb-4">{successMessage}</div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
          <div className='gap-5 md:grid md:grid-cols-2 md:py-7'>
            <FormInput
              control={form.control}
              name={"types"}
              placeholder={"types"}
              label={"Only for Caller/ Leader/ SubLeader"}
            />
            <FormInput
              control={form.control}
              name={"password"}
              placeholder={"5 easly secure password"}
              label={"Password"}
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

export default Assigned;


