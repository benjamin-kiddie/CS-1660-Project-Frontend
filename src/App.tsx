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
import { UserProvider } from "./components/UserProvider";
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
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/watch/:videoId" element={<Watch />} />
                <Route path="*" element={<Navigate to={"/home"} />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </UserProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
