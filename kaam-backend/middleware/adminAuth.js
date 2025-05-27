// middlewares/adminAuth.js

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin Area"');
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  const [username, password] = credentials.split(":");

  if (username === "admin" && password === "admin") {
    next(); // authorized
  } else {
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin Area"');
    return res.status(403).json({ message: "Invalid credentials" });
  }
};

module.exports = adminAuth;
