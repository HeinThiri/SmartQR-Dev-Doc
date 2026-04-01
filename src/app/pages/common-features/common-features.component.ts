import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-common-features',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <h1>Common Features <span class="count-badge">12</span></h1>
      <p class="subtitle">Reusable shared components and utilities across Smart HR modules.</p>

      <div class="feature-list">
        <a routerLink="/common-features/advanced-view" class="feature-card">
          <div class="feature-icon"><i class="bi bi-sliders"></i></div>
          <div class="feature-info">
            <h3>Advanced View</h3>
            <p>Grid state management — save, load, and share custom views with sorting, grouping, filters, and custom queries.</p>
          </div>
          <i class="bi bi-chevron-right arrow"></i>
        </a>

        <a routerLink="/common-features/approval-workflow" class="feature-card">
          <div class="feature-icon"><i class="bi bi-check2-circle"></i></div>
          <div class="feature-info">
            <h3>Approval Workflow</h3>
            <p>Multi-step approval processes with parallel/sequential approvals, audit trails, and entity integration.</p>
          </div>
          <i class="bi bi-chevron-right arrow"></i>
        </a>

        <a routerLink="/common-features/data-migration" class="feature-card">
          <div class="feature-icon"><i class="bi bi-cloud-upload"></i></div>
          <div class="feature-info">
            <h3>Data Migration</h3>
            <p>Configurable Excel import with policy-based column mappings, validation, transformation, lookup resolution, and row-level tracking.</p>
          </div>
          <i class="bi bi-chevron-right arrow"></i>
        </a>

        <a routerLink="/common-features/custom-field" class="feature-card">
          <div class="feature-icon"><i class="bi bi-input-cursor-text"></i></div>
          <div class="feature-info">
            <h3>Custom Field Dynamic Form</h3>
            <p>Add customizable fields to any entity — session-based grouping, multiple field types, validation, and auto-save.</p>
          </div>
          <i class="bi bi-chevron-right arrow"></i>
        </a>

        <a routerLink="/common-features/email-notification" class="feature-card">
          <div class="feature-icon"><i class="bi bi-envelope"></i></div>
          <div class="feature-info">
            <h3>Email Notification Service</h3>
            <p>Automated email processing from SysNotiEmail table — batch processing, status tracking, error handling, and approval workflow integration.</p>
          </div>
          <i class="bi bi-chevron-right arrow"></i>
        </a>

        <a routerLink="/common-features/grid-export" class="feature-card">
          <div class="feature-icon"><i class="bi bi-file-earmark-arrow-down"></i></div>
          <div class="feature-info">
            <h3>Grid Export (PDF + Excel)</h3>
            <p>Reusable export dialog for any DxDataGrid listing page. Supports PDF, Excel, signatures, and custom footers.</p>
          </div>
          <i class="bi bi-chevron-right arrow"></i>
        </a>

        <a routerLink="/common-features/log-note" class="feature-card">
          <div class="feature-icon"><i class="bi bi-clock-history"></i></div>
          <div class="feature-info">
            <h3>Log Note (Audit Trail)</h3>
            <p>Comprehensive audit trail with timeline UI, field-level change tracking, and modal support for any entity.</p>
          </div>
          <i class="bi bi-chevron-right arrow"></i>
        </a>

        <a routerLink="/common-features/maintenance-alert" class="feature-card">
          <div class="feature-icon"><i class="bi bi-bell"></i></div>
          <div class="feature-info">
            <h3>Maintenance Alert</h3>
            <p>Schedule maintenance windows with live banner, auto-redirect, Hangfire email notifications, and developer bypass.</p>
          </div>
          <i class="bi bi-chevron-right arrow"></i>
        </a>

        <a routerLink="/common-features/multi-product-branding" class="feature-card">
          <div class="feature-icon"><i class="bi bi-palette"></i></div>
          <div class="feature-info">
            <h3>Multi-Product Branding</h3>
            <p>Switch between product brands (Smart HR, Smart LMS) at runtime — no rebuild required. Single codebase, multiple products.</p>
          </div>
          <i class="bi bi-chevron-right arrow"></i>
        </a>

        <a routerLink="/common-features/sms-poh-integration" class="feature-card">
          <div class="feature-icon"><i class="bi bi-phone"></i></div>
          <div class="feature-info">
            <h3>SmsPoh Integration</h3>
            <p>Myanmar SMS gateway for OTP during MFA login. Includes rate limiting, daily limits, and balance alert via Hangfire.</p>
          </div>
          <i class="bi bi-chevron-right arrow"></i>
        </a>

        <a routerLink="/common-features/totp-mfa" class="feature-card">
          <div class="feature-icon"><i class="bi bi-shield-lock"></i></div>
          <div class="feature-info">
            <h3>TOTP & Okta MFA</h3>
            <p>Google Authenticator (local TOTP) and Okta Authenticator MFA — QR setup, verify, disable, and login flow.</p>
          </div>
          <i class="bi bi-chevron-right arrow"></i>
        </a>

        <a routerLink="/common-features/vimeo-integration" class="feature-card">
          <div class="feature-icon"><i class="bi bi-camera-video"></i></div>
          <div class="feature-info">
            <h3>Vimeo Integration</h3>
            <p>Reusable TUS resumable video upload to Vimeo — direct browser-to-Vimeo upload, auto-delete on re-upload, folder organization, and thumbnail support.</p>
          </div>
          <i class="bi bi-chevron-right arrow"></i>
        </a>

      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 900px; margin: 0 auto; }
    h1 { font-size: 26px; font-weight: 700; color: #1a1f36; margin: 0 0 6px; display: flex; align-items: center; gap: 10px; }
    .count-badge {
      background: #6c8cff; color: #fff; font-size: 13px; font-weight: 600;
      padding: 2px 10px; border-radius: 20px;
    }
    .subtitle { font-size: 14px; color: #888; margin: 0 0 28px; }

    .feature-list { display: flex; flex-direction: column; gap: 10px; }

    .feature-card {
      display: flex; align-items: center; gap: 16px;
      background: #fff; border-radius: 12px; padding: 22px 24px;
      text-decoration: none; color: inherit;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .feature-card:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }
    .feature-icon {
      width: 48px; height: 48px; flex-shrink: 0;
      background: rgba(108,140,255,0.1); border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .feature-icon i { font-size: 22px; color: #6c8cff; }
    .feature-info { flex: 1; }
    .feature-info h3 { font-size: 16px; font-weight: 600; color: #1a1f36; margin: 0 0 4px; }
    .feature-info p { font-size: 13px; color: #777; margin: 0; }
    .arrow { color: #ccc; font-size: 18px; }
  `]
})
export class CommonFeaturesComponent {}
