import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteOldImage = (imagePath) => {
    if (imagePath) {
        fs.unlink(path.join(__dirname, '..', imagePath), (err) => {
            if (err) console.error(err);
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const condition = req.role === "admin" ? {} : { userId: req.userId };
        const response = await Product.findAll({
            attributes: ['uuid', 'name', 'price', 'stock', 'image'],
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
            attributes: ['uuid', 'name', 'price', 'stock', 'image'],
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
    const { name, price, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        await Product.create({
            name,
            price,
            stock,
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

        const { name, price, stock } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : product.image;

        const condition = req.role === "admin" ?
            { id: product.id } :
            { [Op.and]: [{ id: product.id }, { userId: req.userId }] };

        if (req.role !== "admin" && req.userId !== product.userId) {
            return res.status(403).json({ msg: "Akses terlarang" });
        }

        if (req.file) deleteOldImage(product.image);

        await Product.update({ name, price, stock, image }, { where: condition });

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

        deleteOldImage(product.image);

        await Product.destroy({ where: condition });

        res.status(200).json({ msg: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
