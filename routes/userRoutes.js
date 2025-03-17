import express from "express";
import verifyToken from "../middleware/auth.js";
import {signup, login, logout, getUser, updateUser,deleteUser } from "../controllers/user.js";


const router= express.Router();


router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(verifyToken, logout);
router.route("/getuser/:id").get(verifyToken, getUser);
router.route("/updateuser/:id").patch(verifyToken, updateUser);
router.route("/deleteuser/:id").delete(verifyToken, deleteUser);

export default router;
