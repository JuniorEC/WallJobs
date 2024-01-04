const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASS || "",
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: "mysql",
    logging: false,
  }
);

const initialize = async () => {
  try {
    const User = require("../models/user.model");
    const Product = require("../models/product.model");
    await sequelize.sync({ force: true });
    console.log("Modelos sincronizados com o banco de dados.");

    // Inserção de dados fictícios para User
    await User.bulkCreate([
      {
        name: "John Doe",
        email: "joaodjuniorec@gmail.com",
        password: await bcrypt.hash("123456", 4),
      },
      {
        name: "JOÃO JUNIOR",
        email: "joaodjunior@gmail.com",
        password: await bcrypt.hash("123456", 4),
      },
    ]);

    // Inserção de dados fictícios para Device
    await Product.bulkCreate([
      {
        userId: 1,
        name: "Produto 1",
        code: "p1",
        description: "Top top",
        price: 25.5,
      },
      {
        userId: 1,
        name: "Produto 2",
        code: "p2",
        description: "Só top",
        price: 25.5,
      },
    ]);

    console.log("Dados fictícios inseridos com sucesso.");
  } catch (error) {
    console.error(
      "Erro ao sincronizar modelos e inserir dados fictícios:",
      error
    );
  } finally {
    // Fecha a conexão com o banco de dados
    // await sequelize.close();
  }
};

module.exports = { sequelize, initialize };
