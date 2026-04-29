import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import { Domain, DomainIndex, Feature, ApiEndpoint, QaItem, SearchableItem } from '../models/domain.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);
  private domainsCache: Domain[] | null = null;
  private domainContentCache = new Map<string, any>();
  private searchIndex: SearchableItem[] | null = null;
  private requestTimeoutMs = 5_000;

  async getDomains(): Promise<Domain[]> {
    if (this.domainsCache) return this.domainsCache;
    const data = await firstValueFrom(
      this.http.get<{ domains: Domain[] }>('assets/content/domains.json').pipe(timeout(this.requestTimeoutMs))
    );
    this.domainsCache = data.domains.sort((a, b) => a.order - b.order);
    return this.domainsCache;
  }

  async getDomainIndex(slug: string): Promise<DomainIndex> {
    return this.loadDomainFile<DomainIndex>(slug, 'index.json');
  }

  async getFeatures(slug: string): Promise<Feature[]> {
    const data = await this.loadDomainFile<{ features: Feature[] }>(slug, 'features.json');
    return data.features || [];
  }

  async getApiReference(slug: string): Promise<ApiEndpoint[]> {
    const data = await this.loadDomainFile<{ endpoints: ApiEndpoint[] }>(slug, 'api-reference.json');
    return data.endpoints || [];
  }

  async getQaItems(slug: string): Promise<QaItem[]> {
    const data = await this.loadDomainFile<{ items: QaItem[] }>(slug, 'qa.json');
    return data.items || [];
  }

  async getMarkdownContent(slug: string, filename: string): Promise<string> {
    const key = `${slug}/${filename}`;
    if (this.domainContentCache.has(key)) return this.domainContentCache.get(key);
    try {
      const content = await firstValueFrom(
        this.http.get(`assets/content/${slug}/${filename}`, { responseType: 'text' }).pipe(timeout(this.requestTimeoutMs))
      );
      this.domainContentCache.set(key, content);
      return content;
    } catch {
      return '';
    }
  }

  async buildSearchIndex(): Promise<SearchableItem[]> {
    if (this.searchIndex) return this.searchIndex;

    const domains = await this.getDomains();
    const items: SearchableItem[] = [];

    for (const domain of domains) {
      try {
        const features = await this.getFeatures(domain.slug);
        for (const f of features) {
          items.push({
            type: 'feature',
            domainSlug: domain.slug,
            domainName: domain.name,
            id: f.id,
            title: f.title,
            summary: f.summary,
            content: f.content,
            tags: f.tags,
            routerLink: `/domains/${domain.slug}`
          });
        }
      } catch {}

      try {
        const endpoints = await this.getApiReference(domain.slug);
        for (const e of endpoints) {
          items.push({
            type: 'api',
            domainSlug: domain.slug,
            domainName: domain.name,
            id: e.id,
            title: `${e.method} ${e.path}`,
            summary: e.summary,
            content: e.description || '',
            tags: e.tags,
            routerLink: `/domains/${domain.slug}`
          });
        }
      } catch {}

      try {
        const qaItems = await this.getQaItems(domain.slug);
        for (const q of qaItems) {
          items.push({
            type: 'qa',
            domainSlug: domain.slug,
            domainName: domain.name,
            id: q.id,
            title: q.question,
            summary: q.answer.substring(0, 150),
            content: q.answer,
            tags: q.tags,
            routerLink: `/domains/${domain.slug}/qa`
          });
        }
      } catch {}
    }

    this.searchIndex = items;
    return items;
  }

  async getDocumentationMarkdown(filename: string): Promise<string> {
    const key = `documentation/${filename}`;
    if (this.domainContentCache.has(key)) return this.domainContentCache.get(key);
    const candidates = [
      `assets/documentation/${filename}`,
      `documentation/${filename}`,
      `assets/${filename}`
    ];
    for (const url of candidates) {
      try {
        const content = await firstValueFrom(
          this.http.get(url, { responseType: 'text' }).pipe(timeout(this.requestTimeoutMs))
        );
        if (content && content.trim().length > 0) {
          this.domainContentCache.set(key, content);
          return content;
        }
      } catch {}
    }
    return '';
  }

  private async loadDomainFile<T>(slug: string, filename: string): Promise<T> {
    const key = `${slug}/${filename}`;
    if (this.domainContentCache.has(key)) return this.domainContentCache.get(key);
    const data = await firstValueFrom(
      this.http.get<T>(`assets/content/${slug}/${filename}`).pipe(timeout(this.requestTimeoutMs))
    );
    this.domainContentCache.set(key, data);
    return data;
  }
}
