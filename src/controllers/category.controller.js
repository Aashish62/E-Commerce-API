import models from "../models/index.js";

const { Category } = models;

export const create = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });
    await category.update(req.body);
    res.status(200).json({
      message: "Category updated successfully",
      data: category,
    })
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });
    await category.destroy();
    res.status(204).json({ message: "Category deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const list = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
