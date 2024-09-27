import {  ChurchColumn} from "./columns";
// import { DataTable } from "./data-table";

import { gql, useQuery } from '@apollo/client';
import { DataTable } from "./data-table";
import { ReloadIcon } from "@radix-ui/react-icons";

const GET_GETALL_MAIN_CHURCH = gql`
 query GetAllMainChurch {
  GetAllMainChurch {
    id
    name
    email
    password
    types
  }
}
`;

// ...


function MainTable() {
  const { loading, error, data: dataQuery } = useQuery(GET_GETALL_MAIN_CHURCH, {});



  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const data = dataQuery ? dataQuery.GetAllMainChurch : [];

  return (
    <div className="container mx-auto py-10">
      {loading ? ( // Display the loading icon when loading
              <>
                <ReloadIcon className="h-9 w-9 animate-spin" />
                
              </>
            ) : (
              <DataTable columns={ChurchColumn} data={data} />

            )}
             
    </div>
  );
}

export default MainTable;
