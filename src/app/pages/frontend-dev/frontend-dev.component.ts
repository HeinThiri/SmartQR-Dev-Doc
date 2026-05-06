import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-frontend-dev',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">

      <!-- ── Header ── -->
      <a routerLink="/welcome" class="back-link">
        <i class="bi bi-arrow-left"></i> Home
      </a>
      <div class="page-header">
        <div class="header-icon"><i class="bi bi-window-fullscreen"></i></div>
        <div>
          <h1>Frontend Developer Guide</h1>
          <p class="subtitle">
            Everything you need to work on <strong>Smart_QR_UI</strong> — Angular 19, NgModule-based
            architecture, QR wizards, viewer pages, guards, interceptors, shared components, and i18n.
          </p>
        </div>
      </div>

      <!-- ── Section nav ── -->
      <nav class="toc-strip">
        <a href="#tech-stack">Tech stack</a>
        <a href="#folder">Folder layout</a>
        <a href="#routing">Route map</a>
        <a href="#wizards">QR wizards</a>
        <a href="#viewers">Viewers</a>
        <a href="#services">Services</a>
        <a href="#guards">Guards</a>
        <a href="#interceptor">Interceptor</a>
        <a href="#shared">Shared components</a>
        <a href="#i18n">i18n</a>
        <a href="#patterns">Patterns</a>
        <a href="#commands">Dev commands</a>
      </nav>

      <!-- ══════════════════════════════════════════
           TECH STACK
      ═══════════════════════════════════════════ -->
      <section class="card" id="tech-stack">
        <h2><i class="bi bi-stack"></i> Tech stack</h2>
        <div class="stack-grid">
          <div *ngFor="let item of techStack" class="stack-card">
            <div class="stack-icon" [style.background]="item.bg">
              <i class="bi" [ngClass]="item.icon" [style.color]="item.color"></i>
            </div>
            <div>
              <div class="stack-name">{{ item.name }}</div>
              <div class="stack-version">{{ item.version }}</div>
            </div>
          </div>
        </div>
        <div class="info-box" style="margin-top:14px">
          <i class="bi bi-info-circle"></i>
          <div>
            <strong>Architecture note:</strong> Smart_QR_UI uses <strong>NgModule-based</strong> Angular
            (not standalone components). All feature code lives under
            <code>pages/systematic/modules/</code> with a root <code>AppModule</code>.
            The dev-doc portal uses standalone Angular 21 — the two apps have different patterns.
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           FOLDER LAYOUT
      ═══════════════════════════════════════════ -->
      <section class="card" id="folder">
        <h2><i class="bi bi-folder2-open"></i> Folder layout</h2>
        <pre><code>Smart_QR_UI/src/app/
├── app.module.ts                  # Root module — providers, interceptors, TranslateModule
├── app-routing.module.ts          # All route declarations (central authority)
├── app.component.ts               # Root component
│
├── pages/systematic/modules/
│   ├── qr-code-list/              # QR CRUD, wizards, viewers, loyalty, shops
│   │   ├── qr-operation/         # Step-one/step-two wizard components per QR type
│   │   ├── qr-viewer/            # Public viewer components per QR type
│   │   ├── shops-configuration/  # Shops/menu submodule (shop, category, product, map)
│   │   └── loyalty-program/      # Loyalty dashboard and registration management
│   ├── admin/                     # Admin: users, roles, QR admin, email config
│   ├── auth/                      # Login, register, forgot/set password
│   ├── analytics/                 # Scan usage dashboards
│   ├── settings/                  # User-facing settings
│   └── event-contact-list/        # Event registrant management
│
├── services/
│   ├── qr-code.service.ts         # Main HTTP hub — SmartQRApi, QR generation, loyalty
│   ├── common.service.ts          # Token helpers, isAuthenticated, checkIsAdminAsync
│   ├── translation.service.ts     # Active locale + ngx-translate bridge
│   ├── notification.service.ts    # Toast/alert wrapper
│   ├── user-management.service.ts
│   ├── role-management.service.ts
│   ├── email-settings.service.ts
│   ├── image-compression.service.ts
│   ├── indexed-db.service.ts      # LocalStorage via IndexedDB
│   └── mall-map.service.ts        # Map / parking zone data
│
├── guards/
│   ├── auth.guard.ts              # Checks authToken in localStorage → redirect /login
│   └── admin.guard.ts             # Server-side admin check (async) → redirect /qr-codes/type
│
├── interceptors/
│   └── auth.interceptor.ts        # Injects Bearer token; handles 401 / expiry (code 210)
│
├── shared/                        # 80+ reusable UI components (previews, analytics, forms…)
│
├── layouts/
│   ├── navbar/
│   ├── sidebar/
│   ├── admin-sidebar/
│   └── footer/
│
└── environments/
    ├── environment.ts             # Local dev  → baseApiUrl: http://127.0.0.1:5100
    ├── environment.dev.ts         # UAT staging → qr_uat_api.smarticwork.com
    └── environment.prod.ts        # Production  → qr_api.smarticwork.com</code></pre>
      </section>

      <!-- ══════════════════════════════════════════
           ROUTE MAP
      ═══════════════════════════════════════════ -->
      <section class="card" id="routing">
        <h2><i class="bi bi-signpost-split"></i> Route map</h2>
        <p>All routes are declared in <code>app-routing.module.ts</code>. Add new screens there and
           place components under <code>pages/systematic/modules/</code>.</p>

        <h3>Authentication</h3>
        <div class="route-table">
          <div *ngFor="let r of routes.auth" class="route-row">
            <span class="route-path">{{ r.path }}</span>
            <span class="route-component">{{ r.component }}</span>
            <span class="route-note" *ngIf="r.note">{{ r.note }}</span>
          </div>
        </div>

        <h3>QR Type Selector</h3>
        <div class="route-table">
          <div *ngFor="let r of routes.typeSelector" class="route-row">
            <span class="route-path">{{ r.path }}</span>
            <span class="route-component">{{ r.component }}</span>
            <span class="route-note" *ngIf="r.note">{{ r.note }}</span>
          </div>
        </div>

        <h3>QR Wizard — create (step-one → step-two)</h3>
        <div class="route-table compact">
          <div *ngFor="let r of routes.wizardCreate" class="route-row">
            <span class="route-path">{{ r.path }}</span>
            <span class="route-component">{{ r.component }}</span>
          </div>
        </div>
        <p class="route-note-text">Edit routes follow the same pattern:
          <code>/qr-codes/edit/{{ '{' }}type{{ '}' }}/:id</code> and
          <code>/qr-codes/edit/{{ '{' }}type{{ '}' }}/:id/customize</code>
        </p>

        <h3>Public viewers</h3>
        <div class="route-table">
          <div *ngFor="let r of routes.viewers" class="route-row">
            <span class="route-path">{{ r.path }}</span>
            <span class="route-component">{{ r.component }}</span>
            <span class="route-note" *ngIf="r.note">{{ r.note }}</span>
          </div>
        </div>

        <h3>Shops configuration (under QR menu type)</h3>
        <div class="route-table">
          <div *ngFor="let r of routes.shops" class="route-row">
            <span class="route-path">{{ r.path }}</span>
            <span class="route-component">{{ r.component }}</span>
          </div>
        </div>

        <h3>Loyalty</h3>
        <div class="route-table">
          <div *ngFor="let r of routes.loyalty" class="route-row">
            <span class="route-path">{{ r.path }}</span>
            <span class="route-component">{{ r.component }}</span>
            <span class="route-note" *ngIf="r.note">{{ r.note }}</span>
          </div>
        </div>

        <h3>Admin (AdminGuard)</h3>
        <div class="route-table compact">
          <div *ngFor="let r of routes.admin" class="route-row">
            <span class="route-path">{{ r.path }}</span>
            <span class="route-component">{{ r.component }}</span>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           QR WIZARDS
      ═══════════════════════════════════════════ -->
      <section class="card" id="wizards">
        <h2><i class="bi bi-ui-checks-grid"></i> QR type wizards</h2>
        <p>
          Every QR type uses the same <strong>step-one → step-two</strong> pattern.
          Step-one collects metadata and content; step-two handles visual customisation
          (dot pattern, colours, logo, frame). Both steps share state through
          <code>QrCodeService</code> and call <code>SaveQR</code> at the end.
        </p>

        <div class="wizard-flow">
          <div class="wf-box">
            <div class="wf-label">Type picker</div>
            <div class="wf-sub"><code>/qr-codes/type</code></div>
          </div>
          <div class="wf-arrow"><i class="bi bi-arrow-right"></i></div>
          <div class="wf-box primary">
            <div class="wf-label">Step One</div>
            <div class="wf-sub">Name, content, media</div>
          </div>
          <div class="wf-arrow"><i class="bi bi-arrow-right"></i></div>
          <div class="wf-box primary">
            <div class="wf-label">Step Two</div>
            <div class="wf-sub">Design &amp; customisation</div>
          </div>
          <div class="wf-arrow"><i class="bi bi-arrow-right"></i></div>
          <div class="wf-box success">
            <div class="wf-label">SaveQR</div>
            <div class="wf-sub">API persist &amp; redirect</div>
          </div>
        </div>

        <h3>QR types &amp; their wizards</h3>
        <div class="type-grid">
          <div *ngFor="let t of qrTypes" class="type-card">
            <div class="type-icon">
              <i class="bi" [ngClass]="t.icon"></i>
            </div>
            <div class="type-info">
              <div class="type-name">{{ t.name }}</div>
              <div class="type-path"><code>{{ t.path }}</code></div>
              <div class="type-desc">{{ t.desc }}</div>
            </div>
          </div>
        </div>

        <h3>QRTypeID mapping</h3>
        <p>
          The API uses a numeric <code>QRTypeID</code>. The service exposes two utilities to convert
          between the route slug and the API integer:
        </p>
        <pre><code>// slug → numeric ID
