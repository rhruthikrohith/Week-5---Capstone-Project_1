import exp from "express";
import { verifytoken } from "../middleware/verifytoken.js";
import { usermodel } from "../schemas/usermodel.js";

export const adminroute = exp.Router();

// block user
adminroute.put('/block/:id', verifytoken, async (req, res) => {
    let userobj = req.params.id;
    let blockobj = await usermodel.findByIdAndUpdate(
        userobj,
        { $set: { isactive: false } },
        { new: true }
    );
    if (!blockobj) {
        return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ message: "blocked", blockobj });
})
// unblock user
adminroute.put('/unblock/:id', verifytoken, async (req, res) => {
  let userobj = req.params.id;
    let blockobj = await usermodel.findByIdAndUpdate(
        userobj,
        { $set: { isactive: true } },
        { new: true }
    );
    if (!blockobj)
         {
        return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ message: "unblocked", blockobj });
});
