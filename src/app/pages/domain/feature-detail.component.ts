import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { Feature } from '../../core/models/domain.model';
import { marked } from 'marked';

@Component({
  selector: 'app-feature-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="feature-detail" *ngIf="feature">
      <div class="page-header">
        <a [routerLink]="['/domains', domainSlug]" class="back-link">
          <i class="bi bi-arrow-left"></i> Back to {{ domainSlug | titlecase }}
        </a>
        <h1>{{ feature.title }}</h1>
        <p class="summary">{{ feature.summary }}</p>
        <div class="tags">
          <span *ngFor="let tag of feature.tags" class="tag">{{ tag }}</span>
        </div>
      </div>

      <div class="feature-body" [innerHTML]="renderedContent"></div>
    </div>

    <div *ngIf="loading" class="loading-state">
      <i class="bi bi-arrow-clockwise spin"></i> Loading...
    </div>
    <div *ngIf="!loading && !feature" class="empty-state">
      <i class="bi bi-file-earmark-x"></i>
      <p>Feature not found.</p>
      <a [routerLink]="['/domains', domainSlug]" class="back-link">Back to domain</a>
    </div>
  `,
  styles: [`
    .feature-detail { max-width: 900px; margin: 0 auto; }

    .page-header { margin-bottom: 28px; }
    .back-link {
      font-size: 13px; color: #6c8cff; text-decoration: none;
      display: inline-flex; align-items: center; gap: 4px; margin-bottom: 10px;
    }
    .back-link:hover { text-decoration: underline; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1a1f36; margin: 0 0 8px; }
    .summary { font-size: 15px; color: #666; margin: 0 0 12px; line-height: 1.5; }

    .tags { display: flex; gap: 6px; flex-wrap: wrap; }
    .tag {
      background: #f0f3ff; color: #6c8cff; padding: 4px 12px;
      border-radius: 20px; font-size: 12px; font-weight: 500;
    }

    .feature-body {
      background: #fff;
      border-radius: 14px;
      padding: 32px 36px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      font-size: 15px;
      line-height: 1.8;
      color: #333;
    }

    /* Markdown content styles */
    .feature-body :first-child { margin-top: 0; }
    .feature-body h2 { font-size: 22px; font-weight: 700; color: #1a1f36; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #f0f0f0; }
    .feature-body h3 { font-size: 18px; font-weight: 600; color: #1a1f36; margin: 28px 0 10px; }
    .feature-body h4 { font-size: 16px; font-weight: 600; color: #444; margin: 20px 0 8px; }
    .feature-body p { margin: 0 0 14px; }
    .feature-body ul, .feature-body ol { padding-left: 24px; margin: 0 0 14px; }
    .feature-body li { margin-bottom: 4px; }

    .feature-body code {
      background: #f0f3ff; color: #4a6cf7; padding: 2px 7px;
      border-radius: 4px; font-size: 13px; font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
    }
    .feature-body pre {
      background: #1a1f36; border-radius: 10px; padding: 18px 22px;
      overflow-x: auto; margin: 0 0 16px;
    }
    .feature-body pre code {
      background: none; color: #e0e6ff; padding: 0;
      font-size: 13px; line-height: 1.6;
    }

    .feature-body table {
      width: 100%; border-collapse: collapse; margin: 0 0 16px; font-size: 13px;
    }
    .feature-body th {
      text-align: left; padding: 10px 12px; background: #f5f7fa;
      border-bottom: 2px solid #e0e4ec; font-weight: 600; color: #444;
    }
    .feature-body td {
      padding: 9px 12px; border-bottom: 1px solid #f0f0f0;
    }
    .feature-body tr:hover td { background: #fafbfd; }

    .feature-body hr {
      border: none; border-top: 2px solid #f0f0f0; margin: 28px 0;
    }

    .feature-body blockquote {
      border-left: 4px solid #6c8cff; background: #f8f9ff;
      padding: 12px 18px; margin: 0 0 16px; border-radius: 0 8px 8px 0;
      color: #555;
    }

    .feature-body strong { color: #1a1f36; }

    .loading-state { text-align: center; padding: 60px; color: #888; }
    .empty-state { text-align: center; padding: 60px; color: #bbb; }
    .empty-state i { font-size: 40px; display: block; margin-bottom: 12px; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class FeatureDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);

  domainSlug = '';
  feature: Feature | null = null;
  renderedContent = '';
  loading = true;

  async ngOnInit() {
    this.domainSlug = this.route.snapshot.paramMap.get('slug')!;
    const featureId = this.route.snapshot.paramMap.get('featureId')!;

    try {
      const features = await this.contentService.getFeatures(this.domainSlug);
      this.feature = features.find(f => f.id === featureId) || null;
      if (this.feature) {
        this.renderedContent = marked.parse(this.feature.content, { async: false }) as string;
      }
    } catch (e) {
      console.error('Failed to load feature', e);
    }
    this.loading = false;
  }
}
