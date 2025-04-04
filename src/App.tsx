import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import { UserProvider } from "./components/UserProvider";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
    palette: {
      primary: {
        main: "#FFFFFF",
      },
      secondary: {
        main: "#F5F5F5",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Layout />} />
            <Route path="*" element={<Navigate to={"/login"} />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
