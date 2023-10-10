// Hooks
import React, { useContext } from "react";

// For navigation one page to another
import { useNavigate } from "react-router-dom";

// Contexts
import LogContext from "../context/logManage/LogContext";

export default function Home() {
  // Context Objects
  const LogObj = useContext(LogContext);

  // variable for navigation
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center items-center flex-col h-screen">
        <div
          className="border border-black m-10 w-[300px] h-[76px] rounded-[26px] text-center p-[24px] cursor-pointer hover:bg-gray-300"
          onClick={() => navigate("/api")}
        >
          <h2>Change API</h2>
        </div>
        <div
          className="border border-black m-10 w-[300px] h-[76px] rounded-[26px] text-center p-[24px] cursor-pointer hover:bg-gray-300"
          onClick={() => navigate("/usermanagement")}
        >
          <h2>User Management</h2>
        </div>
        {LogObj.cookies["email"] ? (
          <button
            onClick={() => {
              navigate("/login");
              LogObj.handleCookies(null);
            }}
            className="absolute top-1 right-5 m-[10px] p-[6px] w-[150px] rounded-[12px] border border-white bg-black text-white hover:bg-white hover:text-black hover:border-black"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="absolute top-1 right-5 m-[10px] p-[6px] w-[150px] rounded-[12px] border border-white bg-black text-white hover:bg-white hover:text-black hover:border-black"
          >
            Login
          </button>
        )}
      </div>
    </>
  );
}
