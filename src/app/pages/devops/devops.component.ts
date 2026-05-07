import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { marked } from 'marked';

@Component({
  selector: 'app-devops',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <a routerLink="/welcome" class="back-link">
        <i class="bi bi-arrow-left"></i> Home
      </a>

      <div class="header">
        <div>
          <h1>DevOps / DBA</h1>
          <p class="subtitle">Operations-focused guides for Smart QR: database, troubleshooting, and deployment notes.</p>
        </div>
        <div class="badge"><i class="bi bi-file-earmark-text"></i> Markdown</div>
      </div>

      <div class="layout">
        <div class="list-card">
          <div class="list-title">Guides</div>
          <button
            type="button"
            class="doc-item"
            *ngFor="let d of docs"
            (click)="open(d)"
            [class.active]="active.id === d.id">
            <i class="bi" [ngClass]="d.icon"></i>
            <div class="doc-text">
              <div class="doc-name">{{ d.title }}</div>
              <div class="doc-desc">{{ d.desc }}</div>
            </div>
            <i *ngIf="loadingId === d.id" class="bi bi-arrow-repeat spin end-icon"></i>
            <i *ngIf="loadingId !== d.id" class="bi bi-chevron-right end-icon"></i>
          </button>
        </div>

        <div class="viewer-card">
          <div class="viewer-header" *ngIf="active">
            <div>
              <div class="viewer-title">{{ active.title }}</div>
              <div class="viewer-meta">Source: <code>documentation/{{ active.file }}</code></div>
            </div>
          </div>

          <div class="loading" *ngIf="loading">
            <i class="bi bi-arrow-repeat spin"></i>
          </div>
          <div class="error" *ngIf="!loading && error">
            {{ error }}
          </div>
          <div *ngIf="!loading && !error && html" class="markdown-body" [innerHTML]="html"></div>
          <pre *ngIf="!loading && !error && !html && markdownText" class="raw-md">{{ markdownText }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 1100px; margin: 0 auto; }
    .back-link {
      font-size: 13px; color: #6c8cff; text-decoration: none;
      display: inline-flex; align-items: center; gap: 4px; margin-bottom: 10px;
    }
    .back-link:hover { text-decoration: underline; }
    .header {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 14px; margin-bottom: 16px;
    }
    h1 { font-size: 26px; font-weight: 800; color: #1a1f36; margin: 0 0 6px; }
    .subtitle { font-size: 14px; color: #777; margin: 0; line-height: 1.6; max-width: 760px; }
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 700; color: #4a6cf7;
      background: #f0f3ff; border: 1px solid #d9e0ff;
      padding: 6px 10px; border-radius: 999px; flex-shrink: 0;
    }

    .layout { display: grid; grid-template-columns: 360px 1fr; gap: 14px; }
    .list-card, .viewer-card {
      background: #fff; border-radius: 14px; padding: 16px 18px;
      border: 1px solid #e8ecf4; box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .list-title { font-size: 13px; font-weight: 800; color: #1a1f36; margin-bottom: 10px; }
    .doc-item {
      width: 100%;
      display: flex; align-items: flex-start; gap: 10px;
      background: #f8f9ff;
      border: 1px solid #e8ecf4;
      border-radius: 12px;
      padding: 12px 12px;
      cursor: pointer;
      text-align: left;
      transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
      margin-bottom: 10px;
    }
    .doc-item:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 22px rgba(0,0,0,0.06);
      border-color: #d8def0;
    }
    .doc-item.active {
      background: rgba(108,140,255,0.08);
      border-color: rgba(108,140,255,0.35);
    }
    .doc-item .bi { font-size: 16px; color: #6c8cff; margin-top: 1px; }
    .doc-text { flex: 1; min-width: 0; }
    .doc-name { font-size: 13px; font-weight: 800; color: #1a1f36; margin-bottom: 2px; }
    .doc-desc { font-size: 12px; color: #777; line-height: 1.45; }
    .end-icon { color: #c9cfdd; font-size: 18px; margin-top: 1px; }

    .viewer-header {
      display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;
      padding-bottom: 10px; margin-bottom: 12px;
      border-bottom: 1px solid #eef0f6;
    }
    .viewer-title { font-size: 16px; font-weight: 900; color: #1a1f36; margin-bottom: 4px; }
    .viewer-meta { font-size: 12px; color: #888; }
    .viewer-meta code {
      background: #f0f3ff; color: #4a6cf7; padding: 2px 7px;
      border-radius: 4px; font-size: 12px;
    }

    .loading { padding: 12px 0; color: #667085; }
    .error {
      font-size: 13px; color: #b42318;
      background: #fffbfa; border: 1px solid #fee4e2;
      padding: 10px 12px; border-radius: 10px;
    }
    .raw-md {
      font-size: 13px;
      line-height: 1.6;
      color: #344054;
      background: #f7f8fb;
      border: 1px solid #e8ecf4;
      border-radius: 10px;
      padding: 12px 14px;
      overflow-x: auto;
      margin: 0;
      white-space: pre-wrap;
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

    @media (max-width: 980px) {
      .layout { grid-template-columns: 1fr; }
    }
  `]
})
export class DevopsComponent {
  private http = inject(HttpClient);

  docs = [
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
    {
      id: 'quick-start',
      title: 'Quick Start Guide',
      file: 'Quick_Start_Guide.md',
      icon: 'bi-rocket-takeoff',
      desc: 'Prerequisites, setup, first steps, and common tasks.'
    },
  ];

  active = this.docs[0];
  html = '';
  markdownText = '';
  loading = false;
  loadingId: string | null = null;
  error = '';
  private loadSeq = 0;
  private cache = new Map<string, { html: string; md: string }>();

  constructor() {
    void this.open(this.active);
  }

  async open(doc: { id: string; title: string; file: string; icon: string; desc: string }): Promise<void> {
    const requestId = ++this.loadSeq;
    this.active = doc;
    this.loading = true;
    this.loadingId = doc.id;
    this.error = '';
    this.html = '';
    this.markdownText = '';

    try {
      const cached = this.cache.get(doc.file);
      if (cached) {
        this.html = cached.html;
        this.markdownText = cached.md;
        return;
      }
      const url = new URL(`assets/documentation/${doc.file}`, document.baseURI).toString();
      const md = await firstValueFrom(
        this.http.get(url, { responseType: 'text' })
      );
      const rendered = marked.parse(md, { async: false }) as string;
      if (requestId !== this.loadSeq) return;
      this.markdownText = md;
      this.html = rendered;
      this.cache.set(doc.file, { html: rendered, md });
    } catch {
      if (requestId !== this.loadSeq) return;
      this.error = `Cannot load documentation/${doc.file}. Ensure the file exists and is included in build assets.`;
    } finally {
      if (requestId !== this.loadSeq) return;
      this.loading = false;
      this.loadingId = null;
    }
  }
}
