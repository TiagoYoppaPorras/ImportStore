const { pool } = require('../config/database');

class OrderRepository {
    static async create(orderData, items) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const { order_number, subtotal, total, shipping_method, shipping_city, shipping_address, customer_notes, user_id } = orderData;

            // 1. Insert Order
            const orderQuery = `
                INSERT INTO orders 
                (user_id, order_number, subtotal, total, shipping_method, shipping_city, shipping_address, customer_notes) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [orderResult] = await connection.execute(orderQuery, [
                user_id || null, order_number, subtotal, total, shipping_method, shipping_city, shipping_address, customer_notes
            ]);

            const orderId = orderResult.insertId;

            // 2. Insert Order Items
            const itemQuery = `
                INSERT INTO order_items 
                (order_id, product_id, product_name, quantity, unit_price, subtotal) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            for (const item of items) {
                await connection.execute(itemQuery, [
                    orderId, 
                    item.product.id, 
                    item.product.name, 
                    item.quantity, 
                    item.product.retail_price, 
                    Number(item.product.retail_price) * item.quantity
                ]);
            }

            await connection.commit();
            return { id: orderId, order_number };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async findAll() {
        const query = `
            SELECT o.*, u.name as customer_name 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC
        `;
        const [rows] = await pool.query(query);
        return rows;
    }

    static async updateStatus(id, status) {
        const query = 'UPDATE orders SET status = ? WHERE id = ?';
        await pool.execute(query, [status, id]);
        return true;
    }
}

module.exports = OrderRepository;
