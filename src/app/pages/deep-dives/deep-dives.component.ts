import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-deep-dives',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-qr-hub" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart QR hub
      </a>
      <h1><i class="bi bi-diagram-2"></i> Deep dives & diagrams</h1>
      <p class="subtitle">
        Implementation deep-dives for Smart QR product flows: sequence, data flow, component hierarchy, and linked engineer notes.
      </p>

      <section class="card">
        <h2>1) Sequence: create QR → save → publish → scan → viewer</h2>
        <div class="lane-grid">
          <div class="lane head">User</div>
          <div class="lane head">Smart_QR_UI</div>
          <div class="lane head">SmartQRApi</div>
          <div class="lane head">Viewer</div>

          <div class="lane">Select QR type + fill wizard</div>
          <div class="lane"><code>qr-code.service.saveQRCodeToBackend()</code></div>
          <div class="lane"><code>POST /SmartQRApi/SaveQR</code></div>
          <div class="lane">-</div>

          <div class="lane">Publish / keep active</div>
          <div class="lane">Optionally toggle status</div>
          <div class="lane"><code>POST /SmartQRApi/TogglePause/&#123;qrCodeID&#125;</code></div>
          <div class="lane">-</div>

          <div class="lane">Scan QR from phone</div>
          <div class="lane">Route to viewer</div>
          <div class="lane"><code>GET /SmartQRApi/GetQRPublic/&#123;qrCodeID&#125;</code></div>
          <div class="lane">Render content JSON</div>

          <div class="lane">Interact (order/register/redeem)</div>
          <div class="lane">Submit viewer action</div>
          <div class="lane"><code>SubmitMenuOrder / RegisterForLoyalty / RedeemLoyaltyReward</code></div>
          <div class="lane">Show success/error state</div>
        </div>
      </section>

      <section class="card">
        <h2>2) Data flow: loyalty registration</h2>
        <div class="diagram-row">
          <div class="node node-start">LoyaltyViewer form<br><small>name + phone</small></div>
          <div class="arrow">→</div>
          <div class="node node-api"><code>RegisterForLoyalty</code></div>
          <div class="arrow">→</div>
          <div class="node node-step">registrationID</div>
          <div class="arrow">→</div>
          <div class="node node-api"><code>CheckLoyaltyRegistration</code></div>
          <div class="arrow">→</div>
          <div class="node node-end">Stamp/reward screens</div>
        </div>

        <h3>Admin side (same registration)</h3>
        <ul>
          <li><code>GetLoyaltyRegistrations/&#123;qrCodeID&#125;</code> for moderation table.</li>
          <li><code>ApproveRejectLoyaltyRegistration</code> updates status.</li>
          <li><code>AddLoyaltyStamps</code>, <code>RedeemLoyaltyReward</code>, <code>VerifyLoyaltyRedemption</code> complete lifecycle.</li>
        </ul>
      </section>

      <section class="card">
        <h2>3) Data flow: menu ordering</h2>
        <div class="diagram-row">
          <div class="node node-start">MenuViewer</div>
          <div class="arrow">→</div>
          <div class="node node-api"><code>GetQRPublic</code></div>
          <div class="arrow">→</div>
          <div class="node node-api"><code>GetShopsPublic</code> + <code>GetProductsPublic</code></div>
          <div class="arrow">→</div>
          <div class="node node-step">Cart + guest info</div>
          <div class="arrow">→</div>
          <div class="node node-api"><code>SubmitMenuOrder</code></div>
          <div class="arrow">→</div>
          <div class="node node-end">Order confirmation</div>
        </div>

        <h3>Operations side</h3>
        <ul>
          <li><code>GetMenuOrders/&#123;qrCodeID&#125;</code> + <code>GetMenuOrderDetail/&#123;orderID&#125;</code>.</li>
          <li><code>UpdateMenuOrderStatus</code>, <code>UpdateMenuOrderProductImage</code>, <code>DeleteMenuOrder/&#123;orderID&#125;</code>.</li>
        </ul>
      </section>

      <section class="card">
        <h2>4) Component hierarchy (major features)</h2>
        <h3>A. Menu feature</h3>
        <pre><code>QrCodesComponent
