import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService, Cart } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  Number = Number;
  cart: Cart | null = null;
  loading = true;
  isLoggedIn = false;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.loading = false;
    });
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateCartItem(itemId, quantity).subscribe({
        error: (err) => {
          console.error('Update quantity error:', err);
          if (err.status === 404 && err.error?.message === 'Cart not found') {
            this.errorMessage = 'Your cart session has expired or is invalid. Please reset your cart.';
          }
        }
      });
    }
  }

  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId).subscribe({
      error: (err) => {
        console.error('Remove item error:', err);
        if (err.status === 404 && err.error?.message === 'Cart not found') {
          this.errorMessage = 'Your cart session has expired or is invalid. Please reset your cart.';
        }
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      error: (err) => {
        console.error('Clear cart error:', err);
        if (err.status === 404 && err.error?.message === 'Cart not found') {
          this.errorMessage = 'Your cart session has expired or is invalid. Please reset your cart.';
        }
      }
    });
  }

  resetCartSession(): void {
    this.cartService.clearSessionId();
    window.location.reload();
  }

  proceedToCheckout(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login']);
    }
  }
} 