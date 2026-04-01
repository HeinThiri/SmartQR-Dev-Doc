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
      <!-- Hero -->
      <section class="hero">
        <div class="hero-content">
          <h1>Smart HR Developer Documentation</h1>
          <p>Explore feature guides, API references, and Q&A for every module in Smart HR Pro.</p>
          <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>
          <div class="hero-actions">
            <a routerLink="/domains" class="btn-primary">
              <i class="bi bi-grid"></i> Browse All Domains
            </a>
            <a routerLink="/search" class="btn-outline">
              <i class="bi bi-search"></i> Search Docs
            </a>
          </div>
        </div>
      </section>

      <!-- Quick Stats -->
      <section class="stats-row">
        <div class="stat-card">
          <i class="bi bi-layers"></i>
          <div>
            <strong>{{ domains.length }}</strong>
            <span>Modules</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="bi bi-book"></i>
          <div>
            <strong>Features</strong>
            <span>& Guides</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="bi bi-braces"></i>
          <div>
            <strong>API</strong>
            <span>Reference</span>
          </div>
        </div>
        <div class="stat-card">
          <i class="bi bi-chat-dots"></i>
          <div>
            <strong>Q&A</strong>
            <span>Per Domain</span>
          </div>
        </div>
      </section>

      <!-- Domain Cards -->
      <section class="domains-section">
        <h2>Explore by Module</h2>
        <div class="domain-grid">
          <a *ngFor="let domain of domains"
             [routerLink]="['/domains', domain.slug]"
             class="domain-card">
            <div class="domain-icon">
              <i class="bi" [ngClass]="domain.icon"></i>
            </div>
            <h3>{{ domain.name }}</h3>
            <p>{{ domain.description }}</p>
            <span class="card-link">View Docs <i class="bi bi-arrow-right"></i></span>
          </a>
        </div>
      </section>

      <!-- Getting Started -->
      <section class="getting-started">
        <h2>Getting Started</h2>
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <h4>Choose a Module</h4>
            <p>Select the module you're working with from the sidebar or domain grid above.</p>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <h4>Read Feature Guides</h4>
            <p>Understand what each feature does, how it works, and configuration options.</p>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <h4>Check API Reference</h4>
            <p>Find endpoint details, parameters, request/response examples for integration.</p>
          </div>
          <div class="step">
            <div class="step-num">4</div>
            <h4>Browse Q&A</h4>
            <p>Find answers to common questions and troubleshooting tips for each domain.</p>
          </div>
        </div>
      </section>

      <!-- Doc Log -->
      <section class="card">
        <h2>Doc Log</h2>
        <table>
          <thead><tr><th>Date</th><th>Author</th><th>Change</th></tr></thead>
          <tbody>
            <tr><td>2026-03-27</td><td>Hein Htet Zaw</td><td>Initial documentation</td></tr>
          </tbody>
        </table>
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
    .hero p { font-size: 16px; color: rgba(255,255,255,0.75); margin: 0 0 24px; max-width: 600px; }
    .doc-status {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 600; padding: 4px 14px;
      border-radius: 20px; margin-bottom: 24px;
      background: #e8f5e9; color: #43a047;
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

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .stat-card {
      background: #fff;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .stat-card > i { font-size: 28px; color: #6c8cff; }
    .stat-card strong { display: block; font-size: 18px; color: #1a1f36; }
    .stat-card span { font-size: 13px; color: #888; }

    .domains-section h2, .getting-started h2 {
      font-size: 20px; font-weight: 700; color: #1a1f36; margin: 0 0 16px;
    }
    .domain-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 40px;
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

    .steps {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .step {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .step-num {
      width: 32px; height: 32px;
      background: #6c8cff;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      margin-bottom: 12px;
    }
    .step h4 { font-size: 15px; font-weight: 600; color: #1a1f36; margin: 0 0 6px; }
    .step p { font-size: 13px; color: #777; margin: 0; }

    @media (max-width: 768px) {
      .stats-row { grid-template-columns: repeat(2, 1fr); }
      .steps { grid-template-columns: repeat(2, 1fr); }
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
