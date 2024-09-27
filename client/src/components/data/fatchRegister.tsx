import { gql, useQuery } from "@apollo/client";
import { useLocation, useParams } from "react-router-dom";
import { DataTable } from "./data-table";
import { columnsRegistration } from "./columns";

const QUERY_BY_MEMBER_REGISTRATION = gql`
query GetAllRegistersByMemberID($MemberId: String!) {
  GetAllRegistersByMemberID(MemberId: $MemberId) {
    id
    lastComment
    absence
    present
    memberID
    leaderID
    leaderName
    member{
      name
    }
    createdAt
    
  }
}
`;

function DemoFatchRegistration() {
  const { memberid } = useParams();



  // Fetch register by leader using the leaderId from useParams
  const { loading, error, data } = useQuery(QUERY_BY_MEMBER_REGISTRATION, {
    variables: { MemberId: id },
  });
  console.log(data);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const register = data.GetAllRegistersByMemberID;

  // Render the list of register
  return (
    <div className="container mx-auto py-10">
      <div className="section">
        <div className="_divLg ">
          <DataTable columns={columnsRegistration} data={register} />
        </div>
      </div>
    </div>
  );
}

export default DemoFatchRegistration;
