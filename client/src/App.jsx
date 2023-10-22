import { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Chat from "./routes/Chat";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
// import SocketIO from "./socket";

function App() {
  // useEffect(() => {
  //   SocketIO.emit("send-msg", { message: "Hello-Its Working" });
  // }, []);
  return (
    <>
      {/* <div className="text-red-600 bg-black">
        Hey My ChatApp is Working and tailwind CSS is also working
      </div> */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
