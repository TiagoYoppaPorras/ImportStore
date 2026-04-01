const ProductRepository = require('../repositories/product.repository');
const { generateSlug } = require('../utils/slugify');

class ProductService {
    static async findAll(filters) {
        // Here we could add logic to parse filters, setup redis cache checks, etc.
        return await ProductRepository.findAll(filters);
    }

    static async findBySlug(slug) {
        // Business logic, e.g., increment view counter, check cache, etc.
        return await ProductRepository.findBySlug(slug);
    }

    static async create(data) {
        // Business validation, data transformation
        if (!data.slug) {
            data.slug = generateSlug(data.name);
        }
        
        // Example check: category exists?
        
        return await ProductRepository.create(data);
    }

    // Additional methods like updateStock, adjustPrices, etc.
}

module.exports = ProductService;
