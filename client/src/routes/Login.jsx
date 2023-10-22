import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import chatimage from "../assets/chatimage2.jpg";
import { CiLogin } from "react-icons/ci";
import AuthHeader from "../components/AuthHeader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import client from "../api/client";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // const login = async () => {
  //   try {
  //     await apiClient
  //       .post("/auth/login", {
  //         username: "SahilVerma",
  //         password: "shl123",
  //       })
  //       .then((res) => {
  //         console.log(res.status);
  //         console.log(res.data);
  //       });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // console.log(username);
  // console.log(password);

  const validate = () => {
    if (username == "" || username.length < 6) {
      // console.log("please enter atleast 6 character");
      // setError("please enter atleast 6 character");
      toast.error("please enter atlease 6 characters in username");
      return false;
    }
    if (password == "") {
      // console.log("please enter your password");
      // setError("please enter your password");
      toast.error("please enter your password");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    // navigate("/chat");
    // login();
    if (validate()) {
      // console.log("Form validated");
      // toast.success("Wom so easy");
      await client
        .post("/auth/login", {
          username: username,
          password: password,
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success("login successfull");
            const data = res.data;
            console.log(data);
            localStorage.setItem("username", data.username);
            localStorage.setItem("userid", data.userid);
            navigate("/chat");
          } else {
            const data = res.data;
            const error = data.message;
            console.log(error);
            toast.error(error);
          }
        });
      // const res = await apiClient.post("/auth/login", {
      //   username: username,
      //   password: password,
      // });
      // console.log(res);
    } else {
    }
  };
  return (
    <div className="h-screen w-screen">
      {/* header */}
      <AuthHeader />
      {/* toast */}
      <ToastContainer
        className="my-[3rem]"
        autoClose={1000}
        hideProgressBar={true}
      />
      {/* body */}
      <div className="h-[90vh] grid lg:grid-cols-2">
        {/* left section */}
        <div className="flex justify-center items-center">
          {/* loginCard */}
          {/* logintext */}
          {/* <div className="">Login to Your Accout</div> */}
          {/* logininputs */}
          {/* loginbutton */}
          <div className="shadow-xl border-t-2 border-blue-500 py-[1rem] px-[1rem]">
            {/* welcometext */}
            <div className="flex justify-center items-center font-semibold lg:text-[2.5rem] tracking-wider py-[0.5rem] text-[2.5rem]">
              WELCOME
            </div>
            <div className="px-[1.5rem] py-[1.5rem]">
              {/* loginform */}
              {/* username */}
              <div className="mb-4">
                <label className="text-[1.3rem] font-semibold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md py-[1rem] px-[1rem] text-gray-700 lg:text-[1.2rem] text-[1rem]"
                  placeholder=""
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              {/* password */}
              <div className="mb-6">
                <label className=" text-[1.3rem] font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full border rounded-md py-[1rem] px-[1rem] text-gray-700 text-[1.2rem]"
                  placeholder=""
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {/* loginbutton */}
              <div className="flex items-center justify-between py-[2rem]">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-semibold text-white text-[1.5rem] font-bold py-2 px-4 rounded-md hover:bg-blue-600 flex justify-center items-center"
                >
                  <span>Login</span>
                  <CiLogin className="font-bold text-[1.5rem] mt-[0.2rem]" />
                </button>
                <button className="text-blue-500 hover:text-red-500 text-[1.3rem]">
                  Forgot Password?
                </button>
              </div>
              {/* <form onSubmit={handleSubmit}></form> */}
              <div
                className="flex justify-center items-center py-[1rem]
              "
              >
                {/* horizontal line */}
                <div className="border-[0.5px] border-gray-300 my-[1rem] w-[10vw] " />
                <span className="text-[1.1rem] px-[1rem]">Or</span>
                {/* horizontal line */}
                <div className="border-[0.5px] border-gray-300 my-[1rem] w-[10vw]" />
              </div>
              {/* signup Button */}
              <div className="">
                <span className="px-[0.5rem] text-[1.2rem]">
                  Don't have account?
                </span>
                <button
                  className="text-blue-500 hover:text-red-500 text-[1.2rem]"
                  onClick={() => navigate("/signup")}
                >
                  SignUp
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* right section */}
        <div
          className="justify-center items-center hidden lg:block object-cover"
          // style={{
          //   backgroundImage: `url(${chatbg})`,
          //   backgroundSize: "cover",
          //   backgroundRepeat: "no-repeat",
          //   backgroundPosition: "center",
          //   filter: "blur(5px)",
          // }}
        >
          {/* <span className="relative z-10">hi</span> */}
          {/* <div className="bg-transparent">
         
        </div> */}
          <div className="flex justify-center items-center py-[1rem]">
            <img src={chatimage} alt="GIF?" className="w-[80vh]" />
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* This is login Route */
}
{
  /* <button className="bg-blue-600" onClick={() => navigate("/signup")}>
  SignUp
</button> */
}
