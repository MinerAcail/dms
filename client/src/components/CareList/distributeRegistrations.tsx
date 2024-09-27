import { ApolloError, gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Button } from "../ui/button";
import { useAuth } from "@/middleware/context/authContext";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import RadioInput from "./GetCallerRadioInput";
const __CALLERS_QUERY = gql`
subscription Subscribe{
  currentTime {
    unixTime
    timeStamp
  }
}
`;

const _GET_CALLERS_QUERY = gql`
  query GetCaller {
  GetCaller {
   id
    name
  
  }
}
`;
// Define the GraphQL mutation to distribute registrations to leaders
const DISTRIBUTE_REGISTRATIONS_MUTATION = gql`
  mutation DistributeRegistrationsToLeaders($leaderIds: [String!]!) {
    distributeRegistrationsToLeaders(leaderIds: $leaderIds) {
      leaderID
      registrationIDs
    }
  }
`;
//////////////////try
const DistributeRegistrations = () => {
  // const { user } = useAuth();

  // const Ids = user?.login.id;

  const {
    data: Data,
  } = useQuery(_GET_CALLERS_QUERY);
  const {
    data: Dmata,
    
  } = useSubscription(__CALLERS_QUERY,
    {
      onSubscriptionData: (data) =>{
        console.log("mss");
        
      }
    }
    );
  console.log(Data?.GetCaller);
  console.log(Dmata);


   // State to track selected callers
   const [selectedCallers, setSelectedCallers] = useState<string[]>([]);
    // UseMutation hook to execute the distribution mutation
  const [distributeRegistrationsToLeaders,{ loading:dataLoading }] = useMutation(
    DISTRIBUTE_REGISTRATIONS_MUTATION
  );
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

 
  // Handle checkbox change
  const handleCheckboxChange = (callerId: string): void => {
    // Check if the callerId is already in the selectedCallers array
    if (selectedCallers.includes(callerId)) {
      // Caller is already selected, remove them
      setSelectedCallers((prevSelectedCallers) =>
        prevSelectedCallers.filter((id) => id !== callerId)
      );
    } else {
      // Caller is not in the selected list, add them
      setSelectedCallers((prevSelectedCallers) => [
        ...prevSelectedCallers,
        callerId,
      ]);
    }
  };

   // Handle form submission
   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Log the selected caller IDs
      console.log("Selected Caller IDs:", selectedCallers);
 // Execute the distribution mutation with selectedCaller IDs
 const { data } = await distributeRegistrationsToLeaders({
  variables: { leaderIds: selectedCallers },
});
        // Handle successful response, if needed...
        console.log("Mutation response:", data);
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
    <main className=" m-auto flex flex-col justify-center items-center">
      <div>
        <form className="w-full " onSubmit={handleSubmit}>
          <div className="gap-5 md:grid md:grid-cols-3 md:py-7">
          {Data?.GetCaller.map((caller: any) => (
              <RadioInput
                key={caller.id}
                name={caller.name}
                isChecked={caller.isChecked}
                onChange={() => handleCheckboxChange(caller.id)}
              />
            ))}
          </div>

          {errorMessages.length > 0 && (
            <div className="mt-4 text-red-500">
              {errorMessages.map((Message, index) => (
                <p key={index}>{Message}</p>
              ))}
            </div>
          )}
          <p className="text-center text-sm text-gray-600 mt-2">
            Please make sure to full all the given List
            <Button
              disabled={dataLoading}
              className="flex justify-center items-center mt-6 p-6 "
              type="submit"
            >
              {dataLoading ? ( // Display the loading icon when loading
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                 Distributing..
                </>
              ) : (
                "Save Distribution"
              )}
            </Button>
          </p>
        </form>
      </div>
    </main>
  );
};

export default DistributeRegistrations;
