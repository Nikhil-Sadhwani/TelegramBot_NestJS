import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
// components
import Home from "./components/Home";
import UserList from "./components/UserList";
import ApiChange from "./components/ApiChange";
import Login from "./components/Login";
import Alert from "./components/Alert";

// Google authentication
import { GoogleOAuthProvider } from "@react-oauth/google";

// States
import LogState from "./context/logManage/LogState.js";
import AlertState from "./context/alertManage/AlertState";

function App() {
  return (
    <>
      <AlertState>
        <LogState>
          <GoogleOAuthProvider clientId="786530052195-h89n8ah2hfv9qvrc6h2eeqm2hc2hpssr.apps.googleusercontent.com">
            <BrowserRouter>
              <Alert />
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/usermanagement" element={<UserList />} />
                <Route exact path="/api" element={<ApiChange />} />
                <Route exact path="/login" element={<Login />} />
              </Routes>
            </BrowserRouter>
          </GoogleOAuthProvider>
        </LogState>
      </AlertState>
    </>
  );
}

export default App;
