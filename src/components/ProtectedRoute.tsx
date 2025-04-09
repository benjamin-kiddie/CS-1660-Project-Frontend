import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();

  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
