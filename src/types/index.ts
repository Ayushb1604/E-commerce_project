export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currentBid?: number;
  buyItNowPrice?: number;
  imageUrl: string;
  category: string;
  seller: string;
  condition: 'New' | 'Used' | 'Refurbished';
  timeLeft?: string;
  bids?: number;
  watchers?: number;
  isAuction: boolean;
  shipping: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  rating: number;
  reviews: number;
  isSeller: boolean;
  avatar?: string;
  joinDate: string;
  location?: string;
}

export interface AuthUser extends User {
  likedProducts: string[];
}

export interface CheckoutInfo {
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
}