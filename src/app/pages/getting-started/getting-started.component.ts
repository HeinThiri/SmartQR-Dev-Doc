import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">

      <!-- ── Header ── -->
      <a routerLink="/welcome" class="back-link">
        <i class="bi bi-arrow-left"></i> Home
      </a>
      <h1><i class="bi bi-rocket-takeoff"></i> Getting Started</h1>
      <p class="subtitle">
        End-to-end local setup for <strong>Smart_QR_API</strong> (ASP.NET Core 8),
        <strong>Smart_QR_UI</strong> (Angular 19), and this developer documentation portal.
        Follow each section in order for the fastest path to a working environment.
      </p>

      <!-- ── Section nav ── -->
      <nav class="toc-strip">
        <a href="#prereq">Prerequisites</a>
        <a href="#repo">Repository</a>
        <a href="#backend-cfg">Backend config</a>
        <a href="#database">Database</a>
        <a href="#run-api">Run API</a>
        <a href="#frontend-cfg">Frontend config</a>
        <a href="#run-ui">Run UI</a>
        <a href="#cors">CORS</a>
        <a href="#third-party">Third-party</a>
        <a href="#run-docs">Run DevDocs</a>
        <a href="#devdocs-auth">DevDocs auth</a>
        <a href="#prod-build">Production</a>
        <a href="#troubleshoot">Troubleshooting</a>
        <a href="#next">Next steps</a>
      </nav>

      <!-- ── Setup flow ── -->
      <div class="setup-flow">
        <div class="flow-step">
          <div class="flow-num">1</div>
          <div class="flow-label">Install tools</div>
        </div>
        <div class="flow-arrow"><i class="bi bi-chevron-right"></i></div>
        <div class="flow-step">
          <div class="flow-num">2</div>
          <div class="flow-label">Configure API</div>
        </div>
        <div class="flow-arrow"><i class="bi bi-chevron-right"></i></div>
        <div class="flow-step">
          <div class="flow-num">3</div>
          <div class="flow-label">Migrate DB</div>
        </div>
        <div class="flow-arrow"><i class="bi bi-chevron-right"></i></div>
        <div class="flow-step">
          <div class="flow-num">4</div>
          <div class="flow-label">Run API</div>
        </div>
        <div class="flow-arrow"><i class="bi bi-chevron-right"></i></div>
        <div class="flow-step">
          <div class="flow-num">5</div>
          <div class="flow-label">Configure UI</div>
        </div>
        <div class="flow-arrow"><i class="bi bi-chevron-right"></i></div>
        <div class="flow-step">
          <div class="flow-num">6</div>
          <div class="flow-label">Run UI</div>
        </div>
        <div class="flow-arrow"><i class="bi bi-chevron-right"></i></div>
        <div class="flow-step active">
          <div class="flow-num">7</div>
          <div class="flow-label">Run DevDocs</div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════
           1. PREREQUISITES
      ═══════════════════════════════════════════ -->
      <section class="card" id="prereq">
        <h2><span class="step-badge">1</span> Prerequisites</h2>
        <p>Install all tools below before cloning the repository.</p>
        <table>
          <thead>
            <tr><th>Tool</th><th>Required version</th><th>Purpose</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Node.js</strong></td>
              <td><code>18 LTS</code> or <code>20 LTS</code></td>
              <td>JavaScript runtime for both Angular apps</td>
            </tr>
            <tr>
              <td><strong>npm</strong></td>
              <td><code>11.7.0+</code></td>
              <td>Package manager (bundled with Node)</td>
            </tr>
            <tr>
              <td><strong>.NET SDK</strong></td>
              <td><code>8.0</code></td>
              <td><code>Smart_QR_API</code> runs on .NET 8</td>
            </tr>
            <tr>
              <td><strong>SQL Server</strong></td>
              <td><code>2017+</code> or Express</td>
              <td>Main database + Hangfire job queue</td>
            </tr>
            <tr>
              <td><strong>Angular CLI</strong></td>
              <td>Installed via <code>npx</code></td>
              <td>Optional globally; each project uses local CLI via <code>npx ng</code></td>
            </tr>
            <tr>
              <td><strong>Git</strong></td>
              <td>Any recent</td>
              <td>Source control</td>
            </tr>
          </tbody>
        </table>
        <div class="info-box">
          <i class="bi bi-info-circle"></i>
          <div>
            <strong>Version check: </strong>
            <code>node -v</code> &nbsp;|&nbsp; <code>dotnet --version</code> &nbsp;|&nbsp; <code>sqlcmd -?</code>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           2. REPOSITORY LAYOUT
      ═══════════════════════════════════════════ -->
      <section class="card" id="repo">
        <h2><span class="step-badge">2</span> Repository layout</h2>
        <p>
          The entire project lives under one root folder. Open the sub-directory you need
          and run <code>npm install</code> / <code>dotnet restore</code> inside it.
        </p>
        <pre><code>Smart_QR/
