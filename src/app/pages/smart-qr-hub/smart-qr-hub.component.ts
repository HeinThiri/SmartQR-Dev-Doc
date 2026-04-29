import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-smart-qr-hub',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/welcome" class="back-link">
        <i class="bi bi-arrow-left"></i> Home
      </a>
      <h1><i class="bi bi-qr-code"></i> Smart QR hub</h1>
      <p class="subtitle">
        Entry point for documentation about the <strong>product</strong> application. Source of truth for behavior and APIs remains
        <code>Smart_QR_UI</code> and your backend; this hub links you into the right areas.
      </p>

      <section class="card">
        <h2>Product codebase</h2>
        <p>Path from repository root:</p>
        <pre><code>Smart_QR_UI/
├── src/app/
│   ├── app.module.ts
│   ├── app-routing.module.ts
│   ├── guards/              # AuthGuard, AdminGuard, …
│   ├── services/          # HTTP and domain services (e.g. qr-code.service)
│   ├── shared/            # Reusable UI (previews, filters, content tabs)
│   └── pages/systematic/modules/
│       ├── qr-code-list/  # QR types, wizards, viewers, loyalty, shops
│       ├── admin/         # Users, roles, QR admin, email, system settings
│       ├── auth/          # Login, password flows
│       ├── analytics/
│       └── settings/</code></pre>
        <div class="info-box">
          <i class="bi bi-info-circle"></i>
          <div>
            On <a routerLink="/domains">Domains</a>, open the <strong>Smart QR — …</strong> entries (auth, types, viewers, loyalty, shops, admin) for features, API notes, and Q&amp;A indexed in search.
            To add more packs, see
            <a routerLink="/how-to-doc">How to Doc?</a>.
          </div>
        </div>
      </section>

      <section class="card">
        <h2>Full repository map (frontend + backend)</h2>
        <pre><code>Smart_QR/
