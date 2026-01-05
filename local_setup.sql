-- Selección/Creación de Base de Datos (Ejecutar esto primero)
-- CREATE DATABASE skinker_db;

-- Configuración de Tablas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    image_url TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Pedidos
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Ítems del Pedido
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Datos Iniciales (Seed) con Fotos de Alta Calidad
INSERT INTO products (name, description, price, image_url, category) VALUES
    ('Base de Maquillaje', 'Base líquida de larga duración, acabado natural y cobertura edificable.', 45000, 'https://images.unsplash.com/photo-1631730486784-5456119f69ae?q=80&w=1000&auto=format&fit=crop', 'Maquillaje'),
    ('Labial Matte Premium', 'Labial de larga duración con textura aterciopelada y colores vibrantes.', 22000, 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?q=80&w=1000&auto=format&fit=crop', 'Maquillaje'),
    ('Paleta de Sombras Galaxia', '12 tonos ultrapigmentados entre mates y metalizados.', 48000, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1000&auto=format&fit=crop', 'Maquillaje'),
    ('Máscara XL Lash', 'Pestañas con volumen extremo y longitud sin grumos.', 26000, 'https://images.unsplash.com/photo-1591360236480-9c6a4cb3a6de?q=80&w=1000&auto=format&fit=crop', 'Maquillaje'),
    ('Suero Hidratante Facial', 'Suero con ácido hialurónico para una piel radiante y joven.', 55000, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop', 'Skincare'),
    ('Kit de Brochas Pro', '10 brochas sintéticas de alta suavidad para un acabado perfecto.', 65000, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop', 'Accesorios'),
    ('Crema Hidratante Bio', 'Textura ligera para todo tipo de piel con extractos naturales.', 38000, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop', 'Skincare'),
    ('Delineador Precisión', 'Punta de fieltro ultrafina para un trazo perfecto y duradero.', 20000, 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=1000&auto=format&fit=crop', 'Maquillaje');
