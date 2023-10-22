import React, { useState } from "react";
import AuthHeader from "../components/AuthHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import client from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (username == "" || username.length < 6) {
      toast.error("please enter atlease 6 characters in username");
      return false;
    }
    if (password == "") {
      toast.error("please enter your password");
      return false;
    }
    if (password !== confirmpass) {
      toast.error("confirm password is not same as password");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (validate()) {
      await client
        .post("/auth/signup", {
          username: username,
          password: password,
        })
        .then((res) => {
          console.log(res.data);
          console.log(res.status);
          if (res.status === 200) {
            const data = res.data;
            console.log(res.data);
            toast.success("Signup successful");
            localStorage.setItem("username", data.username);
            localStorage.setItem("userid", data.userid);
            navigate("/chat");
          } else {
            const error = res.data.message;
            console.log(error);
            toast.error(error);
          }
        });
    } else {
      // toast.error("Eror");
    }
  };
  return (
    <div className="w-screen h-screen">
      {/* header */}
      <AuthHeader />
      {/* toast */}
      <ToastContainer
        className="my-[3rem]"
        autoClose={1000}
        hideProgressBar={true}
      />
      {/* body */}
      <div className="h-[90vh] flex justify-center items-center">
        {/* signupsection */}
        <div className="px-[3rem] py-[2rem] shadow-xl border-t-2 border-blue-500">
          <div className="flex justify-center items-center font-semibold text-[2.5rem] tracking-wider py-[0.5rem]">
            SIGNUP
          </div>
          <div className="">
            {/* loginform */}
            <div className="mb-4">
              <label className=" text-[1.3rem] font-semibold mb-2">
                Username
              </label>
              <input
                type="email"
                className="w-full border rounded-md py-2 px-3 text-gray-700 lg:text-[1.2rem] text-[1rem]"
                // placeholder="please enter username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className=" text-[1.3rem] font-semibold mb-2]">
                Password
              </label>
              <input
                type="password"
                className="w-full border rounded-md py-2 px-3 text-gray-700 lg:text-[1.2rem] text-[1rem]"
                placeholder=""
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="text-[1.3rem] font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border rounded-md py-2 px-3 text-gray-700 lg:text-[1.2rem] text-[1rem]"
                placeholder=""
                value={confirmpass}
                onChange={(event) => setConfirmPass(event.target.value)}
              />
            </div>
            <div className="flex items-center justify-between lg:py-[3rem] py-[1rem]">
              <button
                onClick={handleSignup}
                className="bg-blue-500 text-semibold text-white lg:text-[1.5rem] text-[1.3rem] font-bold py-2 px-4 rounded-md hover:bg-blue-600 flex justify-center items-center"
              >
                <span>SignUp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
