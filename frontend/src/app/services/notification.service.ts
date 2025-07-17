import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getUserNotifications(): Observable<Notification[]> {
    return this.http.get<{ success: boolean; data: Notification[] }>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }

  markAsRead(notificationId: string): Observable<Notification> {
    return this.http.patch<{ success: boolean; data: Notification }>(`${this.apiUrl}/${notificationId}/read`, {})
      .pipe(
        map(response => response.data)
      );
  }

  markAllAsRead(): Observable<any> {
    return this.http.patch<{ success: boolean; data: any }>(`${this.apiUrl}/read-all`, {})
      .pipe(
        map(response => response.data)
      );
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete<{ success: boolean; data: any }>(`${this.apiUrl}/${notificationId}`)
      .pipe(
        map(response => response.data)
      );
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<{ success: boolean; data: number }>(`${this.apiUrl}/unread-count`)
      .pipe(
        map(response => response.data)
      );
  }
} 