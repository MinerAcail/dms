import { gql } from "@apollo/client";

export const  CREATE_STUDENT_MUTATION = gql`
mutation createLeader($input: CreateLeaderInput!) {
  createLeader(input: $input) {
    id
    name
   token
    types
    
  }
}
`;

export const  CREATE_LEADER_MUTATION = gql`
mutation createLeader($input: CreateLeaderInput!) {
  createLeader(input: $input) {
    id
    name
   token
    types
    
  }
}
`;