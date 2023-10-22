import React from "react";
import { AiFillWechat } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function AuthHeader() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center shadow-md h-[10vh] px-[1.5rem]">
      <div className="flex justify-center items-center">
        <AiFillWechat className="text-blue-500 text-[2.5rem] font-bold" />
        <span className="text-blue-500 text-[2rem] mx-[1rem] font-bold tracking-widest">
          ChatApp
        </span>
      </div>
      <div className="flex justify-center items-center lg:text-[1.3rem] text-[1.1rem]">
        <button
          className="bg-blue-500 rounded-[1rem] px-[0.8rem] py-[0.25rem] text-white font-bold"
          onClick={() => navigate("/")}
        >
          Login
        </button>
        <button
          className="bg-blue-500 rounded-[1rem] px-[0.5rem] py-[0.25rem] text-white font-bold ml-[1.5rem]"
          onClick={() => navigate("/signup")}
        >
          SignUp
        </button>
      </div>
    </div>
  );
}
