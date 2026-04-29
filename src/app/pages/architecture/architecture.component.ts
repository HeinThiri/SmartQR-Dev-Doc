import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/welcome" class="back-link">
        <i class="bi bi-arrow-left"></i> Home
      </a>
      <h1><i class="bi bi-diagram-3"></i> Architecture overview</h1>
      <p class="subtitle">
        C4-style view at system and container level: who uses what, and how the Smart QR documentation portal relates to the product UI and backend.
      </p>

      <section class="card" id="context">
        <h2>System context</h2>
        <p>
          <strong>Smart QR</strong> is a web-based product for creating and managing QR experiences (menus, loyalty, content, admin, and more).
          Developers extend <code>Smart_QR_UI</code>; this site documents modules, shared patterns, APIs, and security notes.
        </p>
        <div class="ctx-diagram">
          <div class="ctx-box ctx-actor">
            <i class="bi bi-person-badge"></i>
            <span>Developer / Technical reader</span>
          </div>
          <div class="ctx-arrow"><i class="bi bi-arrow-right"></i></div>
          <div class="ctx-box ctx-system">
            <i class="bi bi-book"></i>
            <span>Smart QR DevDocs</span>
            <small>Angular app · static JSON</small>
          </div>
        </div>
        <div class="ctx-diagram" style="margin-top: 20px;">
          <div class="ctx-box ctx-actor">
            <i class="bi bi-people"></i>
            <span>End users &amp; admins</span>
          </div>
          <div class="ctx-arrow"><i class="bi bi-arrow-right"></i></div>
          <div class="ctx-box ctx-system">
            <i class="bi bi-phone"></i>
            <span>Smart QR Web (product)</span>
            <small>Smart_QR_UI</small>
          </div>
          <div class="ctx-arrow"><i class="bi bi-arrow-right"></i></div>
          <div class="ctx-box ctx-api">
            <i class="bi bi-hdd-network"></i>
            <span>Backend API</span>
            <small>REST / services you deploy</small>
          </div>
          <div class="ctx-arrow"><i class="bi bi-arrow-right"></i></div>
          <div class="ctx-box ctx-data">
            <i class="bi bi-database"></i>
            <span>Data stores</span>
            <small>DB, files, cache</small>
          </div>
        </div>
      </section>

      <section class="card" id="system-diagram">
        <h2>System Architecture Diagram</h2>
        <svg viewBox="0 0 1000 700" class="architecture-svg" preserveAspectRatio="xMidYMid meet">
          <!-- Title -->
          <text x="500" y="25" text-anchor="middle" class="svg-title">SmartQR System Architecture</text>

          <!-- Actors -->
          <g id="actors">
            <!-- End Users -->
            <circle cx="100" cy="150" r="35" fill="#e8f5e9" stroke="#81c784" stroke-width="2"/>
            <text x="100" y="145" text-anchor="middle" font-size="20">👥</text>
            <text x="100" y="210" text-anchor="middle" font-size="12" font-weight="600">End Users</text>
            <text x="100" y="225" text-anchor="middle" font-size="11" fill="#666">&amp; Admins</text>

            <!-- Developers -->
            <circle cx="900" cy="150" r="35" fill="#e8eaf6" stroke="#9fa8da" stroke-width="2"/>
            <text x="900" y="145" text-anchor="middle" font-size="20">👨‍💻</text>
            <text x="900" y="210" text-anchor="middle" font-size="12" font-weight="600">Developers</text>
          </g>

          <!-- Frontend Layer -->
          <g id="frontend">
            <rect x="20" y="280" width="180" height="120" rx="8" fill="#e3f2fd" stroke="#64b5f6" stroke-width="2"/>
            <text x="110" y="300" text-anchor="middle" font-size="13" font-weight="700">Smart_QR_UI</text>
            <line x1="25" y1="310" x2="195" y2="310" stroke="#64b5f6" stroke-width="1"/>
            <text x="30" y="330" font-size="11" fill="#1a1f36">• QR Creation/Edit</text>
            <text x="30" y="347" font-size="11" fill="#1a1f36">• Menu/Loyalty Viewers</text>
            <text x="30" y="364" font-size="11" fill="#1a1f36">• Admin Dashboard</text>
            <text x="30" y="381" font-size="11" fill="#1a1f36">• Analytics &amp; Settings</text>
          </g>

          <!-- Smart QR UI - Standalone DevDocs -->
          <g id="devdoc">
            <rect x="800" y="280" width="180" height="120" rx="8" fill="#f3e5f5" stroke="#ce93d8" stroke-width="2"/>
            <text x="890" y="300" text-anchor="middle" font-size="13" font-weight="700">smart-qr-dev-doc</text>
            <line x1="805" y1="310" x2="975" y2="310" stroke="#ce93d8" stroke-width="1"/>
            <text x="810" y="330" font-size="11" fill="#1a1f36">• API Documentation</text>
            <text x="810" y="347" font-size="11" fill="#1a1f36">• Architecture Guides</text>
            <text x="810" y="364" font-size="11" fill="#1a1f36">• Code Patterns</text>
            <text x="810" y="381" font-size="11" fill="#1a1f36">• Static Content</text>
          </g>

          <!-- API Layer -->
          <g id="api">
            <rect x="220" y="280" width="180" height="120" rx="8" fill="#fff3e0" stroke="#ffb74d" stroke-width="2"/>
            <text x="310" y="300" text-anchor="middle" font-size="13" font-weight="700">Smart_QR_API</text>
            <line x1="225" y1="310" x2="395" y2="310" stroke="#ffb74d" stroke-width="1"/>
            <text x="230" y="330" font-size="11" fill="#1a1f36">• Authentication</text>
            <text x="230" y="347" font-size="11" fill="#1a1f36">• QR Management API</text>
            <text x="230" y="364" font-size="11" fill="#1a1f36">• Loyalty Service</text>
            <text x="230" y="381" font-size="11" fill="#1a1f36">• Analytics Service</text>
          </g>

          <!-- Background Jobs -->
          <g id="jobs">
            <rect x="420" y="280" width="160" height="120" rx="8" fill="#fce4ec" stroke="#f06292" stroke-width="2"/>
            <text x="500" y="300" text-anchor="middle" font-size="13" font-weight="700">Hangfire</text>
            <line x1="425" y1="310" x2="575" y2="310" stroke="#f06292" stroke-width="1"/>
            <text x="430" y="330" font-size="11" fill="#1a1f36">• Background Jobs</text>
            <text x="430" y="347" font-size="11" fill="#1a1f36">• Scheduled Tasks</text>
            <text x="430" y="364" font-size="11" fill="#1a1f36">• Async Processing</text>
            <text x="430" y="381" font-size="11" fill="#1a1f36">• Email/Notifications</text>
          </g>

          <!-- Database Layer -->
          <g id="database">
            <rect x="620" y="280" width="160" height="120" rx="8" fill="#e8f5e9" stroke="#81c784" stroke-width="2"/>
            <text x="700" y="300" text-anchor="middle" font-size="13" font-weight="700">SQL Server DB</text>
            <line x1="625" y1="310" x2="775" y2="310" stroke="#81c784" stroke-width="1"/>
            <text x="630" y="330" font-size="11" fill="#1a1f36">• Users &amp; Accounts</text>
            <text x="630" y="347" font-size="11" fill="#1a1f36">• QR Definitions</text>
            <text x="630" y="364" font-size="11" fill="#1a1f36">• Loyalty Programs</text>
            <text x="630" y="381" font-size="11" fill="#1a1f36">• Analytics Data</text>
          </g>

          <!-- Connection arrows from users -->
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#666"/>
            </marker>
            <marker id="arrowhead-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#6c8cff"/>
            </marker>
          </defs>

          <!-- End Users to Frontend -->
          <path d="M 135 185 L 110 280" stroke="#81c784" stroke-width="2" fill="none" marker-end="url(#arrowhead)" stroke-dasharray="5,5"/>
          <text x="75" y="235" font-size="11" fill="#555">uses</text>

          <!-- Developers to DevDocs -->
          <path d="M 865 185 L 890 280" stroke="#9fa8da" stroke-width="2" fill="none" marker-end="url(#arrowhead)" stroke-dasharray="5,5"/>
          <text x="875" y="235" font-size="11" fill="#555">reads</text>

          <!-- Frontend to API -->
          <path d="M 200 340 L 220 340" stroke="#6c8cff" stroke-width="2" fill="none" marker-end="url(#arrowhead-blue)"/>
          <text x="205" y="330" font-size="10" fill="#6c8cff" font-weight="600">REST API</text>

          <!-- API to Jobs -->
          <path d="M 400 340 L 420 340" stroke="#f06292" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
          <text x="405" y="330" font-size="10" fill="#555">triggers</text>

          <!-- API to Database -->
          <path d="M 600 340 L 620 340" stroke="#81c784" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
          <text x="605" y="330" font-size="10" fill="#555">reads/writes</text>

          <!-- Jobs to Database -->
          <path d="M 580 380 Q 650 420 680 400" stroke="#81c784" stroke-width="2" fill="none" marker-end="url(#arrowhead)" stroke-dasharray="5,5"/>
          <text x="600" y="420" font-size="10" fill="#555">updates</text>

          <!-- Data Stores Section -->
          <g id="data-stores">
            <text x="500" y="520" text-anchor="middle" font-size="14" font-weight="700">External Integrations &amp; Services</text>

            <!-- Cache -->
            <rect x="50" y="560" width="140" height="80" rx="8" fill="#ede7f6" stroke="#7c4dff" stroke-width="2"/>
            <text x="120" y="585" text-anchor="middle" font-size="12" font-weight="600">Cache Layer</text>
            <text x="60" y="605" font-size="10" fill="#1a1f36">• In-Memory Cache</text>
            <text x="60" y="620" font-size="10" fill="#1a1f36">• Session Storage</text>

            <!-- Payment Gateway -->
            <rect x="240" y="560" width="140" height="80" rx="8" fill="#e1f5fe" stroke="#0288d1" stroke-width="2"/>
            <text x="310" y="585" text-anchor="middle" font-size="12" font-weight="600">Payment Gateway</text>
            <text x="250" y="605" font-size="10" fill="#1a1f36">• SmartPay</text>
            <text x="250" y="620" font-size="10" fill="#1a1f36">• Order Processing</text>

            <!-- Email Service -->
            <rect x="430" y="560" width="140" height="80" rx="8" fill="#f0f4c3" stroke="#827717" stroke-width="2"/>
            <text x="500" y="585" text-anchor="middle" font-size="12" font-weight="600">Email Service</text>
            <text x="440" y="605" font-size="10" fill="#1a1f36">• Notifications</text>
            <text x="440" y="620" font-size="10" fill="#1a1f36">• Transactional Mail</text>

            <!-- File Storage -->
            <rect x="620" y="560" width="140" height="80" rx="8" fill="#f3e5f5" stroke="#6a1b9a" stroke-width="2"/>
            <text x="690" y="585" text-anchor="middle" font-size="12" font-weight="600">File Storage</text>
            <text x="630" y="605" font-size="10" fill="#1a1f36">• Images/Media</text>
            <text x="630" y="620" font-size="10" fill="#1a1f36">• QR Designs</text>

            <!-- Analytics -->
            <rect x="810" y="560" width="140" height="80" rx="8" fill="#e0f2f1" stroke="#00796b" stroke-width="2"/>
            <text x="880" y="585" text-anchor="middle" font-size="12" font-weight="600">Analytics</text>
            <text x="820" y="605" font-size="10" fill="#1a1f36">• Tracking/Metrics</text>
            <text x="820" y="620" font-size="10" fill="#1a1f36">• Reporting</text>
          </g>

          <!-- Legend -->
          <g id="legend" opacity="0.8">
            <rect x="50" y="680" width="900" height="15" rx="4" fill="#f5f5f5" stroke="#ddd" stroke-width="1"/>
            <text x="60" y="691" font-size="10" fill="#666">◆ Solid arrow: Synchronous communication  |  ◆ Dashed arrow: Asynchronous/Trigger</text>
          </g>
        </svg>
      </section>

      <section class="card" id="containers">
        <h2>Containers in this repository</h2>
        <div class="container-grid">
          <div class="container-card">
            <div class="cc-head"><i class="bi bi-window"></i> Smart_QR_UI</div>
            <p>Primary Angular application. Routing under <code>app-routing.module.ts</code>; features under <code>pages/systematic/modules/</code> (QR flows, admin, auth, analytics).</p>
            <p class="cc-meta">Talks to <code>environment.baseApiUrl</code></p>
          </div>
          <div class="container-card">
            <div class="cc-head"><i class="bi bi-journal-bookmark"></i> smart-qr-dev-doc</div>
            <p>Standalone Angular 21 app. Content from <code>src/assets/content/</code> (<code>domains.json</code>, per-domain JSON, Markdown). Auth via <code>users.json</code> + <code>localStorage</code>.</p>
            <p class="cc-meta">No product API required to browse static docs</p>
          </div>
        </div>
      </section>

      <section class="card" id="runtime">
        <h2>Smart QR runtime architecture</h2>
        <table>
          <thead>
            <tr><th>Layer</th><th>Implementation in this repo</th><th>Responsibility</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Client app</td>
              <td><code>Smart_QR_UI</code> (Angular)</td>
              <td>QR creation/edit flows, viewers, admin screens, auth pages, dashboard UX.</td>
            </tr>
            <tr>
              <td>API app</td>
              <td><code>Smart_QR_API</code> (ASP.NET Core)</td>
              <td>Authentication, SmartQR APIs, service feedback APIs, CORS/security, data access.</td>
            </tr>
            <tr>
              <td>Data layer</td>
              <td>SQL Server via <code>SmartProjectContext</code></td>
              <td>Persist users, QR definitions, loyalty data, orders, configuration.</td>
            </tr>
            <tr>
              <td>Async jobs</td>
              <td>Hangfire connection in backend config</td>
              <td>Background processing for scheduled or heavy tasks.</td>
            </tr>
            <tr>
              <td>Developer docs</td>
              <td><code>smart-qr-dev-doc</code></td>
              <td>Project guides, API conventions, deep dives, domain knowledge transfer.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="card" id="frontend-architecture">
        <h2>Frontend architecture (Smart_QR_UI)</h2>
        <p>
          The product UI is route-centric, with feature modules grouped under
          <code>pages/systematic/modules</code>.
        </p>
        <pre><code>Smart_QR_UI/src/app/
