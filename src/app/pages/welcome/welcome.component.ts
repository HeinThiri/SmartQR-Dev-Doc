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

      <!-- ══════════════════════════════ HERO ══════════════════════════════ -->
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="hero-body">
          <div class="hero-badge">
            <i class="bi bi-qr-code-scan"></i> Smart QR DevDocs
          </div>
          <h1>Smart QR Developer Hub</h1>
          <p class="hero-subtitle">
            Comprehensive reference for <strong>Smart_QR_UI</strong> (Angular 19) and
            <strong>Smart_QR_API</strong> (ASP.NET Core 8) — QR wizards, viewer pages,
            loyalty programs, shops &amp; menu catalog, scan analytics, and admin tooling.
          </p>
          <div class="hero-tags">
            <span class="tag"><i class="bi bi-layers"></i> Angular 19</span>
            <span class="tag"><i class="bi bi-braces"></i> ASP.NET Core 8</span>
            <span class="tag"><i class="bi bi-database"></i> SQL Server</span>
            <span class="tag"><i class="bi bi-key"></i> JWT Auth</span>
            <span class="tag"><i class="bi bi-cloud-check"></i> Firebase</span>
            <span class="tag"><i class="bi bi-globe2"></i> 3-Language i18n</span>
          </div>
          <div class="hero-actions">
            <a routerLink="/getting-started" class="btn-primary">
              <i class="bi bi-rocket-takeoff"></i> Getting Started
            </a>
            <a routerLink="/architecture" class="btn-outline">
              <i class="bi bi-diagram-3"></i> Architecture
            </a>
            <a routerLink="/smart-qr-hub" class="btn-outline">
              <i class="bi bi-qr-code"></i> Smart QR Hub
            </a>
            <a routerLink="/api-truth-source" class="btn-outline">
              <i class="bi bi-code-slash"></i> API Reference
            </a>
            <a routerLink="/search" class="btn-outline">
              <i class="bi bi-search"></i> Search
            </a>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════ STATS STRIP ══════════════════════════ -->
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-num">{{ domains.length }}</span>
          <span class="stat-label">Documentation Domains</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-item">
          <span class="stat-num">3</span>
          <span class="stat-label">Core Layers (UI · API · DB)</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-item">
          <span class="stat-num">7+</span>
          <span class="stat-label">QR Viewer Types</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-item">
          <span class="stat-num">3</span>
          <span class="stat-label">Languages (EN · ZH · MY)</span>
        </div>
        <div class="stat-sep"></div>
        <div class="stat-item">
          <span class="stat-num">RBAC</span>
          <span class="stat-label">Role-Based Access Control</span>
        </div>
      </div>

      <!-- ══════════════════════════ QUICK LINKS ═══════════════════════════ -->
      <section class="section">
        <h2 class="section-title">Quick Navigation</h2>
        <div class="quick-grid">
          <a *ngFor="let link of quickLinks" [routerLink]="link.route" class="quick-card">
            <i class="bi" [ngClass]="link.icon"></i>
            <div>
              <div class="quick-label">{{ link.label }}</div>
              <div class="quick-desc">{{ link.desc }}</div>
            </div>
          </a>
        </div>
      </section>

      <!-- ══════════════════════════ ROLE PATHS ════════════════════════════ -->
      <section class="section">
        <h2 class="section-title">Start Here by Role</h2>
        <p class="section-lead">Choose your entry point based on where you work in the stack.</p>
        <div class="role-grid">
          <div *ngFor="let path of rolePaths" class="role-card">
            <div class="role-header">
              <div class="role-icon">
                <i class="bi" [ngClass]="path.icon"></i>
              </div>
              <div class="role-info">
                <h3>{{ path.role }}</h3>
                <p>{{ path.description }}</p>
              </div>
            </div>
            <ul class="role-links">
              <li *ngFor="let link of path.links">
                <a [routerLink]="link.route">
                  <i class="bi bi-arrow-right-short"></i>{{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════ DOMAINS ═══════════════════════════════ -->
      <section class="section">
        <h2 class="section-title">Documentation Domains</h2>
        <p class="section-lead">{{ domains.length }} domains — each with features, API notes, and Q&amp;A.</p>
        <div class="domain-grid">
          <a *ngFor="let domain of domains"
             [routerLink]="['/domains', domain.slug]"
             class="domain-card">
            <div class="domain-icon">
              <i class="bi" [ngClass]="domain.icon"></i>
            </div>
            <h3>{{ domain.name }}</h3>
            <p>{{ domain.description }}</p>
            <span class="card-link">Explore <i class="bi bi-arrow-right"></i></span>
          </a>
        </div>
      </section>

      <!-- ══════════════════════════ TECH STACK ════════════════════════════ -->
      <section class="section">
        <h2 class="section-title">Tech Stack</h2>
        <p class="section-lead">Libraries and services powering Smart QR end-to-end.</p>
        <div class="stack-list">
          <div *ngFor="let item of stackItems" class="stack-item">
            <i class="bi" [ngClass]="item.icon" [style.color]="item.color"></i>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════ QR VIEWER TYPES ═══════════════════════ -->
      <section class="section">
        <h2 class="section-title">QR Viewer Types</h2>
        <p class="section-lead">Each QR code renders a distinct viewer — scan to see the experience.</p>
        <div class="viewer-grid">
          <div *ngFor="let viewer of viewerTypes" class="viewer-chip">
            <i class="bi" [ngClass]="viewer.icon"></i>
            <span>{{ viewer.label }}</span>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    /* ─── Page wrapper ─── */
    .welcome-page { max-width: 1100px; margin: 0 auto; }

    /* ─── HERO ─── */
    .hero {
      background: linear-gradient(135deg, #1a1f36 0%, #2d3561 55%, #1e3a5f 100%);
      border-radius: 16px;
      padding: 52px 44px;
      color: #fff;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
    }
    .hero-glow {
      position: absolute;
      right: -80px; top: -80px;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(108,140,255,0.2) 0%, transparent 68%);
      border-radius: 50%;
      pointer-events: none;
    }
    .hero-body { position: relative; }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(108,140,255,0.18);
      border: 1px solid rgba(108,140,255,0.38);
      color: #a5b8ff;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 16px;
      letter-spacing: 0.3px;
    }
    .hero h1 {
      font-size: 32px;
      font-weight: 800;
      margin: 0 0 14px;
      line-height: 1.2;
      letter-spacing: -0.5px;
    }
    .hero-subtitle {
      font-size: 15px;
      color: rgba(255,255,255,0.72);
      margin: 0 0 20px;
      max-width: 700px;
      line-height: 1.65;
    }
    .hero-subtitle strong { color: rgba(255,255,255,0.93); font-weight: 700; }
    .hero-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 26px;
    }
    .tag {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.14);
      color: rgba(255,255,255,0.8);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .hero-actions { display: flex; gap: 10px; flex-wrap: wrap; }
    .btn-primary {
      padding: 10px 22px;
      background: #6c8cff;
      color: #fff;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      transition: background 0.2s, transform 0.15s;
    }
    .btn-primary:hover { background: #5a7af0; transform: translateY(-1px); color: #fff; }
    .btn-outline {
      padding: 10px 20px;
      border: 1px solid rgba(255,255,255,0.28);
      color: rgba(255,255,255,0.9);
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      transition: background 0.2s, transform 0.15s;
    }
    .btn-outline:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); color: #fff; }

    /* ─── STATS ROW ─── */
    .stats-row {
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 12px;
      padding: 14px 24px;
      margin-bottom: 32px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      flex-wrap: wrap;
      gap: 4px;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 6px 20px;
      flex: 1;
      min-width: 110px;
    }
    .stat-num {
      font-size: 22px;
      font-weight: 800;
      color: #1a1f36;
      line-height: 1;
    }
    .stat-label {
      font-size: 11px;
      color: #aaa;
      margin-top: 4px;
      text-align: center;
      font-weight: 500;
      white-space: nowrap;
    }
    .stat-sep {
      width: 1px;
      height: 30px;
      background: #eaecf0;
      flex-shrink: 0;
    }

    /* ─── SECTION SCAFFOLD ─── */
    .section { margin-bottom: 36px; }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #1a1f36;
      margin: 0 0 6px;
    }
    .section-lead {
      font-size: 13px;
      color: #999;
      margin: 0 0 16px;
    }

    /* ─── QUICK LINKS ─── */
    .quick-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }
    .quick-card {
      background: #fff;
      border-radius: 10px;
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #e8ebf5;
      transition: box-shadow 0.18s, transform 0.15s, border-color 0.18s;
    }
    .quick-card:hover {
      box-shadow: 0 6px 20px rgba(108,140,255,0.12);
      border-color: #b8c8ff;
      transform: translateY(-2px);
    }
    .quick-card > .bi {
      font-size: 22px;
      color: #6c8cff;
      flex-shrink: 0;
    }
    .quick-label {
      font-size: 14px;
      font-weight: 600;
      color: #1a1f36;
    }
    .quick-desc {
      font-size: 12px;
      color: #aaa;
      margin-top: 2px;
    }

    /* ─── ROLE CARDS ─── */
    .role-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
    .role-card {
      background: #fff;
      border-radius: 12px;
      padding: 22px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #e8ebf5;
    }
    .role-header {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 14px;
    }
    .role-icon {
      width: 44px; height: 44px;
      background: rgba(108,140,255,0.08);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .role-icon .bi { font-size: 20px; color: #6c8cff; }
    .role-info h3 {
      font-size: 14px;
      font-weight: 700;
      color: #1a1f36;
      margin: 0 0 4px;
    }
    .role-info p {
      font-size: 12px;
      color: #999;
      margin: 0;
      line-height: 1.55;
    }
    .role-links {
      list-style: none;
      margin: 0;
      padding: 12px 0 0;
      border-top: 1px solid #f0f2f7;
    }
    .role-links li { margin-bottom: 6px; }
    .role-links a {
      font-size: 13px;
      color: #4a6cf7;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-weight: 500;
      transition: color 0.15s;
    }
    .role-links a:hover { color: #2d4fce; text-decoration: underline; }
    .role-links .bi { font-size: 16px; }

    /* ─── DOMAIN CARDS ─── */
    .domain-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 14px;
    }
    .domain-card {
      background: #fff;
      border-radius: 12px;
      padding: 22px;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid #e8ebf5;
      transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
      display: flex;
      flex-direction: column;
    }
    .domain-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(108,140,255,0.14);
      border-color: #c0d0ff;
    }
    .domain-icon {
      width: 42px; height: 42px;
      background: rgba(108,140,255,0.08);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
    }
    .domain-icon .bi { font-size: 20px; color: #6c8cff; }
    .domain-card h3 {
      font-size: 14px;
      font-weight: 700;
      margin: 0 0 6px;
      color: #1a1f36;
    }
    .domain-card p {
      font-size: 12px;
      color: #999;
      margin: 0 0 14px;
      flex: 1;
      line-height: 1.55;
    }
    .card-link {
      font-size: 13px;
      color: #6c8cff;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    /* ─── TECH STACK ─── */
    .stack-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .stack-item {
      background: #fff;
      border: 1px solid #e8ebf5;
      border-radius: 8px;
      padding: 8px 16px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .stack-item .bi { font-size: 16px; }

    /* ─── VIEWER TYPES ─── */
    .viewer-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .viewer-chip {
      background: #fff;
      border: 1px solid #e8ebf5;
      border-radius: 20px;
      padding: 7px 16px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #1a1f36;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .viewer-chip .bi { font-size: 15px; color: #6c8cff; }

    /* ─── RESPONSIVE ─── */
    @media (max-width: 768px) {
      .hero { padding: 32px 22px; }
      .hero h1 { font-size: 24px; }
      .stats-row { padding: 14px 16px; }
      .stat-sep { display: none; }
      .stat-item { min-width: 90px; padding: 6px 12px; }
    }
  `]
})
export class WelcomeComponent implements OnInit {
  private contentService = inject(ContentService);
  domains: Domain[] = [];

  quickLinks = [
    { icon: 'bi-rocket-takeoff',  label: 'Getting Started',  route: '/getting-started',  desc: 'Local setup, env config, and first run'             },
    { icon: 'bi-diagram-3',       label: 'Architecture',      route: '/architecture',      desc: 'System diagram, layers, and tech overview'          },
    { icon: 'bi-qr-code',         label: 'Smart QR Hub',      route: '/smart-qr-hub',      desc: 'Full platform feature map at a glance'              },
    { icon: 'bi-code-slash',      label: 'API Reference',     route: '/api-truth-source',  desc: 'All REST endpoints in one searchable place'         },
    { icon: 'bi-puzzle',          label: 'Common Features',   route: '/common-features',   desc: 'Shared UI components and cross-cutting patterns'    },
    { icon: 'bi-search',          label: 'Search Docs',       route: '/search',            desc: 'Full-text search across features, APIs, and Q&A'   },
  ];

  rolePaths = [
    {
      icon: 'bi-window-fullscreen',
      role: 'Frontend Developer',
      description: 'Build Smart_QR_UI (Angular 19) — QR wizards, viewer pages, loyalty flows, and product UI modules.',
      links: [
        { label: 'Frontend Developer Guide',        route: '/frontend-dev'               },
        { label: 'Overview & Folder Layout',        route: '/domains/smart-qr-overview'  },
        { label: 'QR Types & Step Wizards',         route: '/domains/smart-qr-types'     },
        { label: 'Viewers (Menu, Gallery, Event…)', route: '/domains/smart-qr-viewers'   },
        { label: 'Loyalty Module',                  route: '/domains/smart-qr-loyalty'   },
        { label: 'Shops & Menu Catalog',            route: '/domains/smart-qr-shops'     },
      ]
    },
    {
      icon: 'bi-server',
      role: 'Backend Developer',
      description: 'Work on Smart_QR_API (ASP.NET Core 8) — REST endpoints, JWT auth, EF Core models, Hangfire jobs.',
      links: [
        { label: 'Auth & Token Flow',     route: '/domains/smart-qr-auth'            },
        { label: 'API Truth Source',      route: '/api-truth-source'                 },
        { label: 'Admin & Roles',         route: '/domains/smart-qr-admin'           },
        { label: 'Approval Workflow',     route: '/common-features/approval-workflow' },
      ]
    },
    {
      icon: 'bi-gear-wide',
      role: 'DevOps / DBA',
      description: 'Deployment, environment config, DB migrations, email setup, and system administration.',
      links: [
        { label: 'Getting Started',    route: '/getting-started'          },
        { label: 'System Architecture', route: '/architecture'            },
        { label: 'Admin Module Docs',  route: '/domains/smart-qr-admin'  },
        { label: 'Email Notification', route: '/common-features/email-notification' },
      ]
    },
  ];

  stackItems = [
    { icon: 'bi-layers',           label: 'Angular 19',          color: '#dd0031' },
    { icon: 'bi-braces-asterisk',  label: 'ASP.NET Core 8',      color: '#512bd4' },
    { icon: 'bi-database',         label: 'SQL Server / EF Core', color: '#cc2927' },
    { icon: 'bi-key',              label: 'JWT Bearer Auth',      color: '#f59e0b' },
    { icon: 'bi-cloud-check',      label: 'Firebase',             color: '#f5820d' },
    { icon: 'bi-clock-history',    label: 'Hangfire',             color: '#20b2aa' },
    { icon: 'bi-globe2',           label: 'ngx-translate (i18n)', color: '#22c55e' },
    { icon: 'bi-qr-code',          label: 'QR Code Styling',      color: '#6c8cff' },
    { icon: 'bi-file-earmark-pdf', label: 'DinkToPdf',            color: '#e03e3e' },
    { icon: 'bi-bar-chart-line',   label: 'DevExpress Reports',   color: '#ff6900' },
  ];

  viewerTypes = [
    { icon: 'bi-menu-button-wide', label: 'Menu'       },
    { icon: 'bi-globe',            label: 'Website'    },
    { icon: 'bi-images',           label: 'Gallery'    },
    { icon: 'bi-calendar-event',   label: 'Event'      },
    { icon: 'bi-award',            label: 'Loyalty'    },
    { icon: 'bi-file-text',        label: 'Content'    },
    { icon: 'bi-chat-left-text',   label: 'Feedback'   },
    { icon: 'bi-person-badge',     label: 'vCard'      },
  ];

  async ngOnInit() {
    this.domains = await this.contentService.getDomains();
  }
}
