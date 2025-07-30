import React from 'react';
import { Clock, Eye, Gavel, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer">
      <div onClick={() => onProductClick(product)}>
        <div className="aspect-w-16 aspect-h-12">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          <div className="mb-3">
            {product.isAuction && product.currentBid ? (
              <div>
                <p className="text-sm text-gray-600">Current bid</p>
                <p className="text-xl font-bold text-green-600">${product.currentBid.toFixed(2)}</p>
                {product.buyItNowPrice && (
                  <p className="text-sm text-gray-500">Buy it now: ${product.buyItNowPrice.toFixed(2)}</p>
                )}
              </div>
            ) : (
              <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">{product.condition}</span>
            <span className="text-xs">+${product.shipping.toFixed(2)} shipping</span>
          </div>

          {product.isAuction && (
            <div className="flex items-center justify-between text-sm mb-3">
              <div className="flex items-center text-red-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>{product.timeLeft}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-500">
                <div className="flex items-center">
                  <Gavel className="w-4 h-4 mr-1" />
                  <span>{product.bids} bids</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{product.watchers}</span>
                </div>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-600 mb-3">Sold by {product.seller}</p>
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <button 
          onClick={() => onAddToCart(product)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};