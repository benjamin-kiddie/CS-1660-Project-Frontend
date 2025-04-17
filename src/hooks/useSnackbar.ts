import { createContext, useContext } from "react";

type SnackbarContextType = {
  showSnackbar: (message: string, severity?: "error" | "success") => void;
};

export const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
