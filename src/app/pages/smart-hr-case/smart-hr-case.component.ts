import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-smart-hr-case',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <h1><i class="bi bi-bug"></i> Smart HR Case <span class="count-badge">{{ features.length }}</span></h1>
      <p class="subtitle">Bug fixes, troubleshooting cases, and solution documentation for Smart HR product issues.</p>

      <div class="feature-list">
        @for (feature of features; track feature.route) {
          <a [routerLink]="feature.route" class="feature-card">
            <div class="feature-icon"><i class="bi" [ngClass]="feature.icon"></i></div>
            <div class="feature-info">
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
              <span class="module-badge">{{ feature.module }}</span>
            </div>
            <i class="bi bi-chevron-right arrow"></i>
          </a>
        }
      </div>

      <div class="empty-state" *ngIf="features.length === 0">
        <i class="bi bi-inbox"></i>
        <p>No cases documented yet. Use Claude in VS Code to add your first case.</p>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 900px; margin: 0 auto; }
    h1 {
      font-size: 26px; font-weight: 700; color: #1a1f36; margin: 0 0 6px;
      display: flex; align-items: center; gap: 10px;
    }
    h1 i { color: #6c8cff; }
    .count-badge {
      background: #6c8cff; color: #fff; font-size: 13px; font-weight: 600;
      padding: 2px 10px; border-radius: 20px;
    }
    .subtitle { font-size: 14px; color: #888; margin: 0 0 28px; }

    .feature-list { display: flex; flex-direction: column; gap: 10px; }

    .feature-card {
      display: flex; align-items: center; gap: 16px;
      background: #fff; border-radius: 12px; padding: 22px 24px;
      text-decoration: none; color: inherit;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .feature-card:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }
    .feature-icon {
      width: 48px; height: 48px; flex-shrink: 0;
      background: rgba(108,140,255,0.1); border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .feature-icon i { font-size: 22px; color: #6c8cff; }
    .feature-info { flex: 1; }
    .feature-info h3 { font-size: 16px; font-weight: 600; color: #1a1f36; margin: 0 0 4px; }
    .feature-info p { font-size: 13px; color: #777; margin: 0 0 6px; }
    .module-badge {
      display: inline-block; font-size: 11px; font-weight: 600;
      padding: 2px 8px; border-radius: 4px;
      background: #f0f3ff; color: #6c8cff;
    }
    .arrow { color: #ccc; font-size: 18px; }

    .empty-state {
      text-align: center; padding: 60px 20px; color: #bbb;
    }
    .empty-state i { font-size: 48px; margin-bottom: 12px; display: block; }
    .empty-state p { font-size: 14px; }
  `]
})
export class SmartHrCaseComponent {
  features: any[] = [].sort((a: any, b: any) => a.title.localeCompare(b.title));
}
