import React, { useState } from "react";
import "../css/Auth.css";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, register } from "../redux/slices/authSlice";

function Auth() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      console.log("Login işlemi başlatılıyor...");
      const result = await dispatch(
        login({ email: loginEmail, password: loginPassword })
      );
      if (login.fulfilled.match(result)) {
        console.log("Giriş başarılı: ", result);

        const token = localStorage.getItem("accessToken");

        navigate("/");
      } else {
        console.log("Giriş başarısız: ", result);
        alert(result.payload || "Login failed. Invalid credentials.");
      }
    } catch (error) {
      console.error("Login işlemi sırasında hata: ", error);
      alert("Login işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleRegister = async () => {
    dispatch(
      register({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
      })
    ).then((result) => {
      if (register.fulfilled.match(result)) {
        navigate("/");
      } else {
        alert(result.payload || "Registration failed. Please try again.");
      }
    });
  };

  return (
    <div className="auth-form">
      <div className="login">
        <div className="login-title">Login</div>
        <div className="login-form">
          <div className="login-div">
            <input
              className="login-inputs"
              type="text"
              placeholder="Lütfen emailinizi giriniz"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              className="login-inputs"
              type="text"
              placeholder="Lütfen şifrenizi giriniz"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <Button
              variant="contained"
              size="medium"
              sx={{ width: "100px", backgroundColor: "black" }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
      <div className="register">
        <div className="register-title">Register</div>
        <div className="register-form">
          <div className="register-div">
            <input
              className="register-inputs"
              type="text"
              placeholder="Lütfen kullanıcı adınızı giriniz"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
            <input
              className="register-inputs"
              type="text"
              placeholder="Lütfen emailinizi giriniz"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <input
              className="register-inputs"
              type="text"
              placeholder="Lütfen şifrenizi giriniz"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <Button
              variant="contained"
              size="medium"
              sx={{ width: "100px", backgroundColor: "black" }}
              onClick={handleRegister}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