├── Smart_QR_UI/                  # Angular frontend
│   └── src/app/
│       ├── app-routing.module.ts
│       ├── app.module.ts
│       ├── guards/               # AuthGuard, AdminGuard
│       ├── interceptors/         # HTTP/JWT middleware
│       ├── services/             # API clients (qr-code.service, etc.)
│       ├── shared/               # Reusable UI blocks
│       ├── layouts/              # Sidebar/topbar layouts
│       └── pages/systematic/modules/
│           ├── qr-code-list/     # QR create/edit/viewer + loyalty + shops
│           ├── admin/            # Users/roles/QR admin/email/system settings
│           ├── auth/             # login/register/forgot/set-password
│           ├── analytics/
│           └── settings/
├── Smart_QR_API/                 # ASP.NET Core backend
│   ├── Program.cs                # Startup: CORS, JWT, Swagger, services
│   ├── appsettings.json          # DB/JWT/recaptcha/aws config
│   ├── APIs/                     # API controllers and modules
│   ├── DBModels/                 # EF Core entities + context
│   ├── Infrastructure/           # Repositories + core wiring
│   ├── DTO/                      # Request/response contracts
│   ├── Services/                 # Business/service layer
│   ├── Migrations/               # EF migrations
│   └── SQL_Scripts/              # SQL helper scripts
├── SQL/                          # Project SQL and docs
└── smart-qr-dev-doc/             # This developer documentation portal</code></pre>
      </section>

      <section class="card">
        <h2>Frontend module responsibilities</h2>
        <table>
          <thead>
            <tr><th>Area</th><th>Folder</th><th>What to change there</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>QR creation/edit</td>
              <td><code>pages/systematic/modules/qr-code-list/qr-operation/</code></td>
              <td>Step-one / step-two wizard forms, validation, payload building.</td>
            </tr>
            <tr>
              <td>Viewers</td>
              <td><code>pages/systematic/modules/qr-code-list/qr-viewer/</code></td>
              <td>Public rendering of menu, loyalty, website, content, event, feedback, v-card.</td>
            </tr>
            <tr>
              <td>Loyalty admin/detail</td>
              <td><code>pages/systematic/modules/qr-code-list/loyalty-registration-detail/</code></td>
              <td>Registration review, report dashboards, deep links from scanned admin QR.</td>
            </tr>
            <tr>
              <td>Shops/catalog</td>
              <td><code>pages/systematic/modules/qr-code-list/shops-configuration/</code></td>
              <td>Shop/category/product/location/map management for menu/content experiences.</td>
            </tr>
            <tr>
              <td>Administration</td>
              <td><code>pages/systematic/modules/admin/</code></td>
              <td>Users/roles, QR type config, email templates/settings, system settings.</td>
            </tr>
            <tr>
              <td>Auth</td>
              <td><code>pages/systematic/modules/auth/</code></td>
              <td>Login, register, forgot password, set/reset password.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="card">
        <h2>Backend architecture details (Smart_QR_API)</h2>
        <table>
          <thead>
            <tr><th>Concern</th><th>Where in backend</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Startup pipeline</td>
              <td><code>Program.cs</code></td>
              <td>Registers controllers, health checks, Swagger docs, CORS policy, JWT auth, DI services.</td>
            </tr>
            <tr>
              <td>Authentication</td>
              <td><code>Program.cs</code> + auth APIs</td>
              <td>JWT bearer validation (issuer/key/lifetime), consumed by frontend Bearer tokens.</td>
            </tr>
            <tr>
              <td>CORS</td>
              <td><code>Program.cs</code></td>
              <td>Allowed origins combine DB SysConfig + localhost + production/UAT host list.</td>
            </tr>
            <tr>
              <td>Database</td>
              <td><code>DBModels/</code> + <code>ConnectionStrings</code></td>
              <td>EF Core with SQL Server; migration scripts under <code>Migrations/</code>.</td>
            </tr>
            <tr>
              <td>API modules</td>
              <td><code>APIs/</code> + <code>Infrastructure/Repository</code></td>
              <td>Smart QR, authentication, service feedback, admin and other domain endpoints.</td>
            </tr>
            <tr>
              <td>Operational extras</td>
              <td><code>appsettings.json</code></td>
              <td>Hangfire connection, recaptcha, Google auth, email/AWS integration settings.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="card">
        <h2>Request lifecycle (end-to-end)</h2>
        <ol>
          <li><strong>UI route:</strong> User opens a frontend route (wizard/viewer/admin) from <code>app-routing.module.ts</code>.</li>
          <li><strong>Service call:</strong> Component calls a service (primarily <code>qr-code.service.ts</code>).</li>
          <li><strong>API request:</strong> URL built from <code>environment.baseApiUrl</code> + endpoint path.</li>
          <li><strong>Security:</strong> JWT token (for protected routes) validated by backend middleware.</li>
          <li><strong>Business/data:</strong> Backend module + repository + EF context read/write SQL data.</li>
          <li><strong>Response/UI state:</strong> JSON response mapped to frontend models and rendered state.</li>
        </ol>
      </section>

      <section class="card">
        <h2>Where to edit for common tasks</h2>
        <table>
          <thead>
            <tr><th>Task</th><th>Frontend</th><th>Backend</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Add new QR type</td>
              <td><code>qr-codes-type</code>, wizard components, viewer, <code>app-routing.module.ts</code></td>
              <td>SmartQR API endpoints + type mapping/business logic + DB schema if needed</td>
            </tr>
            <tr>
              <td>Change loyalty behavior</td>
              <td><code>loyalty-viewer</code>, registration detail, report demo</td>
              <td>Loyalty endpoints in SmartQR module + validation rules + persistence</td>
            </tr>
            <tr>
              <td>Update order/menu flow</td>
              <td><code>menu-viewer</code>, cart, orders/guest tabs, shops config</td>
              <td>Menu/order/shop/product endpoints + transactional handling</td>
            </tr>
            <tr>
              <td>Adjust login/security</td>
              <td><code>modules/auth</code>, guards, interceptors</td>
              <td>Authentication API + JWT settings + CORS/session policy</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="card">
        <h2>Major route groups (product app)</h2>
        <p>Defined in <code>Smart_QR_UI/src/app/app-routing.module.ts</code>. Examples:</p>
        <table>
          <thead>
            <tr><th>Area</th><th>Typical routes</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>QR types &amp; editor</td>
              <td><code>/qr-codes/type/…</code>, <code>/qr-codes/edit/…</code></td>
              <td>Per-type step-one / step-two wizards</td>
            </tr>
            <tr>
              <td>Viewers</td>
              <td>Menu, website, gallery, event, loyalty, content, …</td>
              <td>Public or guarded depending on route</td>
            </tr>
            <tr>
              <td>Loyalty</td>
              <td><code>/qr-codes/loyalty-program/…</code>, dashboards</td>
              <td>Registration detail, report demos</td>
            </tr>
            <tr>
              <td>Admin</td>
              <td>Users, roles, QR codes, email configuration</td>
              <td>Often behind <code>AdminGuard</code></td>
            </tr>
            <tr>
              <td>Auth</td>
              <td>Login, forgot / set password</td>
              <td>Entry and recovery flows</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="card">
        <h2>Where to go next</h2>
        <ul>
          <li><a routerLink="/getting-started">Getting Started</a> — run the UI and configure environments</li>
          <li><a routerLink="/architecture">Architecture</a> — system and container view</li>
          <li><a routerLink="/deep-dives">Deep dives &amp; diagrams</a> — sequence, data flow, and component hierarchy</li>
          <li><a routerLink="/api-truth-source">API truth source</a> — master API list, auth conventions, and error catalog</li>
          <li><a routerLink="/domains">Browse domains</a> — JSON-driven module docs</li>
        </ul>
      </section>
    </div>
  `,
  styles: [`
    .page { max-width: 900px; margin: 0 auto; }
    .back-link {
      font-size: 13px; color: #6c8cff; text-decoration: none;
      display: inline-flex; align-items: center; gap: 4px; margin-bottom: 12px;
    }
    .back-link:hover { text-decoration: underline; }
    h1 { font-size: 28px; font-weight: 700; color: #1a1f36; margin: 0 0 8px; }
    h1 i { margin-right: 8px; color: #6c8cff; }
    .subtitle { font-size: 15px; color: #666; margin: 0 0 28px; line-height: 1.5; }
    .card {
      background: #fff; border-radius: 14px; padding: 28px 32px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06); margin-bottom: 16px;
    }
    .card h2 {
      font-size: 20px; font-weight: 700; color: #1a1f36; margin: 0 0 16px;
      padding-bottom: 10px; border-bottom: 2px solid #f0f0f0;
    }
    .card p { font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 12px; }
    .card ul { padding-left: 22px; margin: 0; font-size: 14px; color: #444; }
    .card li { margin-bottom: 6px; }
    .card a { color: #6c8cff; font-weight: 500; }
    code {
      background: #f0f3ff; color: #4a6cf7; padding: 2px 7px;
      border-radius: 4px; font-size: 13px;
    }
    pre {
      background: #1a1f36; border-radius: 10px; padding: 18px 22px;
      overflow-x: auto; margin: 0 0 14px;
    }
    pre code { background: none; color: #e0e6ff; padding: 0; font-size: 12px; line-height: 1.5; }
    strong { color: #1a1f36; }
    table { width: 100%; border-collapse: collapse; margin: 0 0 14px; font-size: 13px; }
    th {
      text-align: left; padding: 10px 12px; background: #f5f7fa;
      border-bottom: 2px solid #e0e4ec; font-weight: 600; color: #444;
    }
    td { padding: 9px 12px; border-bottom: 1px solid #f0f0f0; color: #444; vertical-align: top; }
    tr:hover td { background: #fafbfd; }
    .info-box {
      display: flex; gap: 12px; padding: 16px 18px;
      border-radius: 10px; margin: 12px 0; font-size: 14px;
      background: #f0f3ff; border-left: 4px solid #6c8cff;
    }
    .info-box > i { color: #6c8cff; font-size: 18px; margin-top: 2px; flex-shrink: 0; }
  `]
})
export class SmartQrHubComponent {}
