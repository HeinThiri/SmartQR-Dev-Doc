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
            On <a routerLink="/domains">Domains</a>, open the <strong>Smart QR — …</strong> entries (overview, auth, types, viewers, loyalty, shops, admin) for features, API notes, and Q&amp;A indexed in search.
            To add more packs, see
            <a routerLink="/how-to-doc">How to Doc?</a>.
          </div>
        </div>
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
          <li><a routerLink="/common-features">Common Features</a> — shared platform behaviors</li>
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
