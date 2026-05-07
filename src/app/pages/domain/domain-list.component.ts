import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { Domain } from '../../core/models/domain.model';

@Component({
  selector: 'app-domain-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="domain-list-page">
      <div class="page-header">
        <h1>All Domains</h1>
        <p>Browse Smart QR product areas (QR types, viewers, loyalty, shops, admin, auth) and common features.</p>
      </div>
      <div class="domain-grid">
        <a *ngFor="let domain of domains"
           [routerLink]="['/domains', domain.slug]"
           class="domain-card">
          <div class="domain-icon">
            <i class="bi" [ngClass]="domain.icon"></i>
          </div>
          <div class="domain-info">
            <h3>{{ domain.name }}</h3>
            <p>{{ domain.description }}</p>
          </div>
          <i class="bi bi-chevron-right card-arrow"></i>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .domain-list-page { max-width: 900px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #1a1f36; margin: 0 0 6px; }
    .page-header p { font-size: 14px; color: #888; margin: 0; }

    .domain-grid { display: flex; flex-direction: column; gap: 10px; }

    .domain-card {
      background: #fff;
      border-radius: 12px;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .domain-card:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }
    .domain-icon {
      width: 48px; height: 48px;
      background: rgba(108,140,255,0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .domain-icon i { font-size: 22px; color: #6c8cff; }
    .domain-info { flex: 1; }
    .domain-info h3 { font-size: 16px; font-weight: 600; margin: 0 0 4px; color: #1a1f36; }
    .domain-info p { font-size: 13px; color: #777; margin: 0; }
    .card-arrow { color: #ccc; font-size: 18px; }
  `]
})
export class DomainListComponent implements OnInit {
  private contentService = inject(ContentService);
  domains: Domain[] = [];

  async ngOnInit() {
    this.domains = await this.contentService.getDomains();
  }
}
