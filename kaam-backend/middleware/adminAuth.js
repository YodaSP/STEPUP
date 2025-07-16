// middlewares/adminAuth.js

const adminAuth = (req, res, next) => {
  console.log("🔐 AdminAuth middleware called for:", req.method, req.path);
  console.log("📋 Request headers:", req.headers);
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    console.log("❌ No Basic auth header found");
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin Area"');
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  const [username, password] = credentials.split(":");

  console.log("🔍 Checking credentials - Username:", username, "Password:", password);

  if (username === "admin" && password === "admin") {
    console.log("✅ Admin authentication successful");
    next(); // authorized
  } else {
    console.log("❌ Admin authentication failed");
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin Area"');
    return res.status(403).json({ message: "Invalid credentials" });
  }
};

module.exports = adminAuth;
