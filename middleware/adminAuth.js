import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unothorized access.",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASWORD) {
      return res.status(401).json({
        success: false,
        message: "Unothorized access.",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
    res.status(500).send("Internal server error ");
  }
};

export default adminAuth;
