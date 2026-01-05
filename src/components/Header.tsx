import { ShoppingBag, Search, Heart, User, Menu } from 'lucide-react';
import logo from '../assets/logo_v2.png';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onCategoryClick?: (category: string) => void;
}

export default function Header({ cartCount, onCartClick, onCategoryClick }: HeaderProps) {
  const categories = ['Todos', 'Maquillaje', 'Skincare', 'Accesorios', 'Kits'];

  return (
    <div className="flex flex-col">
      {/* Top Promotion Bar */}
      <div className="bg-gradient-to-r from-[#D8B4FE] to-[#A78BFA] py-1.5 px-4 text-center">
        <p className="text-white text-xs font-semibold tracking-wider uppercase">
          ✨ Envíos a toda Colombia - Recibe asesoría por WhatsApp 📱
        </p>
      </div>

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
        {/* Main Header Area */}
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-4">

            {/* Left: Mobile Menu & Search (Placeholder) */}
            <div className="flex items-center gap-4 flex-1">
              <button className="md:hidden text-gray-600">
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden md:flex items-center bg-purple-50 rounded-full px-4 py-1.5 w-full max-w-xs border border-purple-100">
                <Search className="w-4 h-4 text-purple-400 mr-2" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="bg-transparent text-sm focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Center: Branding (Logo) */}
            <div className="flex flex-col items-center">
              <img
                src={logo}
                alt="Love for Skincare"
                className="h-24 md:h-36 w-auto object-contain"
              />
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-3 md:gap-5 flex-1 justify-end text-purple-500">
              <button className="hidden sm:block hover:scale-110 transition-transform">
                <User className="w-5 h-5" />
              </button>
              <button className="hidden sm:block hover:scale-110 transition-transform">
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={onCartClick}
                className="relative p-2 rounded-full bg-purple-50 hover:bg-purple-100 transition-all duration-200 group shadow-sm sm:shadow-none"
              >
                <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Navigation (Categories) */}
        <nav className="border-t border-purple-50 hidden md:block px-4">
          <div className="container mx-auto flex justify-center gap-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryClick && onCategoryClick(cat)}
                className="py-3 text-sm font-semibold text-gray-600 hover:text-[#D4AF37] relative group transition-colors"
              >
                {cat}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>
        </nav>
      </header>
    </div>
  );
}
