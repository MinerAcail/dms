import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Form } from '../ui/form';
import { Button } from '../ui/button';
import FormInput from './form';

const CREATE_MEMBER_MUTATION = gql`
 mutation createMember($input:CreateMemberInput){
  createMember(input:$input){
    id
    name
    phoneNumber
    types
  }
}

`;

const FormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().min(1, 'Email is required'),
  location: z.string().min(1, 'Location is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  day: z.string().min(1, 'Day is required'),
});

const CareForm = () => {
  const [createMember, { loading }] = useMutation(CREATE_MEMBER_MUTATION);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message


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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      location: '',
      phoneNumber: '',
      day: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      setErrorMessages([]); // Clear error messages before making the mutation

      const { data, errors } = await createMember({
        variables: { input: values }, // Corrected variable name
      });

      if (errors) {
        throw new ApolloError({
          graphQLErrors: errors,
        });
      }
      
      // Handle successful submission here
      console.log("Mutation response:", data);
      // Reset the form after a successful submission
      setSuccessMessage(`${data.createMember.name} has been successfully as ${data.createMember.types}.`);

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
          <div className='gap-5 md:grid md:grid-cols-2 md:py-7'>
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
              label={"Day of the week"} // Changed the label to provide clarity
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

export default CareForm;