qrCodeService.getQRTypeID('menu')           // → 4
qrCodeService.getQRTypeID('loyalty-program') // → 7

// numeric ID → slug
qrCodeService.mapQRTypeIdToType(4)          // → 'menu'
qrCodeService.mapQRTypeIdToType(7)          // → 'loyalty-program'</code></pre>

        <h3>Pending QR after sign-up</h3>
        <p>
          If a visitor starts a wizard without being logged in, the QR data is queued in
          <code>IndexedDBService</code>. After successful registration via
          <code>AuthenticationApi/Register</code>, the app detects the queued item and calls
          <code>SaveQR</code> automatically before redirecting to the QR list.
        </p>
      </section>

      <!-- ══════════════════════════════════════════
           VIEWERS
      ═══════════════════════════════════════════ -->
      <section class="card" id="viewers">
        <h2><i class="bi bi-eye"></i> Public viewers</h2>
        <p>
          Viewer components are the public-facing pages scanned users land on. They use
          <code>data: {{ '{' }} hideLayout: true {{ '}' }}</code> in the route definition so the
          app's navbar and sidebar are hidden. Each viewer calls <code>ScanQR</code> on load to
          track analytics (IP, location, browser).
        </p>

        <div class="viewer-list">
          <div *ngFor="let v of viewerTypes" class="viewer-card">
            <div class="viewer-header">
              <div class="viewer-icon"><i class="bi" [ngClass]="v.icon"></i></div>
              <div>
                <div class="viewer-name">{{ v.name }}</div>
                <code class="viewer-route">{{ v.route }}</code>
              </div>
            </div>
            <p class="viewer-desc">{{ v.desc }}</p>
            <div class="viewer-tags">
              <span *ngFor="let tag of v.tags" class="vtag">{{ tag }}</span>
            </div>
          </div>
        </div>

        <h3>Scan tracking</h3>
        <p>All viewers call <code>ScanQR</code> on <code>ngOnInit</code> via <code>QrCodeService</code>. The API records:</p>
        <ul>
          <li>Client IP address</li>
          <li>Browser user-agent and device type</li>
          <li>Geolocation (when browser permission granted)</li>
          <li>Timestamp and QR code ID</li>
        </ul>
        <p>Scan history is retrieved with <code>GetQRScansHistory(qrCodeId)</code>.</p>
      </section>

      <!-- ══════════════════════════════════════════
           SERVICES
      ═══════════════════════════════════════════ -->
      <section class="card" id="services">
        <h2><i class="bi bi-gear"></i> Service layer</h2>
        <p>
          Services live in <code>src/app/services/</code> and are provided in
          <code>AppModule</code> root. HTTP calls target
          <code>\${{ '{' }}environment.baseApiUrl{{ '}' }}/&lt;controller&gt;/&lt;action&gt;</code>.
        </p>

        <div class="service-list">
          <div *ngFor="let svc of services" class="service-row">
            <div class="svc-name"><code>{{ svc.file }}</code></div>
            <div class="svc-desc">{{ svc.desc }}</div>
          </div>
        </div>

        <h3>qr-code.service.ts — key method groups</h3>
        <p>This is the largest service (369 kB). Key method categories:</p>
        <table>
          <thead><tr><th>Category</th><th>Example methods</th></tr></thead>
          <tbody>
            <tr><td>QR CRUD</td><td><code>SaveQR</code>, <code>GetQRList</code>, <code>GetQRById</code>, <code>DeleteQR</code></td></tr>
            <tr><td>QR design</td><td><code>generateQRCode()</code>, <code>getQROptions()</code>, <code>applyCustomization()</code></td></tr>
            <tr><td>Scan tracking</td><td><code>ScanQR</code>, <code>GetQRScansHistory</code></td></tr>
            <tr><td>Loyalty</td><td><code>RegisterForLoyalty</code>, <code>AddLoyaltyStamps</code>, <code>RedeemLoyaltyReward</code></td></tr>
            <tr><td>Menu / orders</td><td><code>GetMenuItems</code>, <code>SubmitMenuOrder</code></td></tr>
            <tr><td>Events</td><td><code>RegisterForEvent</code>, <code>GetEventRegistrations</code></td></tr>
            <tr><td>Shops</td><td><code>GetShops</code>, <code>CreateShop</code>, <code>GetShopsPublic</code></td></tr>
            <tr><td>Content</td><td><code>GetContentSections</code>, <code>GetPromotionsPublic</code>, <code>GetParkingZonesPublic</code></td></tr>
            <tr><td>Type utilities</td><td><code>getQRTypeID(slug)</code>, <code>mapQRTypeIdToType(id)</code></td></tr>
          </tbody>
        </table>

        <h3>common.service.ts — key methods</h3>
        <pre><code>// Authentication helpers
