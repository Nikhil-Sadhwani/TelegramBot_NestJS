// Hooks
import React, { useContext, useEffect, useState } from "react";

// For integrate backend with frontend
import axios from "axios";

// Contexts
import AlertContext from "../context/alertManage/AlertContext";
import LogContext from "../context/logManage/LogContext";

export default function UserList() {
  // Context Objects
  const LogObj = useContext(LogContext);
  const AlertObj = useContext(AlertContext);

  // Variables
  const [data, setData] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  // fetch all users
  const getData = async () => {
    await axios
      .get("https://telegram-bot-backend-0zis.onrender.com/users")
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // update the status of the user
  const handleBlock = (id, city, status) => {
    if (LogObj.cookies["email"]) {
      const jsonData = {
        city: city,
        status: status,
      };
      axios
        .put(
          `https://telegram-bot-backend-0zis.onrender.com/users/${id}`,
          jsonData
        )
        .then((response) => {
          AlertObj.showAlert("Success", response.data, "green");
          setData(
            data.map((user) => {
              if (user.id === id) {
                return { ...user, status: status };
              }
              return user;
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      AlertObj.showAlert("Alert", "You are not logged in", "red");
    }
  };

  // deleting the user
  const handleDelete = (id) => {
    if (LogObj.cookies["email"]) {
      axios
        .delete(`https://telegram-bot-backend-0zis.onrender.com/users/${id}`)
        .then((response) => {
          AlertObj.showAlert("Success", response.data, "green");
          setData(
            data.filter((user) => {
              return user.id !== id;
            })
          );
        })
        .catch((err) => console.log(err));
    } else {
      AlertObj.showAlert("Alert", "You are not logged in", "red");
    }
  };
  return (
    <>
      <div className="h-screen p-[20px] ">
        <h2 className="text-center text-[2rem] font-bold m-3">
          User Management
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-slate-500 overflow-scroll">
            <thead>
              <tr>
                <th className=" border border-slate-500 ">Chat ID</th>
                <th className=" border border-slate-500 ">City</th>
                <th className=" border border-slate-500 ">Status</th>
                <th className=" border border-slate-500 ">Management</th>
              </tr>
            </thead>
            <tbody>
              {/* Loop to show all users  */}
              {data.map((user, key) => {
                return (
                  <tr key={key}>
                    <td className=" p-[10px] border border-slate-500 ">
                      {user.chat_id}
                    </td>
                    <td className=" p-[10px] border border-slate-500 ">
                      {user.city}
                    </td>
                    <td className=" p-[10px] border border-slate-500 ">
                      {user.status}
                    </td>
                    <td className=" p-[10px] border border-slate-500 ">
                      {user.status === "block" ? (
                        <button
                          onClick={() =>
                            handleBlock(user.id, user.city, "subscribe")
                          }
                          className="m-[10px] p-[6px] w-[75px] rounded-[12px] border border-white bg-red-400 text-white hover:bg-white hover:text-red-400 hover:border-red-400"
                        >
                          UnBlock
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleBlock(user.id, user.city, "block")
                          }
                          className="m-[10px] p-[6px] w-[68px] rounded-[12px] border border-white bg-red-400 text-white hover:bg-white hover:text-red-400 hover:border-red-400"
                        >
                          Block
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="m-[10px] p-[6px] w-[68px] rounded-[12px] border border-white bg-red-400 text-white hover:bg-white hover:text-red-400 hover:border-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
