import React, { useState } from 'react';
import { ArrowLeft, Heart, ShoppingCart, Gavel, Clock, Eye, Star } from 'lucide-react';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  const [bidAmount, setBidAmount] = useState(product.currentBid ? product.currentBid + 1 : product.price);
  const { user, toggleLikedProduct } = useAuth();

  const isLiked = user?.likedProducts.includes(product.id) || false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="aspect-w-16 aspect-h-12">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">{product.condition}</span>
              <span>•</span>
              <span>{product.category}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 p-6 rounded-lg">
            {product.isAuction && product.currentBid ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Current bid</p>
                  <p className="text-3xl font-bold text-green-600">${product.currentBid.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-red-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="font-medium">{product.timeLeft} left</span>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-500">
                    <div className="flex items-center">
                      <Gavel className="w-4 h-4 mr-1" />
                      <span>{product.bids} bids</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      <span>{product.watchers} watching</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    min={product.currentBid ? product.currentBid + 1 : product.price}
                    step="0.01"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Place Bid
                  </button>
                </div>

                {product.buyItNowPrice && (
                  <div className="pt-4 border-t">
                    <p className="text-lg font-semibold mb-2">Buy it now: ${product.buyItNowPrice.toFixed(2)}</p>
                    <button 
                      onClick={() => onAddToCart(product)}
                      className="w-full bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Buy It Now
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                <button 
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            )}

            <div className="mt-4 pt-4 border-t text-sm text-gray-600">
              <p>+${product.shipping.toFixed(2)} shipping</p>
            </div>
          </div>

          {/* Seller Info */}
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Seller Information</h3>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-blue-600">{product.seller}</span>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">4.8 (234 reviews)</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button 
              onClick={() => toggleLikedProduct(product.id)}
              className={`flex-1 border py-2 px-4 rounded-md transition-colors flex items-center justify-center ${
                isLiked 
                  ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              Add to Watchlist
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      </div>
    </div>
  );
};