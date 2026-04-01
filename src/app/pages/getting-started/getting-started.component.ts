import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/welcome" class="back-link">
        <i class="bi bi-arrow-left"></i> Home
      </a>
      <h1><i class="bi bi-rocket-takeoff"></i> Getting Started</h1>
      <p class="subtitle">
        Complete local setup for Smart QR documentation, frontend, and backend API so the full project can be developed end-to-end.
      </p>

      <section class="card" id="prereq">
        <h2>Prerequisites</h2>
        <ul>
          <li><strong>Node.js</strong> — LTS version compatible with Angular 21 (see <code>package.json</code> <code>packageManager</code> / engines if specified).</li>
          <li><strong>npm</strong> — Comes with Node; this repo uses npm for installs.</li>
          <li><strong>Angular CLI</strong> — Optional globally; each project uses the CLI version from <code>devDependencies</code> via <code>npx ng</code>.</li>
          <li><strong>.NET SDK</strong> — .NET 8 for <code>Smart_QR_API</code>.</li>
          <li><strong>SQL Server</strong> — local/dev database instance reachable by backend connection strings.</li>
          <li><strong>Backend API</strong> — For full Smart QR flows, run <code>Smart_QR_API</code> and point <code>Smart_QR_UI</code> to it (see Environment below).</li>
        </ul>
      </section>

      <section class="card" id="clone">
        <h2>Repository layout</h2>
        <p>
          The documentation site and the Smart QR web app live in the same repository under the project root
          <code>Smart_QR</code> (adjust the path if your folder name differs).
        </p>
        <pre><code>Smart_QR/
├── Smart_QR_UI/          # Product Angular app (customer/admin frontend)
├── Smart_QR_API/         # ASP.NET Core API (SmartQRApi, AuthenticationApi, etc.)
├── SQL/                  # SQL scripts and DB helpers
├── smart-qr-dev-doc/     # This developer documentation portal
└── ...</code></pre>
      </section>

      <section class="card" id="start-order">
        <h2>Recommended startup order</h2>
        <ol>
          <li>Start <strong>Smart_QR_API</strong> and confirm Swagger loads.</li>
          <li>Start <strong>Smart_QR_UI</strong> with <code>baseApiUrl</code> pointing to your running API.</li>
          <li>Start <strong>smart-qr-dev-doc</strong> for developer documentation work.</li>
        </ol>
      </section>

      <section class="card" id="backend-api">
        <h2>Run Smart QR backend API (<code>Smart_QR_API</code>)</h2>
        <pre><code>cd Smart_QR_API
dotnet restore
dotnet build
dotnet run</code></pre>
        <p>
          API launch profile/ports depend on your local machine configuration. Check terminal output for the exact URL.
          By convention in this project, frontend local uses API around <code>http://127.0.0.1:5100</code>.
        </p>
        <h3>Useful checks</h3>
        <ul>
          <li>Open Swagger (if enabled) at the reported URL (commonly <code>/swagger</code>).</li>
          <li>Verify key controllers exist in startup: <code>SmartQRApi</code>, <code>AuthenticationApi</code>, <code>ServiceFeedbackApi</code>.</li>
          <li>If CORS fails, ensure frontend origin is allowed in backend CORS setup and/or SysConfig values.</li>
        </ul>
      </section>

      <section class="card" id="backend-config">
        <h2>Backend configuration (database, auth, CORS)</h2>
        <p>
          Backend runtime settings are loaded from <code>Smart_QR_API/appsettings.json</code> and environment overrides.
        </p>
        <table>
          <thead>
            <tr><th>Setting area</th><th>Purpose</th></tr>
          </thead>
          <tbody>
            <tr><td><code>ConnectionStrings</code></td><td>Main DB + Hangfire DB connection.</td></tr>
            <tr><td><code>JwtAuth</code></td><td>Token signing key, issuer, token lifetime.</td></tr>
            <tr><td><code>GoogleRecaptcha</code>, <code>GoogleAuth</code></td><td>Captcha and Google auth integration.</td></tr>
            <tr><td>CORS policy (Program.cs)</td><td>Allows frontend origins including localhost development hosts.</td></tr>
          </tbody>
        </table>
        <div class="warning-box">
          <i class="bi bi-exclamation-triangle"></i>
          <div>
            Never commit real secrets/credentials in source control. Use local/user-secrets or environment-specific secure configs.
            If secrets are already exposed in tracked files, rotate them immediately.
          </div>
        </div>
      </section>

      <section class="card" id="dev-doc">
        <h2>Run Developer Documentation (<code>smart-qr-dev-doc</code>)</h2>
        <pre><code>cd smart-qr-dev-doc
