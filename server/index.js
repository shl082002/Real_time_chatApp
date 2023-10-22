import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import auth from "./APIs/auth.js";
import authkey from "./middlewares/authKey.js";
import user from "./APIs/user.js";
import { Server } from "socket.io";
import http from "http";
import GROUP_SOCKETS from "./models/group-socket.js";

//----------CREATING EXPRESS APP------------//
const app = express();
//---------SOCKET CONFIG------------//
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//---------SOCKET CONNECTION--------//
var users = [];
io.on("connection", (socket) => {
  //listing to an event
  // console.log(`Socket Connected :-> ${socket.id}`);
  //set-active-users
  socket.on("set-current-user", (data) => {
    const isAlreadyIn = users.find((user) => user.userid === data.userid);
    if (!isAlreadyIn) {
      const user = {
        userid: data.userid,
        username: data.username,
        socketid: socket.id,
      };
      users.push(user);
      io.emit("get-active-users", users);
    }
    console.log(users);
  });
  //send-message
  socket.on("send-message", (data) => {
    const reciever = users.find((user) => user.userid === data.recieverid);
    if (reciever) {
      console.log(reciever);
      io.to(reciever.socketid).emit("get-message", {
        senderid: data.senderid,
        recieverid: data.recieverid,
        message: data.message,
        timestamp: data.timestamp,
        _id: data._id,
        __v: data.__v,
      });
    }
  });
  //disconnect-current-user
  socket.on("disconnect", async () => {
    users = users.filter((user) => user.socketid !== socket.id);
    const removeuser = await GROUP_SOCKETS.findOneAndUpdate(
      {
        members: { $elemMatch: { socketid: socket.id } },
      },
      {
        $pull: {
          members: { socketid: socket.id },
        },
      },
      {
        new: true,
      }
    );
    io.emit("get-active-users", users);
  });
  //------------------GROUP-CHAT-------------------------//
  var groups = [];
  var groupuser = [];
  //---------Join-group--------//
  socket.on("join-group", async (data) => {
    console.log(data);
    socket.join(data.groupid); //--> created a socket-room or channel
    // const group = groups.find((group) => group["groupid"] == data["groupid"]);
    // console.log(group);
    // if (!group) {
    //   //group not exist
    //   console.log("inside not group");
    //   const userdata = {
    //     userid: data.userid,
    //     socketid: socket.id,
    //   };
    //   console.log(userdata);
    //   const groupdata = {
    //     groupid: data.groupid,
    //     activemembers: [userdata],
    //   };
    //   groups.push(groupdata);
    // } else {
    //   console.log(group);
    //   // const members = group.activemembers;
    //   // const userExists = members.some((member) => {
    //   //   member.userid === data.userid;
    //   // });
    //   // console.log("user exists -> " + userExists);
    //   // if (!userExists) {
    //   // }
    //   console.log("inside this");
    //   group.activemembers.push({
    //     userid: data.userid,
    //     socketid: socket.id,
    //   });
    //   io.to(data.groupid).emit("get-group-members", {
    //     groupid: data.groupid,
    //     members: group.members,
    //   });
    // }
    // console.log(groups);
    // const user = groupuser.find((user) => {
    //   user.userid == data.userid;
    // });
    const group = await GROUP_SOCKETS.findOne({
      groupid: data.groupid,
    });
    const userdata = {
      userid: data.userid,
      socketid: socket.id,
    };
    if (!group) {
      const setdata = await GROUP_SOCKETS.create({
        groupid: data.groupid,
        members: userdata,
      });
    } else {
      const userid = data.userid;
      const isUser = await GROUP_SOCKETS.findOne({
        groupid: data.groupid,
        members: { $elemMatch: { userid: userid } },
      });
      console.log(isUser);
      if (!isUser) {
        const user = await GROUP_SOCKETS.findOneAndUpdate(
          {
            groupid: data.groupid,
          },
          {
            $push: {
              members: userdata,
            },
          },
          { new: true }
        );
        console.log(user);
      }
    }
  });
  //-----------Disconnect-user-------------------//
  io.on("leave-group", async (data) => {
    socket.leave(data.groupid);
    const group = await GROUP_SOCKETS.findOneAndUpdate(
      {
        groupid: data.groupid,
      },
      {
        $pull: {
          members: { socketid: socket.id },
        },
      },
      { new: true }
    );
    if (group) {
      console.log("user-disconnected");
    }
  });
  //-----------send-message-ingroup-------------//
  socket.on("send-message-ingroup", async (data) => {
    var group = await GROUP_SOCKETS.findOne({
      groupid: data.groupid,
    });
    console.log(data);
    if (group) {
      group.members = group.members.filter(
        (member) => member.userid !== data.senderid
      );
      // console.log(group);
      group.members.forEach((member) => {
        console.log(member);
        io.to(member.socketid).emit("get-grp-message", data);
      });
    }
  });
});
//----------CONNECT TO DATABASE----------//
const connect = async () => {
  try {
    const DB = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log(`MongoDB connected at ${DB.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
connect();

//---------MIDDLEWARES----------//
// app.use(authkey); //--> AuthKey Verification
app.use(express.json()); //-->> for reading json from api calls
app.use(express.urlencoded({ extended: true })); //-->> for reading fromData from api calls
app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,POST,DELETE",
  })
);
//---------ROUTING------------//

app.use("/api/auth", auth);
app.use("/api/user", user);

//----------PORT-----------//
const api_port = process.env.REST_PORT;
const sockets_port = process.env.WEBSOCKETS_PORT;
app.listen(api_port, () => {
  console.log(`API running at port ${api_port}`);
});
server.listen(sockets_port, () => {
  console.log(`WEB_SOCKET running at port ${sockets_port}`);
});
