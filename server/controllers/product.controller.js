const Product = require("../models/product.model");

module.exports = {
  getAllProducts: async (req, res) => {
    try {
      const { userId } = req.user;
      const { page, pageSize } = req.query;

      const products = await Product.findAll({
        where: { userId },
        limit: Number(pageSize),
        offset: (Number(page) - 1) * Number(pageSize),
      });

      const total = await Product.count({
        where: { userId },
      });

      res.status(200).json({
        next: page + 1,
        page: page,
        total: Math.ceil(total / pageSize),
        data: products,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createProduct: async (req, res) => {
    const { userId } = req.user;

    const { name, code, description, price } = req.body;
    try {
      const product = await Product.create({
        name,
        code,
        description,
        price,
        userId,
      });

      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getProductById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateProduct: async (req, res) => {
    const { userId } = req.user;

    const { id } = req.params;
    const { name, code, description, price } = req.body;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (product.userId !== userId) {
        return res.status(404).json({ error: "Product not found" });
      }
      await product.update({ name, code, description, price });
      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteProduct: async (req, res) => {
    const { userId } = req.user;

    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      if (product.userId !== userId) {
        return res.status(404).json({ error: "Product not found" });
      }
      await product.destroy();
      res.status(204).json();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
