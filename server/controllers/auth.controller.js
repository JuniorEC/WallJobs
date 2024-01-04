const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtsecret = "123asd132asd13asd23sad1asd";

const User = require("../models/user.model");

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (user && user.status === "offline") {
        return res.status(403).json({ error: "Usuário bloqueado" });
      }

      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            jwtsecret,
            {
              expiresIn: "1h",
            }
          );
          delete user.password;
          res.status(200).json({ accessToken, user: user });
        } else {
          res.status(401).json({ error: "Credenciais inválidas." });
        }
      } else {
        res.status(404).json({ error: "Usuário não encontrado." });
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  },
};
