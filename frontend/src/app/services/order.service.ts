import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    discountedPrice: number;
    images: Array<{ url: string; alt: string }>;
  };
  quantity: number;
  price: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: Array<{ productId: string; quantity: number }>;
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    return this.http.post<{ success: boolean; data: Order }>(this.apiUrl, orderData)
      .pipe(
        map(response => response.data)
      );
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<{ success: boolean; data: Order[] }>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<{ success: boolean; data: Order }>(`${this.apiUrl}/${orderId}`)
      .pipe(
        map(response => response.data)
      );
  }

  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order> {
    return this.http.patch<{ success: boolean; data: Order }>(`${this.apiUrl}/${orderId}/status`, { status })
      .pipe(
        map(response => response.data)
      );
  }

  cancelOrder(orderId: string): Observable<Order> {
    return this.http.patch<{ success: boolean; data: Order }>(`${this.apiUrl}/${orderId}/cancel`, {})
      .pipe(
        map(response => response.data)
      );
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<{ success: boolean; data: Order[] }>(`${this.apiUrl}/admin/all`)
      .pipe(
        map(response => response.data)
      );
  }

  getOrderStats(): Observable<any> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/admin/stats`)
      .pipe(
        map(response => response.data)
      );
  }
} 