import { usermodel } from "../schemas/usermodel.js";
export const checkauthor = async (req, res, next) => {
  let authid = req.params?.id || req.body?.author;

  let newauthor = await usermodel.findById(authid);
  if (!newauthor) {
    const error = new Error("invalid author");
    error.status = 400;
    throw error;
  }

  if (newauthor.role != "AUTHOR") {
    const error = new Error("invalid role");
    error.status = 400;
    throw error;
  }

  if (newauthor.isactive === false) {
    const error = new Error("invalid author");
    error.status = 400;
    throw error;
  }

  next();
};
