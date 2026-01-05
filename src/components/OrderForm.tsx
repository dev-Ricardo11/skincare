import { useState } from 'react';
import { ArrowLeft, CheckCircle2, MessageCircle } from 'lucide-react';
import emailjs from 'emailjs-com';
import type { CartItem } from '../App';

// Configura aquí tus ID de EmailJS
const EMAILJS_SERVICE_ID = 'service_pp431hh'; // Reemplazar con Service ID
const EMAILJS_TEMPLATE_ID = 'template_mz9o4ci'; // Reemplazar con Template ID
const EMAILJS_PUBLIC_KEY = 'o_WVm7Vr3iGM4PywB'; // Reemplazar con Public Key

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
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 7) {
      setError('Teléfono válido es requerido');
      return false;
    }
    return true;
  };

  const generateWhatsAppMessage = () => {
    const itemsList = cartItems.map(item => `• ${item.name} x ${item.quantity}`).join('\n');
    const message = `¡Hola! Acabo de hacer un pedido en la página:\n\n*Cliente:* ${formData.name}\n*Teléfono:* ${formData.phone}\n\n*Pedido:*\n${itemsList}\n\n*Total:* $${total.toLocaleString('es-CO')}\n\n¿Me confirman los datos para el envío?`;
    return encodeURIComponent(message);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Inicializar EmailJS (opcional pero recomendado)
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Enviar correo via EmailJS
      const templateParams = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        items_list: cartItems.map(item => `${item.name} x ${item.quantity}`).join('\n'),
        total_amount: `$${total.toLocaleString('es-CO')}`,
        to_email: 'richyrami05@gmail.com'
      };

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('EmailJS Result:', result);
      setSuccess(true);
    } catch (err: any) {
      console.error('Error al enviar email:', err);
      setError('Hubo un pequeño problema al enviar el correo, pero tu pedido ha sido registrado. Por favor, confírmalo por WhatsApp para asegurar tu entrega.');
      // En este caso marcamos éxito para que puedan cerrar por WhatsApp
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl border border-purple-100 p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Pedido Listo!</h2>
        <p className="text-gray-600 mb-8">
          Tu pedido ha sido registrado. Para una atención más rápida, envíanos un mensaje por WhatsApp.
        </p>

        <div className="space-y-4">
          <a
            href={`https://wa.me/573133432418?text=${generateWhatsAppMessage()}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-6 h-6" />
            Enviar Pedido por WhatsApp
          </a>

          <button
            onClick={onOrderComplete}
            className="w-full text-purple-600 font-semibold py-2 hover:underline"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-8 font-semibold transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Volver al catálogo
      </button>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl border border-purple-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Información de Entrega
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className="w-full px-5 py-3 border border-purple-100 bg-purple-50/30 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Número de Celular
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ej: 322 306 4226"
                  className="w-full px-5 py-3 border border-purple-100 bg-purple-50/30 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Correo Electrónico (Opcional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full px-5 py-3 border border-purple-100 bg-purple-50/30 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-200/50 transition-all"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-purple-200"
            >
              {loading ? 'Procesando...' : 'Confirmar Compra'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-8 sticky top-10">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Resumen del Pedido</h3>

            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map(item => (
                <div
                  key={item.product_id}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{item.name}</span>
                    <span className="text-gray-500">Cantidad: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-purple-600">
                    ${(item.price * item.quantity).toLocaleString('es-CO')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-purple-50 pt-6 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold">${total.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío:</span>
                <span className="text-green-600 font-bold bg-green-50 px-2 rounded-lg text-xs flex items-center">Gratis</span>
              </div>

              <div className="flex justify-between items-center font-black text-2xl text-purple-600 pt-4">
                <span>Total:</span>
                <span>${total.toLocaleString('es-CO')}</span>
              </div>

              <div className="mt-8 p-4 bg-purple-50 rounded-2xl text-center">
                <p className="text-xs text-purple-400 font-medium">
                  Nos pondremos en contacto contigo para coordinar la entrega y el pago.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
