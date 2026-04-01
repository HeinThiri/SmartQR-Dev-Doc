import { Component, OnDestroy, AfterViewInit, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface TocItem {
  id: string;
  title: string;
  active: boolean;
}

@Component({
  selector: 'app-floating-toc',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="floating-toc" *ngIf="items.length > 1" [class.collapsed]="isCollapsed">
      <button class="toc-toggle" (click)="isCollapsed = !isCollapsed" [title]="isCollapsed ? 'Show sections' : 'Hide sections'">
        <i class="bi" [class.bi-list]="isCollapsed" [class.bi-chevron-down]="!isCollapsed"></i>
        <span *ngIf="isCollapsed" class="toc-label">Sections</span>
      </button>
      <div class="toc-items" *ngIf="!isCollapsed">
        <button *ngFor="let item of items"
                class="toc-item"
                [class.active]="item.active"
                (click)="scrollTo(item.id)">
          {{ item.title }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .floating-toc {
      position: fixed;
      bottom: 100px;
      right: 24px;
      background: #2d3561;
      border-radius: 16px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1);
      z-index: 9998;
      max-height: 60vh;
      overflow-y: auto;
      max-width: 280px;
      opacity: 0.35;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .floating-toc:hover {
      opacity: 1;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15);
    }
    .floating-toc.collapsed {
      border-radius: 30px;
      padding: 4px 6px;
      max-width: 130px;
    }

    /* Scrollbar */
    .floating-toc::-webkit-scrollbar { width: 4px; }
    .floating-toc::-webkit-scrollbar-track { background: transparent; }
    .floating-toc::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

    .toc-toggle {
      background: none; border: none;
      color: rgba(255,255,255,0.7);
      cursor: pointer; padding: 6px 10px;
      border-radius: 12px;
      display: flex; align-items: center; gap: 6px;
      font-size: 15px; transition: all 0.2s;
      white-space: nowrap;
    }
    .toc-toggle:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .toc-label { font-size: 12px; font-weight: 600; }

    .toc-items { display: flex; flex-direction: column; gap: 1px; }

    .toc-item {
      background: none; border: none;
      color: rgba(255,255,255,0.6);
      cursor: pointer; padding: 7px 12px;
      border-radius: 10px;
      font-size: 12px; font-weight: 500;
      text-align: left; white-space: nowrap;
      overflow: hidden; text-overflow: ellipsis;
      transition: all 0.15s;
      max-width: 268px;
    }
    .toc-item:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9); }
    .toc-item.active {
      background: rgba(108,140,255,0.25);
      color: #fff;
      font-weight: 600;
    }
  `]
})
export class FloatingTocComponent implements AfterViewInit, OnDestroy {
  private ngZone = inject(NgZone);
  private router = inject(Router);

  items: TocItem[] = [];
  isCollapsed = false;

  private observer: IntersectionObserver | null = null;
  private routerSub: Subscription;
  private scanTimeout: any;

  constructor() {
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      clearTimeout(this.scanTimeout);
      this.scanTimeout = setTimeout(() => this.scanSections(), 300);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.scanSections(), 500);
  }

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private scanSections() {
    this.disconnect();
    this.items = [];

    const contentArea = document.querySelector('.content-area');
    if (!contentArea) return;

    const headings = contentArea.querySelectorAll('.card h2');
    if (headings.length <= 1) return;

    headings.forEach((h2, index) => {
      const card = h2.closest('.card');
      if (!card) return;

      let id = card.id;
      if (!id) {
        id = 'toc-section-' + index;
        card.id = id;
      }

      this.items.push({
        id,
        title: h2.textContent?.trim() || 'Section ' + (index + 1),
        active: false
      });
    });

    if (this.items.length > 1) {
      this.setupObserver();
    }
  }

  private setupObserver() {
    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const item = this.items.find(i => i.id === entry.target.id);
            if (item) {
              this.ngZone.run(() => {
                if (entry.isIntersecting) {
                  this.items.forEach(i => i.active = false);
                  item.active = true;
                }
              });
            }
          });
        },
        {
          rootMargin: '-10% 0px -70% 0px',
          threshold: 0
        }
      );

      this.items.forEach(item => {
        const el = document.getElementById(item.id);
        if (el) this.observer!.observe(el);
      });
    });
  }

  private disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  ngOnDestroy() {
    this.disconnect();
    this.routerSub?.unsubscribe();
    clearTimeout(this.scanTimeout);
  }
}
