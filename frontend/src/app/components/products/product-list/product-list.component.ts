import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, ProductFilters } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { FilterPipe } from '../../../shared/pipes/filter.pipe';
import { SortPipe } from '../../../shared/pipes/sort.pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, LoadingSpinnerComponent, FilterPipe, SortPipe],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  filters: ProductFilters = {};
  searchTerm = '';
  selectedCategory = '';
  selectedBrand = '';
  selectedGender = '';
  sortBy = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  page = 1;
  limit = 9;
  totalPages = 1;
  totalProducts = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.filters.page = this.page;
    this.filters.limit = this.limit;
    this.productService.getProducts(this.filters).subscribe({
      next: (response) => {
        this.products = Array.isArray(response.data) ? response.data : [];
        this.totalPages = Math.max(1, Number(response.pagination.pages) || 1);
        this.totalProducts = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.totalPages = 1;
        this.totalProducts = 0;
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.filters.search = this.searchTerm;
    this.page = 1;
    this.loadProducts();
  }

  onCategoryChange(): void {
    this.filters.category = this.selectedCategory;
    this.page = 1;
    this.loadProducts();
  }

  onBrandChange(): void {
    this.filters.brand = this.selectedBrand;
    this.page = 1;
    this.loadProducts();
  }

  onGenderChange(): void {
    this.filters.targetGender = this.selectedGender;
    this.page = 1;
    this.loadProducts();
  }

  onSortChange(): void {
    this.filters.sort = `${this.sortBy}:${this.sortDirection}`;
    this.page = 1;
    this.loadProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addToGuestCart(product._id, 1).subscribe({
      next: () => {
        console.log('Product added to cart');
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
  }

  clearFilters(): void {
    this.filters = {};
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.selectedGender = '';
    this.sortBy = 'name';
    this.sortDirection = 'asc';
    this.page = 1;
    this.loadProducts();
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadProducts();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadProducts();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.loadProducts();
    }
  }
} 