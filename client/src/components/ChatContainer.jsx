import React, { useEffect, useRef, useState } from "react";
import { BiMessageAltDetail, BiSolidUserCircle } from "react-icons/bi";
import { MdGroup } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import client from "../api/client";
import SocketIO from "../socket";
import { data } from "autoprefixer";

export default function ChatContainer({ conversation }) {
  const [mssages, setMssges] = useState([]);
  const [id, setId] = useState("");
  const [msg, setmsg] = useState("");

  const msgRef = useRef(null);

  const incomingstyle = {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  };
  const outgoingstyle = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  };
  useEffect(() => {
    setMssges([]);
    const id = localStorage.getItem("userid");
    setId(id);
    if (conversation.isgroup == false) {
      const rvid = conversation.userid;
      if (id != undefined && id != null && id != "") {
        client.get(`/user/fetchmsg/${rvid}/${id}`).then((res) => {
          if (res.status === 200) {
            setMssges(res.data);
          }
        });
      }
    } else {
      const gpid = conversation.groupid;
      client.get(`/user/fchgrpmsg/${gpid}`).then((res) => {
        if (res.status === 200) {
          setMssges(res.data);
        }
      });
    }
  }, [conversation]);

  useEffect(() => {
    if (!conversation.isgroup) {
      SocketIO.on("get-message", (data) => {
        console.log(data);
        setMssges((prevMessages) => [...prevMessages, data]);
        console.log(mssages);
      });
      return () => {
        SocketIO.off("get-message");
      };
    } else {
      console.log("inside else");
      SocketIO.on("get-grp-message", (data) => {
        console.log(data);
        setMssges((prevMessages) => [...prevMessages, data]);
      });
      return () => {
        SocketIO.off("get-grp-message");
      };
    }
  }, []);

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  }, [mssages]);

  const sendMsg = async () => {
    if (conversation.isgroup == false) {
      if (msg != "" && id != "") {
        await client
          .post(`/user/sendmsg/${id}`, {
            recieverid: conversation.userid,
            message: msg,
          })
          .then((res) => {
            console.log(res.data);
            console.log(res.status);
            if (res.status === 200) {
              const data = res.data;
              setMssges((prevMessages) => [...prevMessages, data]);
              SocketIO.emit("send-message", {
                senderid: data.senderid,
                recieverid: data.recieverid,
                message: data.message,
                timestamp: data.timestamp,
                _id: data._id,
                __v: data.__v,
              });
              setmsg("");
            }
          });
      }
    } else {
      const groupid = conversation.groupid;
      if (msg != "" && id != "" && groupid != "") {
        await client
          .post(`/user/sndmsgingrp/${id}/${groupid}`, {
            message: msg,
          })
          .then((res) => {
            console.log(res.status);
            console.log(res.data);
            if (res.status === 200) {
              const data = res.data;
              setMssges((prevMessages) => [...prevMessages, data]);
              SocketIO.emit("send-message-ingroup", data);
              setmsg("");
            }
          });
      }
    }
  };
  //--------------Group-chat-sockets--------------//
  return (
    <div className="w-[71vw] h-screen">
      {/* header */}
      {conversation && (
        <div className="h-[8vh] shadow-lg flex items-center justify-between bg-[#E6E4E4] border-b-2 border-white">
          {/* userimage */}
          <div className="px-[1rem] flex justify-center items-center">
            <div className="flex justify-center items-center">
              {conversation.isgroup ? (
                <MdGroup className="text-[2.5rem]" />
              ) : (
                <BiSolidUserCircle className="text-[2.5rem]" />
              )}

              <span className="text-[1.5rem] px-[1rem] font-semibold">
                {conversation &&
                  (conversation.username || conversation.groupname)}
              </span>
            </div>
            {conversation.isgroup == true && conversation.adminid == id && (
              <div className="pb-[0.5rem]">group admin</div>
            )}
          </div>
        </div>
      )}
      {/* conversation */}
      <div
        className="scrollbar h-[82vh] overflow-y-scroll bg-[#E6E4E4]"
        ref={msgRef}
      >
        {/* messages */}
        {conversation &&
          mssages.length != 0 &&
          mssages.map((item) => {
            return (
              <div
                key={item._id}
                className=" px-[2rem] py-[1rem] justify-start"
                style={item.senderid === id ? outgoingstyle : incomingstyle}
              >
                <div
                  className="chat-messages bg-[#C1BDBC] py-[0.3rem] px-[1rem] rounded-[0.5rem]"
                  style={{
                    backgroundColor:
                      item.senderid === id ? "#3c82f6" : "#C1BDBC",
                    color: item.senderid === id ? "white" : "black",
                    flexDirection: "row",
                  }}
                >
                  {" "}
                  {conversation.isgroup == true && item.senderid !== id && (
                    <span className="text-[0.8rem] text-white bg-blue-500 px-[0.5rem] rounded-md">
                      {item.sendername}
                    </span>
                  )}
                  <p className="text-[1.1rem] font-semibold">{item.message}</p>
                  {/* Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Sequi, unde perferendis. Porro illo provident quisquam quis,
                  aspernatur nam amet exercitationem at consectetur ipsam
                  repellat alias dignissimos fugit vitae reiciendis debitis. */}
                </div>
              </div>
            );
          })}
      </div>
      {/* sender */}
      <div className="h-[10vh] flex items-center justify-center bg-[#E6E4E4]">
        {/* <span className="shadow-xl w-[50vw] rounded-[2rem] py-[0.8rem] border-2 border-blue-500 px-[1rem]">
            </span> */}
        <input
          type="text"
          className="w-[50vw] rounded-[2rem] py-[0.8rem] text-[1.2rem] px-[1rem] outline-blue-500"
          placeholder="Message"
          value={msg}
          onChange={(e) => setmsg(e.target.value)}
        />
        <LuSend
          className="text-[2rem] mx-[1rem] text-blue-500 hover:text-blue-800"
          onClick={sendMsg}
        />
      </div>
    </div>
  );
}
