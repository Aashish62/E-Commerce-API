
import models from '../models/index.js';
import { Op } from 'sequelize';
import Cloudinary from '../services/cloudinary.service.js';

const { Product, Category } = models;

export const create = async (req, res, next) => {
  try {
    const { name, description, price, stock, categoryId, image} = req.body;
     let imageUrl;
    if (image) {
      const upload = await Cloudinary.uploader.upload(image); // image can be URL or base64
      imageUrl = upload.secure_url;
    }
    const product = await Product.create({ name, description, price, stock, categoryId, imageUrl });
    console.log(product.toJSON());
    res.status(201).json({ message: 'Product created successfully', data: product });
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, stock, categoryId, image } = req.body;
    let imageUrl;

    if (image) {
      const upload = await Cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    await product.update({
      name,
      description,
      price,
      stock,
      categoryId,
      ...(imageUrl ? { imageUrl } : {}),
    });

    res.status(200).json({ message: 'Product updated successfully', data: product });
  } catch (err) {
    next(err);
  }
};


export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    await product.destroy();
    res.status(204).json({ message: 'Product deleted successfully' });
  } catch (err) { next(err); }
};

// Listing with filters and pagination
export const list = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, minPrice, maxPrice, categoryId, search } = req.query;
    const where = {};
    if (minPrice) where.price = { ...where.price, $gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, $lte: parseFloat(maxPrice) };
    if (categoryId) where.categoryId = categoryId;
    if (search) where.name = { [Op.iLike]: `%${search}%` };

    const offset = (page - 1) * pageSize;
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, attributes: ['id', 'name'] }],
      offset,
      limit: parseInt(pageSize),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      meta: { total: count, page: parseInt(page), pageSize: parseInt(pageSize), pages: Math.ceil(count / pageSize) },
      data: rows
    });
  } catch (err) { next(err); }
};
