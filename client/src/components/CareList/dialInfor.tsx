import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/middleware/context/authContext";
import { gql, useMutation } from "@apollo/client";
import { ReloadIcon } from "@radix-ui/react-icons";
import React, { ReactNode, useState } from "react";
import { LEADER_GIVEN_iDS_QUERY } from "./PAlist";

const UPDATE_REGISTRATION_MUTATION = gql`
  mutation UpdateRegistrationByLeader(
    $input: CreateRegistrationInput!
    $registrationID: String!
    $leaderID: String!
  ) {
    updateRegistrationByLeader(
      input: $input
      registrationID: $registrationID
      leaderID: $leaderID
    ) {
      id
      lastComment
      absence
      present
      member {
        name
        phoneNumber
      }
    }
  }
`;
type Props = {
  children?: ReactNode;
  leaderID?: string;
  registrationID?: string;
  memberId?: string;
};
export const DialInfor: React.FC<Props> = ({
  children,
  leaderID,
  registrationID,
  memberId,
 
}) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const toggleHeaderVisibility = () => {
    setIsHeaderVisible(!isHeaderVisible);
  };
  const { user } = useAuth();

  const mleaderID = user?.id;
  const [updateRegistration, { loading, data }] = useMutation(
    UPDATE_REGISTRATION_MUTATION
  );

  const [formValues, setFormValues] = useState({
    lastComment: "",
    absence: false, // Initialize as false for checkbox input
    present: false, // Initialize as false for checkbox input
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = event.target;

    // If the input is a checkbox, set the value as a boolean
    const newValue = type === "checkbox" ? checked : value;

    setFormValues({
      ...formValues,
      [name]: newValue,
    });
  };

  const handleSubmit = async () => {
    try {
  

      const filteredFormValues = Object.fromEntries(
        Object.entries(formValues).filter(([_, value]) => value !== "" && value !== false)
      );
   

      const response = await updateRegistration({
        variables: {
          input: {
            ...filteredFormValues,
          },
          registrationID: registrationID || "",
          leaderID: leaderID || "",
        },
        refetchQueries: [{ query: LEADER_GIVEN_iDS_QUERY, variables: { mleaderID } }],
        
   
      });

      // Check if there were any errors in the response
      if (response.errors) {
        // Handle the errors, display an error message, or log them
        console.error("Mutation errors:", response.errors);
      } else {
        // Handle the success case if needed
        console.log("Mutation response:", response.data);
        // Close the editing dialog or perform other actions
        toggleHeaderVisibility();
      }
    } catch (error) {
      // Handle any unexpected errors here
      console.error("Mutation error:", error);
    }
  };

  console.log("payload", data);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[425px] lg:max-w-[425px]">
        <Dialog>
          <DialogTitle>Edit Register</DialogTitle>
        </Dialog>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="text" className="text-right">
            Last Comment
          </Label>
          <Input
            id="lastComment"
            name="lastComment"
            value={formValues.lastComment}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="absence" className="text-right">
            Absence
          </Label>
          <Input
            id="absence"
            name="absence"
            checked={formValues.absence || false}
            type="checkbox"
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="present" className="text-right">
            Present
          </Label>
          <Input
            id="present"
            name="present"
            checked={formValues.present || false}
            type="checkbox"
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          
          <Button
            disabled={loading}
            className="flex justify-center items-center mt-4 p-4  bg-blue-400 "
            type="submit"
            onClick={handleSubmit}
          >
            {loading ? ( // Display the loading icon when loading
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Save Register
              </>
            ) : (
              " Save Register"
            )}
          </Button>
        </DialogFooter>

        <>
          <DialogFooter>
            <Button
            className="mt-3 p-3 bg-slate-500"
             onClick={toggleHeaderVisibility}>{isHeaderVisible ?"Close":"Edit"} Profile</Button>
          </DialogFooter>
          {isHeaderVisible && (
            <>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make the changes here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>

              <MemberInfor  memberId={memberId} />
            </>
          )}
        </>
      </DialogContent>
    </Dialog>
  );
};

const UPDATE_STUDENT_MUTATION = gql`
  mutation updateMember($input: updateMemberInput!, $memberId: String!) {
    updateMember(input: $input, memberId: $memberId) {
      id
      day
      phoneNumber
      name
    }
  }
`;

type Prop = {
  memberId: string;
};

const MemberInfor: React.FC<Prop> = ({ memberId }) => {
  const [updateMember, { loading}] = useMutation(
    UPDATE_STUDENT_MUTATION
  );

  const [formValues, setFormValues] = useState({
    name: "",
    phoneNumber: "",
    day: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = event.target;

    // If the input is a checkbox, set the value as a boolean
    const newValue = type === "checkbox" ? checked : value;

    setFormValues({
      ...formValues,
      [name]: newValue,
    });
  };

  const handleSubmit = async () => {
    try {
      console.log("memberId", memberId);

      const filteredFormValues = Object.fromEntries(
        Object.entries(formValues).filter(([_, value]) => value !== "")
      );
      console.log("studentformValues", filteredFormValues);

      const response = await updateMember({
        variables: {
          input: {
            ...filteredFormValues,
          },

          memberId: memberId || "",
        },
      });

      // Check if there were any errors in the response
      if (response.errors) {
        // Handle the errors, display an error message, or log them
        console.error("Mutation errors:", response.errors);
      } else {
        // Handle the success case if needed
        console.log("Mutation response:", response.data);
        // Close the editing dialog or perform other actions
      }
    } catch (error) {
      // Handle any unexpected errors here
      console.error("Mutation error:", error);
    }
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input 
          id="name"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phoneNumber" className="text-right">
          Number
          </Label>
          <Input 
          id="phoneNumber"
          name="phoneNumber"
          value={formValues.phoneNumber}
          onChange={handleInputChange}
          className="col-span-3"
           />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="day" className="text-right">
          Day
          </Label>
          <Input 
          id="day"
          name="day"
          value={formValues.day}
          onChange={handleInputChange}
          className="col-span-3"
           />
        </div>
      </div>
      <DialogFooter>
        <Button
            disabled={loading}
            className="flex justify-center items-center mt-4 p-4  bg-blue-400  "
            type="submit"
            onClick={handleSubmit}
          >
            {loading ? ( // Display the loading icon when loading
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Save changes
              </>
            ) : (
              " Save changes"
            )}
          </Button>
      </DialogFooter>
    </>
  );
};
