import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};
export type dataType = {
  [x: string]: any;
  id: string;
  name: string;
  types: "Admin" | "sub_leader" |"SubLeader" | "Caller" | "leader"|"Leader";
  email: string;
  location: string;
  phoneNumber: string;
  createdAt: string;
  leaderID: string;
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  members: Member[]; // Add the member property
};
export type Member = {
  id: string;
  email: string;
};
export const DELETE_MENBER_MUTATION = gql`
  mutation DeleteMember($memberId: String!) {
    deleteMember(memberId: $memberId)
  }
`;
export const UNSIGN_MENBER_MUTATION = gql`
 mutation removeLeader($memberId:String!){
 removeLeader (memberId:$memberId){
    id
    name
    phoneNumber
    types
    password
    token
    createdAt
    updatedAt
  }
}
`;
export const MembersColumns: ColumnDef<dataType>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const Person = row.original;

      const [deleteMember] = useMutation(DELETE_MENBER_MUTATION);
      const [removeLeader] = useMutation(UNSIGN_MENBER_MUTATION);


      const handleDeleteClick = (id: string) => {
        if (window.confirm("Are you sure you want to delete this Member?")) {
          deleteMember({ variables: { memberId: id } })
            .then((response) => {
              // Handle success, e.g., show a success message or update the list of churches
              console.log("Member deleted:", response);
            })
            .catch((error) => {
              // Handle error, e.g., show an error message
              console.error("Error deleting Member:", error);
            });
        }
      };

      const handleRemoveLeader = (id: string) => {
        if (window.confirm(`Are you sure you want to remove ${Person.types} from ${Person.name}?`)) {
          removeLeader({ variables: { memberId: id } })
            .then((response) => {
              // Handle success, e.g., show a success message or update the list of churches
              console.log("Member remove types:", response);
            })
            .catch((error) => {
              // Handle error, e.g., show an error message
              console.error("Error remove types Member:", error);
            });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(Person.id);
                // setSelectedPersonId(Person.id);
                // console.log("Copied Person ID:", Person.id);
              }}
            >
              Copy Person ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(Person.id);
                // setSelectedPersonId(Person.id);
                // console.log("Copied Person ID:", Person.id);
              }}
            >
                <Link to={`/dashboard/members/assign/${Person.id}`}>
                {`Assign The Member`}
              </Link>
              
            </DropdownMenuItem>

            <DropdownMenuItem
            className="text-red-400"
              
              onClick={() => {
                handleRemoveLeader(Person.id);
              }}
              disabled={!Person.types}
            >
              Remove sign {Person.types}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              style={{
                color: "red",
              }}
              onClick={() => {
                handleDeleteClick(Person.id);
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
            // disabled
            disabled={!Person.types}
            >
              <Link to={`/dashboard/tables/leader/members/${Person.id}`}>
                {`View Signed Members`}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
            // disabled
            >
              <Link to={`/dashboard/tables/members/registers/${Person.id}`}>
                {`${Person.name}'s registrations`}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  /* dashboard/formtable/member/registrations/ */
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <>
          <h2 className={`font-extrabold `} key={row.id}>
            {person.name}
          </h2>
        </>
      );
    },
  },
  {
    accessorKey: "day",
    header: "day",
  },
  {
    accessorKey: "Church",
    header: "Church",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <>
          <h2 className={`font-extralight `} key={row.id}>
            {person.subChurch.name}
          </h2>
        </>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "types",
    header: "User Type",
    cell: ({ row }) => {
      const person = row.original;
      let bgColorClass = "";

      if (person.types === "Admin") {
        bgColorClass = "bg-red-500";
      } else if (person.types === "SubLeader" ) {
        bgColorClass = "bg-blue-500";
      } else if (person.types === "Caller") {
        bgColorClass = "bg-green-500";
      } else if (person.types === "Leader") {
        bgColorClass = "bg-red-500";
      }

      return (
        <h2
          className={` p-2 m-0 text-center rounded-sm opacity-60 ${bgColorClass}`}
          key={row.id}
        >
          {person.types}
        </h2>
      );
    },
  },

  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const person = row.original;

      const date = new Date(person.createdAt);
      const day = date.getDate().toString().padStart(2, "0");
      const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        date
      );
      const year = date.getFullYear();

      const formattedDate = `${day} ${month} ${year}`;

      return <h2 className="p-2">{formattedDate}</h2>;
    },
  },
];