commonService.isAuthenticated()          // checks localStorage authToken + userId
commonService.checkIsAdminAsync()        // server-side admin role check

// Token / header utilities
commonService.getToken()                 // returns localStorage authToken
commonService.getAuthHeaders()           // returns HttpHeaders with Bearer token</code></pre>
      </section>

      <!-- ══════════════════════════════════════════
           GUARDS
      ═══════════════════════════════════════════ -->
      <section class="card" id="guards">
        <h2><i class="bi bi-shield-lock"></i> Route guards</h2>
        <div class="guard-grid">
          <div class="guard-card">
            <div class="guard-header">
              <i class="bi bi-lock"></i>
              <h3>AuthGuard</h3>
            </div>
            <p>Synchronous guard. Reads <code>authToken</code> and <code>userId</code> from
              <code>localStorage</code>. Redirects to <code>/login?returnUrl=...</code> if
              either is missing.</p>
            <h4>Protected routes</h4>
            <ul>
              <li><code>/qr-codes/*</code> (QR list, wizards, shops, analytics)</li>
              <li><code>/settings</code></li>
              <li><code>/qr-codes/loyalty-program/:id/registration/:regId</code></li>
            </ul>
            <pre><code>{{ codeBlocks.authGuard }}</code></pre>
          </div>

          <div class="guard-card">
            <div class="guard-header">
              <i class="bi bi-shield-fill-check"></i>
              <h3>AdminGuard</h3>
            </div>
            <p>Async guard. Calls the API server-side to verify admin status — prevents
              client-side localStorage tampering. Shows a SweetAlert2 dialog on denial,
              then redirects to <code>/qr-codes/type</code>.</p>
            <h4>Protected routes</h4>
            <ul>
              <li><code>/admin/system-settings</code></li>
              <li><code>/admin/users/*</code></li>
              <li><code>/admin/roles/*</code></li>
              <li><code>/admin/qr-codes/*</code></li>
              <li><code>/admin/email-configuration/*</code></li>
              <li><code>/qr-codes/loyalty-program-dashboard</code></li>
            </ul>
            <pre><code>{{ codeBlocks.adminGuard }}</code></pre>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           AUTH INTERCEPTOR
      ═══════════════════════════════════════════ -->
      <section class="card" id="interceptor">
        <h2><i class="bi bi-arrow-left-right"></i> Auth interceptor</h2>
        <p>
          <code>src/app/interceptors/auth.interceptor.ts</code> is registered in <code>AppModule</code>
          as an <code>HTTP_INTERCEPTORS</code> provider. It runs before every outgoing HTTP request.
        </p>

        <h3>What it does</h3>
        <ol>
          <li><strong>Reads token</strong> from <code>localStorage.authToken</code>.</li>
          <li><strong>Validates expiry</strong> — decodes the JWT payload and checks <code>exp</code>. If expired, redirects to <code>/login</code> before the request fires.</li>
          <li><strong>Injects header</strong> — clones the request with <code>Authorization: Bearer &lt;token&gt;</code>.</li>
          <li><strong>Handles 401 / code 210</strong> — on <code>HttpErrorResponse</code> with status <code>401</code> or body <code>statusTerm === 'error_securityTokenExpiry'</code>, clears localStorage and redirects once (singleton flag prevents double-redirect).</li>
        </ol>

        <h3>localStorage keys the interceptor uses</h3>
        <table>
          <thead><tr><th>Key</th><th>Content</th><th>Set by</th></tr></thead>
          <tbody>
            <tr><td><code>authToken</code></td><td>JWT Bearer token string</td><td>Login / Register response</td></tr>
            <tr><td><code>userId</code></td><td>Numeric user ID</td><td>Login / Register response</td></tr>
            <tr><td><code>licenseId</code></td><td>Active license ID</td><td>Login / Register response</td></tr>
            <tr><td><code>userRoleName</code></td><td>Role label string</td><td>Login response</td></tr>
            <tr><td><code>roleId</code></td><td>Numeric role ID</td><td>Login response</td></tr>
          </tbody>
        </table>

        <div class="warning-box">
          <i class="bi bi-exclamation-triangle"></i>
          <div>
            All sensitive identity data lives in <code>localStorage</code> (not <code>sessionStorage</code>
            or cookies). Clear it entirely on logout —
            any leftover key can cause the guard or interceptor to misread auth state.
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           SHARED COMPONENTS
      ═══════════════════════════════════════════ -->
      <section class="card" id="shared">
        <h2><i class="bi bi-puzzle"></i> Shared components</h2>
        <p>
          80+ reusable components live under <code>src/app/shared/</code> and are exported by
          <code>SharedModule</code>. Import <code>SharedModule</code> in any feature module to
          access all of them.
        </p>

        <div class="shared-grid">
          <div *ngFor="let cat of sharedCategories" class="shared-cat">
            <div class="cat-header">
              <i class="bi" [ngClass]="cat.icon"></i>
              <h4>{{ cat.name }}</h4>
            </div>
            <ul>
              <li *ngFor="let c of cat.components">
                <code>{{ c }}</code>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           i18n
      ═══════════════════════════════════════════ -->
      <section class="card" id="i18n">
        <h2><i class="bi bi-globe2"></i> Internationalisation (i18n)</h2>
        <p>
          The app uses <code>@ngx-translate/core 17</code> with a custom
          <code>CustomTranslateLoader</code> that fetches JSON files from
          <code>/assets/i18n/{{ '{' }}lang{{ '}' }}.json</code>.
        </p>

        <h3>Supported languages</h3>
        <table>
          <thead><tr><th>File</th><th>Language</th><th>Code</th></tr></thead>
          <tbody>
            <tr><td><code>assets/i18n/en.json</code></td><td>English</td><td><code>en</code></td></tr>
            <tr><td><code>assets/i18n/zh.json</code></td><td>Chinese (Simplified)</td><td><code>zh</code></td></tr>
            <tr><td><code>assets/i18n/my.json</code></td><td>Myanmar (Burmese)</td><td><code>my</code></td></tr>
          </tbody>
        </table>

        <h3>How it is wired</h3>
        <pre><code>{{ codeBlocks.translateModule }}</code></pre>

        <h3>Usage in templates and code</h3>
        <pre><code>{{ codeBlocks.translateUsage }}</code></pre>

        <div class="info-box">
          <i class="bi bi-info-circle"></i>
          <div>
            When adding UI text, always add a key to all three JSON files
            (<code>en.json</code>, <code>zh.json</code>, <code>my.json</code>) so the app
            does not fall back to raw keys in non-English locales.
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           PATTERNS
      ═══════════════════════════════════════════ -->
      <section class="card" id="patterns">
        <h2><i class="bi bi-lightbulb"></i> Key development patterns</h2>

        <div class="pattern-list">
          <div *ngFor="let p of patterns" class="pattern-item">
            <div class="pattern-icon"><i class="bi" [ngClass]="p.icon"></i></div>
            <div>
              <h4>{{ p.title }}</h4>
              <p>{{ p.desc }}</p>
              <pre *ngIf="p.code"><code>{{ p.code }}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           DEV COMMANDS
      ═══════════════════════════════════════════ -->
      <section class="card" id="commands">
        <h2><i class="bi bi-terminal"></i> Dev commands</h2>
        <table>
          <thead><tr><th>Command</th><th>What it does</th></tr></thead>
          <tbody>
            <tr><td><code>npm start</code></td><td>Start dev server at <code>http://localhost:4200</code> (hot-reload)</td></tr>
            <tr><td><code>npm run build</code></td><td>Standard production build → <code>dist/smart-qr/</code></td></tr>
            <tr><td><code>npm run build-prod</code></td><td>Production build with 8 GB Node heap (use for large bundles)</td></tr>
            <tr><td><code>npm run build-serve</code></td><td>Dev server with 8 GB heap (prevents OOM on large feature dev)</td></tr>
            <tr><td><code>npm test</code></td><td>Unit tests via Karma + Jasmine</td></tr>
            <tr><td><code>npm run watch</code></td><td>Incremental dev build — watches for changes</td></tr>
            <tr><td><code>npx ng serve --port 4300</code></td><td>Run on alternate port (useful when dev-doc also on 4200)</td></tr>
            <tr><td><code>npx ng generate component path/name</code></td><td>Scaffold a new component (uses local Angular CLI)</td></tr>
            <tr><td><code>npx ng generate service services/name</code></td><td>Scaffold a new service</td></tr>
          </tbody>
        </table>
        <div class="info-box">
          <i class="bi bi-info-circle"></i>
          <div>
            Always use <code>npx ng</code> (not a global <code>ng</code>) to guarantee the project-local
            Angular CLI version (19.2.8) is used and avoid version mismatch warnings.
          </div>
        </div>
      </section>

      <!-- ── Next ── -->
      <section class="card">
        <h2><i class="bi bi-arrow-right-circle"></i> Dig deeper</h2>
        <ul class="next-list">
          <li><a routerLink="/domains/smart-qr-types"><i class="bi bi-ui-checks-grid"></i><span><strong>QR Types domain</strong> — step-wizard deep-dives, SaveQR contract, pending-QR design.</span></a></li>
          <li><a routerLink="/domains/smart-qr-viewers"><i class="bi bi-eye"></i><span><strong>Viewers domain</strong> — per-viewer breakdown, scan analytics, public vs authenticated.</span></a></li>
          <li><a routerLink="/domains/smart-qr-loyalty"><i class="bi bi-award"></i><span><strong>Loyalty domain</strong> — registration, stamps, prizes, redemption, admin approval.</span></a></li>
          <li><a routerLink="/domains/smart-qr-shops"><i class="bi bi-shop"></i><span><strong>Shops domain</strong> — shop, category, product, promotion, parking zone CRUD.</span></a></li>
          <li><a routerLink="/domains/smart-qr-auth"><i class="bi bi-shield-lock"></i><span><strong>Auth domain</strong> — JWT flow, guards, localStorage, token edge cases.</span></a></li>
        </ul>
      </section>

    </div>
  `,
  styles: [`
    /* ─── page ─── */
    .page {margin: 0 auto; }

    .back-link {
      font-size: 13px; color: #6c8cff; text-decoration: none;
      display: inline-flex; align-items: center; gap: 4px; margin-bottom: 14px;
    }
    .back-link:hover { text-decoration: underline; }

    .page-header {
      display: flex; align-items: flex-start; gap: 18px; margin-bottom: 20px;
    }
    .header-icon {
      width: 56px; height: 56px; border-radius: 14px;
      background: linear-gradient(135deg, #6c8cff, #4a6cf7);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .header-icon .bi { font-size: 26px; color: #fff; }
    h1 { font-size: 27px; font-weight: 800; color: #1a1f36; margin: 0 0 8px; }
    .subtitle { font-size: 14px; color: #666; margin: 0; line-height: 1.65; max-width: 780px; }
    .subtitle strong { color: #1a1f36; }

    /* ─── toc strip ─── */
    .toc-strip {
      display: flex; flex-wrap: wrap; gap: 6px;
      background: #fff; border-radius: 10px; padding: 12px 16px;
      margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      border: 1px solid #e8ebf5;
    }
    .toc-strip a {
      font-size: 12px; font-weight: 600; color: #6c8cff;
      text-decoration: none; padding: 4px 10px; border-radius: 6px;
      background: rgba(108,140,255,0.06); border: 1px solid rgba(108,140,255,0.15);
      white-space: nowrap; transition: background 0.15s, color 0.15s;
    }
    .toc-strip a:hover { background: #6c8cff; color: #fff; }

    /* ─── cards ─── */
    .card {
      background: #fff; border-radius: 14px; padding: 26px 30px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06); margin-bottom: 16px;
      border: 1px solid #e8ebf5;
    }
    .card h2 {
      font-size: 18px; font-weight: 700; color: #1a1f36;
      margin: 0 0 18px; padding-bottom: 12px; border-bottom: 2px solid #f0f2f7;
      display: flex; align-items: center; gap: 10px;
    }
    .card h2 .bi { color: #6c8cff; }
    .card h3 { font-size: 14px; font-weight: 700; color: #1a1f36; margin: 20px 0 8px; }
    .card h4 { font-size: 13px; font-weight: 700; color: #374151; margin: 12px 0 6px; }
    .card p { font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 10px; }
    .card ul { padding-left: 20px; margin: 0 0 10px; font-size: 13px; color: #555; }
    .card li { margin-bottom: 4px; line-height: 1.6; }
    .card a { color: #6c8cff; font-weight: 500; text-decoration: none; }
    .card a:hover { text-decoration: underline; }

    code {
      background: #f0f3ff; color: #4a6cf7;
      padding: 2px 6px; border-radius: 4px; font-size: 12.5px;
    }
    pre {
      background: #1a1f36; border-radius: 10px;
      padding: 16px 20px; overflow-x: auto; margin: 10px 0 0;
    }
    pre code { background: none; color: #e0e6ff; padding: 0; font-size: 12.5px; line-height: 1.6; }

    /* ─── alerts ─── */
    .info-box, .warning-box {
      display: flex; gap: 12px; padding: 13px 16px;
      border-radius: 10px; font-size: 13.5px; line-height: 1.6;
    }
    .info-box { background: #f0f5ff; border-left: 4px solid #6c8cff; color: #2d4fce; }
    .info-box > i { color: #6c8cff; font-size: 16px; margin-top: 2px; flex-shrink: 0; }
    .warning-box { background: #fff8e1; border-left: 4px solid #f9a825; color: #7a5c00; }
    .warning-box > i { color: #f9a825; font-size: 16px; margin-top: 2px; flex-shrink: 0; }

    /* ─── tech stack ─── */
    .stack-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 10px;
    }
    .stack-card {
      display: flex; align-items: center; gap: 12px;
      background: #f8f9ff; border: 1px solid #e8ebf5;
      border-radius: 10px; padding: 12px 14px;
    }
    .stack-icon {
      width: 38px; height: 38px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .stack-icon .bi { font-size: 18px; }
    .stack-name { font-size: 13px; font-weight: 700; color: #1a1f36; }
    .stack-version { font-size: 11px; color: #999; margin-top: 2px; }

    /* ─── route table ─── */
    .route-table { margin-bottom: 10px; }
    .route-row {
      display: flex; align-items: baseline; gap: 12px;
      padding: 7px 12px; border-radius: 7px; font-size: 13px;
    }
    .route-row:nth-child(odd) { background: #f8f9ff; }
    .route-path { color: #4a6cf7; font-family: monospace; font-size: 12.5px; min-width: 340px; flex-shrink: 0; }
    .route-component { color: #374151; font-weight: 600; flex: 1; }
    .route-note { color: #aaa; font-size: 12px; white-space: nowrap; }
    .route-table.compact .route-path { min-width: 280px; }
    .route-note-text { font-size: 13px; color: #888; margin: 4px 0 0; }

    /* ─── wizard flow ─── */
    .wizard-flow {
      display: flex; align-items: center; gap: 8px;
      background: #f8f9ff; border-radius: 12px; padding: 18px 20px;
      margin: 12px 0 20px; flex-wrap: wrap;
    }
    .wf-box {
      background: #fff; border: 1px solid #e0e4ec; border-radius: 8px;
      padding: 10px 16px; text-align: center; min-width: 120px;
    }
    .wf-box.primary { border-color: #6c8cff; background: rgba(108,140,255,0.05); }
    .wf-box.success { border-color: #22c55e; background: rgba(34,197,94,0.05); }
    .wf-label { font-size: 13px; font-weight: 700; color: #1a1f36; }
    .wf-sub { font-size: 11px; color: #999; margin-top: 3px; }
    .wf-arrow { color: #bbb; font-size: 14px; }

    /* ─── QR type cards ─── */
    .type-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 10px;
    }
    .type-card {
      display: flex; gap: 12px; padding: 14px 16px;
      background: #f8f9ff; border: 1px solid #e8ebf5; border-radius: 10px;
    }
    .type-icon {
      width: 38px; height: 38px; border-radius: 9px;
      background: rgba(108,140,255,0.1);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .type-icon .bi { font-size: 18px; color: #6c8cff; }
    .type-name { font-size: 13px; font-weight: 700; color: #1a1f36; }
    .type-path { font-size: 11.5px; margin: 2px 0 4px; }
    .type-path code { font-size: 11px; }
    .type-desc { font-size: 12px; color: #888; line-height: 1.5; }

    /* ─── viewers ─── */
    .viewer-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }
    .viewer-card {
      background: #f8f9ff; border: 1px solid #e8ebf5; border-radius: 10px; padding: 16px;
    }
    .viewer-header { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 8px; }
    .viewer-icon {
      width: 36px; height: 36px; background: rgba(108,140,255,0.1); border-radius: 8px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .viewer-icon .bi { font-size: 16px; color: #6c8cff; }
    .viewer-name { font-size: 13px; font-weight: 700; color: #1a1f36; }
    .viewer-route { font-size: 11px; color: #4a6cf7; display: block; margin-top: 2px; }
    .viewer-desc { font-size: 12px; color: #777; line-height: 1.55; margin: 0 0 8px; }
    .viewer-tags { display: flex; flex-wrap: wrap; gap: 5px; }
    .vtag {
      background: rgba(108,140,255,0.08); border: 1px solid rgba(108,140,255,0.18);
      color: #4a6cf7; font-size: 11px; font-weight: 600;
      padding: 2px 8px; border-radius: 10px;
    }

    /* ─── services ─── */
    .service-list { margin-bottom: 14px; }
    .service-row {
      display: flex; gap: 16px; padding: 8px 12px; border-radius: 7px; font-size: 13px;
    }
    .service-row:nth-child(odd) { background: #f8f9ff; }
    .svc-name { min-width: 260px; flex-shrink: 0; }
    .svc-desc { color: #555; flex: 1; }

    /* ─── guards ─── */
    .guard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .guard-card {
      background: #f8f9ff; border: 1px solid #e8ebf5; border-radius: 12px; padding: 18px;
    }
    .guard-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .guard-header .bi { font-size: 20px; color: #6c8cff; }
    .guard-header h3 { font-size: 15px; font-weight: 700; color: #1a1f36; margin: 0; }
    .guard-card p { font-size: 13px; line-height: 1.6; color: #555; margin: 0 0 10px; }
    .guard-card h4 { font-size: 12px; font-weight: 700; color: #374151; margin: 10px 0 5px; }
    .guard-card ul { padding-left: 18px; margin: 0 0 10px; }
    .guard-card li { font-size: 12px; color: #666; margin-bottom: 3px; }

    /* ─── shared components ─── */
    .shared-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;
    }
    .shared-cat {
      background: #f8f9ff; border: 1px solid #e8ebf5; border-radius: 10px; padding: 14px 16px;
    }
    .cat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
    .cat-header .bi { font-size: 16px; color: #6c8cff; }
    .cat-header h4 { font-size: 13px; font-weight: 700; color: #1a1f36; margin: 0; }
    .shared-cat ul { padding-left: 0; list-style: none; margin: 0; }
    .shared-cat li { font-size: 12px; color: #666; padding: 2px 0; }
    .shared-cat li code { font-size: 11px; }

    /* ─── patterns ─── */
    .pattern-list { display: flex; flex-direction: column; gap: 14px; }
    .pattern-item { display: flex; gap: 14px; }
    .pattern-icon {
      width: 36px; height: 36px; border-radius: 9px;
      background: rgba(108,140,255,0.08);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;
    }
    .pattern-icon .bi { font-size: 17px; color: #6c8cff; }
    .pattern-item h4 { font-size: 14px; font-weight: 700; color: #1a1f36; margin: 0 0 4px; }
    .pattern-item p { font-size: 13px; color: #666; margin: 0; line-height: 1.6; }
    .pattern-item pre { margin: 8px 0 0; }

    /* ─── tables ─── */
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 0 0 10px; }
    th {
      text-align: left; padding: 9px 12px; background: #f5f7fa;
      border-bottom: 2px solid #e0e4ec; font-weight: 700; color: #374151;
    }
    td { padding: 8px 12px; border-bottom: 1px solid #f0f2f7; color: #444; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafbff; }

    /* ─── next ─── */
    .next-list { list-style: none; padding: 0; margin: 0; }
    .next-list li { margin-bottom: 8px; }
    .next-list a {
      display: flex; align-items: center; gap: 12px; padding: 11px 14px;
      border-radius: 10px; background: #f8f9ff; border: 1px solid #e8ebf5;
      color: inherit; text-decoration: none; transition: background 0.15s, border-color 0.15s;
    }
    .next-list a:hover { background: #eef1ff; border-color: #c0d0ff; }
    .next-list .bi { font-size: 17px; color: #6c8cff; flex-shrink: 0; }
    .next-list span { font-size: 13.5px; color: #444; }
    .next-list strong { color: #1a1f36; }

    @media (max-width: 768px) {
      .card { padding: 18px 16px; }
      .guard-grid { grid-template-columns: 1fr; }
      .route-path { min-width: 180px !important; }
      .svc-name { min-width: 180px; }
    }
  `]
})
export class FrontendDevComponent {

  codeBlocks = {
    authGuard: `// auth.guard.ts pattern
if (this.commonService.isAuthenticated()) return true;
router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
return false;`,

    adminGuard: `// admin.guard.ts pattern (async)
const isAdmin = await this.commonService.checkIsAdminAsync();
if (!isAdmin) {
  Swal.fire('Access Denied', ...);
  router.navigate(['/qr-codes/type']);
  return false;
}
return true;`,

    translateModule: `// app.module.ts
TranslateModule.forRoot({
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,  // loads /assets/i18n/{lang}.json
    deps: [HttpClient]
  }
})`,

    translateUsage: `<!-- Template -->
<span>{{ 'LABEL_KEY' | translate }}</span>

// Component
this.translateService.instant('LABEL_KEY')
this.translateService.get('LABEL_KEY').subscribe(v => ...)

// Switch language
this.translationService.setLanguage('zh')   // custom wrapper in translation.service.ts`,
  };

  techStack = [
    { name: 'Angular', version: '19.2.0 (NgModule)', icon: 'bi-layers', color: '#dd0031', bg: 'rgba(221,0,49,0.08)' },
    { name: 'TypeScript', version: '5.7.2', icon: 'bi-filetype-ts', color: '#3178c6', bg: 'rgba(49,120,198,0.08)' },
    { name: 'Bootstrap', version: '5.3.8', icon: 'bi-bootstrap', color: '#7952b3', bg: 'rgba(121,82,179,0.08)' },
    { name: 'ngx-translate', version: '17.0.0', icon: 'bi-globe2', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
    { name: 'Chart.js', version: '4.5.1', icon: 'bi-bar-chart-line', color: '#ff6384', bg: 'rgba(255,99,132,0.08)' },
    { name: 'qr-code-styling', version: '1.8.0', icon: 'bi-qr-code', color: '#6c8cff', bg: 'rgba(108,140,255,0.08)' },
    { name: 'SweetAlert2', version: '11.26.3', icon: 'bi-bell', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    { name: 'moment.js', version: '2.30.1', icon: 'bi-clock', color: '#607d8b', bg: 'rgba(96,125,139,0.08)' },
  ];

  routes = {
    auth: [
      { path: '/login',            component: 'LoginComponent',           note: '' },
      { path: '/register',         component: 'LoginV2Component',         note: 'sign-up flow' },
      { path: '/forgot-password',  component: 'ForgotPasswordComponent',  note: '' },
      { path: '/set-password',     component: 'SetPasswordComponent',     note: '' },
    ],
    typeSelector: [
      { path: '/',                    component: '→ redirects to /qr-codes/type', note: '' },
      { path: '/qr-codes',            component: 'QrCodeListComponent',          note: 'user QR list' },
      { path: '/qr-codes/type',       component: 'QrCodesTypeComponent',         note: 'type picker' },
      { path: '/qr-codes/type/:lang', component: 'QrCodesTypeComponent',         note: 'language-prefixed entry' },
    ],
    wizardCreate: [
      { path: '/qr-codes/type/website',                      component: 'WebsiteStepOneComponent' },
      { path: '/qr-codes/type/website/customize',            component: 'WebsiteStepTwoComponent' },
      { path: '/qr-codes/type/v-card',                       component: 'VCardStepOneComponent' },
      { path: '/qr-codes/type/v-card/customize',             component: 'VCardStepTwoComponent' },
      { path: '/qr-codes/type/image-gallery',                component: 'ImageGalleryStepOneComponent' },
      { path: '/qr-codes/type/image-gallery/customize',      component: 'ImageGalleryStepTwoComponent' },
      { path: '/qr-codes/type/menu',                         component: 'MenuStepOneComponent' },
      { path: '/qr-codes/type/menu/customize',               component: 'MenuStepTwoComponent' },
      { path: '/qr-codes/type/event',                        component: 'EventStepOneComponent' },
      { path: '/qr-codes/type/event/customize',              component: 'EventStepTwoComponent' },
      { path: '/qr-codes/type/service-feedback',             component: 'ServiceFeedbackStepOneComponent' },
      { path: '/qr-codes/type/service-feedback/customize',   component: 'ServiceFeedbackStepTwoComponent' },
      { path: '/qr-codes/type/loyalty-program',              component: 'LoyaltyStepOneComponent' },
      { path: '/qr-codes/type/loyalty-program/customize',    component: 'LoyaltyStepTwoComponent' },
      { path: '/qr-codes/type/content-system',               component: 'ContentStepOneComponent' },
      { path: '/qr-codes/type/content-system/customize',     component: 'ContentStepTwoComponent' },
    ],
    viewers: [
      { path: '/menu/:id',                 component: 'MenuViewerComponent',            note: 'public menu + cart' },
      { path: '/menu/:id/g/:guestToken',   component: 'MenuViewerComponent',            note: 'guest token access' },
      { path: '/gallery/:data',            component: 'GalleryViewerComponent',         note: 'slide or scroll mode' },
      { path: '/vcard/:id',                component: 'VcardViewerComponent',           note: 'digital business card' },
      { path: '/website/:id',              component: 'WebsiteViewerComponent',         note: 'external URL redirect' },
      { path: '/event/:id',                component: 'EventViewerComponent',           note: 'registration + capacity' },
      { path: '/loyalty/:id',              component: 'LoyaltyViewerComponent',         note: 'stamp card + rewards' },
      { path: '/feedback/:id',             component: 'ServiceFeedbackViewerComponent', note: 'feedback form' },
      { path: '/content/:id',              component: 'ContentViewerComponent',         note: 'multi-section + shops + map' },
    ],
    shops: [
      { path: '/qr-codes/shops/:qrCodeID',                              component: 'ShopsConfigurationComponent' },
      { path: '/qr-codes/shops/:qrCodeID/shop-management',              component: 'ShopManagementComponent' },
      { path: '/qr-codes/shops/:qrCodeID/category-management',          component: 'CategoryManagementComponent' },
      { path: '/qr-codes/shops/:qrCodeID/product-management',           component: 'ProductManagementComponent' },
      { path: '/qr-codes/shops/:qrCodeID/location-management',          component: 'LocationManagementComponent' },
      { path: '/qr-codes/shops/:qrCodeID/map-management',               component: 'MapManagementComponent' },
    ],
    loyalty: [
      { path: '/qr-codes/loyalty-program/:id/registration/:regId', component: 'LoyaltyRegistrationComponent', note: 'AuthGuard' },
      { path: '/qr-codes/loyalty-program-dashboard',                component: 'LoyaltyDashboardComponent',    note: 'AdminGuard' },
      { path: '/loyalty-report-demo',                               component: 'LoyaltyReportDemoComponent',   note: 'public demo' },
    ],
    admin: [
      { path: '/admin/system-settings',               component: 'SystemSettingsComponent' },
      { path: '/admin/users/list',                    component: 'UserListComponent' },
      { path: '/admin/users/create',                  component: 'CreateUserComponent' },
      { path: '/admin/users/roles',                   component: 'UserRolesComponent' },
      { path: '/admin/roles/list',                    component: 'RoleListComponent' },
      { path: '/admin/roles/create',                  component: 'CreateRoleComponent' },
      { path: '/admin/qr-codes/list',                 component: 'QRCodeListComponent' },
      { path: '/admin/qr-codes/view/:id',             component: 'QRCodeViewComponent' },
      { path: '/admin/qr-codes/types',                component: 'QRTypeListComponent' },
      { path: '/admin/qr-codes/types/create',         component: 'QRTypeFormComponent' },
      { path: '/admin/qr-codes/types/edit/:id',       component: 'QRTypeFormComponent' },
      { path: '/admin/email-configuration/settings',  component: 'EmailSettingsComponent' },
      { path: '/admin/email-configuration/templates', component: 'EmailTemplatesComponent' },
    ],
  };

  qrTypes = [
    { name: 'Website',          path: '/qr-codes/type/website',          icon: 'bi-globe',              desc: 'URL redirect. Step-one: URL + metadata. Step-two: QR design.' },
    { name: 'V-Card',           path: '/qr-codes/type/v-card',           icon: 'bi-person-badge',       desc: 'Digital contact card. Step-one: contact fields. Step-two: design.' },
    { name: 'Image Gallery',    path: '/qr-codes/type/image-gallery',    icon: 'bi-images',             desc: 'Photo gallery with slide and scroll viewer modes.' },
    { name: 'Menu',             path: '/qr-codes/type/menu',             icon: 'bi-menu-button-wide',   desc: 'Restaurant menu linked to the shops/catalog submodule.' },
    { name: 'Event',            path: '/qr-codes/type/event',            icon: 'bi-calendar-event',     desc: 'Event info + registration form with capacity tracking.' },
    { name: 'Service Feedback', path: '/qr-codes/type/service-feedback', icon: 'bi-chat-left-text',     desc: 'Customer feedback form with rating and text fields.' },
    { name: 'Loyalty Program',  path: '/qr-codes/type/loyalty-program',  icon: 'bi-award',              desc: 'Stamp card with prizes, redemptions, and admin approval.' },
    { name: 'Content System',   path: '/qr-codes/type/content-system',   icon: 'bi-file-richtext',      desc: 'Multi-section page — hero, sections, promotions, parking, shops.' },
  ];

  viewerTypes = [
    {
      name: 'Menu Viewer', route: '/menu/:id', icon: 'bi-menu-button-wide',
      desc: 'Renders shop categories, products, and a cart. Guests can place orders via SubmitMenuOrder. Supports guest tokens for pre-auth session.',
      tags: ['public', 'shopping cart', 'guest token'],
    },
    {
      name: 'Gallery Viewer', route: '/gallery/:data', icon: 'bi-images',
      desc: 'Displays uploaded images in slide or scroll mode. The :data param encodes QR ID and display mode.',
      tags: ['public', 'slide mode', 'scroll mode'],
    },
    {
      name: 'V-Card Viewer', route: '/vcard/:id', icon: 'bi-person-badge',
      desc: 'Shows contact card fields with a "Save to Contacts" button that generates a .vcf file for download.',
      tags: ['public', '.vcf download'],
    },
    {
      name: 'Website Viewer', route: '/website/:id', icon: 'bi-globe',
      desc: 'Redirects or embeds the target URL. Used as a landing page between QR scan and the destination.',
      tags: ['public', 'redirect'],
    },
    {
      name: 'Event Viewer', route: '/event/:id', icon: 'bi-calendar-event',
      desc: 'Shows event info, remaining capacity gauge, and a registration form. Calls RegisterForEvent on submit.',
      tags: ['public', 'capacity gauge', 'registration'],
    },
    {
      name: 'Loyalty Viewer', route: '/loyalty/:id', icon: 'bi-award',
      desc: 'Stamp card UI — users can register, view stamps, check prizes, and redeem rewards.',
      tags: ['public', 'stamps', 'rewards'],
    },
    {
      name: 'Feedback Viewer', route: '/feedback/:id', icon: 'bi-chat-left-text',
      desc: 'Service feedback form. Calls ServiceFeedbackApi on submit. Results visible in admin analytics.',
      tags: ['public', 'feedback form'],
    },
    {
      name: 'Content Viewer', route: '/content/:id', icon: 'bi-file-richtext',
      desc: 'Multi-section renderer: hero, sections, shop list, promotions, parking zones, and map. Sub-viewers handle each section.',
      tags: ['public', 'multi-section', 'map', 'promotions'],
    },
  ];

  services = [
    { file: 'qr-code.service.ts',        desc: 'Central hub — all SmartQRApi HTTP calls, QR generation (qr-code-styling), loyalty, menu, events, shops.' },
    { file: 'common.service.ts',          desc: 'Auth helpers: isAuthenticated(), getToken(), checkIsAdminAsync(), getAuthHeaders().' },
    { file: 'translation.service.ts',     desc: 'Active locale management; wraps ngx-translate setLanguage/instant.' },
    { file: 'notification.service.ts',    desc: 'Toast/alert wrapper — abstracts SweetAlert2 for consistent UI messages.' },
    { file: 'image-compression.service.ts', desc: 'Client-side image resize/compress before upload (respects allowFilesize env setting).' },
    { file: 'indexed-db.service.ts',      desc: 'Persists pending QR data via IndexedDB for the pre-login wizard queue.' },
    { file: 'user-management.service.ts', desc: 'User CRUD — list, create, update, delete users; password resets.' },
    { file: 'role-management.service.ts', desc: 'Role and permission CRUD for the admin module.' },
    { file: 'email-settings.service.ts',  desc: 'Email provider config and SMTP/SES settings management.' },
    { file: 'mall-map.service.ts',        desc: 'Map zone and parking data for the content QR type.' },
  ];

  sharedCategories = [
    {
      name: 'QR Previews', icon: 'bi-eye',
      components: ['qr-preview-website', 'qr-preview-vcard', 'qr-preview-gallery', 'qr-preview-menu', 'qr-preview-event', 'qr-preview-loyalty', 'qr-preview-service-feedback', 'qr-preview-content'],
    },
    {
      name: 'QR Customisation', icon: 'bi-palette',
      components: ['qr-pattern', 'qr-logo', 'qr-frame', 'qr-frame-preview', 'color-picker'],
    },
    {
      name: 'Analytics', icon: 'bi-bar-chart-line',
      components: ['card-analytics', 'qr-code-statistics', 'qr-scans-line-chart', 'qr-geographic-analytics', 'qr-service-feedback-analytics', 'qr-code-status-distribution'],
    },
    {
      name: 'Event components', icon: 'bi-calendar-event',
      components: ['event-customize-design', 'event-mockup-frame', 'event-capacity-gauge', 'event-register-form-config', 'event-qr-dashboard', 'event-registration-timeline-chart'],
    },
    {
      name: 'Loyalty components', icon: 'bi-award',
      components: ['loyalty-customize-design', 'loyalty-mockup-frame', 'loyalty-prize-config', 'loyalty-stamp-design', 'loyalty-register-form', 'loyalty-registrations-list'],
    },
    {
      name: 'Menu / Content', icon: 'bi-menu-button-wide',
      components: ['menu-customize-design', 'menu-mockup-frame', 'content-hero-config', 'content-section-config', 'content-promotions-tab', 'content-parking-tab', 'content-shops-tab'],
    },
    {
      name: 'Layout & Utility', icon: 'bi-grid-1x2',
      components: ['filter', 'notification', 'progress-bar', 'floating-mascot', 'user-profile-header', 'image-upload-modal', 'social-network'],
    },
  ];

  patterns = [
    {
      icon: 'bi-diagram-2',
      title: 'All HTTP calls through QrCodeService',
      desc: 'Do not make raw HttpClient calls from components. Import QrCodeService and call the appropriate method. This keeps the API contract in one place and makes mocking straightforward for tests.',
      code: null,
    },
    {
      icon: 'bi-arrow-repeat',
      title: 'Wizard state via service (not router state)',
      desc: 'Step-one stores its form values in QrCodeService before navigating to step-two. Step-two reads from the same service. On save, both steps clear the service state.',
      code: null,
    },
    {
      icon: 'bi-shield',
      title: 'Never trust client-side admin check alone',
      desc: 'AdminGuard calls the server to verify admin status. Do not gate admin features on localStorage.userRoleName alone — it can be tampered. AdminGuard already handles this.',
      code: null,
    },
    {
      icon: 'bi-eye-slash',
      title: 'hideLayout: true for viewer routes',
      desc: 'Public viewer pages set data: { hideLayout: true } in their route config. AppComponent reads this data property to hide the navbar and sidebar for a clean scan experience.',
      code: `// app-routing.module.ts
{
  path: 'menu/:id',
  component: MenuViewerComponent,
  data: { hideLayout: true }
}`,
    },
    {
      icon: 'bi-translate',
      title: 'Always add keys to all three i18n files',
      desc: 'When adding UI text, write the key in en.json, zh.json, and my.json before submitting. Missing keys render the raw key string in non-English locales.',
      code: null,
    },
    {
      icon: 'bi-box-arrow-in-right',
      title: 'Pending QR survives login',
      desc: 'Visitors who start a wizard unauthenticated have their QR data saved to IndexedDB. After registration/login, the app checks IndexedDB and auto-saves the pending QR. Do not clear IndexedDB state prematurely in new auth flows.',
      code: null,
    },
  ];
}
