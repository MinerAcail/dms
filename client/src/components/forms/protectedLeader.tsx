import React from "react";
import { useAuth } from "@/middleware/context/authContext";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactNode;
  expectedType?: string[]; // The expected user type for this route
};

export const ProtectedLeader: React.FC<ProtectedRouteProps> = ({
  children,
  expectedType=[],
}) => {
  const { isAuthenticated, user } = useAuth();

  // Check if the user is authenticated and has the expected type
  const isAuthorized = isAuthenticated && (expectedType.length === 0 || expectedType.includes(user?.types || ""));

  if (!isAuthorized) {
    // Redirect unauthorized users to a different route (e.g., the home page)
    return <Navigate to="/signin" replace />;
  }
 
  return <>{children}</>;
};
