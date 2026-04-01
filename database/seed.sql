-- Import Store Base Data Script
-- Initial data load for development and testing

USE import_store;


-- 1. Insert Base Roles
INSERT INTO roles (id, name) VALUES 
(1, 'admin'),
(2, 'customer')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 2. Insert Default Admin (Password: admin123 hashed via hypothetical bcrypt)
-- Note: Replace with actual hashed password when using backend login.
INSERT INTO users (role_id, name, email, password_hash, phone, status) 
VALUES (1, 'Admin Import Store', 'admin@importstore.com', '$2b$10$xyz...', '3804524621', 'active');


-- 3. Insert Base Categories
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
(1, 'Gadgets', 'gadgets', 'Accesorios de tecnología', 10),
(2, 'Cosméticos', 'cosmeticos', 'Productos de cuidado capilar y belleza', 20),
(3, 'Perfumes', 'perfumes', 'Perfumes importados y árabes', 30)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 4. Insert Products based on User requirement
-- Gadgets
INSERT INTO products (category_id, sku, name, slug, description, short_description, retail_price, wholesale_price, stock, min_wholesale_qty) VALUES
(1, 'G-AP2', 'AirPods Pro 2da Gen', 'airpods-pro-2da-gen', 'AirPods Pro 2da Gen con cancelación activa de ruido', 'Excelente calidad de audio', 65000.00, 45000.00, 50, 5),
(1, 'G-BP', 'Battery Pack MagSafe', 'battery-pack', 'Batería portátil compatible con MagSafe', 'Batería portátil MagSafe', 35000.00, 25000.00, 30, 5),
(1, 'G-C20W', 'Combo cargador iPhone (20W + Cable C-Lightning)', 'combo-cargador-iphone', 'Cargador rápido 20W más cable C a Lightning', 'Carga rápida asegurada', 25000.00, 18000.00, 100, 10),
(1, 'G-PRJ', 'Proyector Smart', 'proyector', 'Proyector LED con Android TV integrado', 'Cine en casa', 150000.00, 110000.00, 15, 3);

-- Cosméticos
INSERT INTO products (category_id, sku, name, slug, description, short_description, retail_price, wholesale_price, stock, min_wholesale_qty) VALUES
(2, 'C-K500', 'Crema Karseell 500ml', 'crema-karseell-500ml', 'Tratamiento capilar de hidratación profunda.', 'Hidratación total', 25000.00, 15000.00, 200, 10),
(2, 'C-K050', 'Aceite Karseell 50ml', 'aceite-karseell-50ml', 'Aceite capilar nutritivo anti frizz', 'Nutrición concentrada', 15000.00, 9000.00, 150, 10);

-- Perfumes
INSERT INTO products (category_id, sku, name, slug, description, short_description, retail_price, wholesale_price, stock, min_wholesale_qty) VALUES
(3, 'P-AR01', 'Perfume Árabe Lattafa', 'perfume-arabe-lattafa', 'Fragancia intensa de larga duración.', 'Notas orientales', 85000.00, 60000.00, 20, 5),
(3, 'P-IMP01', 'Perfume Importado Bvlgari', 'perfume-importado-bvlgari', 'Fragancia clásica fresca.', 'Fresco y amaderado', 120000.00, 95000.00, 10, 3);