├── Smart_QR_API/               # ASP.NET Core 8 backend
│   ├── appsettings.json        # Runtime config (DB, JWT, CORS, email)
│   ├── appsettings.Development.json
│   ├── Properties/
│   │   └── launchSettings.json # Port 5100 (http), 44361 (IIS Express SSL)
│   ├── Program.cs              # Middleware pipeline, DI setup
│   ├── APIs/                   # Controllers per module
│   ├── DBModels/SmartProject/  # EF Core entities
│   ├── Infrastructure/         # Services, repositories, background jobs
│   └── UploadedFiles/          # Served at /content/* (QR images, uploads)
│
├── Smart_QR_UI/                # Angular 19 product frontend
│   ├── package.json            # Scripts: start, build, build-prod, test
│   ├── angular.json            # Build/serve config (host 127.0.0.1)
│   └── src/
│       ├── environments/
│       │   ├── environment.ts           # Local dev (API → http://127.0.0.1:5100)
│       │   ├── environment.dev.ts       # UAT (API → qr_uat_api.smarticwork.com)
│       │   └── environment.prod.ts      # Prod (API → qr_api.smarticwork.com)
│       ├── app/
│       │   ├── app.module.ts            # Providers, AuthInterceptor, TranslateModule
│       │   └── interceptors/
│       │       └── auth.interceptor.ts  # JWT header injection, session expiry handler
│       └── assets/i18n/                 # Translation files (EN, ZH, MY)
│
├── smart-qr-dev-doc/           # Angular 21 developer documentation portal (this app)
│   ├── package.json
│   └── src/assets/content/     # JSON documentation content per domain
│
└── SQL/
    ├── ContentSystem_Tables_All.sql   # Full content-system schema
    ├── MallMap_Tables_All.sql         # Mall map tables
    └── QRContent*Table.sql            # Individual table scripts</code></pre>
      </section>

      <!-- ══════════════════════════════════════════
           3. BACKEND CONFIGURATION
      ═══════════════════════════════════════════ -->
      <section class="card" id="backend-cfg">
        <h2><span class="step-badge">3</span> Backend configuration</h2>
        <p>
          Edit <code>Smart_QR_API/appsettings.json</code> (and <code>appsettings.Development.json</code> for
          dev-only overrides). The table below covers every key you must set before first run.
        </p>

        <h3>appsettings.json structure</h3>
        <pre><code>{{'{'}}"ConnectionStrings": {{'{'}}"constring": "...", "HangfireConnection": "..."{{'}'}},
  "ConnectionString_BIDashboard": {{'{'}}"ConnectionString": "..."{{'}'}},
  "JwtAuth": {{'{'}}"Key": "...", "Issuer": "systematic.com", "TokenLifeTime": 180{{'}'}},
  "GoogleRecaptcha": {{'{'}}"SecretKey": "...", "SiteKey": "..."{{'}'}},
  "GoogleAuth": {{'{'}}"ClientId": "...apps.googleusercontent.com"{{'}'}},
  "AWS": {{'{'}}"AccessKey": "...", "SecretKey": "...", "Region": "ap-southeast-1",
    "SES": {{'{'}}"FromEmailAddress": "smartqr@smarticwork.com", "BccEmailAddress": "..."{{'}}}}}{{'}'}},
  "AppSetting": {{'{'}}"defaultSystemLicense": "1"{{'}'}}{{'}'}}
</code></pre>

        <h3>Configuration key reference</h3>
        <table>
          <thead>
            <tr><th>Key</th><th>Description</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>ConnectionStrings.constring</code></td>
              <td>Main SQL Server connection</td>
              <td>See connection string patterns below</td>
            </tr>
            <tr>
              <td><code>ConnectionStrings.HangfireConnection</code></td>
              <td>Hangfire job queue database</td>
              <td>Can be the same database as <code>constring</code> in dev</td>
            </tr>
            <tr>
              <td><code>ConnectionString_BIDashboard.ConnectionString</code></td>
              <td>BI / DevExpress dashboard source</td>
              <td>Can point to same database for development</td>
            </tr>
            <tr>
              <td><code>JwtAuth.Key</code></td>
              <td>HMAC-SHA256 signing secret</td>
              <td><strong>Change before any shared or production deployment</strong></td>
            </tr>
            <tr>
              <td><code>JwtAuth.Issuer</code></td>
              <td>JWT issuer claim</td>
              <td>Default: <code>systematic.com</code></td>
            </tr>
            <tr>
              <td><code>JwtAuth.TokenLifeTime</code></td>
              <td>Access token lifetime in minutes</td>
              <td>Default: <code>180</code> (3 hours). Clock skew is 0.</td>
            </tr>
            <tr>
              <td><code>GoogleRecaptcha.SecretKey</code></td>
              <td>Server-side reCAPTCHA secret</td>
              <td>Required for login/registration reCAPTCHA validation</td>
            </tr>
            <tr>
              <td><code>GoogleAuth.ClientId</code></td>
              <td>Google OAuth 2.0 client ID</td>
              <td>Same value used in frontend <code>environment.ts</code></td>
            </tr>
            <tr>
              <td><code>AWS.AccessKey</code> / <code>SecretKey</code></td>
              <td>AWS IAM credentials for SES</td>
              <td>Required for transactional email (new user, QR created)</td>
            </tr>
            <tr>
              <td><code>AWS.Region</code></td>
              <td>SES region</td>
              <td>Default: <code>ap-southeast-1</code></td>
            </tr>
            <tr>
              <td><code>AWS.SES.FromEmailAddress</code></td>
              <td>Sender address for outgoing mail</td>
              <td>Must be verified in SES. Default: <code>smartqr@smarticwork.com</code></td>
            </tr>
          </tbody>
        </table>

        <h3>SQL Server connection string patterns</h3>
        <p><strong>Windows authentication (recommended for local dev):</strong></p>
        <pre><code>Data Source=.\\SQLEXPRESS;Initial Catalog=Dev_SmartQR;Integrated Security=True;TrustServerCertificate=True</code></pre>
        <p><strong>SQL authentication:</strong></p>
        <pre><code>Data Source=192.168.x.x\\MSSQLSERVER2017;Initial Catalog=Dev_SmartQR;
Persist Security Info=True;User ID=sa;Password=YourPassword;
Encrypt=False;TrustServerCertificate=True</code></pre>

        <div class="warning-box">
          <i class="bi bi-exclamation-triangle"></i>
          <div>
            Never commit real credentials to source control. Use
            <code>dotnet user-secrets</code> or environment-specific <code>appsettings.*.json</code>
            files excluded from git for sensitive values such as <code>JwtAuth.Key</code>,
            AWS keys, and database passwords.
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           4. DATABASE SETUP
      ═══════════════════════════════════════════ -->
      <section class="card" id="database">
        <h2><span class="step-badge">4</span> Database setup</h2>

        <h3>Create the database</h3>
        <p>Create a SQL Server database named <code>Dev_SmartQR</code> (or any name you set in <code>constring</code>) before running migrations.</p>
        <pre><code>-- In SSMS or sqlcmd
CREATE DATABASE Dev_SmartQR;</code></pre>

        <h3>Run EF Core migrations</h3>
        <pre><code>cd Smart_QR_API
dotnet restore
dotnet ef database update</code></pre>
        <p>This applies all pending migrations and creates the full schema including
          <code>SysUser</code>, <code>SysRole</code>, <code>QRCode*</code>, approval workflow,
          attendance, and CRM tables.
        </p>

        <h3>Add a migration (when you add new EF entities)</h3>
        <pre><code>dotnet ef migrations add YourMigrationName
dotnet ef database update</code></pre>

        <h3>SQL scripts for content-system tables</h3>
        <p>
          Tables for the QR content system (shops, products, promotions, parking zones, mall maps)
          are managed via scripts in the <code>SQL/</code> folder. Run them in this order after the
          EF migration:
        </p>
        <table>
          <thead>
            <tr><th>Script</th><th>Purpose</th></tr>
          </thead>
          <tbody>
            <tr><td><code>SQL/ContentSystem_Tables_All.sql</code></td><td>All content-system tables (one-shot)</td></tr>
            <tr><td><code>SQL/MallMap_Tables_All.sql</code></td><td>Mall map / parking zone tables</td></tr>
            <tr><td><code>SQL/QRContent*Table.sql</code></td><td>Individual table scripts (run if you need a subset)</td></tr>
          </tbody>
        </table>

        <h3>Seed the SysConfig table</h3>
        <p>
          The API reads runtime settings (CORS origins, email address, OTP expiry) from
          <code>SysConfig</code>. Insert at least one row before testing email or CORS-sensitive flows:
        </p>
        <pre><code>INSERT INTO SysConfig (DefaultEmailAddress, WebUIURL, WebAPIURL, OtpExpiredMinute)
VALUES ('admin@yourdomain.com', 'http://localhost:4200', 'http://localhost:5100', 5);</code></pre>

        <div class="info-box">
          <i class="bi bi-info-circle"></i>
          <div>
            <strong>EF Tools required:</strong> If <code>dotnet ef</code> is not found, install it globally:
            <code>dotnet tool install --global dotnet-ef</code>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           5. RUN THE API
      ═══════════════════════════════════════════ -->
      <section class="card" id="run-api">
        <h2><span class="step-badge">5</span> Run <code>Smart_QR_API</code></h2>

        <pre><code>cd Smart_QR_API
dotnet restore
dotnet build
dotnet run</code></pre>

        <p>
          The API starts on <strong><code>http://localhost:5100</code></strong> (defined in
          <code>Properties/launchSettings.json</code>, profile <em>http</em>).
          IIS Express uses port <code>16302</code> (HTTP) / <code>44361</code> (HTTPS).
        </p>

        <h3>Verify the API is healthy</h3>
        <table>
          <thead>
            <tr><th>URL</th><th>Expected response</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>GET http://localhost:5100/health</code></td>
              <td><code>Healthy</code> (plain text)</td>
            </tr>
            <tr>
              <td><code>http://localhost:5100/swagger</code></td>
              <td>Swagger UI (Development only — disabled in production)</td>
            </tr>
            <tr>
              <td><code>POST http://localhost:5100/AuthenticationApi/login</code></td>
              <td><code>200</code> with JWT on valid credentials</td>
            </tr>
          </tbody>
        </table>

        <h3>Swagger API groups</h3>
        <p>Two Swagger document groups are generated:</p>
        <ul>
          <li><strong>Public-API</strong> — endpoints accessible without a token (login, registration, public QR scan)</li>
          <li><strong>Admin-API</strong> — authenticated endpoints (QR CRUD, user management, reports)</li>
        </ul>
        <p>Click <strong>Authorize</strong> in Swagger and paste a JWT from the login endpoint to test protected routes.</p>

        <h3>Background services started on run</h3>
        <ul>
          <li><strong>Hangfire</strong> — background job queue (uses <code>HangfireConnection</code>)</li>
          <li><strong>QRCodeExpiryNotificationService</strong> — sends expiry notifications for QR codes</li>
        </ul>

        <div class="info-box">
          <i class="bi bi-info-circle"></i>
          <div>
            If you see <em>Unable to connect to database</em> on startup, verify
            <code>ConnectionStrings.constring</code> in <code>appsettings.json</code> and that SQL Server
            is reachable from your machine.
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           6. FRONTEND CONFIGURATION
      ═══════════════════════════════════════════ -->
      <section class="card" id="frontend-cfg">
        <h2><span class="step-badge">6</span> Frontend configuration (<code>Smart_QR_UI</code>)</h2>

        <h3>Environment files</h3>
        <p>
          All API URLs and client-side keys live in <code>Smart_QR_UI/src/environments/</code>.
          The Angular build picks the right file based on the <code>--configuration</code> flag.
        </p>
        <table>
          <thead>
            <tr><th>File</th><th>Used when</th><th>API target</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>environment.ts</code></td>
              <td><code>ng serve</code> (default dev)</td>
              <td><code>http://127.0.0.1:5100</code></td>
            </tr>
            <tr>
              <td><code>environment.dev.ts</code></td>
              <td><code>ng build --configuration dev</code></td>
              <td><code>https://qr_uat_api.smarticwork.com</code></td>
            </tr>
            <tr>
              <td><code>environment.prod.ts</code></td>
              <td><code>ng build --configuration production</code></td>
              <td><code>https://qr_api.smarticwork.com</code></td>
            </tr>
          </tbody>
        </table>

        <h3>Local dev environment (<code>environment.ts</code>)</h3>
        <pre><code>export const environment = {{'{'}}"
  production: false,
  baseApiUrl: 'http://127.0.0.1:5100',     // ← point to your running API
  baseAdminUrl: 'http://localhost:4200',   // ← this app's own origin
  timeout: 180,                            // session timeout in minutes
  allowFilesize: 3,                        // max upload size in MB
  googleClientId: '447569710687-vd427jqfp8qe8pqg38ln1bvct1f2chej.apps.googleusercontent.com',
  firebaseConfig: {{'{'}}{{'}'}}                        // leave empty for local dev
{{'}'}};</code></pre>

        <h3>Environment property reference</h3>
        <table>
          <thead>
            <tr><th>Property</th><th>Type</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>baseApiUrl</code></td><td>string</td><td>REST API root. All HTTP calls use <code>&#36;{{'{'}}environment.baseApiUrl{{'}'}}&#47;SmartQRApi/...</code></td></tr>
            <tr><td><code>baseAdminUrl</code></td><td>string</td><td>Frontend origin, used when the API needs to generate callback URLs</td></tr>
            <tr><td><code>production</code></td><td>boolean</td><td>Disables debug tooling and enables minification when <code>true</code></td></tr>
            <tr><td><code>timeout</code></td><td>number</td><td>Minutes before the session expires (mirrors <code>JwtAuth.TokenLifeTime</code>)</td></tr>
            <tr><td><code>allowFilesize</code></td><td>number</td><td>Maximum file upload size in MB enforced client-side</td></tr>
            <tr><td><code>googleClientId</code></td><td>string</td><td>Google OAuth 2.0 client ID for Google Sign-In button</td></tr>
            <tr><td><code>firebaseConfig</code></td><td>object</td><td>Firebase web config object (required for push notifications in prod)</td></tr>
          </tbody>
        </table>

        <h3>Auth interceptor — localStorage keys</h3>
        <p>
          <code>src/app/interceptors/auth.interceptor.ts</code> reads three keys from
          <code>localStorage</code> on every outgoing HTTP request:
        </p>
        <table>
          <thead>
            <tr><th>Key</th><th>Content</th></tr>
          </thead>
          <tbody>
            <tr><td><code>authToken</code></td><td>JWT Bearer token. Added as <code>Authorization: Bearer ...</code> header.</td></tr>
            <tr><td><code>userId</code></td><td>Logged-in user ID. Used in per-user API calls.</td></tr>
            <tr><td><code>licenseId</code></td><td>Active license ID sent with licensed-feature requests.</td></tr>
          </tbody>
        </table>
        <p>
          On a <code>401</code> or custom status <code>210</code> (error_securityTokenExpiry),
          the interceptor clears localStorage and redirects to the login page.
        </p>

        <h3>npm scripts</h3>
        <table>
          <thead>
            <tr><th>Script</th><th>Command</th><th>Use for</th></tr>
          </thead>
          <tbody>
            <tr><td><code>npm start</code></td><td><code>ng serve</code></td><td>Local development (hot-reload)</td></tr>
            <tr><td><code>npm run build</code></td><td><code>ng build --configuration production</code></td><td>Standard production build</td></tr>
            <tr><td><code>npm run build-prod</code></td><td><code>node --max_old_space_size=8192 ng build --configuration production</code></td><td>Production build with increased heap (large bundle)</td></tr>
            <tr><td><code>npm run build-serve</code></td><td><code>node --max_old_space_size=8192 ng serve</code></td><td>Dev server with increased heap</td></tr>
            <tr><td><code>npm test</code></td><td><code>ng test</code></td><td>Unit tests via Karma</td></tr>
            <tr><td><code>npm run watch</code></td><td><code>ng build --watch --configuration development</code></td><td>Incremental dev builds</td></tr>
          </tbody>
        </table>
      </section>

      <!-- ══════════════════════════════════════════
           7. RUN THE FRONTEND UI
      ═══════════════════════════════════════════ -->
      <section class="card" id="run-ui">
        <h2><span class="step-badge">7</span> Run <code>Smart_QR_UI</code></h2>

        <pre><code>cd Smart_QR_UI
