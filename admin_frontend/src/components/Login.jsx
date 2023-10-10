// Hooks
import React, { useContext } from "react";

// For google authentication
import { GoogleLogin } from "@react-oauth/google";

// For decode the object after login with google
import jwt_decode from "jwt-decode";

// For navigation one page to another
import { useNavigate } from "react-router-dom";

// Contexts
import LogContext from "../context/logManage/LogContext";
import AlertContext from "../context/alertManage/AlertContext";

export default function Login() {
  // Context Objects
  const LogObj = useContext(LogContext);
  const AlertObj = useContext(AlertContext);

  // variable for navigation
  const navigate = useNavigate();
  return (
    <>
      <div
        className={`flex flex-col justify-center items-center h-screen rounded-lg bg-white`}
      >
        <h2 className="text-[5rem] m-[10px] font-bold absolute top-1">Login</h2>

        {/* Login button  */}
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            var decoded = jwt_decode(credentialResponse.credential);
            LogObj.handleCookies(decoded.email);
            AlertObj.showAlert("Success", "Login Successful", "green");
            navigate("/");
          }}
          onError={() => {
            AlertObj.showAlert("Alert", "Login Failed", "red");
          }}
        />
      </div>
    </>
  );
}
