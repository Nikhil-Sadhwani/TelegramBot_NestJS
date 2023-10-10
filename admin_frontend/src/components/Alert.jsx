// Hooks
import React, { useContext } from "react";

// Contexts
import AlertContext from "../context/alertManage/AlertContext";

export default function Alert() {
  // Context Objects
  const AlertObj = useContext(AlertContext);

  return (
    <>
      {AlertObj.alert && (
        <div
          className={`bg-${AlertObj.alert.color}-100 border-t-4 border-${AlertObj.alert.color}-500 rounded-b text-${AlertObj.alert.color}-900 px-4 py-3 shadow-md absolute z-10 w-screen`}
        >
          <p className="font-bold">{AlertObj.alert.type} </p>
          <p className="text-sm">{AlertObj.alert.message}</p>
        </div>
      )}
    </>
  );
}
