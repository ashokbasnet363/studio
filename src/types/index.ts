
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  longDescription?: string;
  imageUrl: string;
  category: string;
  stock: number;
  rating?: number; // Average rating
  numReviews?: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface BasketItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: BasketItem[];
  totalAmount: number;
  orderDate: string;
  status: 'Pending' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled';
}
