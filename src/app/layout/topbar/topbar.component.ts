import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="topbar">
      <div class="topbar-left">
        <button class="btn-menu" (click)="toggleSidebar.emit()">
          <i class="bi bi-list"></i>
        </button>
      </div>
      <div class="topbar-right">
        <span class="user-name">
          <i class="bi bi-person-circle"></i>
          {{ currentUser?.displayName || 'User' }}
        </span>
        <button class="btn-logout" (click)="logout()">
          <i class="bi bi-box-arrow-right"></i>
          Logout
        </button>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      height: 60px;
      background: #fff;
      border-bottom: 1px solid #e8ecf1;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .topbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }
    .btn-menu {
      background: none;
      border: none;
      font-size: 22px;
      color: #555;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .btn-menu:hover { background: #f0f0f0; }

    .search-wrapper {
      display: flex;
      align-items: center;
      background: #f5f7fa;
      border-radius: 8px;
      padding: 8px 14px;
      gap: 8px;
      max-width: 400px;
      flex: 1;
    }
    .search-wrapper i { color: #999; font-size: 14px; }
    .search-wrapper input {
      border: none;
      background: none;
      outline: none;
      font-size: 14px;
      flex: 1;
      color: #333;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .user-name {
      font-size: 14px;
      color: #555;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn-logout {
      background: none;
      border: 1px solid #ddd;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      color: #666;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn-logout:hover { background: #f5f5f5; border-color: #ccc; }
  `]
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  private authService = inject(AuthService);
  private router = inject(Router);

  searchQuery = '';
  currentUser = this.authService.getCurrentUser();

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
    }
  }

  logout() {
    this.authService.logout();
  }
}
