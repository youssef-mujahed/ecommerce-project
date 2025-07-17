import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './auth.service';

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  avatar?: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<User> {
    return this.http.get<{ success: boolean; data: User }>(`${this.apiUrl}/profile`)
      .pipe(
        map(response => response.data)
      );
  }

  updateProfile(profileData: UpdateProfileRequest): Observable<User> {
    return this.http.put<{ success: boolean; data: User }>(`${this.apiUrl}/profile`, profileData)
      .pipe(
        map(response => response.data)
      );
  }

  changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.patch<{ success: boolean; data: any }>(`${this.apiUrl}/change-password`, passwordData)
      .pipe(
        map(response => response.data)
      );
  }

  addDeliveryAddress(address: DeliveryAddress): Observable<User> {
    return this.http.post<{ success: boolean; data: User }>(`${this.apiUrl}/delivery-addresses`, address)
      .pipe(
        map(response => response.data)
      );
  }

  updateDeliveryAddress(addressId: string, address: DeliveryAddress): Observable<User> {
    return this.http.put<{ success: boolean; data: User }>(`${this.apiUrl}/delivery-addresses/${addressId}`, address)
      .pipe(
        map(response => response.data)
      );
  }

  deleteDeliveryAddress(addressId: string): Observable<User> {
    return this.http.delete<{ success: boolean; data: User }>(`${this.apiUrl}/delivery-addresses/${addressId}`)
      .pipe(
        map(response => response.data)
      );
  }

  setDefaultAddress(addressId: string): Observable<User> {
    return this.http.patch<{ success: boolean; data: User }>(`${this.apiUrl}/delivery-addresses/${addressId}/default`, {})
      .pipe(
        map(response => response.data)
      );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<{ success: boolean; data: User[] }>(`${this.apiUrl}/admin/all`)
      .pipe(
        map(response => response.data)
      );
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<{ success: boolean; data: User }>(`${this.apiUrl}/admin/${userId}`)
      .pipe(
        map(response => response.data)
      );
  }

  updateUserRole(userId: string, role: 'user' | 'admin'): Observable<User> {
    return this.http.patch<{ success: boolean; data: User }>(`${this.apiUrl}/admin/${userId}/role`, { role })
      .pipe(
        map(response => response.data)
      );
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<{ success: boolean; data: any }>(`${this.apiUrl}/admin/${userId}`)
      .pipe(
        map(response => response.data)
      );
  }
} 