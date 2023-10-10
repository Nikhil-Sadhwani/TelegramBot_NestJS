import LogContext from "./LogContext";
import { useCookies } from "react-cookie";

const LogState = (props) => {
  const [cookies, setCookies] = useCookies(["email"]);

  const handleCookies = (data) => {
    if (data) {
      setCookies("email", data);
    } else {
      setCookies("email", "");
    }
  };
  return (
    <LogContext.Provider value={{ cookies, handleCookies }}>
      {props.children}
    </LogContext.Provider>
  );
};

export default LogState;
