const { pool } = require('../config/database');

class UserRepository {
    static async findByEmail(email) {
        const query = `
            SELECT u.*, r.name as role 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.email = ? AND u.status = 'active' 
            LIMIT 1
        `;
        const [rows] = await pool.execute(query, [email]);
        return rows[0] || null;
    }

    static async findById(id) {
        const query = `
            SELECT u.id, u.name, u.email, u.role_id, r.name as role 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.id = ? AND u.status = 'active' 
            LIMIT 1
        `;
        const [rows] = await pool.execute(query, [id]);
        return rows[0] || null;
    }
}

module.exports = UserRepository;
