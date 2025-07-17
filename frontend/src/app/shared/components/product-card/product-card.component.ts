import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showAddToCart: boolean = true;
  @Output() addToCart = new EventEmitter<Product>();

  constructor(private cartService: CartService) {}

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  isProductInCart(): boolean {
    return this.cartService.isProductInCart(this.product._id);
  }

  getProductQuantity(): number {
    return this.cartService.getProductQuantity(this.product._id);
  }
} 