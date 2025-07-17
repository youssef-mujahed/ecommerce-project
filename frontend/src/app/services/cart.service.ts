import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CartItem {
  _id: string;
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

export interface Cart {
  _id: string;
  user?: string;
  sessionId?: string;
  items: CartItem[];
  totalAmount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private loadCart(): void {
    const sessionId = this.getSessionId();
    if (sessionId) {
      this.getGuestCart(sessionId).subscribe();
    }
  }

  getUserCart(): Observable<Cart> {
    return this.http.get<{ success: boolean; data: Cart }>(this.apiUrl)
      .pipe(
        map(response => {
          this.cartSubject.next(response.data);
          return response.data;
        })
      );
  }

  getGuestCart(sessionId: string): Observable<Cart> {
    return this.http.get<{ success: boolean; data: Cart }>(`${this.apiUrl}/guest/${sessionId}`)
      .pipe(
        map(response => {
          this.cartSubject.next(response.data);
          return response.data;
        })
      );
  }

  addToUserCart(productId: string, quantity: number = 1): Observable<Cart> {
    return this.http.post<{ success: boolean; data: Cart }>(this.apiUrl, {
      productId,
      quantity
    }).pipe(
      map(response => {
        this.cartSubject.next(response.data);
        return response.data;
      })
    );
  }

  addToGuestCart(productId: string, quantity: number = 1): Observable<Cart> {
    const sessionId = this.getSessionId();
    return this.http.post<{ success: boolean; data: Cart }>(`${this.apiUrl}/guest`, {
      productId,
      quantity,
      sessionId
    }).pipe(
      map(response => {
        this.cartSubject.next(response.data);
        return response.data;
      })
    );
  }

  updateCartItem(itemId: string, quantity: number): Observable<Cart> {
    return this.http.put<{ success: boolean; data: Cart }>(`${this.apiUrl}/${itemId}`, {
      quantity
    }).pipe(
      map(response => {
        this.cartSubject.next(response.data);
        return response.data;
      })
    );
  }

  removeFromCart(itemId: string): Observable<Cart> {
    return this.http.delete<{ success: boolean; data: Cart }>(`${this.apiUrl}/${itemId}`)
      .pipe(
        map(response => {
          this.cartSubject.next(response.data);
          return response.data;
        })
      );
  }

  clearCart(): Observable<Cart> {
    return this.http.delete<{ success: boolean; data: Cart }>(this.apiUrl)
      .pipe(
        map(response => {
          this.cartSubject.next(response.data);
          return response.data;
        })
      );
  }

  getCurrentCart(): Cart | null {
    return this.cartSubject.value;
  }

  getCartItemCount(): number {
    const cart = this.cartSubject.value;
    return cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
  }

  getCartTotal(): number {
    const cart = this.cartSubject.value;
    return cart ? cart.totalAmount : 0;
  }

  isProductInCart(productId: string): boolean {
    const cart = this.cartSubject.value;
    return cart ? cart.items.some(item => item.product._id === productId) : false;
  }

  getProductQuantity(productId: string): number {
    const cart = this.cartSubject.value;
    if (!cart) return 0;
    
    const item = cart.items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  }

  private getSessionId(): string {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  clearSessionId(): void {
    localStorage.removeItem('sessionId');
  }
} 