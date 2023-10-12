// Hooks
import React, { useContext, useEffect, useState } from "react";

// For integrate backend with frontend
import axios from "axios";

// Contexts
import LogContext from "../context/logManage/LogContext";
import AlertContext from "../context/alertManage/AlertContext";

export default function ApiChange() {
  // Variables
  const [newApi, setNewApi] = useState("");
  const [currentApi, setCurrentApi] = useState("");
  const [showInput, setShowInput] = useState(false);

  // Context Objects
  const LogObj = useContext(LogContext);
  const AlertObj = useContext(AlertContext);

  useEffect(() => {
    getApi();
  }, []);

  // fetching Existing API from database
  const getApi = async () => {
    await axios
      .get("https://telegram-bot-backend-0zis.onrender.com/admin/1")
      .then((response) => {
        setCurrentApi(response.data.apikey);
      })
      .catch((err) => console.log(err));
  };

  // Update the API and email of that person who updated it
  const handleApi = () => {
    if (newApi !== "") {
      const jsonData = {
        email: LogObj.cookies["email"],
        apikey: newApi,
      };
      axios
        .put("https://telegram-bot-backend-0zis.onrender.com/admin/1", jsonData)
        .then((response) => {
          AlertObj.showAlert("Success", response.data, "green");
          setCurrentApi(newApi);
          setNewApi("");
          setShowInput(false);
        })
        .catch((err) => console.log(err));
    }
  };

  // It helps to show the input box for API changing
  const handleButton = () => {
    if (LogObj.cookies["email"]) {
      setShowInput(true);
    } else {
      AlertObj.showAlert(
        "Warning",
        "You are not log in so you don't have authority to change API",
        "yellow"
      );
    }
  };

  return (
    <>
      {/* Input box POP-UP  */}
      <div
        className={`${showInput ? "" : "hidden"} absolute
         sm:bg-black sm:bg-opacity-[0.8] flex flex-col justify-center items-center h-screen w-screen`}
      >
        <div
          className={`flex flex-col justify-center items-center w-[260px] h-[200px] rounded-lg bg-[#e9e9e9] sm:bg-white z-10`}
        >
          <p
            className="text-right w-[100%] pr-2 cursor-pointer"
            onClick={() => setShowInput(false)}
          >
            X
          </p>
          <h2 className="text-[23px] m-[10px] font-bold">New API</h2>
          <input
            className="border-gray-300 border-2 mb-4 p-[10px] rounded-lg"
            type="text"
            name="apikey"
            value={newApi}
            onChange={(e) => setNewApi(e.target.value)}
            placeholder="Enter the new API key"
          />
          <button
            onClick={handleApi}
            className="m-[10px] p-[6px]  rounded-[12px] border border-white bg-black text-white hover:bg-white hover:text-black hover:border-black"
          >
            Change the api
          </button>
        </div>
      </div>

      {/* Front page where the current API shows */}
      <div
        // className={`flex flex-col justify-center items-center h-screen w-screen rounded-lg bg-white`}
        className={` flex flex-col justify-center items-center h-screen w-screen rounded-lg bg-white`}
      >
        {/* <h2 className="text-[5rem] m-[10px] font-bold absolute top-1"> */}
        <h2 className="text-[2rem] sm:text-[3rem] md:text-[4rem] m-[10px] font-bold absolute top-1">
          Current API
        </h2>
        <p className=" text-sm sm:text-[1.5rem] md:text-[2rem]  m-[35px]">
          {currentApi ? currentApi : "No Api Set"}
        </p>
        <button
          onClick={handleButton}
          className={`m-[10px] p-[6px]  rounded-[12px] border border-white bg-black text-white hover:bg-white hover:text-black hover:border-black
          `}
        >
          Click to change API
        </button>
      </div>
    </>
  );
}
