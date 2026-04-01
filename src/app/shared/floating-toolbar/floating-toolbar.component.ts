import { Component, inject, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-floating-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="floating-toolbar" [class.expanded]="isSearchOpen" [class.hidden]="!visible">
      <!-- Back -->
      <button class="tb-btn" (click)="goBack()" title="Back (Alt+Left)">
        <i class="bi bi-arrow-left"></i>
        <span class="shortcut">Alt+&#8592;</span>
      </button>

      <!-- Home -->
      <button class="tb-btn" (click)="goHome()" title="Home (Alt+H)">
        <i class="bi bi-house"></i>
        <span class="shortcut">Alt+H</span>
      </button>

      <div class="tb-divider"></div>

      <!-- Search toggle / input -->
      <div class="search-area" [class.open]="isSearchOpen">
        <button class="tb-btn" (click)="toggleSearch()" title="Search in page (Ctrl+F)">
          <i class="bi bi-search"></i>
          <span class="shortcut">Ctrl+F</span>
        </button>
        <div class="search-box" *ngIf="isSearchOpen">
          <input #searchInput type="text"
                 [(ngModel)]="searchQuery"
                 (ngModelChange)="onSearch()"
                 (keydown.enter)="nextMatch()"
                 (keydown.escape)="closeSearch()"
                 placeholder="Search in page..." />
          <span class="match-count" *ngIf="searchQuery">
            {{ totalMatches === 0 ? 'No results' : (currentIndex + 1) + ' / ' + totalMatches }}
          </span>
          <button class="nav-btn" (click)="prevMatch()" [disabled]="totalMatches === 0" title="Previous (Shift+Enter)">
            <i class="bi bi-chevron-up"></i>
          </button>
          <button class="nav-btn" (click)="nextMatch()" [disabled]="totalMatches === 0" title="Next (Enter)">
            <i class="bi bi-chevron-down"></i>
          </button>
          <button class="nav-btn close-btn" (click)="closeSearch()" title="Close (Esc)">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .floating-toolbar {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #2d3561;
      border-radius: 30px;
      padding: 6px 10px;
      display: flex;
      align-items: center;
      gap: 4px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15);
      z-index: 9999;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .floating-toolbar.hidden { opacity: 0; pointer-events: none; transform: translateY(20px); }
    .floating-toolbar.expanded { padding: 6px 14px; }

    .tb-btn {
      width: 44px; height: 44px;
      background: none; border: none; color: rgba(255,255,255,0.85);
      border-radius: 10px; cursor: pointer;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 1px;
      font-size: 17px; transition: all 0.2s;
      flex-shrink: 0;
    }
    .tb-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
    .shortcut {
      font-size: 8px; font-weight: 600; letter-spacing: 0.3px;
      color: rgba(255,255,255,0.45); line-height: 1;
      white-space: nowrap;
    }
    .tb-btn:hover .shortcut { color: rgba(255,255,255,0.7); }

    .tb-divider {
      width: 1px; height: 24px; background: rgba(255,255,255,0.15);
      margin: 0 4px; flex-shrink: 0;
    }

    .search-area { display: flex; align-items: center; }
    .search-area.open { flex: 1; }

    .search-box {
      display: flex; align-items: center; gap: 4px;
      background: rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 4px 8px 4px 14px;
      margin-left: 4px;
      animation: slideIn 0.2s ease;
    }
    @keyframes slideIn { from { width: 0; opacity: 0; } to { width: auto; opacity: 1; } }

    .search-box input {
      background: none; border: none; outline: none;
      color: #fff; font-size: 14px; width: 180px;
      padding: 6px 0;
    }
    .search-box input::placeholder { color: rgba(255,255,255,0.4); }

    .match-count {
      font-size: 12px; color: rgba(255,255,255,0.5);
      white-space: nowrap; padding: 0 6px;
      min-width: 60px; text-align: center;
    }

    .nav-btn {
      width: 30px; height: 30px;
      background: none; border: none; color: rgba(255,255,255,0.6);
      border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; transition: all 0.15s;
      flex-shrink: 0;
    }
    .nav-btn:hover:not(:disabled) { background: rgba(255,255,255,0.12); color: #fff; }
    .nav-btn:disabled { opacity: 0.3; cursor: default; }
    .close-btn { font-size: 18px; }
  `]
})
export class FloatingToolbarComponent implements OnDestroy {
  private location = inject(Location);
  private router = inject(Router);

  visible = true;
  isSearchOpen = false;
  searchQuery = '';
  totalMatches = 0;
  currentIndex = 0;

  private highlights: HTMLElement[] = [];
  private originalContents = new Map<Node, string>();
  private scrollTimeout: any;

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    // Ctrl+F to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      this.toggleSearch();
    }
    // Alt+H for home
    if (e.altKey && e.key === 'h') {
      e.preventDefault();
      this.goHome();
    }
    // Alt+Left for back
    if (e.altKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      this.goBack();
    }
    // Shift+Enter for previous when search is open
    if (e.shiftKey && e.key === 'Enter' && this.isSearchOpen) {
      e.preventDefault();
      this.prevMatch();
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    // Brief hide on scroll, show after stop
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => { this.visible = true; }, 150);
  }

  goBack() { this.location.back(); }
  goHome() { this.router.navigate(['/welcome']); }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
    if (this.isSearchOpen) {
      setTimeout(() => {
        const input = document.querySelector('.search-box input') as HTMLInputElement;
        input?.focus();
        if (this.searchQuery) input?.select();
      }, 100);
    } else {
      this.clearHighlights();
    }
  }

  closeSearch() {
    this.isSearchOpen = false;
    this.searchQuery = '';
    this.clearHighlights();
  }

  onSearch() {
    this.clearHighlights();
    if (!this.searchQuery || this.searchQuery.length < 2) {
      this.totalMatches = 0;
      this.currentIndex = 0;
      return;
    }
    this.highlightAll(this.searchQuery);
    this.totalMatches = this.highlights.length;
    this.currentIndex = this.totalMatches > 0 ? 0 : 0;
    if (this.totalMatches > 0) this.scrollToMatch(0);
  }

  nextMatch() {
    if (this.totalMatches === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.totalMatches;
    this.scrollToMatch(this.currentIndex);
  }

  prevMatch() {
    if (this.totalMatches === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.totalMatches) % this.totalMatches;
    this.scrollToMatch(this.currentIndex);
  }

  private highlightAll(query: string) {
    const contentArea = document.querySelector('.content-area') || document.querySelector('.main-area') || document.body;
    const walker = document.createTreeWalker(contentArea, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName?.toLowerCase();
        if (['script', 'style', 'input', 'textarea'].includes(tag)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('.floating-toolbar')) return NodeFilter.FILTER_REJECT;
        if (node.textContent && node.textContent.toLowerCase().includes(query.toLowerCase())) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    });

    const textNodes: Text[] = [];
    let current: Node | null;
    while ((current = walker.nextNode())) {
      textNodes.push(current as Text);
    }

    for (const textNode of textNodes) {
      const parent = textNode.parentNode;
      if (!parent) continue;

      const text = textNode.textContent || '';
      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let matchIndex: number;

      while ((matchIndex = lowerText.indexOf(lowerQuery, lastIndex)) !== -1) {
        // Text before match
        if (matchIndex > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, matchIndex)));
        }
        // Highlighted match
        const mark = document.createElement('mark');
        mark.className = 'search-highlight';
        mark.textContent = text.slice(matchIndex, matchIndex + query.length);
        fragment.appendChild(mark);
        this.highlights.push(mark);
        lastIndex = matchIndex + query.length;
      }
      // Remaining text
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      this.originalContents.set(textNode, text);
      parent.replaceChild(fragment, textNode);
    }
  }

  private clearHighlights() {
    const marks = document.querySelectorAll('mark.search-highlight, mark.search-highlight-active');
    marks.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
        parent.normalize();
      }
    });
    this.highlights = [];
    this.originalContents.clear();
  }

  private scrollToMatch(index: number) {
    // Remove active from all
    this.highlights.forEach(h => h.className = 'search-highlight');
    // Set active
    const target = this.highlights[index];
    if (target) {
      target.className = 'search-highlight-active';
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  ngOnDestroy() {
    this.clearHighlights();
    clearTimeout(this.scrollTimeout);
  }
}
