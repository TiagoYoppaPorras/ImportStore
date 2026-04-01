const { pool } = require('../config/database');

class ProductRepository {
    static async findAll(filters) {
        let baseQuery = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            JOIN categories c ON p.category_id = c.id 
            WHERE p.is_active = true AND p.deleted_at IS NULL
        `;
        let params = [];
        
        if (filters && filters.category) {
            baseQuery += ' AND c.slug = ?';
            params.push(filters.category);
        }

        const [rows] = await pool.query(baseQuery, params);
        return rows;
    }

    static async findById(id) {
        const query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            JOIN categories c ON p.category_id = c.id 
            WHERE p.id = ? AND p.deleted_at IS NULL
        `;
        const [rows] = await pool.query(query, [id]);
        return rows[0] || null;
    }

    static async create(data) {
        const { category_id, sku, name, slug, description, short_description, retail_price, wholesale_price, stock, main_image_url } = data;
        const query = `
            INSERT INTO products 
            (category_id, sku, name, slug, description, short_description, retail_price, wholesale_price, stock, main_image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [
            category_id, sku, name, slug, description, short_description, retail_price, wholesale_price, stock, main_image_url || null
        ]);
        return { id: result.insertId, ...data };
    }

    static async update(id, data) {
        const { category_id, sku, name, slug, description, short_description, retail_price, wholesale_price, stock, is_active, main_image_url } = data;
        const query = `
            UPDATE products SET 
            category_id = ?, sku = ?, name = ?, slug = ?, description = ?, 
            short_description = ?, retail_price = ?, wholesale_price = ?, stock = ?, is_active = ?, main_image_url = ?
            WHERE id = ?
        `;
        await pool.execute(query, [
            category_id, sku, name, slug, description, short_description, retail_price, wholesale_price, stock, is_active, main_image_url, id
        ]);
        return this.findById(id);
    }

    static async delete(id) {
        // Soft delete
        const query = 'UPDATE products SET deleted_at = CURRENT_TIMESTAMP, is_active = false WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = ProductRepository;
