import { useState, useMemo } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
// import { CategoryNav } from './components/CategoryNav';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { LoginModal } from './components/LoginModal';
import { ProfilePage } from './components/ProfilePage';
import { LikedProductsPage } from './components/LikedProductsPage';
import { CheckoutPage } from './components/CheckoutPage';
import { ProductListingPage } from './components/ProductListingPage';
import { mockProducts } from './data/mockData';
import { Product, CartItem } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'profile' | 'liked' | 'checkout' | 'all-products'>('home');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setCurrentPage('home');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedProduct(null);
  };

  // Checkout Page
  if (currentPage === 'checkout') {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            onSearch={setSearchQuery} 
            cartCount={cartCount} 
            onCartClick={() => setIsCartOpen(true)}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onProfileClick={() => setCurrentPage('profile')}
            onLikedProductsClick={() => setCurrentPage('liked')}
          />
          <CheckoutPage
            onBack={handleBackToHome}
            cartItems={cartItems}
            onOrderComplete={handleOrderComplete}
          />
        </div>
      </AuthProvider>
    );
  }

  // Profile Page
  if (currentPage === 'profile') {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            onSearch={setSearchQuery} 
            cartCount={cartCount} 
            onCartClick={() => setIsCartOpen(true)}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onProfileClick={() => setCurrentPage('profile')}
            onLikedProductsClick={() => setCurrentPage('liked')}
          />
          <ProfilePage onBack={handleBackToHome} />
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </div>
      </AuthProvider>
    );
  }

  // Liked Products Page
  if (currentPage === 'liked') {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            onSearch={setSearchQuery} 
            cartCount={cartCount} 
            onCartClick={() => setIsCartOpen(true)}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onProfileClick={() => setCurrentPage('profile')}
            onLikedProductsClick={() => setCurrentPage('liked')}
          />
          <LikedProductsPage
            onBack={handleBackToHome}
            onProductClick={setSelectedProduct}
            onAddToCart={handleAddToCart}
          />
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </div>
      </AuthProvider>
    );
  }

  // All Products Page
  if (currentPage === 'all-products') {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            onSearch={setSearchQuery} 
            cartCount={cartCount} 
            onCartClick={() => setIsCartOpen(true)}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onProfileClick={() => setCurrentPage('profile')}
            onLikedProductsClick={() => setCurrentPage('liked')}
          />
          <ProductListingPage
            products={filteredProducts}
            onBack={handleBackToHome}
            onProductClick={setSelectedProduct}
            onAddToCart={handleAddToCart}
          />
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </div>
      </AuthProvider>
    );
  }

  // Product Detail Page
  if (selectedProduct) {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            onSearch={setSearchQuery} 
            cartCount={cartCount} 
            onCartClick={() => setIsCartOpen(true)}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onProfileClick={() => setCurrentPage('profile')}
            onLikedProductsClick={() => setCurrentPage('liked')}
          />
          <ProductDetail
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
          />
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </div>
      </AuthProvider>
    );
  }

  // Home Page
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header 
          onSearch={setSearchQuery} 
          cartCount={cartCount} 
          onCartClick={() => setIsCartOpen(true)}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onProfileClick={() => setCurrentPage('profile')}
          onLikedProductsClick={() => setCurrentPage('liked')}
        />
        {/*used to be CategoryNav, but commented out for now         
        <CategoryNav 
          selectedCategory={selectedCategory} 
          onCategorySelect={setSelectedCategory} 
        />
         */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          {!searchQuery && selectedCategory === 'All Categories' && (
            <>
              <div className="text-center mb-16 py-24 bg-gradient-to-br from-blue-50 to-gray-50 rounded-2xl">
                <h1 className="text-6xl font-bold mb-6">
                  <span className="text-blue-500">Welcome</span>
                  <span className="text-gray-600"> to </span>
                  <span className="text-amber-500">My Store</span>
                </h1>
                <p className="text-xl text-gray-600 mb-12">
                  The ultimate C2C marketplace where buyers and sellers connect safely and securely
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors flex items-center"
                  >
                    Start Selling <span className="ml-2">→</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('all-products')}
                    className="bg-white text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    Browse Products
                  </button>
                </div>
              </div>

              {/* Why Choose My Store Section */}
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Why Choose My Store?</h2>
                <p className="text-xl text-gray-600 mb-12">
                  Join thousands of satisfied users who trust our platform for their buying and selling needs
                </p>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {/* For Sellers */}
                  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="inline-block px-4 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-4">For Sellers</div>
                    <h3 className="text-xl font-bold mb-3">Sell Your Products</h3>
                    <p className="text-gray-600">List your items and reach thousands of potential buyers</p>
                  </div>

                  {/* For Buyers */}
                  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div className="inline-block px-4 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-4">For Buyers</div>
                    <h3 className="text-xl font-bold mb-3">Shop Safely</h3>
                    <p className="text-gray-600">Browse verified products with secure payment protection</p>
                  </div>

                  {/* Secure */}
                  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="inline-block px-4 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-4">Secure</div>
                    <h3 className="text-xl font-bold mb-3">Secure Transactions</h3>
                    <p className="text-gray-600">All payments are protected with industry-standard security</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Products Section */}
          <div id="products-section" className="mb-12 text-center">
            {!searchQuery && selectedCategory === 'All Categories' ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Featured Products
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover the most popular items from our trusted sellers. From electronics to fashion, find amazing deals on quality products.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search results for "${searchQuery}"` : selectedCategory}
                </h2>
                <p className="text-gray-600 mt-1">{filteredProducts.length} items found</p>
              </>
            )}
          </div>
          <ProductGrid
            products={filteredProducts}
            onProductClick={setSelectedProduct}
            onAddToCart={handleAddToCart}
          />

          {/* Footer Section */}
          {!searchQuery && selectedCategory === 'All Categories' && (
            <footer className="mt-24 pt-12 border-t border-gray-200 bg-gray-50 rounded-lg shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-blue-500 mb-4">My Store</h3>
                  <p className="text-gray-600 mb-4">
                    The trusted C2C marketplace where millions of people come to buy and sell almost anything. Safe, secure, and simple.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <div className="w-5 h-5 mr-2">📍</div>
                      123 Market Street, San Francisco, CA 94102
                    </div>
                    <div className="flex items-center text-gray-600">
                      <div className="w-5 h-5 mr-2">📞</div>
                      +1 (555) 123-4567
                    </div>
                    <div className="flex items-center text-gray-600">
                      <div className="w-5 h-5 mr-2">📧</div>
                      hello@mystore.com
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">Browse Categories</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">Featured Products</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">New Arrivals</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">Best Sellers</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">Deals & Offers</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Support</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">Help Center</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">Contact Us</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">Shipping Info</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">Returns</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">Safety Tips</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-4">Account</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">Sign In</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">Create Account</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">My Orders</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">Sell on My Store</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-blue-500">Become a Seller</a></li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8 pb-12">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-gray-600 mb-4 md:mb-0">© 2024 My Store. All rights reserved.</p>
                  <div className="flex space-x-6">
                    <a href="#" className="text-gray-600 hover:text-blue-500">Privacy Policy</a>
                    <a href="#" className="text-gray-600 hover:text-blue-500">Terms of Service</a>
                  </div>
                  <div className="flex space-x-4 mt-4 md:mt-0">
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          )}
        </main>

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
        
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </div>
    </AuthProvider>
  );
}

export default App;