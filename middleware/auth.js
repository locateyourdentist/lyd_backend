const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'LYD2025';

const auth = (req, res, next) => {
  try {
    const header = req.headers['authorization']; 
    if (!header) {
      return res.json({ status: "error", message: "Authorization header missing" });
    }

    const [bearer, token] = header.split(" "); 

    if (bearer !== "Bearer" || !token) {
      return res.json({ status: "error", message: "Invalid token format" });
    }

   // const decoded = jwt.verify(token, process.env.JWT_SECRET || 'LYD2025'); 
    const decoded = jwt.verify(token, 'LYD2025');

    req.user = decoded;  
    next();  

  } catch (err) {
    return res.json({ status: "error", message: err.message });
  }
};

module.exports = auth;
