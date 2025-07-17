import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  discountedPrice: number;
  category: any;
  subcategory: string;
  brand: string;
  targetGender: 'men' | 'women' | 'unisex';
  sku: string;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  stock: {
    quantity: number;
    lowStockThreshold: number;
  };
  stockStatus: 'in-stock' | 'out-of-stock' | 'low-stock';
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  brand?: string;
  targetGender?: string;
  category?: string;
  subcategory?: string;
  stockStatus?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  success: boolean;
  count: number;
  total: number;
  pagination: {
    page: number;
    limit: number;
    pages: number;
  };
  data: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getProducts(filters: ProductFilters = {}): Observable<ProductResponse> {
    let params = new HttpParams();
    
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof ProductFilters];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ProductResponse>(this.apiUrl, { params })
      .pipe(
        map(response => {
          this.productsSubject.next(response.data);
          return response;
        })
      );
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<{ success: boolean; data: Product }>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<ProductResponse>(`${this.apiUrl}?isFeatured=true&limit=8`)
      .pipe(
        map(response => response.data)
      );
  }

  getSaleProducts(): Observable<Product[]> {
    return this.http.get<ProductResponse>(`${this.apiUrl}?isOnSale=true&limit=8`)
      .pipe(
        map(response => response.data)
      );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<ProductResponse>(`${this.apiUrl}?search=${query}`)
      .pipe(
        map(response => response.data)
      );
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<ProductResponse>(`${this.apiUrl}?category=${categoryId}`)
      .pipe(
        map(response => response.data)
      );
  }

  getProductsByBrand(brand: string): Observable<Product[]> {
    return this.http.get<ProductResponse>(`${this.apiUrl}?brand=${brand}`)
      .pipe(
        map(response => response.data)
      );
  }

  createProduct(productData: Partial<Product>): Observable<Product> {
    return this.http.post<{ success: boolean; data: Product }>(this.apiUrl, productData)
      .pipe(
        map(response => response.data)
      );
  }

  updateProduct(id: string, productData: Partial<Product>): Observable<Product> {
    return this.http.put<{ success: boolean; data: Product }>(`${this.apiUrl}/${id}`, productData)
      .pipe(
        map(response => response.data)
      );
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<{ success: boolean; data: any }>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  getCurrentProducts(): Product[] {
    return this.productsSubject.value;
  }
} 