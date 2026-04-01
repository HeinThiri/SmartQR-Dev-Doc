import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { FloatingToolbarComponent } from '../shared/floating-toolbar/floating-toolbar.component';
import { FloatingTocComponent } from '../shared/floating-toc/floating-toc.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, FloatingToolbarComponent, FloatingTocComponent],
  template: `
    <div class="app-layout" [class.sidebar-collapsed]="sidebarCollapsed">
      <app-sidebar [collapsed]="sidebarCollapsed" (toggleCollapse)="sidebarCollapsed = !sidebarCollapsed" />
      <div class="main-area">
        <app-topbar (toggleSidebar)="sidebarCollapsed = !sidebarCollapsed" />
        <main class="content-area">
          <router-outlet />
        </main>
      </div>
      <app-floating-toc />
      <app-floating-toolbar />
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
    }
    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      margin-left: 260px;
      transition: margin-left 0.3s ease;
    }
    .sidebar-collapsed .main-area {
      margin-left: 64px;
    }
    .content-area {
      flex: 1;
      padding: 24px 32px;
      background: #f5f7fa;
      overflow-y: auto;
    }
    @media (max-width: 768px) {
      .main-area { margin-left: 0; }
    }
  `]
})
export class LayoutComponent {
  sidebarCollapsed = false;
}
