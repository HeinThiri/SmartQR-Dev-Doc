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
    @media (max-width: 768px) {
      .diagram-row { flex-direction: column; }
      .diagram-arrow { transform: rotate(90deg); }
    }
  `]
})
export class ArchitectureComponent {}
