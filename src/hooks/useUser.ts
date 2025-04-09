import { User } from "firebase/auth";
import { createContext, useContext } from "react";

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider.");
  }
  return context;
};
