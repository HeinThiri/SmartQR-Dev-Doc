import { Injectable, inject } from '@angular/core';
import { ContentService } from './content.service';
import { SearchableItem } from '../models/domain.model';

export interface SearchResult {
  item: SearchableItem;
  score: number;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private contentService = inject(ContentService);

  async search(query: string, filters?: { domain?: string; type?: string }): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];

    const index = await this.contentService.buildSearchIndex();
    const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);

    let results: SearchResult[] = index.map(item => ({
      item,
      score: this.scoreItem(item, tokens)
    })).filter(r => r.score > 0);

    if (filters?.domain) {
      results = results.filter(r => r.item.domainSlug === filters.domain);
    }
    if (filters?.type) {
      results = results.filter(r => r.item.type === filters.type);
    }

    return results.sort((a, b) => b.score - a.score).slice(0, 50);
  }

  private scoreItem(item: SearchableItem, tokens: string[]): number {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const summaryLower = item.summary.toLowerCase();
    const contentLower = item.content.toLowerCase();
    const tagsLower = item.tags.map(t => t.toLowerCase());

    for (const token of tokens) {
      if (titleLower === token) score += 100;
      else if (titleLower.includes(token)) score += 50;

      if (tagsLower.some(t => t === token)) score += 30;
      else if (tagsLower.some(t => t.includes(token))) score += 15;

      if (summaryLower.includes(token)) score += 20;
      if (contentLower.includes(token)) score += 5;
    }

    return score;
  }
}
