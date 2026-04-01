const OrderRepository = require('../repositories/order.repository');

class OrderController {
    static async create(req, res, next) {
        try {
            const { items, total, shipping_city, note } = req.body;
            
            if (!items || items.length === 0) {
                return res.status(400).json({ success: false, message: 'El carrito está vacío' });
            }

            // Generate order number: ORD-YYYYMMDD-XXXX
            const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const random = Math.floor(1000 + Math.random() * 9000);
            const order_number = `ORD-${date}-${random}`;

            const orderData = {
                order_number,
                subtotal: total,
                total,
                shipping_method: 'whatsapp',
                shipping_city: shipping_city || 'No especificado',
                shipping_address: 'Coordinar por WA',
                customer_notes: note || '',
                user_id: req.user ? req.user.id : null
            };

            const result = await OrderRepository.create(orderData, items);
            
            res.status(201).json({
                success: true,
                message: 'Orden persistida con éxito',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const orders = await OrderRepository.findAll();
            res.status(200).json({ success: true, data: orders });
        } catch (error) {
            next(error);
        }
    }

    static async updateStatus(req, res, next) {
        try {
            const { status } = req.body;
            await OrderRepository.updateStatus(req.params.id, status);
            res.status(200).json({ success: true, message: 'Estado actualizado' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = OrderController;
