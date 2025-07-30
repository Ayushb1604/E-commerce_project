import React from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockProducts } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface LikedProductsPageProps {
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const LikedProductsPage: React.FC<LikedProductsPageProps> = ({ 
  onBack, 
  onProductClick, 
  onAddToCart 
}) => {
  const { user } = useAuth();

  if (!user) return null;

  const likedProducts = mockProducts.filter(product => 
    user.likedProducts.includes(product.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Heart className="w-8 h-8 mr-3 text-red-500" />
          Liked Products
        </h1>
        <p className="text-gray-600 mt-2">{likedProducts.length} items in your wishlist</p>
      </div>

      {likedProducts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No liked products yet</h3>
          <p className="text-gray-500">Start browsing and like products to see them here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {likedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};