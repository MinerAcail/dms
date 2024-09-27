import { ApolloClient, HttpLink,  split } from '@apollo/client';
import { InMemoryCache } from '@apollo/client';

// import { createClient } from 'graphql-ws';
//authLink.concat(httpLink)
import { createUploadLink } from "apollo-upload-client";

const link =  createUploadLink({
  uri: "http://localhost:9091/query",
  credentials: "include",
  
  
});



const Client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});



/*You will send to the mian index file */
export default Client;