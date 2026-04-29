import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { marked } from 'marked';

@Component({
  selector: 'app-common-features',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page">
      <h1>Common Features <span class="count-badge">{{ docGuides.length }}</span></h1>
      <p class="subtitle">Smart QR project documentation guides (markdown) rendered inside the portal.</p>

      <section class="card">
        <h2 class="section-title">Smart QR Project Guides</h2>
        <p class="section-subtitle">Markdown-based guides from <code>documentation/</code> rendered inside the portal.</p>
        <div class="doc-layout">
          <div class="doc-list">
            <div class="doc-controls">
              <div class="search-wrap">
                <i class="bi bi-search"></i>
                <input
                  class="search-input"
                  type="text"
                  placeholder="Search guides…"
                  [(ngModel)]="query"
                  (input)="applyFilter()" />
              </div>
            </div>

            <div class="doc-grid">
              <button
                type="button"
                class="doc-card"
                *ngFor="let d of filteredDocGuides"
                (click)="openDoc(d)"
                [class.active]="activeDoc?.id === d.id">
                <div class="doc-icon"><i class="bi" [ngClass]="d.icon"></i></div>
                <div class="doc-info">
                  <div class="doc-title">{{ d.title }}</div>
                  <div class="doc-desc">{{ d.desc }}</div>
                </div>
                <i *ngIf="loadingDocId === d.id" class="bi bi-arrow-repeat doc-arrow spin"></i>
                <i *ngIf="loadingDocId !== d.id" class="bi bi-chevron-right doc-arrow"></i>
              </button>
            </div>
          </div>

          <div class="doc-viewer" *ngIf="activeDoc">
            <div class="doc-viewer-header">
              <div>
                <div class="doc-viewer-title">{{ activeDoc.title }}</div>
                <div class="doc-viewer-meta">Source: <code>documentation/{{ activeDoc.file }}</code></div>
              </div>
              <button type="button" class="btn-close" (click)="closeDoc()">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
            <div class="doc-loading" *ngIf="loading"><i class="bi bi-arrow-repeat spin"></i></div>
            <div class="doc-error" *ngIf="!loading && loadError">
              {{ loadError }}
            </div>
            <div *ngIf="!loading && !loadError" class="markdown-body" [innerHTML]="markdownHtml"></div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page { max-width: 900px; margin: 0 auto; }
    h1 { font-size: 26px; font-weight: 700; color: #1a1f36; margin: 0 0 6px; display: flex; align-items: center; gap: 10px; }
    .count-badge {
      background: #6c8cff; color: #fff; font-size: 13px; font-weight: 600;
      padding: 2px 10px; border-radius: 20px;
    }
    .subtitle { font-size: 14px; color: #888; margin: 0 0 28px; }

    .card {
      background: #fff; border-radius: 12px; padding: 22px 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      margin-bottom: 16px;
    }
    .section-title { margin: 0 0 6px; font-size: 16px; font-weight: 700; color: #1a1f36; }
    .section-subtitle { margin: 0 0 14px; font-size: 13px; color: #777; line-height: 1.6; }
    .section-subtitle code {
      background: #f0f3ff; color: #4a6cf7; padding: 2px 7px;
      border-radius: 4px; font-size: 12px;
    }

    .doc-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
    }
    .doc-controls { margin-bottom: 10px; }
    .search-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border: 1px solid #e8ecf4;
      border-radius: 12px;
      background: #fff;
    }
    .search-wrap i { color: #98a2b3; font-size: 14px; }
    .search-input {
      border: none;
      outline: none;
      width: 100%;
      font-size: 13px;
      color: #1a1f36;
    }
    .search-input::placeholder { color: #98a2b3; }

    .doc-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
    .doc-card {
      display: flex; align-items: center; gap: 14px;
      background: #f8f9ff;
      border: 1px solid #e8ecf4;
      border-radius: 12px;
      padding: 14px 16px;
      cursor: pointer;
      text-align: left;
      transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
    }
    .doc-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(0,0,0,0.06);
      border-color: #d8def0;
    }
    .doc-card.active {
      background: rgba(108,140,255,0.08);
      border-color: rgba(108,140,255,0.35);
    }
    .doc-icon {
      width: 44px; height: 44px; flex-shrink: 0;
      background: rgba(108,140,255,0.14);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .doc-icon i { font-size: 20px; color: #6c8cff; }
    .doc-info { flex: 1; min-width: 0; }
    .doc-title { font-size: 14px; font-weight: 700; color: #1a1f36; margin-bottom: 2px; }
    .doc-desc { font-size: 12px; color: #777; line-height: 1.45; }
    .doc-arrow { color: #c9cfdd; font-size: 18px; }

    .doc-viewer {
      border: 1px solid #e8ecf4;
      border-radius: 14px;
      background: #fff;
      padding: 16px 18px;
    }
    .doc-viewer-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eef0f6;
      margin-bottom: 12px;
    }
    .doc-viewer-title { font-size: 16px; font-weight: 800; color: #1a1f36; margin-bottom: 4px; }
    .doc-viewer-meta { font-size: 12px; color: #888; }
    .doc-viewer-meta code {
      background: #f0f3ff; color: #4a6cf7; padding: 2px 7px;
      border-radius: 4px; font-size: 12px;
    }
    .btn-close {
      border: 1px solid #e8ecf4;
      background: #fff;
      border-radius: 10px;
      padding: 8px 10px;
      cursor: pointer;
      color: #667085;
      line-height: 1;
    }
    .btn-close:hover { background: #f8f9ff; }
    .btn-close i { font-size: 14px; }
    .doc-loading { font-size: 13px; color: #666; padding: 10px 0; }
    .doc-error {
      font-size: 13px; color: #b42318;
      background: #fffbfa;
      border: 1px solid #fee4e2;
      padding: 10px 12px;
      border-radius: 10px;
    }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .markdown-body { font-size: 14px; line-height: 1.7; color: #444; }
    .markdown-body :first-child { margin-top: 0; }
    .markdown-body h1 { font-size: 22px; margin: 18px 0 10px; color: #1a1f36; }
    .markdown-body h2 { font-size: 18px; margin: 18px 0 10px; color: #1a1f36; }
    .markdown-body h3 { font-size: 16px; margin: 16px 0 8px; color: #1a1f36; }
    .markdown-body p { margin: 0 0 10px; }
    .markdown-body ul, .markdown-body ol { padding-left: 20px; margin: 0 0 12px; }
    .markdown-body li { margin-bottom: 4px; }
    .markdown-body code {
      background: #f0f3ff; color: #4a6cf7; padding: 2px 6px; border-radius: 4px; font-size: 13px;
    }
    .markdown-body pre {
      background: #1a1f36; border-radius: 10px; padding: 14px 16px;
      overflow-x: auto; margin: 0 0 12px;
    }
    .markdown-body pre code { background: none; color: #e0e6ff; padding: 0; }
    .markdown-body table { width: 100%; border-collapse: collapse; margin: 0 0 12px; font-size: 13px; }
    .markdown-body th {
      text-align: left; padding: 10px 12px; background: #f5f7fa;
      border-bottom: 2px solid #e0e4ec; font-weight: 600; color: #444;
    }
    .markdown-body td { padding: 9px 12px; border-bottom: 1px solid #f0f0f0; color: #444; vertical-align: top; }
    .markdown-body tbody tr:hover td { background: #fafbfd; }
    .markdown-body a { color: #4a6cf7; text-decoration: none; }
    .markdown-body a:hover { text-decoration: underline; }

    @media (max-width: 720px) {
      .doc-grid { grid-template-columns: 1fr; }
    }
    @media (min-width: 980px) {
      .page { max-width: 1100px; }
      .doc-layout { grid-template-columns: 460px 1fr; align-items: start; }
      .doc-viewer { position: sticky; top: 16px; max-height: calc(100vh - 140px); overflow: auto; }
    }
  `]
})
export class CommonFeaturesComponent {
  private http = inject(HttpClient);
  private loadSeq = 0;
  private markdownCache = new Map<string, string>();

  docGuides = [
    {
      id: 'quick-start',
      title: 'Quick Start Guide',
      file: 'Quick_Start_Guide.md',
      icon: 'bi-rocket-takeoff',
      desc: 'Prerequisites, 5-minute setup, first steps, and common tasks.'
    },
    {
      id: 'common-features',
      title: 'Common Features Guide',
      file: 'Common_Features_Guide.md',
      icon: 'bi-puzzle',
      desc: 'Complete guide to shared features used across Smart QR.'
    },
    {
      id: 'api',
      title: 'API Documentation',
      file: 'API_Documentation.md',
      icon: 'bi-braces-asterisk',
      desc: 'REST endpoints, auth rules, examples, and response schemas.'
    },
    {
      id: 'db',
      title: 'Database Schema',
      file: 'Database_Schema.md',
      icon: 'bi-database',
      desc: 'Core tables, relationships, and key domain entities.'
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting FAQ',
      file: 'Troubleshooting_FAQ.md',
      icon: 'bi-life-preserver',
      desc: 'Common issues and fixes (DB, CORS, JWT, email, npm).'
    },
  ];

  query = '';
  filteredDocGuides = [...this.docGuides];
  activeDoc: { id: string; title: string; file: string; icon: string; desc: string } | null = null;
  markdownHtml = '';
  loading = false;
  loadingDocId: string | null = null;
  loadError = '';

  applyFilter(): void {
    const q = this.query.trim().toLowerCase();
    if (!q) {
      this.filteredDocGuides = [...this.docGuides];
      return;
    }
    this.filteredDocGuides = this.docGuides.filter(d =>
      `${d.title} ${d.desc}`.toLowerCase().includes(q)
    );
  }

  closeDoc(): void {
    this.activeDoc = null;
    this.loading = false;
    this.loadingDocId = null;
    this.loadError = '';
    this.markdownHtml = '';
  }

  async openDoc(doc: { id: string; title: string; file: string; icon: string; desc: string }): Promise<void> {
    const requestId = ++this.loadSeq;
    this.activeDoc = doc;
    this.loading = true;
    this.loadingDocId = doc.id;
    this.loadError = '';
    this.markdownHtml = '';

    try {
      const cached = this.markdownCache.get(doc.file);
      if (cached) {
        this.markdownHtml = cached;
        return;
      }
      const md = await firstValueFrom(
        this.http.get(`assets/documentation/${doc.file}`, { responseType: 'text' })
      );
      const html = marked.parse(md, { async: false }) as string;
      if (requestId !== this.loadSeq) return;
      this.markdownHtml = html;
      this.markdownCache.set(doc.file, html);
    } catch {
      if (requestId !== this.loadSeq) return;
      this.loadError = `Cannot load documentation/${doc.file}. Ensure the file exists and is included in build assets.`;
    } finally {
      if (requestId !== this.loadSeq) return;
      this.loading = false;
      this.loadingDocId = null;
    }
  }
}
