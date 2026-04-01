import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User, SessionUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly SESSION_KEY = 'devdocs_session';
  private usersCache: User[] | null = null;

  async login(username: string, password: string): Promise<boolean> {
    const users = await this.loadUsers();
    const hash = await this.hashPassword(password);
    const user = users.find(u => u.username === username && u.passwordHash === hash);

    if (user) {
      const session: SessionUser = {
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        token: this.generateToken()
      };
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.SESSION_KEY);
  }

  getCurrentUser(): SessionUser | null {
    const data = localStorage.getItem(this.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  private async loadUsers(): Promise<User[]> {
    if (this.usersCache) return this.usersCache;
    const data = await firstValueFrom(
      this.http.get<{ users: User[] }>('assets/content/users.json')
    );
    this.usersCache = data.users;
    return this.usersCache;
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private generateToken(): string {
    return crypto.randomUUID();
  }
}
