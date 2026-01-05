import { useState, useMemo } from 'react';
import { Heart, Eye } from 'lucide-react';
import type { Product } from '../App';
import { products as initialProducts } from '../data/products';

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
  selectedCategory?: string;
}

export default function ProductCatalog({ onAddToCart, selectedCategory = 'Todos' }: ProductCatalogProps) {
  const [products] = useState<Product[]>(initialProducts);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return products;
    }
    return products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory, products]);

  return (
    <div className="pb-12">
      <div className="flex flex-col items-center mb-12">
        <span className="text-purple-500 font-bold text-sm tracking-widest uppercase mb-2">¡Los mejores precios!</span>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter text-center">
          Descubre nuestras ofertas
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 px-2 md:px-0">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="group bg-white flex flex-col h-full relative"
          >
            {/* Image Container */}
            <div className="relative aspect-square bg-[#f9f9f9] overflow-hidden">
              {/* Offer Badge */}
              <div className="absolute top-0 left-0 z-10 bg-[#FF8A3D] text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 uppercase">
                ¡Oferta!
              </div>

              {/* Action Icons */}
              <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-1.5 bg-white rounded-full shadow-md text-gray-400 hover:text-purple-500 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1.5 bg-white rounded-full shadow-md text-gray-400 hover:text-purple-500 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply p-4 transition-transform duration-500 group-hover:scale-105"
              />

              {/* Add to Cart Hover Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-black text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-purple-600 transition-colors shadow-lg"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="py-4 flex flex-col items-center text-center">
              <h4 className="text-sm font-medium text-gray-700 mb-1 px-2 line-clamp-1 group-hover:text-purple-500 transition-colors">
                {product.name}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 line-through">
                  ${(product.price * 1.2).toLocaleString('es-CO')}
                </span>
                <span className="text-base font-bold text-gray-900">
                  ${product.price.toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white border border-gray-100 italic text-gray-400">
          No hay productos disponibles en esta categoría.
        </div>
      )}
    </div>
  );
}
