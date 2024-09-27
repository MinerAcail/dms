import { gql, useQuery } from "@apollo/client";
import { useLocation, useParams } from "react-router-dom";
import { DataTable } from "./data-table";
import { MembersColumns } from "./columns";

const MEMBERS_BY_SUB_CHURCH_ID_QUERY = gql`
query GetAllMembersBySubChurchID($subChurchId: String!) {
  GetAllMembersBySubChurchID(subChurchId: $subChurchId) {
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
  }
}
`;

function DemoFatch() {
  const { id } = useParams();
  const location = useLocation();

  // Fetch members by subChurch using the Id from useParams
  const { loading, error, data } = useQuery(MEMBERS_BY_SUB_CHURCH_ID_QUERY, {
    variables: { subChurchId: id },
  });
  // console.log(data);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const members = data.GetAllMembersBySubChurchID;

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

export default DemoFatch;
