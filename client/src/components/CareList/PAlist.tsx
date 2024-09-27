import { EditIcon, MessageSquareDashedIcon, PhoneIcon } from "lucide-react";
import { useState } from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { DialInfor } from "./dialInfor";
import { gql, useQuery } from "@apollo/client";
import { useAuth } from "@/middleware/context/authContext";
import { DialLastComment } from "./dialLastComment";

export const LEADER_GIVEN_iDS_QUERY = gql`
  query RegistrationsByLeader($mleaderID: String!) {
    registrationsByLeader(mleaderID: $mleaderID) {
      id
      lastComment
      absence
      present
      createdAt
      leaderName
      memberID
      leaderID
      member {
        name
        phoneNumber
        id
        subChurch {
          name
        }
      }
    }
  }
`;

const PAListComponent = () => {
  const { user } = useAuth();

  const [isChecked, setIsChecked] = useState(false);
  const mleaderID = user?.id;

  const { loading, error, data } = useQuery(LEADER_GIVEN_iDS_QUERY, {
    variables: {
      mleaderID,
    },
  });
  console.log(data);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!data || !data.registrationsByLeader) {
    return <div>No data available</div>;
  }

  let totalPresentTrue = 0;
  let totalPresentFalse = 0;

  const members = data.registrationsByLeader
    .filter((registration: { present: boolean }) => {
      if (!isChecked) {
        if (registration.present === false) {
          totalPresentFalse++;
          return true;
        }
      } else if (registration.present === true) {
        totalPresentTrue++;
        return true;
      }
      return false;
    })
    .map((registration: { member: any; id: string }) => ({
      member: registration.member,
      registrationID: registration.id, // Assuming registration.id is the registrationID
    }));

  console.log("ishere", members);

  return (
    <main className="m-auto flex flex-col justify-center items-center">
      <div className="flex justify-center">
        <ToggleSwitch isChecked={isChecked} setIsChecked={setIsChecked} />
      </div>
      <div>
        <QueryStudentIds members={members} />
      </div>
    </main>
  );
};
export default PAListComponent;

// Inside PAListComponent component
const QueryStudentIds = ({ members }) => {
  const { user } = useAuth();

  const mleaderID = user?.id;

  if (!members || members.length === 0) {
    return <>Care Group Data Not Available</>;
  }
  console.log(members);

  return (
    <div>
      <form className="">
        <div className="grid gap-3 lg:grid-cols-3 md:grid-cols-2 md:py-7">
          {members.map(
            (memberWithID: {
              member: {
                subChurch: any;
                id: string | null | undefined;
                name: string;
                phoneNumber: any;
              };
              registrationID: string | undefined;
            }) => (
              <div key={memberWithID.member?.id}>
                {memberWithID.member &&
                  memberWithID.member.id && ( // Check if memberWithID.member is not null
                    <div
                      key={memberWithID.member?.id}
                      style={{
                        backgroundColor: "#e1f4f365",
                      }}
                      className="bg-blue-500 w-72 rounded-xl mt-6"
                    >
                      <div className="pb-4 shadow-2xl rounded-xl bg-slate-300 w-full ">
                        <div
                        
                        className="mt-4 w-fit px-1 rounded-sm" style={{ fontSize: 14, }}>
                          {memberWithID.member.subChurch.name}
                        </div>

                        <div className=" flex flex-row justify-around items-center">
                          <h2 className="text-center text-xl font-bold">
                            {memberWithID.member.name || "Name not available"}
                            {/* Use default text if name is not available */}
                          </h2>
                          <DialInfor
                            memberId={memberWithID.member.id}
                            leaderID={mleaderID}
                            registrationID={memberWithID.registrationID}
                            children={<EditIcon color="blue" />}
                          />
                        </div>
                      </div>
                      <div className="mr-10 py-5 flex justify-around w-full text-xl font-bold">
                        <div className=" flex justify-around ">
                          <PhoneIcon
                            className=" mr-3"
                            color="white"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                memberWithID.member.phoneNumber || ""
                              );
                            }}
                          />

                          <DialLastComment
                            memberId={memberWithID.member.id}
                            children={
                              <MessageSquareDashedIcon
                                color="white"
                                size={25}
                                className="cursor-pointer"
                              />
                            }
                          />
                        </div>
                        <h2>
                          {memberWithID.member.phoneNumber ||
                            "Phone not available"}
                          {/* Use default text if phone number is not available */}
                        </h2>
                      </div>
                    </div>
                  )}
              </div>
            )
          )}
        </div>
      </form>
    </div>
  );
};

export const ToggleSwitch = ({ isChecked, setIsChecked }) => {
  return (
    <div
      onClick={() => {
        setIsChecked(!isChecked);
      }}
      className={`flex w-60 h-20  rounded-xl items-center cursor-pointer relative transition-all duration-500 ${
        isChecked ? "bg-slate-800 shadow-lg" : "bg-slate-800"
      }`}
    >
      <div className="text-white absolute ml-2  flex justify-center z-10">
        ABSENCE <CaretSortIcon className="mr-2 h-7 w-7 " />
      </div>
      <div className="text-white absolute ml-2 flex right-2 justify-center z-10">
        PRESENT <CaretSortIcon className="ml-1 h-7 w-7 " />
      </div>
      <span
        className={`w-32 h-20 rounded-xl  transition-all duration-500 transform ${
          isChecked
            ? "translate-x-28  bg-slate-500"
            : "translate-x-0  bg-slate-400"
        } absolute top-0`}
      />
    </div>
  );
};
