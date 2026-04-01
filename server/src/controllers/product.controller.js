const ProductRepository = require('../repositories/product.repository');
const { generateSlug } = require('../utils/slugify');

class ProductController {
    static async getAll(req, res, next) {
        try {
            const filters = req.query;
            const products = await ProductRepository.findAll(filters);
            res.status(200).json({ success: true, count: products.length, data: products });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req, res, next) {
        try {
            const product = await ProductRepository.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Producto no encontrado' });
            }
            res.status(200).json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const data = req.body;
            if (!data.slug && data.name) {
                data.slug = generateSlug(data.name);
            }
            const product = await ProductRepository.create(data);
            res.status(201).json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const product = await ProductRepository.update(req.params.id, req.body);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Producto no encontrado' });
            }
            res.status(200).json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const success = await ProductRepository.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ success: false, message: 'Producto no encontrado' });
            }
            res.status(200).json({ success: true, message: 'Producto eliminado correctamente' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductController;
