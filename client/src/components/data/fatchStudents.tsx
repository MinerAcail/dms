import { gql, useQuery } from "@apollo/client";
import { DataTable } from "./data-table";
import {  columnsStudent } from "./columns";

const GET_STUDENTS = gql`
 query students{
  students{
    id
    day
    email
    
    name
    leaderID
    phoneNumber
    createdAt
    
  }
}
`;

function FatchAllStudents() {



  // Fetch students by leader using the leaderId from useParams
  const { loading, error, data } = useQuery(GET_STUDENTS, { });
  console.log(data);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const students = data.students;

  // Render the list of students
  return (
    <div className="container mx-auto py-10">
      <div className="section">
        <div className="_divLg ">
          <DataTable columns={columnsStudent} data={students} />
        </div>
      </div>
    </div>
  );
}

export default FatchAllStudents;
