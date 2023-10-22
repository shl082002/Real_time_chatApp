import express from "express";
const router = express.Router();
import jwtAuth from "./../middlewares/jwtAuth.js";
import USER from "../models/user.js";
import MESSAGES from "../models/messages.js";
import GROUPS from "../models/group.js";
import e from "express";

//------------GET USER------------//

router.get("/getone", jwtAuth, async (req, res) => {
  try {
    const user = await USER.findById(req.user.id);
    if (!user) {
      return res.status(200).send({
        message: "user not found",
      });
    }
    return res.status(200).send({
      userid: user._id,
      username: user.username,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//-----------FETCH ALL USERS----------//
router.get("/getall/:userid", async (req, res) => {
  try {
    const data = [];
    const { userid } = req.params;
    const users = await USER.find({ _id: { $ne: userid } });
    if (users.length === 0) {
      return res.status(400).send({
        message: "Users not found",
      });
    } else {
      for (const user of users) {
        data.push({
          userid: user._id,
          username: user.username,
          isgroup: false,
        });
      }
      if (data.length === 0) {
        return res.status(400).send({
          message: "Users not found",
        });
      }
      return res.status(200).send(data);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
//-------------SEND MESSAGE---------------//
router.post("/sendmsg/:userid", async (req, res) => {
  try {
    const { recieverid, message } = req.body;
    const { userid } = req.params;
    const fetchuser = await USER.findById(userid);
    if (fetchuser) {
      const msg = await MESSAGES.create({
        senderid: userid,
        recieverid,
        message,
        timestamp: Date.now(),
      });
      return res.status(200).send(msg);
    } else {
      return res.status(400).send("User Not Found");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

//------------FETCH USER MESSAGES----------//

router.get("/fetchmsg/:recieverid/:userid", async (req, res) => {
  try {
    const { recieverid, userid } = req.params;
    const user = await USER.findById(userid);
    if (user) {
      const messages = await MESSAGES.find({
        $or: [
          { senderid: userid, recieverid: recieverid },
          { senderid: recieverid, recieverid: userid },
        ],
      });
      if (messages.length === 0) {
        return res.status(400).send({
          message: "messages not found",
        });
      } else {
        return res.status(200).send(messages);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
//-----------CREATE GROUP--------//
router.post("/creategrp/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const { members, groupname } = req.body;
    const user = await USER.findById(userid);
    // return res.status(200).send(user);
    if (user) {
      members.push({
        username: user.username,
        userid: user._id,
      });
      await GROUPS.create({
        groupname,
        adminid: userid,
        members,
      });
      return res.status(200).send();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
//-----------FETCH GROUP------------//
router.get("/fetchgrp/:userid", async (req, res) => {
  try {
    const data = [];
    const { userid } = req.params;
    const groups = await GROUPS.find({
      members: { $elemMatch: { userid } },
    });
    if (groups.length === 0) {
      return res.status(400).send({
        message: "no groups found",
      });
    } else {
      for (const group of groups) {
        data.push({
          groupid: group._id,
          adminid: group.adminid,
          groupname: group.groupname,
          members: group.members,
          isgroup: true,
        });
      }
      if (data.length == 0) {
        return res.status(400).send({
          message: "no groups found",
        });
      } else {
        return res.status(200).send(data);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
//---------UPDATE EXISTING GROUP--------//
router.post("/updategrp/:userid/:groupid", async (req, res) => {
  try {
    const { userid, groupid } = req.params;
    const { members, groupname } = req.body;
    const groups = await GROUPS.findById(groupid);
    if (!groups) {
      return res.status(400).send({
        message: "group not found",
      });
    } else {
      console.log(groups);
      if (groups.adminid === userid) {
        await GROUPS.findByIdAndUpdate(groupid, {
          $set: { groupname },
          $push: { members: { $each: members } },
        });
        return res.status(200).send("Group updated");
      } else {
        return res.status(400).send({
          message: "only admin can update group information",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
//-----------------SEND MESSAGE IN GROUP---------------//
router.post("/sndmsgingrp/:userid/:groupid", async (req, res) => {
  try {
    const { userid, groupid } = req.params;
    const { message } = req.body;
    const group = await GROUPS.findOne({
      _id: groupid,
      members: { $elemMatch: { userid: userid } },
    });
    // return res.status(400).send(group);
    if (!group) {
      return res.status(400).send({
        message: "group not found",
      });
    } else {
      const user = await USER.findById(userid);
      if (user) {
        const msg = await MESSAGES.create({
          senderid: userid,
          sendername: user.username,
          groupid,
          message,
          timestamp: Date.now(),
        });
        return res.status(200).send(msg);
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
//-----------FETCH GROUP MESSAGES------------//
router.get("/fchgrpmsg/:groupid", async (req, res) => {
  try {
    const { groupid } = req.params;
    const messages = await MESSAGES.find({ groupid });
    if (messages.length === 0) {
      return res.status(400).send({
        messages: "messages not found",
      });
    } else {
      return res.status(200).send(messages);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
export default router;
