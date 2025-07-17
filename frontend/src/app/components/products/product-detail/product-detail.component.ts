import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  selectedQuantity: number = 1;
  selectedImageIndex = 0;
  Math = Math;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  loadProduct(productId: string): void {
    this.loading = true;
    this.productService.getProduct(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToGuestCart(this.product._id, this.selectedQuantity).subscribe({
        next: () => {
          console.log('Product added to cart');
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
        }
      });
    }
  }

  isProductInCart(): boolean {
    return this.product ? this.cartService.isProductInCart(this.product._id) : false;
  }

  getProductQuantity(): number {
    return this.product ? this.cartService.getProductQuantity(this.product._id) : 0;
  }
} 