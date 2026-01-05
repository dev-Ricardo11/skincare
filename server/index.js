import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './db.js';
import { Resend } from 'resend';

process.on('uncaughtException', (err) => {
    console.error('CRITICAL ERROR:', err.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('UNHANDLED REJECTION:', reason.message || reason);
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
if (resend) {
    console.log('--- Resend inicializado correctamente ---');
} else {
    console.log('--- Resend NO inicializado (Falta API KEY) ---');
}

// Obtener todos los productos
app.get('/api/products', async (req, res) => {
    try {
        const result = await query('SELECT * FROM products ORDER BY category, name');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Crear una nueva orden
app.post('/api/orders', async (req, res) => {
    const { customer_name, customer_email, customer_phone, total_amount, items } = req.body;

    try {
        // Iniciar transacción
        await query('BEGIN');

        const orderResult = await query(
            'INSERT INTO orders (customer_name, customer_email, customer_phone, total_amount) VALUES ($1, $2, $3, $4) RETURNING id',
            [customer_name, customer_email, customer_phone, total_amount]
        );

        const orderId = orderResult.rows[0].id;

        for (const item of items) {
            await query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        await query('COMMIT');

        // Enviar notificación por correo (opcional si hay API KEY)
        if (process.env.RESEND_API_KEY) {
            console.log('--- Intentando enviar emails de notificación...');

            // 1. Email para el Administrador
            try {
                const adminRes = await resend.emails.send({
                    from: 'Skinker Shop <onboarding@resend.dev>',
                    to: 'richyrami05@gmail.com',
                    subject: `Nueva orden recibida de ${customer_name}`,
                    html: `
                        <h1>Nueva Orden #${orderId.substring(0, 8)}</h1>
                        <p><strong>Cliente:</strong> ${customer_name}</p>
                        <p><strong>Email:</strong> ${customer_email}</p>
                        <p><strong>Teléfono:</strong> ${customer_phone}</p>
                        <p><strong>Total:</strong> $${total_amount.toLocaleString('es-CO')}</p>
                        <h3>Items:</h3>
                        <ul>
                          ${items.map(item => `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-CO')}</li>`).join('')}
                        </ul>
                    `
                });
                if (adminRes.error) {
                    console.error('--- ERROR EMAIL ADMIN:', adminRes.error.message);
                } else {
                    console.log('--- Email Admin enviado con éxito');
                }
            } catch (err) {
                console.error('--- ERROR CRITICO EMAIL ADMIN:', err.message);
            }

            // 2. Email para el Cliente
            try {
                const customerRes = await resend.emails.send({
                    from: 'Skinker Shop <onboarding@resend.dev>',
                    to: customer_email,
                    subject: '¡Gracias por tu compra en Skinker Shop!',
                    html: `
                        <h1>¡Hola ${customer_name}!</h1>
                        <p>Hemos recibido tu pedido con éxito. Pronto nos pondremos en contacto contigo para coordinar la entrega.</p>
                        <hr>
                        <h3>Resumen de tu compra:</h3>
                        <ul>
                          ${items.map(item => `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toLocaleString('es-CO')}</li>`).join('')}
                        </ul>
                        <p><strong>Total pagado:</strong> $${total_amount.toLocaleString('es-CO')}</p>
                        <hr>
                        <p>Gracias por confiar en nosotros.</p>
                    `
                });

                if (customerRes.error) {
                    console.error('--- ERROR EMAIL CLIENTE:', customerRes.error.message);
                    console.log('--- NOTA: Resend requiere un dominio verificado para enviar a correos externos.');
                } else {
                    console.log('--- Email Cliente enviado con éxito');
                }
            } catch (err) {
                console.error('--- ERROR CRITICO EMAIL CLIENTE:', err.message);
            }
        } else {
            console.log('--- No se enviaron emails: RESEND_API_KEY no detectada ---');
        }

        res.status(201).json({ id: orderId, message: 'Orden creada exitosamente' });
    } catch (err) {
        await query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al procesar la orden' });
    }
});

// Endpoint de prueba para el correo
app.get('/api/test-email', async (req, res) => {
    if (!process.env.RESEND_API_KEY) {
        return res.status(400).json({ error: 'Falta RESEND_API_KEY en el .env' });
    }

    console.log('--- Iniciando PRUEBA de email...');
    try {
        const { data, error } = await resend.emails.send({
            from: 'Skinker Shop <onboarding@resend.dev>',
            to: 'richyrami05@gmail.com',
            subject: 'Prueba de Conexión - Skinker Shop',
            html: '<h1>¡Funciona!</h1><p>Si recibes esto, el backend está bien configurado.</p>'
        });

        if (error) {
            console.error('--- ERROR EN PRUEBA:', error);
            return res.status(500).json({ error: error });
        }

        console.log('--- PRUEBA EXITOSA:', data.id);
        res.json({ success: true, id: data.id });
    } catch (err) {
        console.error('--- ERROR CRITICO EN PRUEBA:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
