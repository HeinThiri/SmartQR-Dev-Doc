import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { Domain } from '../../core/models/domain.model';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="welcome-page">
      <section class="hero">
        <div class="hero-content">
          <h1>Smart QR Developer Documentation</h1>
          <p>
            Docs for <code>Smart_QR_UI</code> and this portal: runbooks, architecture, domain guides (<code>assets/content</code>), and search.
          </p>
          <div class="hero-actions">
            <a routerLink="/getting-started" class="btn-primary">
              <i class="bi bi-rocket-takeoff"></i> Getting Started
            </a>
            <a routerLink="/architecture" class="btn-outline">
              <i class="bi bi-diagram-3"></i> Architecture
            </a>
            <a routerLink="/smart-qr-hub" class="btn-outline">
              <i class="bi bi-qr-code"></i> Smart QR hub
            </a>
            <a routerLink="/domains" class="btn-outline">
              <i class="bi bi-grid"></i> Domains
            </a>
            <a routerLink="/search" class="btn-outline">
              <i class="bi bi-search"></i> Search
            </a>
          </div>
        </div>
      </section>

      <section class="domains-section">
        <h2>Domains</h2>
        <p class="domains-lead">{{ domains.length }} topics — features, API notes, and Q&amp;A.</p>
        <div class="domain-grid">
          <a *ngFor="let domain of domains"
             [routerLink]="['/domains', domain.slug]"
             class="domain-card">
            <div class="domain-icon">
              <i class="bi" [ngClass]="domain.icon"></i>
            </div>
            <h3>{{ domain.name }}</h3>
            <p>{{ domain.description }}</p>
            <span class="card-link">Open <i class="bi bi-arrow-right"></i></span>
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .welcome-page { max-width: 1100px; margin: 0 auto; }

    .hero {
      background: linear-gradient(135deg, #1a1f36, #2d3561);
      border-radius: 16px;
      padding: 48px 40px;
      color: #fff;
      margin-bottom: 24px;
    }
    .hero h1 { font-size: 28px; font-weight: 700; margin: 0 0 12px; }
    .hero p { font-size: 16px; color: rgba(255,255,255,0.75); margin: 0 0 24px; max-width: 720px; line-height: 1.55; }
    .hero code {
      background: rgba(255,255,255,0.12);
      color: #e8ecff;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 13px;
    }
    .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .btn-primary {
      padding: 10px 24px;
      background: #6c8cff;
      color: #fff;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s;
    }
    .btn-primary:hover { background: #5a7af0; }
    .btn-outline {
      padding: 10px 24px;
      border: 1px solid rgba(255,255,255,0.3);
      color: #fff;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-outline:hover { background: rgba(255,255,255,0.1); }

    .domains-section h2 {
      font-size: 20px; font-weight: 700; color: #1a1f36; margin: 0 0 6px;
    }
    .domains-lead {
      font-size: 14px; color: #888; margin: 0 0 16px;
    }
    .domain-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .domain-card {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
    }
    .domain-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }
    .domain-icon {
      width: 44px; height: 44px;
      background: rgba(108,140,255,0.1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
    }
    .domain-icon i { font-size: 20px; color: #6c8cff; }
    .domain-card h3 { font-size: 16px; font-weight: 600; margin: 0 0 6px; color: #1a1f36; }
    .domain-card p { font-size: 13px; color: #777; margin: 0 0 14px; flex: 1; }
    .card-link {
      font-size: 13px;
      color: #6c8cff;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    @media (max-width: 768px) {
      .hero { padding: 32px 24px; }
    }
  `]
})
export class WelcomeComponent implements OnInit {
  private contentService = inject(ContentService);
  domains: Domain[] = [];

  async ngOnInit() {
    this.domains = await this.contentService.getDomains();
  }
}
