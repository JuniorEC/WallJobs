const cors = require("cors");
require("dotenv").config();
const express = require("express");
const path = require("path");

const { sequelize, initialize } = require("./config/database.config");
const authentication = require("./midlewares/auth.midleware");

const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use("/api", productRoutes);
app.use("/auth", authRoutes);

app.get("/", authentication, async (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/login", async (req, res) => {
  res.sendFile(path.join(__dirname, "/public/login.html"));
});

// Inicialização do servidor
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Sincronização do Sequelize com o banco de dados
//   initialize();
  console.log("Database synced");
});