npm install
npm start
# or: npx ng serve</code></pre>
        <p>Open <code>http://localhost:4200/</code> (or the port shown in the terminal). You will be redirected to <strong>Login</strong> until you authenticate.</p>
      </section>

      <section class="card" id="product-ui">
        <h2>Run Smart QR product UI (<code>Smart_QR_UI</code>)</h2>
        <pre><code>cd Smart_QR_UI
npm install
npm start
# or: npx ng serve</code></pre>
        <p>
          Default dev server URL is typically <code>http://localhost:4200/</code>. If both apps use the same port, run one on a different port, for example:
        </p>
        <pre><code>npx ng serve --port 4300</code></pre>
        <h3>Frontend API health check</h3>
        <ul>
          <li>Login page should call <code>AuthenticationApi/login</code> (or register path in login-v2).</li>
          <li>QR list/wizard pages should call <code>SmartQRApi</code> endpoints without CORS errors.</li>
          <li>If network calls fail with <code>ERR_CONNECTION_REFUSED</code>, confirm backend is running and <code>baseApiUrl</code> is correct.</li>
        </ul>
      </section>

      <section class="card" id="environment">
        <h2>Environment wiring (frontend ↔ backend)</h2>
        <p>
          API and related settings for the product app are in
          <code>Smart_QR_UI/src/environments/environment.ts</code> (and <code>environment.prod.ts</code> for production builds).
        </p>
        <table>
          <thead>
            <tr><th>Property</th><th>Purpose</th></tr>
          </thead>
          <tbody>
            <tr><td><code>baseApiUrl</code></td><td>REST API base URL (e.g. local API or UAT).</td></tr>
            <tr><td><code>baseAdminUrl</code></td><td>Admin / app origin used where the UI needs its own URL.</td></tr>
            <tr><td><code>production</code></td><td>Build mode flag.</td></tr>
            <tr><td><code>timeout</code>, <code>allowFilesize</code>, etc.</td><td>Product-specific behavior; see file comments in the UI repo.</td></tr>
          </tbody>
        </table>
        <div class="warning-box">
          <i class="bi bi-exclamation-triangle"></i>
          <div>
            Do not commit real secrets. Use local overrides or environment-specific files your team agrees on.
          </div>
        </div>
      </section>

      <section class="card" id="full-workflow">
        <h2>Daily full-stack workflow</h2>
        <ol>
          <li>Pull latest code and restore dependencies for API/UI.</li>
          <li>Run API first and verify at least one auth endpoint in Swagger.</li>
          <li>Run UI and complete login flow.</li>
          <li>Develop feature across:
            <ul>
              <li><code>Smart_QR_UI</code> for screens and services</li>
              <li><code>Smart_QR_API</code> for controllers/repositories/business rules</li>
              <li><code>smart-qr-dev-doc</code> for implementation notes and API updates</li>
            </ul>
          </li>
          <li>Update docs when API contract, auth behavior, or error handling changes.</li>
        </ol>
      </section>

      <section class="card" id="troubleshooting">
        <h2>Troubleshooting quick guide</h2>
        <table>
          <thead>
            <tr><th>Issue</th><th>Typical cause</th><th>Fix</th></tr>
          </thead>
          <tbody>
            <tr><td>Frontend cannot reach API</td><td>Wrong <code>baseApiUrl</code> or API not running</td><td>Start API and align environment URL.</td></tr>
            <tr><td>CORS blocked</td><td>Origin not whitelisted</td><td>Update backend CORS/system config for your localhost origin.</td></tr>
            <tr><td>401 / unauthorized</td><td>Missing/expired token</td><td>Re-login, inspect token storage and auth headers.</td></tr>
            <tr><td>DB connection error</td><td>Invalid SQL connection string</td><td>Correct <code>ConnectionStrings</code> and DB accessibility.</td></tr>
          </tbody>
        </table>
      </section>

      <section class="card" id="login">
        <h2>Sign in to DevDocs</h2>
        <p>
          This portal uses <strong>client-side authentication</strong> for gating access to documentation. There is no server session:
          credentials are checked against <code>src/assets/content/users.json</code>, and a session object is stored in
          <code>localStorage</code> under the key <code>devdocs_session</code> (see <code>AuthService</code>).
        </p>
        <h3>How it works</h3>
        <ol>
          <li>On login, the app loads <code>assets/content/users.json</code> via HTTP.</li>
          <li>Your password is hashed with <strong>SHA-256</strong> in the browser and compared to <code>passwordHash</code> on each user record.</li>
          <li>On success, <code>username</code>, <code>displayName</code>, <code>role</code>, and a generated <code>token</code> are saved to <code>localStorage</code>.</li>
          <li><code>authGuard</code> redirects unauthenticated users to <code>/login</code>.</li>
        </ol>
        <h3>Default accounts (<code>users.json</code>)</h3>
        <table>
          <thead>
            <tr><th>Username</th><th>Role</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>admin</code></td>
              <td><code>admin</code></td>
              <td>Default password for local docs: <code>admin123</code> (SHA-256 stored in repo).</td>
            </tr>
            <tr>
              <td><code>developer</code></td>
              <td><code>viewer</code></td>
              <td>Second sample account; password is a hashed value in JSON — ask your team or set a new hash (below).</td>
            </tr>
          </tbody>
        </table>
        <h3>Add or reset a user</h3>
        <p>Edit <code>smart-qr-dev-doc/src/assets/content/users.json</code>. Set <code>passwordHash</code> to the SHA-256 hex digest of the password (lowercase hex, no prefix).</p>
        <p>Example with Node:</p>
        <pre><code>node -e "console.log(require('crypto').createHash('sha256').update('YourPassword').digest('hex'))"</code></pre>
        <div class="warning-box">
          <i class="bi bi-shield-lock"></i>
          <div>
            <code>users.json</code> ships in the client bundle — treat it as <strong>obfuscation only</strong>, not enterprise IAM.
            Use stronger auth for anything sensitive or internet-exposed.
          </div>
        </div>
      </section>

      <section class="card" id="next">
        <h2>Next steps</h2>
        <ul>
          <li><a routerLink="/architecture">Architecture overview</a> — how the pieces fit together.</li>
          <li><a routerLink="/smart-qr-hub">Smart QR hub</a> — where the product code lives.</li>
          <li><a routerLink="/domains">Browse domains</a> — feature and API notes by domain.</li>
          <li><a routerLink="/search">Search</a> — across indexed JSON content.</li>
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
    .card h3 { font-size: 16px; font-weight: 600; color: #1a1f36; margin: 20px 0 8px; }
    .card p { font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 12px; }
    .card ul, .card ol { padding-left: 22px; margin: 0 0 12px; font-size: 14px; color: #444; }
    .card li { margin-bottom: 4px; line-height: 1.6; }
    .card a { color: #6c8cff; font-weight: 500; }
    code {
      background: #f0f3ff; color: #4a6cf7; padding: 2px 7px;
      border-radius: 4px; font-size: 13px;
    }
    pre {
      background: #1a1f36; border-radius: 10px; padding: 18px 22px;
      overflow-x: auto; margin: 0 0 14px;
    }
    pre code { background: none; color: #e0e6ff; padding: 0; }
    table { width: 100%; border-collapse: collapse; margin: 0 0 14px; font-size: 13px; }
    th {
      text-align: left; padding: 10px 12px; background: #f5f7fa;
      border-bottom: 2px solid #e0e4ec; font-weight: 600; color: #444;
    }
    td { padding: 9px 12px; border-bottom: 1px solid #f0f0f0; color: #444; }
    tr:hover td { background: #fafbfd; }
    strong { color: #1a1f36; }
    .info-box, .warning-box {
      display: flex; gap: 12px; padding: 16px 18px;
      border-radius: 10px; margin: 12px 0; font-size: 14px;
    }
    .warning-box {
      background: #fff8e1; border-left: 4px solid #f9a825;
    }
    .warning-box > i { color: #f9a825; font-size: 18px; margin-top: 2px; flex-shrink: 0; }
  `]
})
export class GettingStartedComponent {}
