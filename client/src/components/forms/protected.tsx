import React from "react";
import { useAuth } from "@/middleware/context/authContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  expectedType?: string[]; // The expected user type for this route
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  expectedType=[],
}) => {
  const { isAuthenticated, user } = useAuth();

  // Check if the user is authenticated and has the expected type
  const isAuthorized = isAuthenticated && (expectedType.length === 0 || expectedType.includes(user?.types || ""));

  return isAuthorized ? <>{children}</> : null;
 
};
