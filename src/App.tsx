import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Search from "./components/Search";
import SnackbarProvider from "./components/SnackbarProvider";
import UserProvider from "./components/UserProvider";
import Watch from "./components/Watch";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
    palette: {
      primary: {
        main: "#78C5DC",
      },
      secondary: {
        main: "#F5F5F5",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <UserProvider>
          <SnackbarProvider>
            <Routes>
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/home" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/watch/:videoId" element={<Watch />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to={"/home"} />} />
            </Routes>
          </SnackbarProvider>
        </UserProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
