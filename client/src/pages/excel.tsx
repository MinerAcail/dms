import "../assets/styles/style.scss";
import "../App.scss";
import { useMutation, gql, ApolloError } from "@apollo/client";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/middleware/context/authContext";

import Dropzone from "react-dropzone"; // Import Dropzone from react-dropzone

const IMPORT_MEMBER_DATA = gql`
  mutation ImportMemberData($file: Upload!, $ChurchID: String) {
    importMemberData(file: $file, ChurchID: $ChurchID) {
      id
      name
      email
      phoneNumber
      day
    }
  }
`;

function Excel() {
  const { user } = useAuth();
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [importMemberData, { loading }] = useMutation(IMPORT_MEMBER_DATA);

  const handleFileDrop = async (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];
      const response = await importMemberData({
        variables: {
          file,
          ChurchID: user?.id,
        },
      });
      if (response.data && response.data.importMemberData) {
        setSuccessMessage(
          `${response.data.importMemberData.length} members saved successfully.`
        );
      }
    } catch (error) {
      if (error instanceof ApolloError) {
        const errorMessages = error.graphQLErrors.map((err) => err.message);
        setErrorMessages(errorMessages);
      } else {
        console.error("Other error:", error);
      }
    }
  };

  return (
    <div className="section">
      <div className="_divLg flex justify-center items-center py-10 w-4/6">
        {loading ? (
          <>
            <ReloadIcon className="mr-2 h-16 w-16 animate-spin" />
            Saving, please give it some time...
          </>
        ) : (
          <Dropzone
            accept={{
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [".xlsx"],
            }}
            onDrop={handleFileDrop}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="cursor-pointer font-bold text-lg"
              >
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            )}
          </Dropzone>
        )}
        {errorMessages.length > 0 && (
          <div className="mt-4 text-red-400">
            {errorMessages.map((message, index) => (
              <p
                className="m-10 w-96 rounded-md py-3 px-8 bg-slate-50"
                key={index}
              >
                {message}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Excel;
