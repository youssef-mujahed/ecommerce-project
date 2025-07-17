import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

import { HomeComponent } from './components/home/home.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderHistoryComponent } from './components/orders/order-history/order-history.component';
import { OrderDetailComponent } from './components/orders/order-detail/order-detail.component';

import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { 
    path: 'checkout',  component: CheckoutComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'orders',  component: OrderHistoryComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'orders/:id',  component: OrderDetailComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'admin',  component: AdminDashboardComponent, 
    canActivate: [authGuard, adminGuard] 
  },
  { 
    path: 'admin/products',  component: AdminProductsComponent, 
    canActivate: [authGuard, adminGuard] 
  },
  { 
    path: 'admin/orders',  component: AdminOrdersComponent, 
    canActivate: [authGuard, adminGuard] 
  },
  { 
    path: 'admin/users',  component: AdminUsersComponent, 
    canActivate: [authGuard, adminGuard] 
  },

  { path: '**', redirectTo: '' }
]; 