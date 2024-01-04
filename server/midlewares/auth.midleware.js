const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

const jwtsecret = "123asd132asd13asd23sad1asd";

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || token === "null") {
    return res.status(401).json();
  }

  try {
    const decodedToken = jwt.verify(token, jwtsecret);

    req.user = { userId: decodedToken.userId, email: decodedToken.email };
    const user = await User.findByPk(decodedToken.userId);

    next();
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    return res.status(401).json({ error: "Token inválido." });
  }
};
