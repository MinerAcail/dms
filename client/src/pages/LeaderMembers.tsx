import { MembersColumns } from "@/components/data/columns";
import { DataTable } from "@/components/data/data-table";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";


const _ARRAY_MEMBERS_QUERY = gql`
  query GetAllMembersByLeader($leaderID: String!) {
    GetAllMembersByLeader(leaderID: $leaderID) {
      id
    name
   email
    phoneNumber
    location
    createdAt
    types
    updatedAt
    day
    subChurch{
      name
    }
  }}
`;
function LeaderMembersFatch() {
  const { leaderid } = useParams();

  // Fetch members by subChurch using the Id from useParams
  const { loading, error, data } = useQuery(_ARRAY_MEMBERS_QUERY, {
    variables: { leaderID: leaderid },
  });
  console.log(data);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const members = data.GetAllMembersByLeader;

  // Render the list of members
  return (
    <div className="container mx-auto py-10">
      <div className="section">
        <div className="_divLg ">
          <DataTable columns={MembersColumns} data={members} />
        </div>
      </div>
    </div>
  );
}

export default LeaderMembersFatch;
