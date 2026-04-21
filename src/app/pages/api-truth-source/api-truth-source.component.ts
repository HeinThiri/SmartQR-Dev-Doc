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
        Single source of truth for Smart QR backend contracts, frontend consumers, auth conventions, and error handling.
      </p>

      <section class="card">
        <h2>1) Source files that define API truth</h2>
        <p>
          Master endpoint list is maintained in:
          <code>src/assets/content/api/master-api-reference.json</code>
        </p>
        <ul>
          <li>Backend implementation source: <code>Smart_QR_API/APIs/SmartQR_Module/SmartQRApi.cs</code>.</li>
          <li>Auth source: <code>Smart_QR_API/APIs/Authentication_Module/AuthenticationApi.cs</code>.</li>
          <li>Service feedback source: <code>Smart_QR_API/APIs/ServiceFeedback_Module/ServiceFeedbackApi.cs</code>.</li>
          <li>Main frontend caller: <code>Smart_QR_UI/src/app/services/qr-code.service.ts</code>.</li>
          <li>Domain-level <code>api-reference.json</code> files are curated views derived from this master list.</li>
        </ul>
      </section>

      <section class="card">
        <h2>2) Backend module ownership (Smart QR scope)</h2>
        <table>
          <thead>
            <tr><th>Backend controller</th><th>Responsibilities</th><th>Example actions</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>SmartQRApi</code></td>
              <td>Core QR lifecycle + type runtimes (menu, loyalty, event, map, promotions, shops/products)</td>
              <td><code>SaveQR</code>, <code>GetQRPublic</code>, <code>SubmitMenuOrder</code>, <code>RegisterForLoyalty</code></td>
            </tr>
            <tr>
              <td><code>AuthenticationApi</code></td>
              <td>Login and password/OTP authentication flows</td>
              <td><code>login</code>, <code>ResetPassword</code>, <code>ResendLoginOtp</code></td>
            </tr>
            <tr>
              <td><code>ServiceFeedbackApi</code></td>
              <td>Feedback submission and owner analytics/reporting</td>
              <td><code>SubmitFeedback</code>, <code>GetFeedbackList</code>, <code>GetFeedbackAnalytics</code></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="card">
        <h2>3) Frontend to backend mapping (high-traffic flows)</h2>
        <table>
          <thead>
            <tr><th>User flow</th><th>Frontend caller</th><th>Backend endpoints</th><th>Auth mode</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Login</td>
              <td><code>login.component.ts</code>, <code>login-v2.component.ts</code></td>
              <td><code>POST /AuthenticationApi/login</code></td>
              <td>Public</td>
            </tr>
            <tr>
              <td>Create/update QR</td>
              <td><code>qr-codes.component.ts</code> via <code>qr-code.service.ts</code></td>
              <td><code>POST /SmartQRApi/SaveQR</code>, <code>POST /SmartQRApi/SaveQRType</code></td>
              <td>Bearer JWT</td>
            </tr>
            <tr>
              <td>Viewer load</td>
              <td>All viewer components via <code>getQRPublic()</code></td>
              <td><code>GET /SmartQRApi/GetQRPublic/&#123;qrCodeID&#125;</code></td>
              <td>Public</td>
            </tr>
            <tr>
              <td>Menu ordering</td>
              <td><code>menu-viewer.component.ts</code>, <code>my-cart.component.ts</code></td>
              <td><code>GetShopsPublic</code>, <code>GetProductsPublic</code>, <code>SubmitMenuOrder</code></td>
              <td>Public</td>
            </tr>
            <tr>
              <td>Menu operations</td>
              <td>Owner menu tabs via <code>qr-code.service.ts</code></td>
              <td><code>GetMenuOrders</code>, <code>GetMenuOrderDetail</code>, <code>UpdateMenuOrderStatus</code>, <code>DeleteMenuOrder</code></td>
              <td>Bearer JWT</td>
            </tr>
            <tr>
              <td>Loyalty registration/redeem</td>
              <td><code>loyalty-viewer</code> + registration detail pages</td>
              <td><code>RegisterForLoyalty</code>, <code>CheckLoyaltyRegistration</code>, <code>AddLoyaltyStamps</code>, <code>RedeemLoyaltyReward</code></td>
              <td>Mixed (Public + Bearer)</td>
            </tr>
            <tr>
              <td>Event registration</td>
              <td><code>event-viewer</code> and owner dashboards</td>
              <td><code>RegisterForEvent</code>, <code>CheckEventRegistration</code>, <code>GetEventRegistrations</code></td>
              <td>Mixed (Public + Bearer)</td>
            </tr>
            <tr>
              <td>Service feedback</td>
              <td><code>service-feedback-viewer.component.ts</code></td>
              <td><code>POST /ServiceFeedbackApi/SubmitFeedback</code>, <code>GET /ServiceFeedbackApi/GetFeedbackList/&#123;qrCodeID&#125;</code></td>
              <td>Mixed (Public + Bearer)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="card">
        <h2>4) Auth convention (applies to endpoint descriptions)</h2>
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
        <h2>5) Error catalog</h2>
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
        <h2>6) How to keep backend/frontend in sync</h2>
        <ol>
          <li>Change backend controller action signature in <code>Smart_QR_API</code>.</li>
          <li>Update the matching method in <code>Smart_QR_UI/src/app/services/qr-code.service.ts</code>.</li>
          <li>Verify caller pages/components still pass expected payload shape.</li>
          <li>Update <code>master-api-reference.json</code> with method, path, auth, and error codes.</li>
          <li>Update any curated domain <code>api-reference.json</code> docs if behavior changed.</li>
        </ol>
      </section>

      <section class="card">
        <h2>7) Implementation checklist</h2>
        <ul>
          <li>Keep <code>master-api-reference.json</code> updated first.</li>
          <li>Ensure each endpoint description marks one auth mode: Bearer, Cookie(+CSRF), or Public.</li>
          <li>Map endpoint failures to the shared error catalog with HTTP + business code.</li>
          <li>Prefer adding endpoints only after they exist in backend controller source.</li>
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
    .card ol { margin: 0; padding-left: 22px; }
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
export class ApiTruthSourceComponent { }

