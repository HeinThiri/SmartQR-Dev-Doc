import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { Domain } from '../../core/models/domain.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <div class="logo" *ngIf="!collapsed">
          <i class="bi bi-book"></i>
          <div class="logo-text">
            <span class="logo-title">Smart QR</span>
            <span class="logo-sub">DevDocs</span>
          </div>
        </div>
        <button class="btn-collapse" (click)="toggleCollapse.emit()">
          <i class="bi" [class.bi-chevron-left]="!collapsed" [class.bi-chevron-right]="collapsed"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/welcome" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-item">
          <i class="bi bi-house"></i>
          <span *ngIf="!collapsed">Home</span>
        </a>
        <a routerLink="/getting-started" routerLinkActive="active" class="nav-item">
          <i class="bi bi-rocket-takeoff"></i>
          <span *ngIf="!collapsed">Getting Started</span>
        </a>
        <a routerLink="/architecture" routerLinkActive="active" class="nav-item">
          <i class="bi bi-diagram-3"></i>
          <span *ngIf="!collapsed">Architecture</span>
        </a>
        <a routerLink="/smart-qr-hub" routerLinkActive="active" class="nav-item">
          <i class="bi bi-qr-code"></i>
          <span *ngIf="!collapsed">Smart QR hub</span>
        </a>
        <a routerLink="/deep-dives" routerLinkActive="active" class="nav-item">
          <i class="bi bi-diagram-2"></i>
          <span *ngIf="!collapsed">Deep dives</span>
        </a>
        <a routerLink="/backend-dev" routerLinkActive="active" class="nav-item">
          <i class="bi bi-server"></i>
          <span *ngIf="!collapsed">Backend Developer</span>
        </a>
        <a routerLink="/api-truth-source" routerLinkActive="active" class="nav-item">
          <i class="bi bi-braces-asterisk"></i>
          <span *ngIf="!collapsed">API truth source</span>
        </a>
        <a routerLink="/domains" routerLinkActive="active" class="nav-item">
          <i class="bi bi-grid"></i>
          <span *ngIf="!collapsed">Domains</span>
        </a>
        <a routerLink="/search" routerLinkActive="active" class="nav-item">
          <i class="bi bi-search"></i>
          <span *ngIf="!collapsed">Search</span>
        </a>
        <a routerLink="/how-to-doc" routerLinkActive="active" class="nav-item">
          <i class="bi bi-journal-code"></i>
          <span *ngIf="!collapsed">How to Doc?</span>
        </a>

      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0; top: 0;
      width: 260px;
      height: 100vh;
      background: #1a1f36;
      color: #fff;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      z-index: 100;
      overflow-y: auto;
    }
    .sidebar.collapsed { width: 64px; }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      font-weight: 700;
    }
    .logo i { font-size: 22px; color: #6c8cff; }
    .logo-text { display: flex; flex-direction: column; line-height: 1.2; }
    .logo-title { font-size: 16px; font-weight: 700; }
    .logo-sub { font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.5); }

    .btn-collapse {
      background: none;
      border: none;
      color: rgba(255,255,255,0.6);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .btn-collapse:hover { background: rgba(255,255,255,0.1); }

    .sidebar-nav {
      padding: 12px 8px;
      flex: 1;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
      margin-bottom: 2px;
    }
    .nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
    .nav-item.active { background: rgba(108,140,255,0.15); color: #6c8cff; font-weight: 500; }
    .nav-item i { font-size: 18px; min-width: 20px; text-align: center; }

    .collapsed .nav-item { justify-content: center; padding: 10px; }
    .collapsed .nav-item i { margin: 0; }

    .nav-divider {
      padding: 16px 14px 6px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1px;
      color: rgba(255,255,255,0.35);
      border-top: 1px solid rgba(255,255,255,0.06);
      margin-top: 8px;
    }

    @media (max-width: 768px) {
      .sidebar { display: none; }
    }
  `]
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  private contentService = inject(ContentService);
  domains: Domain[] = [];

  async ngOnInit() {
    this.domains = await this.contentService.getDomains();
  }
}
