const UserRepository = require('../repositories/user.repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await UserRepository.findByEmail(email);
            if (!user) {
                return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
            }

            // Create token
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
            );

            // Remove password from response
            delete user.password_hash;

            res.status(200).json({
                success: true,
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async verify(req, res, next) {
        try {
            // If the request reaches here, it means the auth middleware already verified the token
            const user = await UserRepository.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }

            res.status(200).json({
                success: true,
                data: { user }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
