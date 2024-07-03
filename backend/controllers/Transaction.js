import Transactions from "../models/TransactionModel.js";
import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";

export const getTransactions = async (req, res) => {
    try {
        const response = await Transactions.findAll({
            attributes: ['uuid', 'quantity', 'totalPrice'],
            include: [
                {
                    model: Products,
                    attributes: ['name', 'price']
                },
                {
                    model: Users,
                    attributes: ['name', 'email']
                }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createTransaction = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const product = await Products.findOne({
            where: { id: productId }
        });
        if (!product) return res.status(404).json({ msg: "Product not found" });

        const totalPrice = product.price * quantity;

        await Transactions.create({
            productId,
            userId: req.userId,
            quantity,
            totalPrice
        });
        res.status(201).json({ msg: "Transaction Created Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transactions.findOne({
            where: { uuid: req.params.id }
        });
        if (!transaction) return res.status(404).json({ msg: "Transaction not found" });

        await Transactions.destroy({
            where: { uuid: req.params.id }
        });
        res.status(200).json({ msg: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
