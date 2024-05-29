import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getProducts = async (req, res) => {
    try {
        const condition = req.role === "admin" ? {} : { userId: req.userId };
        const response = await Product.findAll({
            attributes: ['uuid', 'name', 'price', 'image'],
            where: condition,
            include: [{
                model: User,
                attributes: ['name', 'email']
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { uuid: req.params.id }
        });
        if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const condition = req.role === "admin" ?
            { id: product.id } :
            { [Op.and]: [{ id: product.id }, { userId: req.userId }] };

        const response = await Product.findOne({
            attributes: ['uuid', 'name', 'price', 'image'],
            where: condition,
            include: [{
                model: User,
                attributes: ['name', 'email']
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createProduct = async (req, res) => {
    const { name, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Anggap file disimpan di folder 'uploads'
    
    try {
        await Product.create({
            name,
            price,
            image,
            userId: req.userId
        });
        res.status(201).json({ msg: "Product Created Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { uuid: req.params.id }
        });
        if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const { name, price } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : product.image;
        
        const condition = req.role === "admin" ?
            { id: product.id } :
            { [Op.and]: [{ id: product.id }, { userId: req.userId }] };

        if (req.role !== "admin" && req.userId !== product.userId) {
            return res.status(403).json({ msg: "Akses terlarang" });
        }

        await Product.update({ name, price, image }, { where: condition });

        if (req.file) deleteOldImage(product.image); // Hapus gambar lama jika ada gambar baru

        res.status(200).json({ msg: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { uuid: req.params.id }
        });
        if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const condition = req.role === "admin" ?
            { id: product.id } :
            { [Op.and]: [{ id: product.id }, { userId: req.userId }] };

        if (req.role !== "admin" && req.userId !== product.userId) {
            return res.status(403).json({ msg: "Akses terlarang" });
        }

        await Product.destroy({ where: condition });

        deleteOldImage(product.image); // Hapus gambar lama jika produk dihapus

        res.status(200).json({ msg: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
