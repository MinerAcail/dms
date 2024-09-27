
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { gql, useQuery } from "@apollo/client";
import React, { ReactNode } from "react";

const LASTFOURCOMMENT = gql`
  query LastFourCommentsForMember($memberID: String!) {
    LastFourCommentsForMember(memberID: $memberID)
  }
`;
type Props = {
  children?: ReactNode;
  memberId?: string;
};
export const DialLastComment: React.FC<Props> = ({ children, memberId }) => {
  const { loading, error, data } = useQuery(LASTFOURCOMMENT, {
    variables: {
      memberID: memberId,
    },
  });
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const lastFourComments = data?.LastFourCommentsForMember || [];

  console.log("payload", data);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[425px] lg:max-w-[425px]">
        <Dialog>
          <DialogTitle>Last Comment Register</DialogTitle>
        </Dialog>
        {lastFourComments.map((comment: string, index: number) => (
          <DialogDescription key={index}># {comment}</DialogDescription>
        ))}
      </DialogContent>
    </Dialog>
  );
};
