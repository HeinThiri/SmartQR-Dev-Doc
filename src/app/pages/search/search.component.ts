import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SearchService, SearchResult } from '../../core/services/search.service';
import { ContentService } from '../../core/services/content.service';
import { Domain } from '../../core/models/domain.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="search-page">
      <div class="page-header">
        <h1>Search Documentation</h1>
      </div>

      <!-- Search Input -->
      <div class="search-input-wrapper">
        <i class="bi bi-search"></i>
        <input type="text" [(ngModel)]="query" placeholder="Search features, APIs, Q&A..."
               (keydown.enter)="doSearch()" autofocus />
        <button *ngIf="query" class="btn-clear" (click)="query = ''; results = []">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Filters -->
      <div class="filters" *ngIf="results.length || query">
        <div class="filter-group">
          <label>Domain:</label>
          <select [(ngModel)]="filterDomain" (change)="doSearch()">
            <option value="">All</option>
            <option *ngFor="let d of domains" [value]="d.slug">{{ d.name }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Type:</label>
          <select [(ngModel)]="filterType" (change)="doSearch()">
            <option value="">All</option>
            <option value="feature">Features</option>
            <option value="api">API</option>
            <option value="qa">Q&A</option>
          </select>
        </div>
        <span class="result-count" *ngIf="searched">{{ results.length }} result(s)</span>
      </div>

      <!-- Results -->
      <div class="results" *ngIf="searched">
        <div *ngIf="results.length === 0 && !loading" class="empty-state">
          <i class="bi bi-search"></i>
          <p>No results found for "{{ query }}"</p>
        </div>
        <a *ngFor="let r of results" [routerLink]="r.item.routerLink" class="result-card">
          <div class="result-type">
            <span class="type-badge" [ngClass]="'type-' + r.item.type">{{ r.item.type }}</span>
            <span class="domain-label">{{ r.item.domainName }}</span>
          </div>
          <h3>{{ r.item.title }}</h3>
          <p>{{ r.item.summary }}</p>
          <div class="result-tags">
            <span *ngFor="let tag of r.item.tags" class="tag">{{ tag }}</span>
          </div>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .search-page { max-width: 800px; margin: 0 auto; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #1a1f36; margin: 0 0 20px; }

    .search-input-wrapper {
      display: flex; align-items: center; gap: 12px;
      background: #fff; border: 2px solid #e0e4ec;
      border-radius: 12px; padding: 14px 18px;
      margin-bottom: 16px;
      transition: border-color 0.2s;
    }
    .search-input-wrapper:focus-within { border-color: #6c8cff; }
    .search-input-wrapper i { color: #999; font-size: 18px; }
    .search-input-wrapper input {
      border: none; outline: none; flex: 1;
      font-size: 16px; color: #333;
    }
    .btn-clear { background: none; border: none; color: #999; cursor: pointer; padding: 4px; }

    .filters {
      display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
    }
    .filter-group { display: flex; align-items: center; gap: 6px; }
    .filter-group label { font-size: 13px; color: #666; font-weight: 500; }
    .filter-group select {
      padding: 6px 10px; border: 1px solid #ddd; border-radius: 6px;
      font-size: 13px; color: #333; background: #fff;
    }
    .result-count { font-size: 13px; color: #888; margin-left: auto; }

    .result-card {
      display: block; background: #fff; border-radius: 12px;
      padding: 20px; margin-bottom: 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      text-decoration: none; color: inherit;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .result-card:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

    .result-type { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .type-badge {
      padding: 2px 8px; border-radius: 4px; font-size: 11px;
      font-weight: 600; text-transform: uppercase;
    }
    .type-feature { background: #e8f5e9; color: #2e7d32; }
    .type-api { background: #e3f2fd; color: #1565c0; }
    .type-qa { background: #fff3e0; color: #e65100; }
    .domain-label { font-size: 12px; color: #888; }

    .result-card h3 { font-size: 16px; font-weight: 600; color: #1a1f36; margin: 0 0 6px; }
    .result-card p { font-size: 13px; color: #666; margin: 0; }

    .result-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 10px; }
    .tag {
      background: #f0f3ff; color: #6c8cff; padding: 2px 8px;
      border-radius: 12px; font-size: 11px;
    }

    .empty-state { text-align: center; padding: 60px 20px; color: #bbb; }
    .empty-state i { font-size: 40px; display: block; margin-bottom: 12px; }
  `]
})
export class SearchComponent implements OnInit {
  private searchService = inject(SearchService);
  private contentService = inject(ContentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  query = '';
  filterDomain = '';
  filterType = '';
  results: SearchResult[] = [];
  domains: Domain[] = [];
  loading = false;
  searched = false;

  async ngOnInit() {
    this.domains = await this.contentService.getDomains();
    const q = this.route.snapshot.queryParams['q'];
    if (q) {
      this.query = q;
      await this.doSearch();
    }
  }

  async doSearch() {
    if (!this.query.trim()) return;
    this.loading = true;
    this.searched = true;
    this.router.navigate([], { queryParams: { q: this.query }, queryParamsHandling: 'merge' });
    this.results = await this.searchService.search(this.query, {
      domain: this.filterDomain || undefined,
      type: this.filterType || undefined
    });
    this.loading = false;
  }
}
