import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return null;
  }

  return user ? children : null;
}

export default ProtectedRoute;
