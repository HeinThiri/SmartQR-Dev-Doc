import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-smart-hr',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <h1><i class="bi bi-briefcase"></i> Smart HR Design <span class="count-badge">{{ features.length }}</span></h1>
      <p class="subtitle">Feature documentation for Smart HR product modules — Payroll, HR, Attendance, and more.</p>

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
  `]
})
export class SmartHrComponent {
  features = [
    {
      title: 'Attendance Calendar',
      description: 'Monthly attendance grid with status display, day-off detection, half-day leave, and Excel export for each employee.',
      icon: 'bi-calendar-check',
      module: 'Attendance',
      route: '/smart-hr/attendance-calendar'
    },
    {
      title: 'Duty Roster',
      description: 'Shift assignment grid across 31-day period — single cell override, bulk switch, bulk change, and audit logging.',
      icon: 'bi-calendar3-range',
      module: 'Attendance',
      route: '/smart-hr/duty-roster'
    },
    {
      title: 'Child Data Log',
      description: 'Audit trail for child entity changes — save and delete operations with before/after field-level tracking.',
      icon: 'bi-journal-text',
      module: 'HR',
      route: '/smart-hr/child-data-log'
    },
    {
      title: 'License Validation',
      description: 'Client-side license validation with localStorage caching, navigation guard, and credit balance modal.',
      icon: 'bi-key',
      module: 'System',
      route: '/smart-hr/license-validation'
    },
    {
      title: 'DevExpress Report Viewer',
      description: 'Report viewer integration with backend controllers, authentication, report parameters, and adding new reports.',
      icon: 'bi-file-bar-graph',
      module: 'Reporting',
      route: '/smart-hr/report-viewer'
    },
    {
      title: 'Group Data Access',
      description: 'Organization group-based data access control — restrict user visibility by org group across all modules.',
      icon: 'bi-shield-lock',
      module: 'Security',
      route: '/smart-hr/group-data-access'
    },
    {
      title: 'Organization Structure',
      description: 'Interactive, zoomable org chart — Group, Division, Department, Section, Staff hierarchy with search, pan/zoom, and print.',
      icon: 'bi-diagram-3',
      module: 'Employee',
      route: '/smart-hr/org-structure'
    },
    {
      title: 'Salary Book',
      description: 'Complete Salary Book Management — module design, database schema, policy-based organization, API integration, and implementation guide.',
      icon: 'bi-book',
      module: 'Payroll',
      route: '/smart-hr/salary-book'
    },
    {
      title: 'Learning Module - Course Management',
      description: 'Course management with chapters and lessons — backend architecture, API endpoints, frontend components, and nested CRUD operations.',
      icon: 'bi-mortarboard',
      module: 'Learning',
      route: '/smart-hr/learning-module'
    },
    {
      title: 'My Workspace - My Profile',
      description: 'Employee dashboard with profile info, approval requests, leave balances, monthly overview, and quick action shortcuts.',
      icon: 'bi-person-workspace',
      module: 'Workspace',
      route: '/smart-hr/my-workspace'
    },
    {
      title: 'Asset & Resource Management',
      description: 'Complete asset lifecycle — request, approval, allocation, tracking, return, maintenance, inventory, and procurement with 14 database tables.',
      icon: 'bi-box-seam',
      module: 'Asset',
      route: '/smart-hr/asset-management'
    },
    {
      title: 'Myanmar Income Tax System',
      description: 'Configuration-driven income tax calculation — progressive tax brackets, dynamic relief items, multi-company support, and Excel reporting.',
      icon: 'bi-calculator',
      module: 'Payroll',
      route: '/smart-hr/tax-design'
    },
    {
      title: 'Coupon & Credit System',
      description: 'Credit-based licensing with coupon generation, distribution, redemption, and balance tracking across platform control and subscription pages.',
      icon: 'bi-ticket-perforated',
      module: 'System',
      route: '/smart-hr/coupon-credit'
    },
    {
      title: 'Smart Pay Integration',
      description: 'Payment gateway integration design — online credit purchase via KBZ Pay, Wave Money with SmartPay SPGA.',
      icon: 'bi-credit-card',
      module: 'Payment',
      route: '/smart-hr/smart-pay-integration'
    }
  ].sort((a, b) => a.title.localeCompare(b.title));
}
