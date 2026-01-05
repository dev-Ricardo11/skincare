import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import type { CartItem } from '../App';

interface ShoppingCartProps {
  items: CartItem[];
  onRemoveItem: (product_id: string) => void;
  onUpdateQuantity: (product_id: string, quantity: number) => void;
  onCheckout: () => void;
}

export default function ShoppingCart({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
}: ShoppingCartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl shadow-pink-100 border border-pink-50 p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-pink-100 rounded-xl">
          <ShoppingBag className="w-5 h-5 text-pink-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">Tu Carrito</h3>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-100">
            <ShoppingBag className="w-8 h-8 text-pink-200" />
          </div>
          <p className="text-gray-400 font-medium italic">Está muy vacío...</p>
          <p className="text-xs text-gray-300 mt-1 uppercase tracking-widest">¡Agrega algo de magia!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {items.map(item => (
              <div
                key={item.product_id}
                className="flex items-center gap-4 group"
              >
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-pink-100 flex-shrink-0 shadow-sm">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm truncate leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-pink-500 font-black text-xs mt-1">
                    ${item.price.toLocaleString('es-CO')}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-1 bg-pink-50 rounded-full px-1 py-1">
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.product_id, item.quantity + 1)
                    }
                    className="p-1 rounded-full hover:bg-white transition-colors"
                  >
                    <Plus className="w-3 h-3 text-pink-500" />
                  </button>
                  <span className="text-[10px] font-black text-pink-600">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.product_id, item.quantity - 1)
                    }
                    className="p-1 rounded-full hover:bg-white transition-colors"
                  >
                    <Minus className="w-3 h-3 text-pink-500" />
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(item.product_id)}
                  className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-6 border-t border-pink-50">
            <div className="flex justify-between items-center px-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Estimado</span>
              <span className="text-2xl font-black text-gray-800 font-['Outfit']">
                ${total.toLocaleString('es-CO')}
              </span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-black text-white hover:bg-pink-600 font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-pink-100 uppercase text-xs tracking-[0.2em] active:scale-95"
            >
              Completar Pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
}
