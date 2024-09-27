import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { Button } from "../ui/button";
import CheckRadioInput from "./radioInput";
import { useAuth } from "@/middleware/context/authContext";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";

const CREATE_ARRAY_REGISTRATION_MUTATION = gql`
  mutation CreateRegistrationArray($input: [RegistrationArrayInput]!) {
    createRegistrationArray(input: $input) {
      
      absence
      present
      memberID
      member {
        name
        id
      }
    }
  }
`;
export const _ARRAY_MEMBERS_QUERY = gql`
  query GetAllMembersByLeader($leaderID: String!) {
    GetAllMembersByLeader(leaderID: $leaderID) {
      id
      name
      day
      subChurchID
    }
  }
`;

//////////////////try
const CareListComponent = () => {
  const { user } = useAuth();

  const Ids = user?.id;
  

  const {
    loading,

    data: memberData,
  } = useQuery(_ARRAY_MEMBERS_QUERY, {
    variables: { leaderID: Ids },
  });

  console.log(memberData);

  // Initialize registrationData with absence: true and present: false for all members
  const initialRegistrationData =
    memberData?.GetAllMembersByLeader.reduce(
      (acc: any, member: { id: any }) => ({
        ...acc,
        [member.id]: {
          present: false, // Set default value for unchecked (absence)
          absence: true, // Set default value for checked (present)
        },
      }),
      {}
    ) || {};

  console.log(memberData?.GetAllMembersByLeader);
  const [createRegistrationArray, { loading: dataLoading }] = useMutation(
    CREATE_ARRAY_REGISTRATION_MUTATION
  );

  const [registrationData, setRegistrationData] = useState(
    initialRegistrationData
  );
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  type RegistrationData = {
    [memberId: string]: {
      present: boolean;
      absence: boolean;
    };
  };
  type MemberId = string;
  type IsChecked = boolean;

  type MemberType = {
    id: string;
    name: string;
    // ...other properties
  };
  // Define a type for your member objects

  // Define a type for the registration array input
  type RegistrationArrayInputType = {
    memberId: string;
    createInput: {
      present: boolean;
      absence: boolean;
    };
  };
  const handleCheckboxChange = (
    memberId: MemberId,
    isChecked: IsChecked
  ): void => {
    setRegistrationData((prevData: RegistrationData) => ({
      ...prevData,
      [memberId]: {
        ...prevData[memberId],
        present: isChecked,
        absence: !isChecked,
      },
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      // ...

      const registrationArrayInput: RegistrationArrayInputType[] =
        memberData?.GetAllMembersByLeader.map((member: MemberType) => ({
          memberId: member.id,
          createInput: {
            present: registrationData[member.id]?.present || false,
            absence: !registrationData[member.id]?.present || false,
          },
        })) || [];

      //Execute the mutation here...
      const { data } = await createRegistrationArray({
        variables: { input: registrationArrayInput },
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
          <div className="gap-5 md:grid md:grid-cols-2 lg:grid-cols-3 md:py-7">
            {memberData?.GetAllMembersByLeader.map((member: MemberType) => (
              <CheckRadioInput
                key={member.id}
                name={member.name}
                onChange={(
                  isChecked: boolean // Specify the type of isChecked as boolean
                ) => handleCheckboxChange(member.id, isChecked)}
                // Set the initial checked state based on registrationData
                isChecked={
                  registrationData && registrationData[member.id]?.present
                }
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
            Please make sure to click no the given List
            <Button
              disabled={dataLoading}
              className="flex justify-center items-center mt-6 p-6 "
              type="submit"
            >
              {dataLoading ? ( // Display the loading icon when loading
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  save Care Register
                </>
              ) : (
                "save Care Register"
              )}
            </Button>
          </p>
        </form>
      </div>
    </main>
  );
};

export default CareListComponent;