export type dataTypeRegistration = {
  leaderName: string;
  leaderID: string;
  id: string;
  lastComment: string;
  absence: boolean;
  present: boolean;
  createdAt: string;
};
export const DELETE_REGISTER_MUTATION = gql`
  mutation deleteRegistration($registrationId: String!) {
    deleteRegistration(registrationId: $registrationId)
  }
`;
export const columnsRegistration: ColumnDef<dataTypeRegistration>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const Person = row.original;

      const [deleteRegistration] = useMutation(DELETE_REGISTER_MUTATION);

      const handleDeleteClick = (registrationId: string) => {
        if (window.confirm("Are you sure you want to delete this Register?")) {
          deleteRegistration({ variables: { registrationId } })
            .then((response) => {
              // Handle success, e.g., show a success message or update the list of churches
              console.log("Register deleted:", response);
            })
            .catch((error) => {
              // Handle error, e.g., show an error message
              console.error("Error deleting Register:", error);
            });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              style={{
                color: "red",
              }}
              onClick={() => {
                handleDeleteClick(Person.id);
              }}
            >
              Delete
            </DropdownMenuItem>
            {Person.leaderID && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  Assigned Caller is {Person.leaderName}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "AssignCaller",
    header: "Assign Caller",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <h2 className={`font-extrabold max-w-lg lex items-center`} key={row.id}>
          {person.leaderName}
        </h2>
      );
    },
  },

  {
    accessorKey: "present",
    header: "Present",
    cell: ({ row }) => {
      const person = row.original;
      let bgColorClass = "";

      if (person.present === false) {
        bgColorClass = "bg-red-500";
      } else if (person.present === true) {
        bgColorClass = "bg-blue-500";
      }
      return (
        <h2
          className={` p-2 m-0 text-center rounded-sm opacity-60 ${bgColorClass}`}
          key={row.id}
        >
          {person.present ? "Present" : "Absent"}
        </h2>
      );
    },
  },
  {
    accessorKey: "lastComment",
    header: "Last Comment",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <h2 className={`font-extrabold max-w-lg lex items-center`} key={row.id}>
          {person.lastComment}
        </h2>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const person = row.original;

      const date = new Date(person.createdAt);
      const day = date.getDate().toString().padStart(2, "0");
      const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        date
      );
      const year = date.getFullYear();

      const formattedDate = `${day} ${month} ${year}`;

      return <h2 className="p-2">{formattedDate}</h2>;
    },
  },
];

export const DELETE_SUB_CHURCH_MUTATION = gql`
  mutation deleteSubChurch($subChurchId: String!) {
    deleteSubChurch(subChurchId: $subChurchId)
  }
`;

export type subChurch = {
  id: string;

  name: string;
};
export const SubChurchColumn: ColumnDef<church>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const Person = row.original;
      const [deleteSubChurch] = useMutation(DELETE_SUB_CHURCH_MUTATION);

      const handleDeleteClick = (id: string) => {
        if (
          window.confirm("Are you sure you want to delete this Sub Church?")
        ) {
          deleteSubChurch({ variables: { subChurchId: id } })
            .then((response) => {
              // Handle success, e.g., show a success message or update the list of churches
              console.log("subChurch deleted:", response);
            })
            .catch((error) => {
              // Handle error, e.g., show an error message
              console.error("Error deleting subChurch:", error);
            });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              style={{
                color: "red",
              }}
              onClick={() => {
                handleDeleteClick(Person.id);
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link to={`/dashboard/tables/members/${Person.id}`}>
                View Members Details
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link to={`/dashboard/create/members/${Person.id}`}>
                Create Members
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <>
          <h2 className={`font-extrabold `} key={row.id}>
            {person.name}
          </h2>
        </>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <>
          <h2 className={`font-extrabold `} key={row.id}>
            {person.email}
          </h2>
        </>
      );
    },
  },
  {
    accessorKey: "Church",
    header: "Main Church",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <>
          <h2 className={`font-extralight `} key={row.id}>
            {person.church.name}
          </h2>
        </>
      );
    },
  },
];
/* MIAN CHURCH SEECION */

export const DELETE_MUTATION = gql`
  mutation DeleteChurch($registrationId: String!) {
    deleteChurch(mainChurchId: $registrationId)
  }
`;

export type church = {
  [x: string]: any;
  id: string;
  email: string;
  name: string;
  types: string;
};
export const ChurchColumn: ColumnDef<church>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const Person = row.original;
      const [deleteChurch] = useMutation(DELETE_MUTATION);

      const handleDeleteClick = (id: string) => {
        if (window.confirm("Are you sure you want to delete this church?")) {
          deleteChurch({ variables: { registrationId: id } })
            .then((response) => {
              // Handle success, e.g., show a success message or update the list of churches
              console.log("Church deleted:", response);
            })
            .catch((error) => {
              // Handle error, e.g., show an error message
              console.error("Error deleting church:", error);
            });
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              style={{
                color: "red",
              }}
              onClick={() => {
                handleDeleteClick(Person.id);
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link to={`/dashboard/tables/sub/${Person.id}`}>View Sub Churchs</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const person = row.original;
      return (
        <>
          <h2 className={`font-extrabold `} key={row.id}>
            {person.name}
          </h2>
        </>
      );
    },
  },

  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "types",
    header: "User Type",
    cell: ({ row }) => {
      const person = row.original;
      let bgColorClass = "";

      if (person.types === "Admin") {
        bgColorClass = "bg-red-500";
      } else if (person.types === "sub_leader") {
        bgColorClass = "bg-blue-500";
      } else if (person.types === "care_person") {
        bgColorClass = "bg-green-500";
      } else if (person.types === "leader") {
        bgColorClass = "bg-white";
      }

      return (
        <h2
          className={` p-2 m-0 text-center rounded-sm opacity-60 ${bgColorClass}`}
          key={row.id}
        >
          {person.types}
        </h2>
      );
    },
  },
];
