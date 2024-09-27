import { useParams } from "react-router-dom";
import {  SubChurchColumn} from "./columns";
import { DataTable } from "./data-table";

import { gql, useQuery } from '@apollo/client';

const GET_SUB_CHURCH_BY_MIAN_ID = gql`
query GetAllsubChurchByMainChurchID($mainChurchId: String!) {
  GetAllsubChurchByMainChurchID(mainChurchId: $mainChurchId) {
    id
    name
    email
    church{
      name
    }
  
  }
}
`;

// ...


function SubChurchPage() {
  const { subid } = useParams()
  const { loading, error, data: dataQuery } = useQuery(GET_SUB_CHURCH_BY_MIAN_ID, {
    variables: {mainChurchId: subid}
  });
console.log(dataQuery);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const data = dataQuery ? dataQuery.GetAllsubChurchByMainChurchID : [];
console.log(data);


  

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={SubChurchColumn} data={data} />
    </div>
  );
}

export default SubChurchPage;
