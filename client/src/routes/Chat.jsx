import React, { useState, useEffect } from "react";
import { AiFillWechat, AiOutlineUsergroupAdd } from "react-icons/ai";
import { HiMiniUserGroup } from "react-icons/hi2";
import { BiMessageAltDetail, BiSolidUserCircle } from "react-icons/bi";
import { CiGlass, CiLogout } from "react-icons/ci";
import { LuSend } from "react-icons/lu";
import ChatContainer from "../components/ChatContainer";
import client from "../api/client";
import { MdGroup } from "react-icons/md";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SocketIO from "../socket";

export default function Chat() {
  const [currentconv, setCurrentconv] = useState(null);
  const [curruserdata, setCurruserdata] = useState({
    username: "",
    userid: "",
  });
  const [isgroup, setIsgroup] = useState(false);
  const [allusers, setAllusers] = useState([]);
  const [allGroups, setAllgroups] = useState([]);
  const [isModelVisible, setIsmodelvisible] = useState(false);
  const [memberstoadd, setMemberstoadd] = useState([]);
  const [grpname, setGrpname] = useState("");
  // const [ischat, setIschat] = useState(false);
  const fetchusers = async () => {
    try {
      if (curruserdata.userid != "") {
        // console.log("inside");
        client.get(`/user/getall/${curruserdata.userid}`).then((res) => {
          // console.log(res.data);
          if (res.status === 200) {
            setAllusers(res.data);
          } else {
            console.log("something went wrong");
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchgroups = async () => {
    const id = curruserdata.userid;
    if (id != "") {
      await client.get(`/user/fetchgrp/${id}`).then((res) => {
        if (res.status === 200) {
          setAllgroups(res.data);
        }
      });
    }
  };
  useEffect(() => {
    const username = localStorage.getItem("username");
    const userid = localStorage.getItem("userid");
    setCurruserdata({
      username: username,
      userid: userid,
    });
  }, []);

  useEffect(() => {
    setCurrentconv(null);
    fetchusers();
    fetchgroups();
  }, [isgroup]);

  useEffect(() => {
    if (isgroup) {
      fetchgroups;
    } else {
      fetchusers();
    }
  });
  useEffect(() => {
    const id = localStorage.getItem("userid");
    const name = localStorage.getItem("username");
    if (id && name) {
      SocketIO.emit("set-current-user", {
        userid: id,
        username: name,
      });
    }
    SocketIO.on("get-active-users", (data) => {
      console.log("active-users -> " + data);
    });
  }, []);

  const validate = () => {
    if (grpname == "") {
      toast.error("please enter group name");
      return false;
    }
    if (memberstoadd.length == 0) {
      toast.error("please select atleast on user");
      return false;
    }
    return true;
  };

  const handleCreateGrp = async () => {
    const id = curruserdata.userid;
    if (validate() && id != "") {
      await client
        .post(`/user/creategrp/${id}`, {
          groupname: grpname,
          members: memberstoadd,
        })
        .then((res) => {
          console.log(res.data);
          console.log(res.status);
          if (res.status === 200) {
            setMemberstoadd([]);
            setGrpname("");
            setIsmodelvisible(false);
            toast.success("Group successfully created");
          } else {
            console.log("something went wrong");
          }
        });
    }
  };
  //------Group-chat-sockets-------//

  useEffect(() => {
    if (currentconv != null && currentconv.isgroup) {
      const id = localStorage.getItem("userid");
      if (id) {
        SocketIO.emit("join-group", {
          groupid: currentconv.groupid,
          userid: id,
        });
      }
    }
  }, [currentconv]);

  return (
    <div className="w-screen h-screen">
      <div className="flex">
        {/* sidecontainer */}
        <div className="shadow-lg lg:w-[4vw] bg-[#E6E4E4] border-r-2 border-white">
          <div className="flex justify-center items-center">
            {/* icon */}
            <AiFillWechat className="text-black text-[2.5rem] font-bold my-[0.5rem]" />
          </div>
          {/* chat */}
          <button
            onClick={() => {
              setIsgroup(false);
            }}
            className="flex justify-center items-center text-[1.5rem] rounded-[999rem] px-[1rem] py-[0.3rem] my-[0.5rem] mx-[0.4em] hover:bg-blue-500 hover:text-white"
            style={{
              backgroundColor: !isgroup ? "#3c82f6" : "white",
              color: !isgroup ? "white" : "black",
            }}
          >
            <BiMessageAltDetail />
          </button>
          {/* group chat*/}
          <button
            onClick={() => {
              setIsgroup(true);
              console.log("button triggered");
            }}
            className="flex justify-center items-center text-[1.5rem] rounded-[999rem] px-[1rem] py-[0.3rem] my-[1rem] mx-[0.4em] hover:bg-blue-500 hover:text-white cursor-pointer"
            style={{
              backgroundColor: isgroup ? "#3c82f6" : "white",
              color: isgroup ? "white" : "black",
            }}
          >
            <HiMiniUserGroup />
          </button>
          {/* userimage */}
          {/* <div className="text-[2.5rem] flex justify-center items-center mt-[31rem]">
            <BiSolidUserCircle />
          </div> */}
          {/* signout */}
          {/* <button
            className="text-[1.8rem] font-bold bg-blue-100 rounded-[10rem] py-[0.4rem] px-[0.5rem] justify-center items-center flex my-[1rem] ml-[0.4rem] hover:bg-blue-500 hover:text-white"
            // onClick={logout}
          >
            <CiLogout />
          </button> */}
        </div>
        {/* contact-chat-container */}
        {!isgroup && (
          <div className="lg:w-[25vw] h-screen">
            {/* header */}
            <div className="lg:h-[8vh] shadow-lg flex items-center justify-between bg-[#E6E4E4] border-2 border-white">
              <span className="lg:text-[1.5rem] text-[1.2rem] mx-[0.5rem] font-bold tracking-widest">
                Hey, {curruserdata.username}
              </span>
              <div className="lg:text-[2.5rem] text-[1.5rem] px-[0.5rem]">
                {/* <BiSolidUserCircle /> */}
              </div>
            </div>
            {/* Contacts */}
            <div className="scrollbar overflow-y-scroll h-[92vh] bg-[#E6E4E4]">
              {/* contactcard */}
              {allusers.map((item) => {
                return (
                  <div
                    className="lg:h-[8vh] shadow-md rounded-[0.5rem] mt-[0.5rem] mx-[0.5rem] flex items-center cursor-pointer"
                    key={item.userid}
                    onClick={() => {
                      setCurrentconv(item);
                    }}
                    style={{
                      backgroundColor:
                        (currentconv && currentconv.userid) == item.userid
                          ? "#3c82f6"
                          : "white",
                    }}
                  >
                    <div
                      className=""
                      style={{
                        color:
                          (currentconv && currentconv.userid) == item.userid
                            ? "white"
                            : "black",
                      }}
                    >
                      <BiSolidUserCircle className="text-[2.5rem] mx-[1rem]" />
                    </div>
                    <span
                      className="text-[1.2rem] font-semibold"
                      style={{
                        color:
                          (currentconv && currentconv.userid) == item.userid
                            ? "white"
                            : "black",
                        // color: "blue",
                      }}
                    >
                      {item.username}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* <div className="h-[8vh] shadow-md rounded-[0.5rem] mt-[0.5rem]"></div>
      <div className="h-[8vh] shadow-md rounded-[0.5rem] mt-[0.5rem]"></div>
      <div className="h-[8vh] shadow-md rounded-[0.5rem] mt-[0.5rem]"></div> */}
          </div>
        )}

        {/* groups */}
        {isgroup && (
          <div className="lg:w-[25vw] h-screen">
            {/* header */}
            <div className="lg:h-[8vh] shadow-lg flex items-center justify-between bg-[#E6E4E4] border-2 border-white">
              <span className="lg:text-[1.5rem] mx-[0.5rem] font-bold tracking-widest">
                Hey, {curruserdata.username}
              </span>
              <button
                className=" lg:px-[0.5rem] lg:py-[0.2rem] rounded-[2rem] bg-blue-500 justify-between items-center flex lg:mx-[1rem] px-[1.5rem]"
                onClick={() => setIsmodelvisible(true)}
                // data-bs-toggle="modal"
                // data-bs-target="#exampleModal"
              >
                {/* <BiSolidUserCircle /> */}

                <AiOutlineUsergroupAdd className="text-white lg:text-[1.4rem] text-[1.2rem]" />
                <span className="text-white lg:text-[1.3rem] text-[0.8rem]">
                  New Group
                </span>
              </button>
            </div>
            {/* Contacts */}
            <div className="scrollbar overflow-y-scroll h-[92vh] bg-[#E6E4E4]">
              {/* contactcard */}
              {allGroups.map((item) => {
                return (
                  <div
                    className="lg:h-[8vh] shadow-md rounded-[0.5rem] mt-[0.5rem] mx-[0.5rem] flex items-center cursor-pointer"
                    key={item.groupid}
                    onClick={() => {
                      setCurrentconv(item);
                    }}
                    style={{
                      backgroundColor:
                        (currentconv && currentconv.groupid) == item.groupid
                          ? "#3c82f6"
                          : "white",
                    }}
                  >
                    <div
                      className=""
                      style={{
                        color:
                          (currentconv && currentconv.groupid) == item.groupid
                            ? "white"
                            : "black",
                      }}
                    >
                      <MdGroup className="text-[2.5rem] mx-[1rem]" />
                    </div>
                    <span
                      className="text-[1.2rem] font-semibold"
                      style={{
                        color:
                          (currentconv && currentconv.groupid) == item.groupid
                            ? "white"
                            : "black",
                        // color: "blue",
                      }}
                    >
                      {item.groupname}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* <div className="h-[8vh] shadow-md rounded-[0.5rem] mt-[0.5rem]"></div>
      <div className="h-[8vh] shadow-md rounded-[0.5rem] mt-[0.5rem]"></div>
      <div className="h-[8vh] shadow-md rounded-[0.5rem] mt-[0.5rem]"></div> */}
          </div>
        )}
        {/* Modal */}
        <Modal
          isOpen={isModelVisible}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              // width: "30vw",
              // height: "80vh",
              borderRadius: "2rem",
            },
          }}
        >
          {/* main-container */}
          <div className="px-[2rem]">
            {/* header */}
            <div className="bg-blue-500 text-white font-bold lg:text-[2rem] text-[1.8rem] rounded-md flex justify-center items-center">
              <span className="">Create New Group</span>
            </div>
            {/* Groupname */}
            <div className="mx-[1rem] my-[2rem]">
              <label className="text-[1.3rem] font-semibold mb-2">
                Group Name
              </label>
              <input
                type="text"
                className="w-full border rounded-md py-[0.5rem] px-[1rem] text-gray-700 text-[1.2rem]"
                placeholder="name"
                value={grpname}
                onChange={(e) => setGrpname(e.target.value)}
              />
            </div>
            {/* body */}
            {/* add members */}
            <div className="mx-[1rem]">
              <span className="block text-[1.2rem] font-semibold mb-2">
                Add members
              </span>
              <div className="overflow-y-scroll scrollbar h-[35vh]">
                {/* checkbox */}
                {allusers.map((item) => {
                  return (
                    <div
                      key={item.userid}
                      className="grid gap-y-[1rem] mx-[1rem] my-[2rem]"
                      role="group"
                      aria-label="Basic checkbox toggle button group"
                    >
                      <input
                        type="checkbox"
                        className="btn-check"
                        id={item.userid}
                        autoComplete="off"
                        checked={memberstoadd.some(
                          (member) => member.userid == item.userid
                        )}
                        onChange={() => {
                          const isChecked = memberstoadd.some(
                            (member) => item.userid == member.userid
                          );
                          if (isChecked) {
                            setMemberstoadd(
                              memberstoadd.filter(
                                (member) => item.userid !== member.userid
                              )
                            );
                          } else {
                            setMemberstoadd([...memberstoadd, item]);
                          }
                        }}
                      />
                      <label
                        className="btn btn-outline-primary text-[1.3rem]"
                        for={item.userid}
                      >
                        {item.username}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* footer */}
            <div className="flex justify-between items-center px-[2rem] py-[2rem] scrollbar">
              <button
                className="bg-blue-500 text-white font-semibold text-[1.5rem] px-[0.5rem] py-[0.2rem] rounded-[0.5rem]"
                onClick={() => setIsmodelvisible(false)}
              >
                Close
              </button>
              <button
                className="bg-blue-500 text-white font-semibold text-[1.5rem] px-[0.5rem] py-[0.2rem] rounded-[0.5rem]"
                onClick={handleCreateGrp}
              >
                Create
              </button>
            </div>
          </div>
        </Modal>
        {/* chat container */}
        {/* toast */}
        <ToastContainer
          className="my-[3rem] text-[1.3rem] px-[1rem]"
          autoClose={1000}
          hideProgressBar={true}
        />
        {currentconv ? (
          <ChatContainer conversation={currentconv} />
        ) : (
          <div className="flex justify-center items-center w-[71vw] bg-[#E6E4E4]">
            <span className="flex justify-center items-center text-[2.5rem]">
              Select a user to start chatting!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
