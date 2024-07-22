import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Routers/AuthContext";
import axios from "axios";
import { LOGIN } from "../../service/ApiService";

const theme = createTheme();

function Login() {
  const nav = useNavigate();

  const [LoginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { setIsAuthenticate, setRoleType } = useAuth();

  const handleLogin = async () => {
    console.log("data",LoginData)
    if (LoginData.email == "" || LoginData.password == "") {
      toast.error(`please enter all the Fields !`);
    } else {
      console.log("value", LoginData);
        console.log("login", LOGIN);
      // setIsAuthenticate(true)
      await axios
        .post(LOGIN, LoginData)
        .then((res) => {
          if (res.data) {
            console.log(res.data);
            localStorage.setItem("Position", res.data.admin.position);
            localStorage.setItem("Id", res.data.admin._id);
            localStorage.setItem("Token", res.data.token);
            setIsAuthenticate(true);
            toast.success("Login Successfull !");
            setTimeout(() => {
              nav("/admin");
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
          // if(error.message)
          toast.error(`${error.message}`);
        });

      //   handleClear();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#c1c1c1",
          height: "100vh",
        }}
      >
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              mt: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: 3,
              p: 3,
              borderRadius: 2,
              backgroundColor: "white",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 10,
                backgroundColor: "#0070b9",
                mb: 3,
              }}
            />
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={LoginData.email}
                onChange={(e) => setLoginData({...LoginData,[e.target.name]:e.target.value})}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={LoginData.password}
                onChange={(e) => setLoginData({...LoginData,[e.target.name]:e.target.value})}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => handleLogin()}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
}

export default Login;
