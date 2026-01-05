import { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductCatalog from './components/ProductCatalog';
import ShoppingCart from './components/ShoppingCart';
import OrderForm from './components/OrderForm';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

type Page = 'catalog' | 'checkout';

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>('catalog');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product_id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image_url: product.image_url
      }];
    });
  };

  const removeFromCart = (product_id: string) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== product_id));
  };

  const updateQuantity = (product_id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(product_id);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product_id === product_id
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      setCurrentPage('checkout');
    }
  };

  const handleOrderComplete = () => {
    clearCart();
    setCurrentPage('catalog');
  };

  return (
    <div className="min-h-screen font-['Outfit']">
      <Header
        cartCount={cart.length}
        onCartClick={() => setCurrentPage('checkout')}
        onCategoryClick={(cat) => setSelectedCategory(cat)}
      />

      <main className="container mx-auto px-0 md:px-4 py-8">
        {currentPage === 'catalog' ? (
          <div className="flex flex-col">
            <HeroSection />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 px-4 md:px-0">
              {/* Product Area */}
              <div className="lg:col-span-3">
                <ProductCatalog onAddToCart={addToCart} selectedCategory={selectedCategory} />
              </div>

              {/* Sidebar Cart */}
              <div className="lg:col-span-1">
                <div className="sticky top-40">
                  <ShoppingCart
                    items={cart}
                    onRemoveItem={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    onCheckout={handleCheckout}
                  />

                  {/* Extra sidebar widgets */}
                  <div className="mt-8 p-6 bg-gradient-to-br from-purple-500 to-lavender-400 rounded-3xl text-white shadow-xl shadow-purple-200/50">
                    <h4 className="font-bold mb-2">¿Necesitas ayuda?</h4>
                    <p className="text-xs text-white/80 mb-4 font-medium">Asesoría personalizada por WhatsApp sobre maquillaje y skincare.</p>
                    <a
                      href="https://wa.me/573133432418?text=Hola!%20Vengo%20de%20la%20página%20y%20necesito%20asesoría."
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block w-full text-center bg-white text-purple-600 py-3 rounded-2xl font-bold text-sm hover:bg-purple-50 transition-colors"
                    >
                      Chatear ahora
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4">
            <OrderForm
              cartItems={cart}
              onOrderComplete={handleOrderComplete}
              onCancel={() => setCurrentPage('catalog')}
            />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-purple-100 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-[#D4AF37] bg-clip-text text-transparent italic tracking-tight mb-4">
            Love for Skincare
          </h2>
          <p className="text-gray-400 text-sm italic">© 2026 Love for Skincare. Hecho con amor para resaltar tu belleza.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/573133432418?text=Hola!%20Vengo%20de%20la%20página%20y%20necesito%20asesoría."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}

export default App;
