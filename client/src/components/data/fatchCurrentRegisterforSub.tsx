import { gql, useQuery } from "@apollo/client";
import { DataTable } from "./data-table";
import { columnsRegistration } from "./columns";

const MEMBER_REGISTRATION_CURRENT_WEEK = gql`
  query WeekRegistrationsforSub{
    WeekRegistrationsforSub{
    id
    lastComment
    absence
    present
    createdAt
    leaderName
  }
}

`;

function CurrentWeekRegistrationsforSub() {



  // Fetch members by leader using the leaderId from useParams
  const { loading, error, data } = useQuery(MEMBER_REGISTRATION_CURRENT_WEEK);
  console.log(data);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const members = data.WeekRegistrationsforSub;

  // Render the list of members
  return (
    <div className="container mx-auto py-10">
      <div className="section">
        <div className="_divLg ">
          <DataTable columns={columnsRegistration} data={members} />
        </div>
      </div>
    </div>
  );
}

export default CurrentWeekRegistrationsforSub;
