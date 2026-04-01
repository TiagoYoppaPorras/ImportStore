-- Import Store Sample Queries

USE import_store;

-- 1. Get all active products with their category names
SELECT p.id, p.name, p.retail_price, c.name AS category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true;

-- 2. Report: Top selling products by revenue
SELECT oi.product_id, oi.product_name, SUM(oi.quantity) as items_sold, SUM(oi.subtotal) as total_revenue
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('paid', 'shipped', 'delivered')
GROUP BY oi.product_id, oi.product_name
ORDER BY total_revenue DESC
LIMIT 5;

-- 3. Alert: Low stock products
SELECT id, sku, name, stock
FROM products
WHERE stock < 10
ORDER BY stock ASC;

-- 4. Get User cart with items and calculating current totals
SELECT c.id as cart_id, ci.quantity, p.name, p.retail_price, (ci.quantity * p.retail_price) as row_total
FROM carts c
JOIN cart_items ci ON c.id = ci.cart_id
JOIN products p ON ci.product_id = p.id
WHERE c.user_id = 1;

-- 5. Monthly Revenue summary
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    COUNT(id) as total_orders,
    SUM(total) as total_revenue
FROM orders
WHERE status != 'cancelled'
GROUP BY month
ORDER BY month DESC;