npm install
npm start
# Development server starts at http://localhost:4200/</code></pre>

        <p>
          The dev server binds to <strong><code>http://localhost:4200</code></strong> (configured in
          <code>angular.json</code> as <code>"host": "127.0.0.1"</code>).
          If you also serve the dev-doc on 4200, run one of them on a different port:
        </p>
        <pre><code>npx ng serve --port 4300</code></pre>

        <h3>Smoke-test the UI</h3>
        <ul>
          <li>Login page should call <code>POST /AuthenticationApi/login</code> without CORS errors.</li>
          <li>QR list (<code>/qr-codes</code>) should load QR records via <code>GET /SmartQRApi/GetQRList</code>.</li>
          <li>Check the browser Network tab — all XHR calls should hit <code>127.0.0.1:5100</code>.</li>
          <li>If you see <strong>ERR_CONNECTION_REFUSED</strong>, the API is not running or <code>baseApiUrl</code> is wrong.</li>
        </ul>

        <h3>i18n — translation files</h3>
        <p>
          Language files live at <code>src/assets/i18n/</code>. The app supports three locales:
        </p>
        <table>
          <thead><tr><th>File</th><th>Language</th></tr></thead>
          <tbody>
            <tr><td><code>en.json</code></td><td>English (default)</td></tr>
            <tr><td><code>zh.json</code></td><td>Chinese (Simplified)</td></tr>
            <tr><td><code>my.json</code></td><td>Myanmar (Burmese)</td></tr>
          </tbody>
        </table>
      </section>

      <!-- ══════════════════════════════════════════
           8. CORS
      ═══════════════════════════════════════════ -->
      <section class="card" id="cors">
        <h2>CORS setup</h2>
        <p>
          The backend reads allowed origins from the <code>SysConfig</code> database table
          (<code>WebUIURL</code>) and also has a hardcoded fallback list in <code>Program.cs</code>.
          Both sources are merged at startup.
        </p>
        <table>
          <thead>
            <tr><th>Environment</th><th>Allowed origin</th></tr>
          </thead>
          <tbody>
            <tr><td>Local dev</td><td><code>http://localhost:4200</code>, <code>http://127.0.0.1:4200</code></td></tr>
            <tr><td>Local API self</td><td><code>http://localhost:5100</code>, <code>http://127.0.0.1:5100</code></td></tr>
            <tr><td>UAT</td><td><code>https://qr-uat.smarticwork.com</code>, <code>https://qr_uat.smarticwork.com</code></td></tr>
            <tr><td>Production</td><td><code>https://qr.smarticwork.com</code>, <code>https://qr-api.smarticwork.com</code></td></tr>
          </tbody>
        </table>
        <p>
          To add a new origin for local testing without touching <code>Program.cs</code>,
          update the <code>WebUIURL</code> column in <code>SysConfig</code> and restart the API.
        </p>
        <div class="info-box">
          <i class="bi bi-info-circle"></i>
          <div>
            Static files served under <code>/content/*</code> (uploaded images, QR assets) are
            configured with <strong>allow-all origins</strong> because they are public media assets.
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           9. THIRD-PARTY SERVICES
      ═══════════════════════════════════════════ -->
      <section class="card" id="third-party">
        <h2>Third-party services</h2>
        <p>
          Smart QR integrates with several external services. You can skip optional services
          in local dev — the API falls back gracefully for most.
        </p>

        <h3><i class="bi bi-envelope-at"></i>&nbsp; AWS SES — transactional email</h3>
        <p>Used for new-user registration emails and QR-created notifications.
          Template IDs: <code>E-0020</code> (new user) and <code>E-0021</code> (QR created) in the
          <code>CrmEmailTemplate</code> table.</p>
        <table>
          <thead><tr><th>Key</th><th>Where</th></tr></thead>
          <tbody>
            <tr><td><code>AWS.AccessKey</code> / <code>SecretKey</code></td><td><code>appsettings.json</code></td></tr>
            <tr><td><code>AWS.Region</code></td><td><code>ap-southeast-1</code> (default)</td></tr>
            <tr><td><code>AWS.SES.FromEmailAddress</code></td><td>Must be verified in your SES account</td></tr>
          </tbody>
        </table>
        <div class="info-box">
          <i class="bi bi-info-circle"></i>
          <div>
            In local dev, AWS credentials can be left empty — email sending will fail silently
            without affecting core QR features.
          </div>
        </div>

        <h3><i class="bi bi-google"></i>&nbsp; Google OAuth 2.0</h3>
        <p>Powers the <strong>Sign in with Google</strong> button on the login page.</p>
        <table>
          <thead><tr><th>Config</th><th>Location</th></tr></thead>
          <tbody>
            <tr><td>Client ID (frontend)</td><td><code>environment.ts → googleClientId</code></td></tr>
            <tr><td>Client ID (backend token validation)</td><td><code>appsettings.json → GoogleAuth.ClientId</code></td></tr>
          </tbody>
        </table>

        <h3><i class="bi bi-shield-check"></i>&nbsp; Google reCAPTCHA v3</h3>
        <p>Protects the login and registration forms against bots.</p>
        <table>
          <thead><tr><th>Config</th><th>Location</th></tr></thead>
          <tbody>
            <tr><td>Site key (frontend, shown to browser)</td><td><code>appsettings.json → GoogleRecaptcha.SiteKey</code></td></tr>
            <tr><td>Secret key (backend verification)</td><td><code>appsettings.json → GoogleRecaptcha.SecretKey</code></td></tr>
          </tbody>
        </table>

        <h3><i class="bi bi-fire"></i>&nbsp; Firebase Admin SDK</h3>
        <p>Used for push notifications to mobile/web clients.</p>
        <ul>
          <li>Backend: <code>FirebaseAdmin</code> NuGet package — configure with a service account JSON.</li>
          <li>Frontend: <code>environment.ts → firebaseConfig</code> (the web SDK config object from Firebase console).</li>
          <li>Leave <code>firebaseConfig: &#123;&#125;</code> in local dev; push will be disabled.</li>
        </ul>

        <h3><i class="bi bi-bar-chart-line"></i>&nbsp; DevExpress Reporting &amp; Dashboards</h3>
        <p>
          Licensed component for QR analytics dashboards and printable reports.
          License key is set in <code>Program.cs</code> via
          <code>DevExpress.LicenseHelper.LicenseHelper.SetLicenseKey("...")</code>.
          Dashboard endpoints:
          <code>/api/systemdashboard</code>, <code>/api/resourcedashboard</code>, and others.
        </p>
      </section>

      <!-- ══════════════════════════════════════════
           10. RUN DEVELOPER DOCS
      ═══════════════════════════════════════════ -->
      <section class="card" id="run-docs">
        <h2><span class="step-badge">8</span> Run Developer Documentation (<code>smart-qr-dev-doc</code>)</h2>

        <pre><code>cd smart-qr-dev-doc
npm install
npm start
# Opens at http://localhost:4200/</code></pre>

        <p>
          This portal runs on <strong>Angular 21</strong> with standalone components and serves
          documentation from JSON files under <code>src/assets/content/</code>.
          You will be redirected to <code>/login</code> until authenticated (see DevDocs Auth below).
        </p>

        <h3>Build the docs for static hosting</h3>
        <pre><code>npm run build
# Output: dist/developer-docs/</code></pre>
      </section>

      <!-- ══════════════════════════════════════════
           11. DEVDOCS AUTHENTICATION
      ═══════════════════════════════════════════ -->
      <section class="card" id="devdocs-auth">
        <h2>DevDocs portal authentication</h2>
        <p>
          This portal uses <strong>client-side-only authentication</strong> — there is no server
          session. Credentials are stored in <code>src/assets/content/users.json</code> and
          verified in the browser.
        </p>

        <h3>How it works</h3>
        <ol>
          <li>On login, the app fetches <code>assets/content/users.json</code> via HTTP.</li>
          <li>The entered password is hashed with <strong>SHA-256</strong> in the browser and
              compared against the stored <code>passwordHash</code> field.</li>
          <li>On success, <code>username</code>, <code>displayName</code>, <code>role</code>,
              and a generated token are written to <code>localStorage</code> under the key
              <code>devdocs_session</code>.</li>
          <li><code>authGuard</code> redirects any unauthenticated request to <code>/login</code>.</li>
        </ol>

        <h3>Default accounts</h3>
        <table>
          <thead>
            <tr><th>Username</th><th>Role</th><th>Default password</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>admin</code></td>
              <td><code>admin</code></td>
              <td><code>admin123</code> (SHA-256 hash stored in repo)</td>
            </tr>
            <tr>
              <td><code>developer</code></td>
              <td><code>viewer</code></td>
              <td>Ask your team or reset using the steps below</td>
            </tr>
          </tbody>
        </table>

        <h3>Add or reset a user password</h3>
        <p>Edit <code>smart-qr-dev-doc/src/assets/content/users.json</code>. Generate a SHA-256 hex
        digest of your new password:</p>
        <pre><code># Node.js
node -e "console.log(require('crypto').createHash('sha256').update('YourPassword').digest('hex'))"

# PowerShell
(Get-FileHash -Algorithm SHA256 -InputStream ([System.IO.MemoryStream]::new([System.Text.Encoding]::UTF8.GetBytes('YourPassword')))).Hash.ToLower()</code></pre>
        <p>Paste the output as the <code>passwordHash</code> value in <code>users.json</code>.</p>

        <div class="warning-box">
          <i class="bi bi-shield-lock"></i>
          <div>
            <code>users.json</code> is bundled with the client — treat this as
            <strong>access obfuscation only</strong>, not enterprise IAM. Do not use this pattern
            for any system that holds sensitive data or is exposed to the internet without
            additional access controls.
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           12. PRODUCTION BUILD
      ═══════════════════════════════════════════ -->
      <section class="card" id="prod-build">
        <h2>Production builds</h2>

        <h3>Smart_QR_UI</h3>
        <pre><code># Standard (smaller machines)
npm run build

# Increased heap — use this for the official prod build (large bundle)
npm run build-prod
# Equivalent: node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --configuration production
# Output: dist/smart-qr/</code></pre>

        <h3>Smart_QR_API</h3>
        <pre><code>dotnet publish -c Release -o ./publish
# IIS / Windows Service: point the site root to the publish/ folder</code></pre>

        <h3>smart-qr-dev-doc</h3>
        <pre><code>npm run build
# Output: dist/developer-docs/
# Serve as static files behind nginx or IIS</code></pre>

        <h3>Build budget limits (Smart_QR_UI)</h3>
        <table>
          <thead><tr><th>Budget type</th><th>Warning</th><th>Error</th></tr></thead>
          <tbody>
            <tr><td>Initial bundle</td><td>7 MB</td><td>8 MB</td></tr>
            <tr><td>Component styles</td><td>150 kB</td><td>200 kB</td></tr>
          </tbody>
        </table>
      </section>

      <!-- ══════════════════════════════════════════
           13. TROUBLESHOOTING
      ═══════════════════════════════════════════ -->
      <section class="card" id="troubleshoot">
        <h2>Troubleshooting</h2>
        <table>
          <thead>
            <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Frontend shows <code>ERR_CONNECTION_REFUSED</code></td>
              <td>API not running, or wrong <code>baseApiUrl</code></td>
              <td>Start the API (<code>dotnet run</code>) and verify port 5100 is open. Check <code>environment.ts → baseApiUrl</code>.</td>
            </tr>
            <tr>
              <td>CORS error in browser console</td>
              <td>Frontend origin not in the allowed list</td>
              <td>Add your localhost origin to <code>SysConfig.WebUIURL</code> or the fallback list in <code>Program.cs</code>, then restart API.</td>
            </tr>
            <tr>
              <td><code>401 Unauthorized</code> on API calls</td>
              <td>Missing or expired JWT</td>
              <td>Re-login to refresh the token. Check <code>authToken</code> in <code>localStorage</code>.</td>
            </tr>
            <tr>
              <td>SQL Server connection failed on API start</td>
              <td>Wrong connection string or DB not created</td>
              <td>Verify <code>constring</code> in <code>appsettings.json</code>. Create the database and run <code>dotnet ef database update</code>.</td>
            </tr>
            <tr>
              <td><code>dotnet ef</code> not found</td>
              <td>EF Core CLI tools not installed</td>
              <td><code>dotnet tool install --global dotnet-ef</code></td>
            </tr>
            <tr>
              <td>Angular CLI version mismatch warning</td>
              <td>Global CLI differs from project CLI</td>
              <td>Use <code>npx ng serve</code> to always use the project-local version.</td>
            </tr>
            <tr>
              <td>Port 4200 already in use</td>
              <td>Another Angular app or process on same port</td>
              <td><code>npx ng serve --port 4300</code></td>
            </tr>
            <tr>
              <td>DevDocs login fails with correct password</td>
              <td>Hash mismatch in <code>users.json</code></td>
              <td>Regenerate the SHA-256 hash and update <code>users.json</code> (see DevDocs Auth section).</td>
            </tr>
            <tr>
              <td>Email not sent (new user / QR created)</td>
              <td>AWS SES credentials missing or not verified</td>
              <td>Set <code>AWS.*</code> keys in <code>appsettings.json</code>. Verify sender address in SES console.</td>
            </tr>
            <tr>
              <td>Hangfire jobs not running</td>
              <td><code>HangfireConnection</code> wrong or DB missing</td>
              <td>Verify connection string; Hangfire creates its own schema automatically on first run.</td>
            </tr>
            <tr>
              <td>Build fails with heap out-of-memory</td>
              <td>Node.js default heap too small for large bundle</td>
              <td>Use <code>npm run build-prod</code> (sets <code>--max_old_space_size=8192</code>).</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- ══════════════════════════════════════════
           14. NEXT STEPS
      ═══════════════════════════════════════════ -->
      <section class="card" id="next">
        <h2>Next steps</h2>
        <ul class="next-list">
          <li>
            <a routerLink="/architecture">
              <i class="bi bi-diagram-3"></i>
              <span><strong>Architecture</strong> — how API, UI, DB, and services fit together.</span>
            </a>
          </li>
          <li>
            <a routerLink="/smart-qr-hub">
              <i class="bi bi-qr-code"></i>
              <span><strong>Smart QR Hub</strong> — full product feature map and module guide.</span>
            </a>
          </li>
          <li>
            <a routerLink="/domains/smart-qr-overview">
              <i class="bi bi-folder2-open"></i>
              <span><strong>Smart QR Overview</strong> — folder layout, routing, and naming conventions.</span>
            </a>
          </li>
          <li>
            <a routerLink="/domains/smart-qr-auth">
              <i class="bi bi-shield-lock"></i>
              <span><strong>Auth domain</strong> — JWT flow, guards, and token storage in detail.</span>
            </a>
          </li>
          <li>
            <a routerLink="/api-truth-source">
              <i class="bi bi-code-slash"></i>
              <span><strong>API Reference</strong> — all REST endpoints with parameters and responses.</span>
            </a>
          </li>
          <li>
            <a routerLink="/domains">
              <i class="bi bi-grid"></i>
              <span><strong>Browse all domains</strong> — features, API notes, and Q&amp;A by domain.</span>
            </a>
          </li>
        </ul>
      </section>

    </div>
  `,
  styles: [`
    /* ─── Page ─── */
    .page { max-width: 900px; margin: 0 auto; }

    .back-link {
      font-size: 13px; color: #6c8cff; text-decoration: none;
      display: inline-flex; align-items: center; gap: 4px; margin-bottom: 12px;
    }
    .back-link:hover { text-decoration: underline; }

    h1 { font-size: 28px; font-weight: 800; color: #1a1f36; margin: 0 0 10px; }
    h1 i { margin-right: 8px; color: #6c8cff; }

    .subtitle {
      font-size: 15px; color: #555; margin: 0 0 24px; line-height: 1.65; max-width: 780px;
    }
    .subtitle strong { color: #1a1f36; }

    /* ─── Section nav strip ─── */
    .toc-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      background: #fff;
      border-radius: 10px;
      padding: 12px 16px;
      margin-bottom: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      border: 1px solid #e8ebf5;
    }
    .toc-strip a {
      font-size: 12px;
      font-weight: 600;
      color: #6c8cff;
      text-decoration: none;
      padding: 4px 10px;
      border-radius: 6px;
      background: rgba(108,140,255,0.06);
      border: 1px solid rgba(108,140,255,0.15);
      white-space: nowrap;
      transition: background 0.15s, color 0.15s;
    }
    .toc-strip a:hover { background: #6c8cff; color: #fff; }

    /* ─── Setup flow ─── */
    .setup-flow {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
      background: linear-gradient(135deg, #1a1f36, #2d3561);
      border-radius: 12px;
      padding: 18px 24px;
      margin-bottom: 24px;
    }
    .flow-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex: 1;
      min-width: 70px;
    }
    .flow-num {
      width: 32px; height: 32px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.7);
    }
    .flow-step.active .flow-num {
      background: #6c8cff;
      border-color: #6c8cff;
      color: #fff;
    }
    .flow-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255,255,255,0.5);
      text-align: center;
    }
    .flow-step.active .flow-label { color: rgba(255,255,255,0.9); }
    .flow-arrow { color: rgba(255,255,255,0.2); font-size: 12px; flex-shrink: 0; }

    /* ─── Cards ─── */
    .card {
      background: #fff;
      border-radius: 14px;
      padding: 28px 32px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      margin-bottom: 16px;
      border: 1px solid #e8ebf5;
    }
    .card h2 {
      font-size: 19px; font-weight: 700; color: #1a1f36;
      margin: 0 0 18px; padding-bottom: 12px;
      border-bottom: 2px solid #f0f2f7;
      display: flex; align-items: center; gap: 10px;
    }
    .card h3 { font-size: 15px; font-weight: 700; color: #1a1f36; margin: 22px 0 8px; }
    .card p  { font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 12px; }
    .card ul, .card ol { padding-left: 22px; margin: 0 0 12px; font-size: 14px; color: #444; }
    .card li { margin-bottom: 5px; line-height: 1.65; }
    .card a  { color: #6c8cff; font-weight: 500; text-decoration: none; }
    .card a:hover { text-decoration: underline; }

    .step-badge {
      display: inline-flex; align-items: center; justify-content: center;
      width: 26px; height: 26px;
      background: #6c8cff; color: #fff;
      border-radius: 50%;
      font-size: 13px; font-weight: 700;
      flex-shrink: 0;
    }

    /* ─── Code ─── */
    code {
      background: #f0f3ff; color: #4a6cf7;
      padding: 2px 7px; border-radius: 4px; font-size: 13px;
    }
    pre {
      background: #1a1f36; border-radius: 10px;
      padding: 18px 22px; overflow-x: auto; margin: 0 0 14px;
    }
    pre code { background: none; color: #e0e6ff; padding: 0; font-size: 13px; line-height: 1.6; }

    /* ─── Tables ─── */
    table { width: 100%; border-collapse: collapse; margin: 0 0 14px; font-size: 13px; }
    th {
      text-align: left; padding: 10px 14px;
      background: #f5f7fa; border-bottom: 2px solid #e0e4ec;
      font-weight: 700; color: #374151;
    }
    td { padding: 9px 14px; border-bottom: 1px solid #f0f2f7; color: #444; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafbff; }

    /* ─── Alert boxes ─── */
    .info-box, .warning-box {
      display: flex; gap: 12px; padding: 14px 18px;
      border-radius: 10px; margin: 12px 0; font-size: 13.5px; line-height: 1.6;
    }
    .info-box {
      background: #f0f5ff;
      border-left: 4px solid #6c8cff;
      color: #2d4fce;
    }
    .info-box > i { color: #6c8cff; font-size: 16px; margin-top: 2px; flex-shrink: 0; }
    .warning-box {
      background: #fff8e1;
      border-left: 4px solid #f9a825;
      color: #7a5c00;
    }
    .warning-box > i { color: #f9a825; font-size: 16px; margin-top: 2px; flex-shrink: 0; }

    /* ─── Next-steps list ─── */
    .next-list { list-style: none; padding: 0; margin: 0; }
    .next-list li { margin-bottom: 10px; }
    .next-list a {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 12px 16px; border-radius: 10px;
      background: #f8f9ff; border: 1px solid #e8ebf5;
      color: inherit; text-decoration: none;
      transition: background 0.15s, border-color 0.15s;
    }
    .next-list a:hover { background: #eef1ff; border-color: #c0d0ff; }
    .next-list .bi { font-size: 18px; color: #6c8cff; flex-shrink: 0; margin-top: 2px; }
    .next-list span { font-size: 14px; color: #444; line-height: 1.55; }
    .next-list strong { color: #1a1f36; }

    /* ─── Responsive ─── */
    @media (max-width: 768px) {
      .card { padding: 20px 18px; }
      .setup-flow { padding: 14px 16px; }
      .flow-label { display: none; }
      pre { padding: 14px 16px; }
    }
  `]
})
export class GettingStartedComponent {}
