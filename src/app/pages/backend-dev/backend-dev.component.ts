import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-backend-dev',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">

      <!-- ── Header ── -->
      <a routerLink="/welcome" class="back-link">
        <i class="bi bi-arrow-left"></i> Home
      </a>
      <div class="page-header">
        <div class="header-icon"><i class="bi bi-server"></i></div>
        <div>
          <h1>Backend Developer Guide</h1>
          <p class="subtitle">
            Everything you need to work on <strong>Smart_QR_API</strong> — ASP.NET Core 8, Entity Framework Core,
            JWT authentication, REST APIs, Hangfire background jobs, and the SmartQR content system.
          </p>
        </div>
      </div>

      <!-- ── Section nav ── -->
      <nav class="toc-strip">
        <a href="#tech-stack">Tech stack</a>
        <a href="#architecture">Architecture</a>
        <a href="#folder">Folder layout</a>
        <a href="#db-models">Database models</a>
        <a href="#ef-core">Entity Framework</a>
        <a href="#di">Dependency injection</a>
        <a href="#auth">Authentication</a>
        <a href="#api-structure">API structure</a>
        <a href="#services">Services</a>
        <a href="#background">Background jobs</a>
        <a href="#config">Configuration</a>
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
      </section>

      <!-- ══════════════════════════════════════════
           ARCHITECTURE
      ═══════════════════════════════════════════ -->
      <section class="card" id="architecture">
        <h2><i class="bi bi-diagram-3"></i> Architecture overview</h2>
        <p>
          Smart_QR_API follows a <strong>layered architecture</strong> with clear separation of concerns:
        </p>

        <div class="arch-diagram">
          <div class="arch-layer api">
            <div class="arch-label">APIs (Controllers)</div>
            <div class="arch-desc">REST endpoints organized by module (AuthenticationApi, SmartQRApi, etc.)</div>
          </div>
          <div class="arch-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="arch-layer services">
            <div class="arch-label">Services</div>
            <div class="arch-desc">Business logic — QR CRUD, loyalty, menu, analytics, email</div>
          </div>
          <div class="arch-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="arch-layer repo">
            <div class="arch-label">Repositories + EF Core</div>
            <div class="arch-desc">Data access via Entity Framework Core DbContext</div>
          </div>
          <div class="arch-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="arch-layer database">
            <div class="arch-label">SQL Server Database</div>
            <div class="arch-desc">Tables for users, roles, QR codes, content, analytics</div>
          </div>
        </div>

        <h3>Cross-cutting concerns</h3>
        <ul>
          <li><strong>Authentication:</strong> JWT tokens issued by AuthenticationApi, validated on every request</li>
          <li><strong>Background jobs:</strong> Hangfire hosts long-running tasks (expiry notifications, emails)</li>
          <li><strong>Middleware:</strong> CORS, exception handling, request logging in Program.cs</li>
          <li><strong>Dependency injection:</strong> All services and repositories registered in DI container</li>
        </ul>
      </section>

      <!-- ══════════════════════════════════════════
           FOLDER LAYOUT
      ═══════════════════════════════════════════ -->
      <section class="card" id="folder">
        <h2><i class="bi bi-folder2-open"></i> Folder layout</h2>

        <h3>Root directories</h3>
        <ul>
          <li><strong>Smart_QR_API/</strong> — ASP.NET Core 8 backend API</li>
          <li><strong>Smart_QR_UI/</strong> — Angular 19 product frontend</li>
          <li><strong>smart-qr-dev-doc/</strong> — Angular 21 developer documentation portal</li>
          <li><strong>SQL/</strong> — Database initialization scripts</li>
        </ul>

        <h3>Smart_QR_API structure</h3>
        <ul>
          <li><strong>Program.cs</strong> — Entry point, middleware pipeline, DI setup, Hangfire</li>
          <li><strong>appsettings.json</strong> — Runtime config (DB, JWT, AWS, Google, etc.)</li>
          <li><strong>Properties/launchSettings.json</strong> — Port 5100, IIS Express settings</li>
          <li><strong>APIs/</strong> — Controllers (REST endpoints) organized by module</li>
          <li><strong>DBModels/SmartProject/</strong> — EF Core entity classes</li>
          <li><strong>Infrastructure/Services/</strong> — Business logic layer</li>
          <li><strong>Infrastructure/Repositories/</strong> — Data access layer</li>
          <li><strong>Infrastructure/Context/</strong> — SmartProjectContext DbContext</li>
          <li><strong>Migrations/</strong> — EF Core migration files</li>
          <li><strong>UploadedFiles/</strong> — Files served at /content/* (QR images, uploads)</li>
        </ul>
      </section>

      <!-- ══════════════════════════════════════════
           DATABASE MODELS
      ═══════════════════════════════════════════ -->
      <section class="card" id="db-models">
        <h2><i class="bi bi-database"></i> Core database models</h2>

        <h3>Authentication and Authorization</h3>
        <p><strong>SysUser:</strong> UserId (PK), Username, Email, PasswordHash, RoleId (FK), IsActive</p>
        <p><strong>SysRole:</strong> RoleId (PK), RoleName, Description, Permissions</p>

        <h3>QR Code System</h3>
        <p><strong>QRCode:</strong> QRCodeID (PK), QRName, QRTypeID, CreatedByUserID, CreatedDate, ExpiryDate, IsActive</p>
        <p><strong>QRCodeDesign:</strong> DesignID (PK), QRCodeID (FK), DotsColor, FrameColor, LogoUrl, FrameStyle</p>
        <p><strong>QRCodeScan:</strong> ScanID (PK), QRCodeID (FK), ClientIP, UserAgent, ScanDate, Latitude, Longitude</p>

        <h3>Content and Loyalty</h3>
        <p><strong>LoyaltyMember:</strong> MemberID (PK), QRCodeID (FK), MemberPhone, MemberEmail, RegisterDate, TotalStamps</p>
        <p><strong>MenuShop:</strong> ShopID (PK), QRCodeID (FK), ShopName, ShopImage, IsActive</p>

        <h3>Configuration</h3>
        <p><strong>SysConfig:</strong> ConfigID (PK), DefaultEmailAddress, WebUIURL, WebAPIURL, OtpExpiredMinute</p>
      </section>

      <!-- ══════════════════════════════════════════
           ENTITY FRAMEWORK CORE
      ═══════════════════════════════════════════ -->
      <section class="card" id="ef-core">
        <h2><i class="bi bi-database-fill"></i> Entity Framework Core</h2>

        <h3>SmartProjectContext (DbContext)</h3>
        <p>
          All EF Core configuration lives in <code>Infrastructure/Context/SmartProjectContext.cs</code>.
          The context initializes on <code>Program.cs</code> using the connection string from
          <code>appsettings.json → ConnectionStrings.constring</code>.
        </p>

        <h3>Migrations workflow</h3>
        <ul>
          <li><code>dotnet ef migrations list</code> — List pending migrations</li>
          <li><code>dotnet ef migrations add AddNewEntityField</code> — Create a new migration</li>
          <li><code>dotnet ef database update</code> — Apply migrations to database</li>
          <li><code>dotnet ef database update YourMigrationName</code> — Revert to specific migration</li>
          <li><code>dotnet ef migrations remove</code> — Remove the latest migration</li>
        </ul>

        <h3>Common EF patterns</h3>
        <table>
          <thead><tr><th>Pattern</th><th>Use case</th></tr></thead>
          <tbody>
            <tr>
              <td><code>DbSet&lt;T&gt;</code></td>
              <td>Access an entity table</td>
            </tr>
            <tr>
              <td><code>.Include()</code></td>
              <td>Eager load related data to prevent N+1 queries</td>
            </tr>
            <tr>
              <td><code>.Where().FirstOrDefault()</code></td>
              <td>Query with condition</td>
            </tr>
            <tr>
              <td><code>.AsNoTracking()</code></td>
              <td>Read-only queries for better performance</td>
            </tr>
            <tr>
              <td><code>SaveChangesAsync()</code></td>
              <td>Persist changes (Create, Update, Delete)</td>
            </tr>
          </tbody>
        </table>

        <div class="info-box">
          <i class="bi bi-info-circle"></i>
          <div>
            <strong>Important:</strong> Always use async/await for database calls. EF Core handles connection pooling automatically.
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           DEPENDENCY INJECTION
      ═══════════════════════════════════════════ -->
      <section class="card" id="di">
        <h2><i class="bi bi-puzzle"></i> Dependency injection</h2>

        <h3>Service registration</h3>
        <p>
          All services, repositories, and infrastructure components are registered in <code>Program.cs</code>.
          The application injects these into controllers and other services via constructor injection.
        </p>

        <h3>Service lifetimes</h3>
        <table>
          <thead><tr><th>Lifetime</th><th>Behavior</th><th>Use for</th></tr></thead>
          <tbody>
            <tr>
              <td><code>AddScoped</code></td>
              <td>One instance per HTTP request</td>
              <td>Default for APIs. Services and repositories.</td>
            </tr>
            <tr>
              <td><code>AddTransient</code></td>
              <td>New instance every time</td>
              <td>Lightweight, stateless helpers</td>
            </tr>
            <tr>
              <td><code>AddSingleton</code></td>
              <td>One instance for app lifetime</td>
              <td>Configuration, caches, long-lived resources</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- ══════════════════════════════════════════
           AUTHENTICATION
      ═══════════════════════════════════════════ -->
      <section class="card" id="auth">
        <h2><i class="bi bi-shield-lock"></i> JWT authentication</h2>

        <h3>Token flow</h3>
        <ol>
          <li>Client calls <code>/AuthenticationApi/login</code> with credentials</li>
          <li>Server validates username and password hash</li>
          <li>Server issues JWT token with userId, role, expiration</li>
          <li>Client stores token in localStorage.authToken</li>
          <li>Client includes token in Authorization header for subsequent requests</li>
        </ol>

        <h3>JWT configuration</h3>
        <p>Configure in <code>appsettings.json</code>:</p>
        <ul>
          <li><code>JwtAuth.Key</code> — HMAC-SHA256 signing secret (minimum 32 characters, change before production)</li>
          <li><code>JwtAuth.Issuer</code> — Token issuer claim (e.g., "systematic.com")</li>
          <li><code>JwtAuth.Audience</code> — Token audience (e.g., "smartqr-app")</li>
          <li><code>JwtAuth.TokenLifeTime</code> — Token expiry in minutes (default: 180 = 3 hours)</li>
        </ul>

        <h3>Token payload</h3>
        <p>Decoded JWT contains these claims:</p>
        <ul>
          <li><code>sub</code> — User ID</li>
          <li><code>username</code> — User email/username</li>
          <li><code>role</code> — User role name (e.g., "admin")</li>
          <li><code>roleId</code> — Numeric role ID</li>
          <li><code>exp</code> — Expiration timestamp</li>
          <li><code>iat</code> — Issued at timestamp</li>
        </ul>

        <h3>Protecting endpoints</h3>
        <p>Use the <code>[Authorize]</code> attribute on controller methods to require a valid JWT token.</p>
        <p>For admin-only endpoints, verify the role server-side (never trust client-side checks alone).</p>

        <div class="warning-box">
          <i class="bi bi-exclamation-triangle"></i>
          <div>
            <strong>Never rely on token claims alone for authorization.</strong>
            The client can modify localStorage. Always verify roles and permissions server-side.
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           API STRUCTURE
      ═══════════════════════════════════════════ -->
      <section class="card" id="api-structure">
        <h2><i class="bi bi-diagram-2"></i> API structure and conventions</h2>

        <h3>Controller organization</h3>
        <table>
          <thead><tr><th>Controller</th><th>Base route</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td>AuthenticationApi</td><td>/AuthenticationApi</td><td>Login, register, token refresh</td></tr>
            <tr><td>SmartQRApi</td><td>/SmartQRApi</td><td>QR CRUD, save, design, list</td></tr>
            <tr><td>AnalyticsApi</td><td>/SmartQRApi</td><td>Scan history, reports</td></tr>
            <tr><td>AdminApi</td><td>/AdminApi</td><td>User/role management (admin-only)</td></tr>
            <tr><td>LoyaltyApi</td><td>/SmartQRApi</td><td>Loyalty registration, stamps, rewards</td></tr>
            <tr><td>MenuApi</td><td>/SmartQRApi</td><td>Shops, products, orders</td></tr>
            <tr><td>EventApi</td><td>/SmartQRApi</td><td>Event registration</td></tr>
            <tr><td>FeedbackApi</td><td>/SmartQRApi</td><td>Service feedback surveys</td></tr>
          </tbody>
        </table>

        <h3>HTTP method conventions</h3>
        <ul>
          <li><strong>GET:</strong> Retrieve data (GetQRList, GetQRById, GetScansHistory)</li>
          <li><strong>POST:</strong> Create or perform action (SaveQR, Login, ScanQR)</li>
          <li><strong>PUT:</strong> Update existing resource (UpdateQR)</li>
          <li><strong>DELETE:</strong> Remove resource (DeleteQR)</li>
        </ul>

        <h3>API response envelope</h3>
        <p>All responses are wrapped in a standard envelope:</p>
        <ul>
          <li><code>statusCode</code> — HTTP status (200, 400, 210 for token expiry)</li>
          <li><code>statusTerm</code> — Status category: "success", "error", "error_validation", "error_securityTokenExpiry"</li>
          <li><code>message</code> — Human-readable message</li>
          <li><code>data</code> — Actual payload (null if no data or on error)</li>
        </ul>

        <h3>Query string filters</h3>
        <p>Common query parameters include:</p>
        <ul>
          <li><code>pageNumber</code>, <code>pageSize</code> — Pagination</li>
          <li><code>searchText</code> — Search filter</li>
          <li><code>sortBy</code> — Sort column</li>
          <li><code>startDate</code>, <code>endDate</code> — Date range filtering</li>
        </ul>
      </section>

      <!-- ══════════════════════════════════════════
           SERVICES
      ═══════════════════════════════════════════ -->
      <section class="card" id="services">
        <h2><i class="bi bi-gear"></i> Service layer</h2>
        <p>
          Services live in <code>Infrastructure/Services/</code> and contain the business logic
          for each domain. Services use repositories to query the database and coordinate
          complex operations.
        </p>

        <div class="service-list">
          <div *ngFor="let svc of services" class="service-row">
            <div class="svc-name"><code>{{ svc.file }}</code></div>
            <div class="svc-desc">{{ svc.desc }}</div>
          </div>
        </div>

        <h3>Service responsibilities</h3>
        <ul>
          <li><strong>Business logic:</strong> Complex rules, validation, calculations</li>
          <li><strong>Orchestration:</strong> Call multiple repositories and other services</li>
          <li><strong>Data transformation:</strong> Map entities to DTOs before returning</li>
          <li><strong>Cross-cutting:</strong> Email sending, file uploads, third-party API calls</li>
        </ul>
      </section>

      <!-- ══════════════════════════════════════════
           BACKGROUND JOBS
      ═══════════════════════════════════════════ -->
      <section class="card" id="background">
        <h2><i class="bi bi-hourglass-split"></i> Background jobs (Hangfire)</h2>

        <h3>What is Hangfire?</h3>
        <p>
          <strong>Hangfire</strong> is a .NET background job library that persists jobs in SQL Server.
          The SmartQR_API uses Hangfire to run long-running tasks asynchronously without blocking HTTP responses.
        </p>

        <h3>Built-in Hangfire jobs</h3>
        <table>
          <thead><tr><th>Job</th><th>Trigger</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr>
              <td>QRCodeExpiryNotificationService</td>
              <td>Scheduled (recurring)</td>
              <td>Send expiry reminders before QR expires</td>
            </tr>
            <tr>
              <td>SendEmailTask</td>
              <td>On-demand / queued</td>
              <td>Send transactional emails (registration, QR created)</td>
            </tr>
            <tr>
              <td>GenerateReportTask</td>
              <td>On-demand / scheduled</td>
              <td>Generate analytics reports in background</td>
            </tr>
          </tbody>
        </table>

        <h3>Job configuration</h3>
        <p>
          Hangfire is configured in <code>Program.cs</code> to use SQL Server for job persistence.
          It automatically creates its own tables with prefix <code>HangFire_*</code> on first run.
        </p>

        <h3>Monitor Hangfire jobs</h3>
        <p>
          Visit <code>http://localhost:5100/hangfire</code> to see job queues, successful jobs, failed jobs, and retry history.
        </p>

        <div class="info-box">
          <i class="bi bi-info-circle"></i>
          <div>
            Ensure <code>HangfireConnection</code> in appsettings.json points to a database where you have CREATE TABLE permissions.
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           CONFIGURATION
      ═══════════════════════════════════════════ -->
      <section class="card" id="config">
        <h2><i class="bi bi-sliders2"></i> Configuration management</h2>

        <h3>appsettings.json structure</h3>
        <p>The configuration file contains these major sections:</p>
        <table>
          <thead><tr><th>Section</th><th>Key settings</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>ConnectionStrings</strong></td>
              <td>constring (main DB), HangfireConnection (job queue)</td>
            </tr>
            <tr>
              <td><strong>JwtAuth</strong></td>
              <td>Key (signing secret), Issuer, Audience, TokenLifeTime</td>
            </tr>
            <tr>
              <td><strong>AWS</strong></td>
              <td>AccessKey, SecretKey, Region, SES (sender email)</td>
            </tr>
            <tr>
              <td><strong>GoogleAuth</strong></td>
              <td>ClientId for OAuth 2.0</td>
            </tr>
            <tr>
              <td><strong>GoogleRecaptcha</strong></td>
              <td>SecretKey, SiteKey for v3</td>
            </tr>
            <tr>
              <td><strong>AppSetting</strong></td>
              <td>defaultSystemLicense and other app-wide settings</td>
            </tr>
          </tbody>
        </table>

        <h3>Environment-specific overrides</h3>
        <p>
          Use <code>appsettings.Development.json</code> for dev-only settings. It merges with the base
          <code>appsettings.json</code>, and Development values take precedence.
        </p>
        <p>Common dev overrides:</p>
        <ul>
          <li><code>Logging.LogLevel.Default</code> — Set to "Debug" for detailed logs</li>
          <li><code>ConnectionStrings.constring</code> — Point to local dev database</li>
          <li><code>JwtAuth.Key</code> — Can use simpler key for local testing (change for shared/prod)</li>
        </ul>

        <div class="warning-box">
          <i class="bi bi-exclamation-triangle"></i>
          <div>
            <strong>Never commit real secrets.</strong>
            Use <code>dotnet user-secrets</code> for local dev or environment variables for production.
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════
           PATTERNS
      ═══════════════════════════════════════════ -->
      <section class="card" id="patterns">
        <h2><i class="bi bi-lightbulb"></i> Common backend patterns</h2>

        <div class="pattern-list">
          <div *ngFor="let p of patterns" class="pattern-item">
            <div class="pattern-icon"><i class="bi" [ngClass]="p.icon"></i></div>
            <div>
              <h4>{{ p.title }}</h4>
              <p>{{ p.desc }}</p>
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
            <tr><td><code>dotnet restore</code></td><td>Restore NuGet packages</td></tr>
            <tr><td><code>dotnet build</code></td><td>Compile the project</td></tr>
            <tr><td><code>dotnet run</code></td><td>Start the API on http://localhost:5100</td></tr>
            <tr><td><code>dotnet watch run</code></td><td>Run with hot-reload</td></tr>
            <tr><td><code>dotnet ef migrations list</code></td><td>Show all migrations</td></tr>
            <tr><td><code>dotnet ef migrations add [Name]</code></td><td>Create a new migration</td></tr>
            <tr><td><code>dotnet ef database update</code></td><td>Apply pending migrations</td></tr>
            <tr><td><code>dotnet test</code></td><td>Run unit tests</td></tr>
            <tr><td><code>dotnet publish -c Release -o ./publish</code></td><td>Create production build</td></tr>
          </tbody>
        </table>
      </section>

      <!-- ── Next ── -->
      <section class="card">
        <h2><i class="bi bi-arrow-right-circle"></i> Dig deeper</h2>
        <ul class="next-list">
          <li><a routerLink="/getting-started"><i class="bi bi-rocket-takeoff"></i><span><strong>Getting Started</strong> — full setup guide for backend, frontend, and database.</span></a></li>
          <li><a routerLink="/architecture"><i class="bi bi-diagram-3"></i><span><strong>Architecture</strong> — system design, API layers, module interactions.</span></a></li>
          <li><a routerLink="/api-truth-source"><i class="bi bi-code-slash"></i><span><strong>API Reference</strong> — all REST endpoints with parameters and responses.</span></a></li>
          <li><a routerLink="/domains"><i class="bi bi-grid"></i><span><strong>Browse all domains</strong> — deep dives into each feature area.</span></a></li>
        </ul>
      </section>

    </div>
  `,
  styles: [`
    .page {margin: 0 auto; }
    .back-link { font-size: 13px; color: #6c8cff; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 14px; }
    .back-link:hover { text-decoration: underline; }
    .page-header { display: flex; align-items: flex-start; gap: 18px; margin-bottom: 20px; }
    .header-icon { width: 56px; height: 56px; border-radius: 14px; background: linear-gradient(135deg, #6c8cff, #4a6cf7); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .header-icon .bi { font-size: 26px; color: #fff; }
    h1 { font-size: 27px; font-weight: 800; color: #1a1f36; margin: 0 0 8px; }
    .subtitle { font-size: 14px; color: #666; margin: 0; line-height: 1.65; max-width: 780px; }
    .subtitle strong { color: #1a1f36; }
    .toc-strip { display: flex; flex-wrap: wrap; gap: 6px; background: #fff; border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e8ebf5; }
    .toc-strip a { font-size: 12px; font-weight: 600; color: #6c8cff; text-decoration: none; padding: 4px 10px; border-radius: 6px; background: rgba(108,140,255,0.06); border: 1px solid rgba(108,140,255,0.15); white-space: nowrap; transition: background 0.15s, color 0.15s; }
    .toc-strip a:hover { background: #6c8cff; color: #fff; }
    .card { background: #fff; border-radius: 14px; padding: 26px 30px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); margin-bottom: 16px; border: 1px solid #e8ebf5; }
    .card h2 { font-size: 18px; font-weight: 700; color: #1a1f36; margin: 0 0 18px; padding-bottom: 12px; border-bottom: 2px solid #f0f2f7; display: flex; align-items: center; gap: 10px; }
    .card h2 .bi { color: #6c8cff; }
    .card h3 { font-size: 14px; font-weight: 700; color: #1a1f36; margin: 20px 0 8px; }
    .card h4 { font-size: 13px; font-weight: 700; color: #374151; margin: 12px 0 6px; }
    .card p { font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 10px; }
    .card ul { padding-left: 20px; margin: 0 0 10px; font-size: 13px; color: #555; }
    .card li { margin-bottom: 4px; line-height: 1.6; }
    .card a { color: #6c8cff; font-weight: 500; text-decoration: none; }
    .card a:hover { text-decoration: underline; }
    code { background: #f0f3ff; color: #4a6cf7; padding: 2px 6px; border-radius: 4px; font-size: 12.5px; }
    .arch-diagram { display: flex; flex-direction: column; gap: 0; background: #f8f9ff; border-radius: 12px; padding: 20px; margin: 16px 0; }
    .arch-layer { padding: 14px 16px; border-radius: 10px; background: #fff; border: 2px solid #e8ebf5; margin-bottom: 8px; }
    .arch-layer.api { border-color: #6c8cff; background: rgba(108,140,255,0.05); }
    .arch-layer.services { border-color: #f59e0b; background: rgba(245,158,11,0.05); }
    .arch-layer.repo { border-color: #22c55e; background: rgba(34,197,94,0.05); }
    .arch-layer.database { border-color: #ef4444; background: rgba(239,68,68,0.05); }
    .arch-label { font-size: 13px; font-weight: 700; color: #1a1f36; }
    .arch-desc { font-size: 12px; color: #666; margin-top: 4px; }
    .arch-arrow { text-align: center; color: #bbb; font-size: 16px; }
    .stack-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
    .stack-card { display: flex; align-items: center; gap: 12px; background: #f8f9ff; border: 1px solid #e8ebf5; border-radius: 10px; padding: 12px 14px; }
    .stack-icon { width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .stack-icon .bi { font-size: 18px; }
    .stack-name { font-size: 13px; font-weight: 700; color: #1a1f36; }
    .stack-version { font-size: 11px; color: #999; margin-top: 2px; }
    .service-list { margin-bottom: 14px; }
    .service-row { display: flex; gap: 16px; padding: 8px 12px; border-radius: 7px; font-size: 13px; }
    .service-row:nth-child(odd) { background: #f8f9ff; }
    .svc-name { min-width: 280px; flex-shrink: 0; }
    .svc-desc { color: #555; flex: 1; }
    .pattern-list { display: flex; flex-direction: column; gap: 14px; }
    .pattern-item { display: flex; gap: 14px; }
    .pattern-icon { width: 36px; height: 36px; border-radius: 9px; background: rgba(108,140,255,0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
    .pattern-icon .bi { font-size: 17px; color: #6c8cff; }
    .pattern-item h4 { font-size: 14px; font-weight: 700; color: #1a1f36; margin: 0 0 4px; }
    .pattern-item p { font-size: 13px; color: #666; margin: 0; line-height: 1.6; }
    .info-box, .warning-box { display: flex; gap: 12px; padding: 13px 16px; border-radius: 10px; font-size: 13.5px; line-height: 1.6; }
    .info-box { background: #f0f5ff; border-left: 4px solid #6c8cff; color: #2d4fce; }
    .info-box > i { color: #6c8cff; font-size: 16px; margin-top: 2px; flex-shrink: 0; }
    .warning-box { background: #fff8e1; border-left: 4px solid #f9a825; color: #7a5c00; }
    .warning-box > i { color: #f9a825; font-size: 16px; margin-top: 2px; flex-shrink: 0; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 0 0 10px; }
    th { text-align: left; padding: 9px 12px; background: #f5f7fa; border-bottom: 2px solid #e0e4ec; font-weight: 700; color: #374151; }
    td { padding: 8px 12px; border-bottom: 1px solid #f0f2f7; color: #444; vertical-align: top; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafbff; }
    .next-list { list-style: none; padding: 0; margin: 0; }
    .next-list li { margin-bottom: 8px; }
    .next-list a { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 10px; background: #f8f9ff; border: 1px solid #e8ebf5; color: inherit; text-decoration: none; transition: background 0.15s, border-color 0.15s; }
    .next-list a:hover { background: #eef1ff; border-color: #c0d0ff; }
    .next-list .bi { font-size: 17px; color: #6c8cff; flex-shrink: 0; }
    .next-list span { font-size: 13.5px; color: #444; }
    .next-list strong { color: #1a1f36; }
    @media (max-width: 768px) {
      .card { padding: 18px 16px; }
      .page-header { flex-direction: column; }
    }
  `]
})
export class BackendDevComponent {

  techStack = [
    { name: '.NET SDK', version: '8.0', icon: 'bi-windows', color: '#0078d4', bg: 'rgba(0,120,212,0.08)' },
    { name: 'ASP.NET Core', version: '8.0', icon: 'bi-code-slash', color: '#512bd4', bg: 'rgba(81,43,212,0.08)' },
    { name: 'Entity Framework', version: '8.0', icon: 'bi-database-fill', color: '#0078d4', bg: 'rgba(0,120,212,0.08)' },
    { name: 'SQL Server', version: '2017+', icon: 'bi-archive', color: '#cc2927', bg: 'rgba(204,41,39,0.08)' },
    { name: 'Hangfire', version: '1.8.x', icon: 'bi-hourglass-split', color: '#1e88e5', bg: 'rgba(30,136,229,0.08)' },
    { name: 'Swagger/OpenAPI', version: '6.x', icon: 'bi-files', color: '#85ea2d', bg: 'rgba(133,234,45,0.08)' },
    { name: 'AutoMapper', version: '13.x', icon: 'bi-arrow-left-right', color: '#ff6b6b', bg: 'rgba(255,107,107,0.08)' },
    { name: 'JWT Authentication', version: 'Built-in', icon: 'bi-shield-lock', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  ];

  services = [
    { file: 'QRCodeService.cs', desc: 'Core QR CRUD, save, list, delete, and design operations' },
    { file: 'AuthenticationService.cs', desc: 'Login, register, password reset, JWT token generation' },
    { file: 'LoyaltyService.cs', desc: 'Loyalty member registration, stamp management, rewards' },
    { file: 'MenuService.cs', desc: 'Shop, category, product, and menu item CRUD' },
    { file: 'EventService.cs', desc: 'Event info, registration management, capacity tracking' },
    { file: 'EmailService.cs', desc: 'AWS SES integration for transactional emails' },
    { file: 'ImageService.cs', desc: 'Image upload, compression, QR code generation' },
    { file: 'AnalyticsService.cs', desc: 'Scan history, user reports, analytics' },
    { file: 'UserManagementService.cs', desc: 'User CRUD, role assignment, password management' },
    { file: 'ContentService.cs', desc: 'Content system tables and management' },
  ];

  patterns = [
    {
      icon: 'bi-diagram-2',
      title: 'Service → Repository → DbContext',
      desc: 'Controllers call services, services call repositories, repositories use EF DbContext. Never call DbContext directly from controllers.',
    },
    {
      icon: 'bi-shield',
      title: 'Always validate server-side',
      desc: 'Client-side validation is for UX. Always re-validate all inputs server-side, especially for permissions and financial transactions.',
    },
    {
      icon: 'bi-arrow-repeat',
      title: 'Async/await for all I/O',
      desc: 'All database, file I/O, and HTTP calls must be async. Use Task and await to free up thread pool threads.',
    },
    {
      icon: 'bi-database',
      title: 'Use Include() to prevent N+1 queries',
      desc: 'When loading related data, use .Include() to eagerly load in one query instead of N queries.',
    },
    {
      icon: 'bi-code-slash',
      title: 'Map to DTOs for API responses',
      desc: 'Never return EF entities directly. Map to DTOs to decouple API contract from database schema.',
    },
    {
      icon: 'bi-exclamation-circle',
      title: 'Log sensitive operations',
      desc: 'Log all authentication, authorization, and data modification attempts for audit trails and debugging.',
    },
  ];
}
