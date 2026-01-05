import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import type { CartItem } from '../App';

interface OrderFormProps {
  cartItems: CartItem[];
  onOrderComplete: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
}

export default function OrderForm({
  cartItems,
  onOrderComplete,
  onCancel,
}: OrderFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Email válido es requerido');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 7) {
      setError('Teléfono válido es requerido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          total_amount: total,
          items: cartItems,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al procesar la orden');
      }

      setSuccess(true);
      setTimeout(() => {
        onOrderComplete();
      }, 2000);
    } catch (err) {
      setError('Error al procesar la orden. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md border border-pink-200/50 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Orden Confirmada</h2>
        <p className="text-gray-600 mb-2">
          ¡Tu pedido ha sido enviado exitosamente!
        </p>
        <p className="text-sm text-gray-500">
          Recibirás una confirmación en tu correo electrónico
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-pink-500 hover:text-pink-600 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al catálogo
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md border border-pink-200/50 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Información de Entrega
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Número de Celular
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Ej: +57 300 123 4567"
                className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-300"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-md"
            >
              {loading ? 'Procesando...' : 'Confirmar Compra'}
            </button>
          </form>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md border border-pink-200/50 p-6 sticky top-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Resumen del Pedido</h3>

            <div className="space-y-3 mb-6">
              {cartItems.map(item => (
                <div
                  key={item.product_id}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ${(item.price * item.quantity).toLocaleString('es-CO')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-pink-200 pt-4">
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Subtotal:</span>
                <span>${total.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-4">
                <span>Envío:</span>
                <span className="text-green-600 font-semibold">Gratis</span>
              </div>

              <div className="flex justify-between font-bold text-lg text-pink-500 bg-pink-50 p-3 rounded">
                <span>Total:</span>
                <span>${total.toLocaleString('es-CO')}</span>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Nos pondremos en contacto para confirmar tu pedido
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
