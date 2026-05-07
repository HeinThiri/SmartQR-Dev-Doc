import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { DomainIndex, Feature, ApiEndpoint, QaItem } from '../../core/models/domain.model';
import { marked } from 'marked';

@Component({
  selector: 'app-domain-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="domain-detail" *ngIf="domainIndex">
      <!-- Header -->
      <div class="page-header">
        <a routerLink="/domains" class="back-link">
          <i class="bi bi-arrow-left"></i> All Domains
        </a>
        <h1>{{ domainIndex.name }}</h1>
        <small class="text-muted">Last updated: {{ domainIndex.lastUpdated }}</small>
        <p *ngIf="domainIndex.summary" class="domain-summary">{{ domainIndex.summary }}</p>
        <div *ngIf="domainIndex.keyFiles?.length" class="key-files">
          <strong>Key files</strong>
          <ul>
            <li *ngFor="let f of domainIndex.keyFiles"><code>{{ f }}</code></li>
          </ul>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tab-bar">
        <button *ngFor="let tab of tabs" class="tab-btn"
                [class.active]="activeTab === tab.key"
                (click)="activeTab = tab.key">
          <i class="bi" [ngClass]="tab.icon"></i>
          {{ tab.label }}
        </button>
      </div>

      <!-- Features Tab -->
      <div *ngIf="activeTab === 'features'" class="tab-content">
        <div *ngIf="features.length === 0" class="empty-state">
          <i class="bi bi-file-earmark-text"></i>
          <p>No feature documentation yet.</p>
        </div>
        <a *ngFor="let feature of features"
           [routerLink]="['/domains', domainIndex.slug, 'features', feature.id]"
           class="feature-link-card">
          <div class="feature-link-icon">
            <i class="bi bi-file-earmark-text"></i>
          </div>
          <div class="feature-link-body">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.summary }}</p>
            <div class="tags">
              <span *ngFor="let tag of feature.tags" class="tag">{{ tag }}</span>
            </div>
          </div>
          <i class="bi bi-chevron-right feature-arrow"></i>
        </a>
      </div>

      <!-- API Reference Tab -->
      <div *ngIf="activeTab === 'api'" class="tab-content">
        <div *ngIf="endpoints.length === 0" class="empty-state">
          <i class="bi bi-braces"></i>
          <p>No API endpoints documented yet.</p>
        </div>
        <div *ngFor="let ep of endpoints" class="content-card api-card">
          <div class="api-header">
            <span class="method-badge" [ngClass]="'method-' + ep.method.toLowerCase()">
              {{ ep.method }}
            </span>
            <code class="api-path">{{ ep.path }}</code>
          </div>
          <p class="summary">{{ ep.summary }}</p>
          <div *ngIf="ep.description" class="markdown-content" [innerHTML]="renderMarkdown(ep.description)"></div>

          <div *ngIf="ep.parameters?.length" class="params-section">
            <h4>Parameters</h4>
            <table class="params-table">
              <thead>
                <tr><th>Name</th><th>In</th><th>Type</th><th>Required</th><th>Description</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of ep.parameters">
                  <td><code>{{ p.name }}</code></td>
                  <td>{{ p.in }}</td>
                  <td>{{ p.type }}</td>
                  <td>{{ p.required ? 'Yes' : 'No' }}</td>
                  <td>{{ p.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="code-examples" *ngIf="ep.requestBody || ep.responseBody">
            <div *ngIf="ep.requestBody" class="code-block">
              <div class="code-label">Request Body</div>
              <pre><code>{{ ep.requestBody }}</code></pre>
            </div>
            <div *ngIf="ep.responseBody" class="code-block">
              <div class="code-label">Response</div>
              <pre><code>{{ ep.responseBody }}</code></pre>
            </div>
          </div>
          <div class="tags">
            <span *ngFor="let tag of ep.tags" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- Q&A Tab -->
      <div *ngIf="activeTab === 'qa'" class="tab-content">
        <div *ngIf="qaItems.length === 0" class="empty-state">
          <i class="bi bi-chat-dots"></i>
          <p>No Q&A items yet.</p>
        </div>
        <div *ngFor="let qa of qaItems; let i = index" class="qa-item">
          <div class="qa-question" (click)="toggleQa(i)">
            <i class="bi" [class.bi-chevron-down]="openQa === i" [class.bi-chevron-right]="openQa !== i"></i>
            <strong>{{ qa.question }}</strong>
          </div>
          <div class="qa-answer" *ngIf="openQa === i">
            <div [innerHTML]="renderMarkdown(qa.answer)"></div>
            <div class="tags" *ngIf="qa.tags.length">
              <span *ngFor="let tag of qa.tags" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="loading" class="loading-state">
      <i class="bi bi-arrow-clockwise spin"></i> Loading...
    </div>
  `,
  styles: [`
    .domain-detail { max-width: 960px; margin: 0 auto; }

    .page-header { margin-bottom: 20px; }
    .back-link {
      font-size: 13px; color: #6c8cff; text-decoration: none;
      display: inline-flex; align-items: center; gap: 4px; margin-bottom: 8px;
    }
    .back-link:hover { text-decoration: underline; }
    .page-header h1 { font-size: 26px; font-weight: 700; color: #1a1f36; margin: 0 0 4px; }
    .domain-summary {
      font-size: 15px; line-height: 1.6; color: #555; margin: 12px 0 0; max-width: 820px;
    }
    .key-files {
      margin-top: 14px; padding: 14px 18px; background: #f8f9fc;
      border-radius: 10px; border-left: 4px solid #6c8cff; font-size: 14px;
    }
    .key-files strong { display: block; margin-bottom: 8px; color: #1a1f36; }
    .key-files ul { margin: 0; padding-left: 20px; color: #444; }
    .key-files li { margin-bottom: 4px; }
    .key-files code { font-size: 12px; background: #fff; padding: 2px 6px; border-radius: 4px; }

    .tab-bar {
      display: flex; gap: 4px; margin-bottom: 24px;
      border-bottom: 2px solid #eee; padding-bottom: 0;
    }
    .tab-btn {
      padding: 10px 18px; border: none; background: none;
      font-size: 14px; font-weight: 500; color: #888;
      cursor: pointer; border-bottom: 2px solid transparent;
      margin-bottom: -2px; display: flex; align-items: center; gap: 6px;
      transition: all 0.2s;
    }
    .tab-btn:hover { color: #555; }
    .tab-btn.active { color: #6c8cff; border-bottom-color: #6c8cff; }

    .content-card {
      background: #fff; border-radius: 12px; padding: 24px;
      margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .content-card h3 { font-size: 18px; font-weight: 600; color: #1a1f36; margin: 0 0 8px; }
    .summary { font-size: 14px; color: #666; margin: 0 0 12px; }

    .markdown-content { font-size: 14px; line-height: 1.7; color: #444; }
    .markdown-content :first-child { margin-top: 0; }

    .tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px; }
    .tag {
      background: #f0f3ff; color: #6c8cff; padding: 3px 10px;
      border-radius: 20px; font-size: 12px; font-weight: 500;
    }

    /* API styles */
    .api-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    .method-badge {
      padding: 4px 10px; border-radius: 6px; font-size: 12px;
      font-weight: 700; font-family: monospace;
    }
    .method-get { background: #e8f5e9; color: #2e7d32; }
    .method-post { background: #e3f2fd; color: #1565c0; }
    .method-put { background: #fff3e0; color: #e65100; }
    .method-delete { background: #fce4ec; color: #c62828; }
    .method-patch { background: #f3e5f5; color: #7b1fa2; }
    .api-path { font-size: 14px; color: #333; background: #f5f7fa; padding: 4px 8px; border-radius: 4px; }

    .params-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
    .params-table th { text-align: left; padding: 8px; border-bottom: 2px solid #eee; color: #555; font-weight: 600; }
    .params-table td { padding: 8px; border-bottom: 1px solid #f0f0f0; }
    .params-table code { background: #f5f7fa; padding: 2px 6px; border-radius: 4px; font-size: 12px; }

    .code-examples { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
    .code-block {
      background: #1a1f36; border-radius: 8px; overflow: hidden;
    }
    .code-label { padding: 8px 14px; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; }
    .code-block pre { margin: 0; padding: 0 14px 14px; overflow-x: auto; }
    .code-block code { color: #e0e6ff; font-size: 13px; white-space: pre-wrap; }

    /* Q&A styles */
    .qa-item {
      background: #fff; border-radius: 10px; margin-bottom: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06); overflow: hidden;
    }
    .qa-question {
      padding: 16px 20px; cursor: pointer; display: flex;
      align-items: center; gap: 10px; font-size: 15px;
      transition: background 0.15s;
    }
    .qa-question:hover { background: #f8f9fc; }
    .qa-question i { color: #6c8cff; font-size: 14px; }
    .qa-answer {
      padding: 0 20px 16px 44px;
      font-size: 14px; line-height: 1.7; color: #555;
    }

    /* Feature link cards */
    .feature-link-card {
      display: flex; align-items: center; gap: 16px;
      background: #fff; border-radius: 12px; padding: 20px 24px;
      margin-bottom: 10px; text-decoration: none; color: inherit;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .feature-link-card:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }
    .feature-link-icon {
      width: 44px; height: 44px; flex-shrink: 0;
      background: rgba(108,140,255,0.1); border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
    }
    .feature-link-icon i { font-size: 20px; color: #6c8cff; }
    .feature-link-body { flex: 1; min-width: 0; }
    .feature-link-body h3 { font-size: 16px; font-weight: 600; color: #1a1f36; margin: 0 0 4px; }
    .feature-link-body p { font-size: 13px; color: #777; margin: 0 0 8px; }
    .feature-arrow { color: #ccc; font-size: 18px; flex-shrink: 0; }

    .empty-state {
      text-align: center; padding: 60px 20px; color: #bbb;
    }
    .empty-state i { font-size: 40px; margin-bottom: 12px; display: block; }

    .loading-state { text-align: center; padding: 60px; color: #888; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .code-examples { grid-template-columns: 1fr; }
    }
  `]
})
export class DomainDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);

  domainIndex: DomainIndex | null = null;
  features: Feature[] = [];
  endpoints: ApiEndpoint[] = [];
  qaItems: QaItem[] = [];
  activeTab = 'features';
  openQa = -1;
  loading = true;

  tabs = [
    { key: 'features', label: 'Features', icon: 'bi-book' },
    { key: 'api', label: 'API Reference', icon: 'bi-braces' },
    { key: 'qa', label: 'Q&A', icon: 'bi-chat-dots' }
  ];

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    try {
      const [domainIndex, features, endpoints, qaItems] = await Promise.all([
        this.contentService.getDomainIndex(slug).catch(() => null),
        this.contentService.getFeatures(slug).catch(() => [] as Feature[]),
        this.contentService.getApiReference(slug).catch(() => [] as ApiEndpoint[]),
        this.contentService.getQaItems(slug).catch(() => [] as QaItem[])
      ]);
      this.domainIndex = domainIndex;
      this.features = features;
      this.endpoints = endpoints;
      this.qaItems = qaItems;
    } catch (e) {
      console.error('Failed to load domain', e);
    }
    this.loading = false;
  }

  toggleQa(index: number) {
    this.openQa = this.openQa === index ? -1 : index;
  }

  renderMarkdown(content: string): string {
    if (!content) return '';
    return marked.parse(content, { async: false }) as string;
  }
}