└── qr-codes/
    ├── menu-step-one.component
    ├── menu-step-two.component
    └── qr-viewer/menu-viewer.component
        ├── my-cart.component
        ├── menu-orders-tab.component (admin side)
        └── menu-guest-tab.component (admin side)</code></pre>

        <h3>B. Loyalty feature</h3>
        <pre><code>QrCodesComponent
└── qr-codes/
    ├── loyalty-step-one.component
    ├── loyalty-step-two.component
    ├── qr-viewer/loyalty-viewer.component
    └── loyalty-registration-detail/
        ├── loyalty-registration-detail.component
        └── loyalty-report-demo.component</code></pre>
      </section>

      <section class="card">
        <h2>5) Engineer notes linked into doc site</h2>
        <p>Source notes from product repo (used for this summary):</p>
        <ul>
          <li><code>Smart_QR_UI/src/app/pages/systematic/modules/qr-code-list/loyalty-registration-detail/loyalty-report-demo/LOYALTY_MAIN_DASHBOARD.md</code></li>
          <li><code>Smart_QR_UI/src/app/pages/systematic/modules/qr-code-list/loyalty-registration-detail/loyalty-report-demo/LOGIC.md</code></li>
        </ul>

        <div class="info-box">
          <i class="bi bi-lightbulb"></i>
          <div>
            <strong>Summary imported into DevDocs:</strong>
            portfolio-vs-shop scope, KPI derivation, chart behavior, and API wiring placeholders
            are now represented in the sequence/data-flow sections above.
          </div>
        </div>
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
    .card h3 { font-size: 16px; margin: 16px 0 8px; color: #1a1f36; }
    .card p, .card li { font-size: 14px; color: #444; line-height: 1.7; }
    .card ul { margin: 0; padding-left: 22px; }
    code {
      background: #f0f3ff; color: #4a6cf7; padding: 2px 6px;
      border-radius: 4px; font-size: 12px;
    }
    pre {
      background: #1a1f36; border-radius: 10px; padding: 14px 16px;
      overflow-x: auto; margin: 8px 0 0;
    }
    pre code { background: none; color: #e0e6ff; padding: 0; font-size: 12px; line-height: 1.5; }

    .lane-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
    }
    .lane {
      background: #f8f9fc; border: 1px solid #e5e8f0; border-radius: 8px;
      padding: 10px; font-size: 12px; line-height: 1.45; color: #334;
    }
    .lane.head {
      background: #eef2ff; border-color: #cfd8ff;
      font-weight: 700; color: #1a1f36;
    }

    .diagram-row {
      display: flex; align-items: center; flex-wrap: wrap; gap: 8px;
      margin-bottom: 10px;
    }
    .node {
      border-radius: 10px; padding: 10px 12px; font-size: 12px; text-align: center;
      min-width: 120px;
    }
    .node small { color: #777; }
    .node-start { background: #e3f2fd; color: #0d47a1; border: 1px solid #90caf9; }
    .node-step { background: #f3e5f5; color: #6a1b9a; border: 1px solid #ce93d8; }
    .node-api { background: #e8f5e9; color: #1b5e20; border: 1px solid #a5d6a7; }
    .node-end { background: #fff3e0; color: #e65100; border: 1px solid #ffcc80; }
    .arrow { color: #9aa3b2; font-weight: 700; font-size: 16px; }

    .info-box {
      display: flex; gap: 12px; padding: 14px 16px;
      border-radius: 10px; margin-top: 12px; font-size: 14px;
      background: #f0f3ff; border-left: 4px solid #6c8cff; color: #334;
    }
    .info-box i { color: #6c8cff; font-size: 18px; margin-top: 2px; }

    @media (max-width: 900px) {
      .lane-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DeepDivesComponent {}

