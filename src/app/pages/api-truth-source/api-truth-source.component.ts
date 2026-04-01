import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-api-truth-source',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-qr-hub" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart QR hub
      </a>
      <h1><i class="bi bi-braces-asterisk"></i> API truth source</h1>
      <p class="subtitle">
        Single source of truth for Smart QR endpoint references, auth conventions, and error catalog.
      </p>

      <section class="card">
        <h2>Single maintained list</h2>
        <p>
          Master endpoint list is maintained in:
          <code>src/assets/content/api/master-api-reference.json</code>
        </p>
        <ul>
          <li>If OpenAPI is available, import/transform from that source into the same file.</li>
          <li>If OpenAPI is not available, maintain this JSON directly from validated backend contracts.</li>
          <li>Domain-level <code>api-reference.json</code> files are considered curated views derived from this master list.</li>
        </ul>
      </section>

      <section class="card">
        <h2>Auth convention (applies to endpoint descriptions)</h2>
        <table>
          <thead>
            <tr><th>Scheme</th><th>When used</th><th>Documentation rule</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Bearer JWT</code></td>
              <td>Authenticated owner/admin APIs</td>
              <td>Include header: <code>Authorization: Bearer &lt;token&gt;</code>.</td>
            </tr>
            <tr>
              <td><code>Cookie session</code></td>
              <td>If backend enables cookie auth</td>
              <td>Mark endpoint as cookie-auth and include CSRF requirement if applicable.</td>
            </tr>
            <tr>
              <td><code>Public</code></td>
              <td>Viewer-facing reads (e.g. <code>GetQRPublic</code>)</td>
              <td>Explicitly state “No auth required” and note server-side filtering constraints.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="card">
        <h2>Error catalog</h2>
        <p>Use this baseline across Smart QR docs. Extend codes as backend formalizes business errors.</p>
        <table>
          <thead>
            <tr><th>HTTP</th><th>Business code</th><th>Meaning</th><th>Client action</th></tr>
          </thead>
          <tbody>
            <tr><td><code>400</code></td><td><code>VALIDATION_ERROR</code></td><td>Payload or field invalid</td><td>Show inline validation and block submit.</td></tr>
            <tr><td><code>401</code></td><td><code>AUTH_REQUIRED</code></td><td>Token missing/expired</td><td>Redirect login, clear stale token.</td></tr>
            <tr><td><code>403</code></td><td><code>ACCESS_DENIED</code></td><td>Insufficient role/ownership</td><td>Show permission message, hide action.</td></tr>
            <tr><td><code>404</code></td><td><code>RESOURCE_NOT_FOUND</code></td><td>ID not found or deleted</td><td>Show not-found state.</td></tr>
            <tr><td><code>409</code></td><td><code>DUPLICATE_ACTION</code></td><td>Duplicate register/redeem/order</td><td>Treat idempotently, show existing result.</td></tr>
            <tr><td><code>429</code></td><td><code>RATE_LIMITED</code></td><td>Too many attempts</td><td>Backoff + retry later.</td></tr>
            <tr><td><code>500</code></td><td><code>INTERNAL_ERROR</code></td><td>Unhandled server failure</td><td>Show generic error + log correlation id.</td></tr>
          </tbody>
        </table>
      </section>

      <section class="card">
        <h2>Implementation checklist</h2>
        <ul>
          <li>Keep <code>master-api-reference.json</code> updated first.</li>
          <li>Ensure each endpoint description marks one auth mode: Bearer, Cookie(+CSRF), or Public.</li>
          <li>Map endpoint failures to the shared error catalog with HTTP + business code.</li>
        </ul>
      </section>
    </div>
  `,
  styles: [`
    .page { max-width: 980px; margin: 0 auto; }
    .back-link {
      font-size: 13px; color: #6c8cff; text-decoration: none;
      display: inline-flex; align-items: center; gap: 4px; margin-bottom: 12px;
    }
    .back-link:hover { text-decoration: underline; }
    h1 { font-size: 28px; font-weight: 700; color: #1a1f36; margin: 0 0 8px; }
    h1 i { margin-right: 8px; color: #6c8cff; }
    .subtitle { font-size: 15px; color: #666; margin: 0 0 24px; line-height: 1.5; }
    .card {
      background: #fff; border-radius: 14px; padding: 24px 28px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06); margin-bottom: 16px;
    }
    .card h2 {
      font-size: 20px; font-weight: 700; color: #1a1f36; margin: 0 0 14px;
      padding-bottom: 10px; border-bottom: 2px solid #f0f0f0;
    }
    .card p, .card li { font-size: 14px; color: #444; line-height: 1.7; }
    .card ul { margin: 0; padding-left: 22px; }
    code {
      background: #f0f3ff; color: #4a6cf7; padding: 2px 6px;
      border-radius: 4px; font-size: 12px;
    }
    table { width: 100%; border-collapse: collapse; margin: 0; font-size: 13px; }
    th {
      text-align: left; padding: 10px 12px; background: #f5f7fa;
      border-bottom: 2px solid #e0e4ec; font-weight: 600; color: #444;
    }
    td { padding: 9px 12px; border-bottom: 1px solid #f0f0f0; color: #444; vertical-align: top; }
    tr:hover td { background: #fafbfd; }
  `]
})
export class ApiTruthSourceComponent {}

