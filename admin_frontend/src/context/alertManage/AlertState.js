import { useState } from "react";
import AlertContext from "./AlertContext";

const AlertState = (props) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, msg, colo) => {
    setAlert({
      type: type,
      message: msg,
      color: colo,
    });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };
  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