├── app-routing.module.ts        # Main route map
├── services/qr-code.service.ts  # Core SmartQR API client + payload mapping
├── guards/                      # AuthGuard, AdminGuard
├── shared/                      # Reusable UI blocks
└── pages/systematic/modules/
    ├── qr-code-list/            # QR type flows, viewers, shops, loyalty
    ├── admin/                   # Users, roles, QR admin, email/system settings
    ├── auth/                    # login / forgot / set password
    ├── analytics/
    └── settings/</code></pre>

        <h3>Routing characteristics</h3>
        <ul>
          <li><strong>Wizard/editor routes:</strong> <code>/qr-codes/type/...</code> and <code>/qr-codes/edit/.../:id</code></li>
          <li><strong>Public viewers:</strong> <code>/menu/:id</code>, <code>/loyalty/:id</code>, <code>/website/:id</code>, <code>/content/:id</code>, etc.</li>
          <li><strong>Admin paths:</strong> protected by <code>AdminGuard</code> for system operations.</li>
          <li><strong>Compatibility routes:</strong> loyalty registration detail supports both camelCase and PascalCase params.</li>
        </ul>
      </section>

      <section class="card" id="backend-architecture">
        <h2>Backend architecture (Smart_QR_API)</h2>
        <p>
          Backend startup in <code>Program.cs</code> configures OpenAPI, JWT bearer auth, CORS, EF Core DB context,
          repository registrations, and controller services.
        </p>
        <div class="container-grid">
          <div class="container-card">
            <div class="cc-head"><i class="bi bi-shield-lock"></i> Security & auth</div>
            <p>JWT Bearer configured with issuer/key validation and Swagger Bearer definition for testing.</p>
            <p class="cc-meta">Related: <code>JwtAuth</code> config + <code>AddAuthentication().AddJwtBearer()</code></p>
          </div>
          <div class="container-card">
            <div class="cc-head"><i class="bi bi-diagram-2"></i> API surface</div>
            <p>Primary Smart QR endpoints are exposed via SmartQR and related controllers/services.</p>
            <p class="cc-meta">Examples: <code>SmartQRApi</code>, <code>AuthenticationApi</code>, <code>ServiceFeedbackApi</code></p>
          </div>
          <div class="container-card">
            <div class="cc-head"><i class="bi bi-database"></i> Persistence</div>
            <p>Entity Framework Core uses SQL Server through <code>SmartProjectContext</code> and UnitOfWork.</p>
            <p class="cc-meta">Connection strings + DB settings are loaded from app settings/environment</p>
          </div>
          <div class="container-card">
            <div class="cc-head"><i class="bi bi-globe2"></i> CORS policy</div>
            <p>Allowed origins include localhost and deployment origins, composed from SysConfig + static list.</p>
            <p class="cc-meta">Critical for frontend ↔ API communication across environments</p>
          </div>
        </div>
      </section>

      <section class="card" id="request-flows">
        <h2>Key request flows</h2>
        <h3>Flow A: QR create/edit</h3>
        <div class="flow-wrap">
          <div class="diagram-row">
            <div class="diagram-node node-step">Wizard screen</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action">qr-code.service</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action">/SmartQRApi/SaveQR</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success">SQL persisted</div>
          </div>
        </div>

        <h3>Flow B: Viewer access after scan</h3>
        <div class="flow-wrap">
          <div class="diagram-row">
            <div class="diagram-node node-step">Scan URL</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step">Viewer route</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action">/SmartQRApi/GetQRPublic/...</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success">Render payload</div>
          </div>
        </div>

        <h3>Flow C: Auth + protected operations</h3>
        <ul>
          <li>Login/registration obtains token via <code>AuthenticationApi</code>.</li>
          <li>Frontend stores auth state and sends Bearer token for protected endpoints.</li>
          <li><code>AuthGuard</code> and <code>AdminGuard</code> enforce route-level access in UI.</li>
          <li>Backend JWT validation enforces API-level authorization.</li>
        </ul>
      </section>

      <section class="card" id="devdoc-internal">
        <h2>DevDocs application internals</h2>
        <div class="flow-wrap">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-shield-lock"></i> authGuard</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-layout-sidebar"></i> Layout</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-file-earmark-text"></i> Page / Domain</div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-folder2-open"></i> ContentService</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-cloud-download"></i> assets/content/*.json</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-search"></i> Search index</div>
          </div>
        </div>
      </section>

      <section class="card" id="related">
        <h2>Related reading</h2>
        <ul>
          <li><a routerLink="/getting-started">Getting Started</a></li>
          <li><a routerLink="/smart-qr-hub">Smart QR hub</a></li>
          <li><a routerLink="/deep-dives">Deep dives &amp; diagrams</a> — sequence/data-flow views</li>
          <li><a routerLink="/api-truth-source">API truth source</a> — auth and error conventions</li>
          <li><a routerLink="/how-to-doc">How to Doc?</a> — contributing pages and diagrams</li>
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
    table { width: 100%; border-collapse: collapse; margin: 0 0 14px; font-size: 13px; }
    th {
      text-align: left; padding: 10px 12px; background: #f5f7fa;
      border-bottom: 2px solid #e0e4ec; font-weight: 600; color: #444;
    }
    td { padding: 9px 12px; border-bottom: 1px solid #f0f0f0; color: #444; vertical-align: top; }
    tr:hover td { background: #fafbfd; }
    pre {
      background: #1a1f36; border-radius: 10px; padding: 16px 18px;
      overflow-x: auto; margin: 0 0 14px;
    }
    pre code { background: none; color: #e0e6ff; padding: 0; font-size: 12px; line-height: 1.5; }
    code {
      background: #f0f3ff; color: #4a6cf7; padding: 2px 7px;
      border-radius: 4px; font-size: 13px;
    }
    strong { color: #1a1f36; }

    .ctx-diagram {
      display: flex; align-items: center; justify-content: center;
      flex-wrap: wrap; gap: 12px; padding: 16px;
      background: #f8f9fc; border-radius: 12px;
    }
    .ctx-box {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 16px 20px; border-radius: 12px; min-width: 120px; text-align: center;
      font-size: 13px; font-weight: 600; color: #1a1f36;
    }
    .ctx-box i { font-size: 22px; }
    .ctx-box small { font-weight: 400; color: #777; font-size: 11px; }
    .ctx-actor { background: #e8eaf6; border: 2px solid #9fa8da; }
    .ctx-system { background: #e3f2fd; border: 2px solid #64b5f6; }
    .ctx-api { background: #fff3e0; border: 2px solid #ffb74d; }
    .ctx-data { background: #e8f5e9; border: 2px solid #81c784; }
    .ctx-arrow { color: #aaa; font-size: 20px; }

    .container-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;
    }
    .container-card {
      border: 1px solid #e0e4ec; border-radius: 12px; padding: 18px;
      background: #fafbfd;
    }
    .cc-head {
      font-size: 15px; font-weight: 700; color: #1a1f36; margin-bottom: 10px;
      display: flex; align-items: center; gap: 8px;
    }
    .cc-head i { color: #6c8cff; }
    .container-card p { margin: 0 0 8px; font-size: 13px; color: #555; }
    .cc-meta { font-size: 12px !important; color: #888 !important; font-style: italic; }

    .flow-wrap { padding: 8px 0; }
    .diagram-row {
      display: flex; align-items: center; gap: 10px;
      flex-wrap: wrap; justify-content: center;
    }
    .diagram-node {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 14px 18px; border-radius: 12px; min-width: 100px;
      text-align: center; font-size: 12px; font-weight: 500;
    }
    .diagram-node i { font-size: 18px; }
    .node-start { background: #e8f5e9; color: #2e7d32; border: 2px solid #81c784; }
    .node-step { background: #f0f3ff; color: #1a1f36; border: 2px solid #d0d8ff; }
    .node-action { background: #6c8cff; color: #fff; }
    .node-success { background: #43a047; color: #fff; }
    .diagram-arrow { color: #bbb; font-size: 18px; }
    .diagram-down { text-align: center; color: #bbb; font-size: 20px; padding: 6px 0; }
    .architecture-svg {
      width: 100%;
      height: auto;
      max-width: 1000px;
      margin: 20px auto;
      display: block;
      background: #fafbfd;
      border-radius: 12px;
      border: 1px solid #e0e4ec;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .svg-title {
      font-weight: 700;
      fill: #1a1f36;
    }

    @media (max-width: 768px) {
      .diagram-row { flex-direction: column; }
      .diagram-arrow { transform: rotate(90deg); }
      .architecture-svg {
        margin: 10px auto;
      }
    }
  `]
})
export class ArchitectureComponent {}
