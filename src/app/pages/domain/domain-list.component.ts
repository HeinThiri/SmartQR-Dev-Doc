import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { Domain } from '../../core/models/domain.model';
import { marked } from 'marked';
import QRCode from 'qrcode';

@Component({
  selector: 'app-domain-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="domain-list-page">
      <div class="page-header">
        <h1>All Domains</h1>
        <p>Browse Smart QR product areas (QR types, viewers, loyalty, shops, admin, auth).</p>
      </div>
      <details class="spec-panel" [open]="specOpen">
        <summary class="spec-summary" (click)="specOpen = !specOpen">
          <span class="spec-title">SmartQR_System.md</span>
          <span class="spec-sub">System spec (QR types, wizard steps, viewer routes)</span>
        </summary>
        <div class="spec-body">
          <div *ngIf="specLoading" class="spec-loading">
            <i class="bi bi-arrow-clockwise spin"></i> Loading spec...
          </div>
          <div *ngIf="!specLoading && specError" class="spec-error" role="status" aria-live="polite">
            {{ specError }}
          </div>
          <div *ngIf="!specLoading && !specError && specHtml" class="markdown-content" [innerHTML]="specHtml"></div>
        </div>
      </details>
      <div *ngIf="loading" class="loading-state">
        <i class="bi bi-arrow-clockwise spin"></i> Loading...
      </div>
      <div *ngIf="!loading && loadError" class="error-state" role="status" aria-live="polite">
        <i class="bi bi-exclamation-triangle"></i>
        <p>{{ loadError }}</p>
      </div>
      <div class="domain-grid">
        <ng-container *ngFor="let domain of domains">
          <a *ngIf="domain.slug !== authSlug"
             [routerLink]="['/domains', domain.slug]"
             class="domain-card">
            <div class="domain-icon">
              <i class="bi" [ngClass]="domain.icon"></i>
            </div>
            <div class="domain-info">
              <h3>{{ domain.name }}</h3>
              <p>{{ domain.description }}</p>
            </div>
            <i class="bi bi-chevron-right card-arrow"></i>
          </a>

          <div *ngIf="domain.slug === authSlug"
               class="domain-card domain-card-expandable"
               [class.is-expanded]="authExpanded">
            <div class="domain-card-header">
              <div class="domain-icon">
                <i class="bi" [ngClass]="domain.icon"></i>
              </div>
              <div class="domain-info">
                <h3>{{ domain.name }}</h3>
                <p>{{ domain.description }}</p>
              </div>
              <div class="domain-actions">
                <a class="view-docs-link" [routerLink]="['/domains', domain.slug]">View docs</a>
                <button
                  type="button"
                  class="details-toggle"
                  (click)="toggleAuthDetails()"
                  [attr.aria-expanded]="authExpanded"
                  aria-controls="smart-qr-auth-details">
                  {{ authExpanded ? 'Hide details' : 'Show details' }}
                </button>
              </div>
            </div>

            <div
              id="smart-qr-auth-details"
              class="details"
              role="region"
              aria-label="Smart QR Auth details"
              [class.details-expanded]="authExpanded"
              (keydown.escape)="closeAuthDetails()"
              tabindex="-1">
              <div class="details-grid">
                <div class="left-panel">
                  <div class="panel-header">
                    <div class="panel-title">OTP Login Session</div>
                    <div class="badge"
                         [attr.data-variant]="authStatus"
                         role="status"
                         aria-live="polite">
                      {{ authStatusLabel }}
                    </div>
                  </div>
                  <div class="meta-row">
                    <span class="meta-label">Base URL</span>
                    <code class="meta-value">{{ authBaseUrl }}</code>
                  </div>

                  <div class="qr-card" [class.qr-muted]="authStatus === 'expired'">
                    <div class="qr-wrap" (click)="markAuthScanned()" (keydown.enter)="markAuthScanned()" tabindex="0" role="button" aria-label="Mark QR as scanned">
                      <img *ngIf="authQrDataUrl" class="qr-img" [src]="authQrDataUrl" alt="OTP validation QR code" />
                      <div *ngIf="!authQrDataUrl" class="qr-loading">
                        <i class="bi bi-arrow-clockwise spin"></i> Generating QR...
                      </div>
                      <div class="qr-overlay" *ngIf="authStatus === 'expired'">Expired</div>
                      <div class="qr-overlay" *ngIf="authStatus === 'error'">Error</div>
                    </div>
                    <div class="qr-caption">
                      Scan to open <code>/AuthenticationApi/ValidateLoginOtp</code>
                    </div>
                  </div>

                  <div class="timer-row" [class.timer-danger]="authStatus === 'error'" [class.timer-expired]="authStatus === 'expired'">
                    <svg class="ring" viewBox="0 0 48 48" aria-hidden="true">
                      <circle class="ring-track" cx="24" cy="24" r="18"></circle>
                      <circle
                        class="ring-progress"
                        cx="24"
                        cy="24"
                        r="18"
                        [attr.stroke-dasharray]="ringCircumference"
                        [attr.stroke-dashoffset]="ringDashOffset">
                      </circle>
                    </svg>
                    <div class="timer-text">
                      <div class="timer-main" [attr.aria-label]="timerAriaLabel">Expires in {{ authRemainingFormatted }}</div>
                      <div class="timer-sub" *ngIf="authOtpExpiredMinute">OtpExpiredMinute: {{ authOtpExpiredMinute }}</div>
                    </div>
                  </div>

                  <div class="action-bar">
                    <button
                      type="button"
                      class="btn btn-primary"
                      (click)="regenerateAuthSession()"
                      [disabled]="authRegenerateDisabled">
                      Regenerate OTP
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      (click)="copyAuthLink()"
                      [disabled]="!authDeepLink">
                      Copy link
                    </button>
                    <button type="button" class="btn btn-tertiary" (click)="closeAuthDetails()">Cancel</button>
                    <div class="inline-note" *ngIf="authInlineNote">{{ authInlineNote }}</div>
                  </div>
                </div>

                <div class="right-panel">
                  <div class="tabs" role="tablist" aria-label="Auth details tabs">
                    <button type="button" class="tab"
                            role="tab"
                            [attr.aria-selected]="authTab === 'flows'"
                            [class.active]="authTab === 'flows'"
                            (click)="authTab = 'flows'">
                      Flows
                    </button>
                    <button type="button" class="tab"
                            role="tab"
                            [attr.aria-selected]="authTab === 'responses'"
                            [class.active]="authTab === 'responses'"
                            (click)="authTab = 'responses'">
                      Responses
                    </button>
                    <button type="button" class="tab"
                            role="tab"
                            [attr.aria-selected]="authTab === 'errors'"
                            [class.active]="authTab === 'errors'"
                            (click)="authTab = 'errors'">
                      Errors & Limits
                    </button>
                  </div>

                  <div class="tab-body" *ngIf="authTab === 'flows'">
                    <div class="section">
                      <div class="section-title">Login (Standard)</div>
                      <div class="step"><span class="pill">POST</span><code>/AuthenticationApi/login</code></div>
                      <div class="hint">Returns <code>ServiceActionResult</code> with <code>resultObject.token</code> and <code>resultObject.userid</code> on success.</div>
                    </div>
                    <div class="section">
                      <div class="section-title">Login (MFA / OTP)</div>
                      <div class="step"><span class="pill">POST</span><code>/AuthenticationApi/login</code> → <span class="pill">GET</span><code>/AuthenticationApi/ValidateLoginOtp</code></div>
                      <div class="hint">MFA required is represented by <code>status=4233</code> and <code>message=MfaRequired</code> with <code>OtpExpiredMinute</code>.</div>
                    </div>
                    <div class="section">
                      <div class="section-title">Password Reset</div>
                      <div class="step"><span class="pill">GET</span><code>/SysUser/ForgotPassword</code> → <span class="pill">GET</span><code>/AuthenticationApi/VerifyForgotPasswordOtp</code> → <span class="pill">POST</span><code>/AuthenticationApi/ResetPassword</code></div>
                      <div class="hint">Reset tokens are stored as bcrypt hashes; successful reset rotates session.</div>
                    </div>
                  </div>

                  <div class="tab-body" *ngIf="authTab === 'responses'">
                    <div class="section">
                      <div class="section-title">ServiceActionResult envelope</div>
                      <pre class="code-block"><code>{{ authResponseEnvelopeExample }}</code></pre>
                    </div>
                    <div class="section">
                      <div class="section-title">MFA Required (example)</div>
                      <pre class="code-block"><code>{{ authMfaRequiredExample }}</code></pre>
                    </div>
                  </div>

                  <div class="tab-body" *ngIf="authTab === 'errors'">
                    <div class="section">
                      <div class="section-title">HTTP outcomes</div>
                      <div class="kv">
                        <div class="kv-row"><code>401 Unauthorized</code><span>Missing/expired JWT or invalid signature</span></div>
                        <div class="kv-row"><code>401 SessionExpired</code><span><code>session_token</code> mismatch vs <code>SysUser.CurrentSessionId</code></span></div>
                        <div class="kv-row"><code>429 Too Many Requests</code><span>Rate limit exceeded; slow down retries</span></div>
                      </div>
                    </div>
                    <div class="section">
                      <div class="section-title">Rate limit policies</div>
                      <div class="chip-row">
                        <span class="chip">auth-login</span>
                        <span class="chip">auth-register</span>
                        <span class="chip">auth-otp</span>
                        <span class="chip">auth-password-reset</span>
                      </div>
                    </div>
                    <div class="section">
                      <div class="section-title">JWT & session binding</div>
                      <div class="hint">JWT includes <code>session_token</code> and requests can be rejected when it does not match <code>SysUser.CurrentSessionId</code> under single-session enforcement.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .domain-list-page { max-width: 900px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 24px; font-weight: 700; color: #1a1f36; margin: 0 0 6px; }
    .page-header p { font-size: 14px; color: #888; margin: 0; }

    .domain-grid { display: flex; flex-direction: column; gap: 10px; }

    .spec-panel {
      border: 1px solid #e0e4ec;
      border-radius: 14px;
      background: #fff;
      margin-bottom: 12px;
      overflow: hidden;
    }
    .spec-summary {
      list-style: none;
      cursor: pointer;
      padding: 14px 18px;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      user-select: none;
    }
    .spec-summary::-webkit-details-marker { display: none; }
    .spec-title { font-weight: 900; color: #1a1f36; }
    .spec-sub { font-size: 12px; color: #777; }
    .spec-body { border-top: 1px solid #f0f0f0; padding: 14px 18px; }
    .spec-loading { color: #888; padding: 6px 0; }
    .spec-error { color: #c62828; padding: 6px 0; }
    .markdown-content { font-size: 14px; line-height: 1.7; color: #444; }
    .markdown-content :first-child { margin-top: 0; }
    .markdown-content code { background: #f0f3ff; color: #4a6cf7; padding: 2px 7px; border-radius: 4px; font-size: 13px; }
    .markdown-content pre { background: #1a1f36; border-radius: 10px; padding: 18px 22px; overflow-x: auto; margin: 0 0 16px; }
    .markdown-content pre code { background: none; color: #e0e6ff; padding: 0; font-size: 13px; line-height: 1.6; }
    .markdown-content table { width: 100%; border-collapse: collapse; margin: 0 0 16px; font-size: 13px; }
    .markdown-content th { text-align: left; padding: 10px 12px; background: #f5f7fa; border-bottom: 2px solid #e0e4ec; font-weight: 600; color: #444; }
    .markdown-content td { padding: 9px 12px; border-bottom: 1px solid #f0f0f0; }

    .loading-state { text-align: center; padding: 44px 12px; color: #888; }
    .error-state {
      text-align: center;
      padding: 44px 12px;
      border: 1px solid #e0e4ec;
      border-radius: 14px;
      background: #fff;
      color: #c62828;
      margin-bottom: 12px;
    }
    .error-state i { display: block; font-size: 22px; margin-bottom: 8px; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .domain-card {
      background: #fff;
      border-radius: 12px;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .domain-card:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }
    .domain-icon {
      width: 48px; height: 48px;
      background: rgba(108,140,255,0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .domain-icon i { font-size: 22px; color: #6c8cff; }
    .domain-info { flex: 1; }
    .domain-info h3 { font-size: 16px; font-weight: 600; margin: 0 0 4px; color: #1a1f36; }
    .domain-info p { font-size: 13px; color: #777; margin: 0; }
    .card-arrow { color: #ccc; font-size: 18px; }

    .domain-card-expandable {
      display: block;
      padding: 0;
      overflow: hidden;
    }
    .domain-card-expandable:hover { transform: translateX(0); }
    .domain-card-header {
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .domain-actions {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .view-docs-link {
      font-size: 13px;
      color: #6c8cff;
      text-decoration: none;
      padding: 8px 10px;
      border-radius: 10px;
    }
    .view-docs-link:hover { text-decoration: underline; }
    .details-toggle {
      border: 1px solid #e0e4ec;
      background: #fff;
      color: #1a1f36;
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .details-toggle:hover { box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
    .details-toggle:focus-visible { outline: 2px solid #6c8cff; outline-offset: 2px; }

    .details {
      border-top: 1px solid #f0f0f0;
      max-height: 0;
      opacity: 0;
      transform: translateY(8px);
      transition: max-height 280ms cubic-bezier(0.2, 0, 0, 1), opacity 220ms cubic-bezier(0.2, 0, 0, 1), transform 280ms cubic-bezier(0.2, 0, 0, 1);
      overflow: hidden;
    }
    .details.details-expanded {
      max-height: 980px;
      opacity: 1;
      transform: translateY(0);
    }
    .details-grid {
      padding: 24px;
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 20px;
    }
    .left-panel, .right-panel {
      background: #fff;
      border: 1px solid #e0e4ec;
      border-radius: 12px;
      padding: 18px;
    }
    .panel-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
    .panel-title { font-size: 14px; font-weight: 700; color: #1a1f36; }
    .badge {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.6px;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid transparent;
      text-transform: uppercase;
      user-select: none;
    }
    .badge[data-variant="pending"] { background: rgba(108,140,255,0.12); color: #2f51e4; border-color: rgba(108,140,255,0.25); }
    .badge[data-variant="scanned"] { background: rgba(67,160,71,0.12); color: #2e7d32; border-color: rgba(67,160,71,0.25); }
    .badge[data-variant="expired"] { background: rgba(153,153,153,0.14); color: #666; border-color: rgba(153,153,153,0.25); }
    .badge[data-variant="error"] { background: rgba(198,40,40,0.12); color: #c62828; border-color: rgba(198,40,40,0.25); }

    .meta-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
    .meta-label { font-size: 12px; color: #777; }
    .meta-value { font-size: 12px; background: #f5f7fa; padding: 2px 6px; border-radius: 6px; }

    .qr-card { background: #f8f9fc; border-radius: 12px; padding: 14px; border: 1px solid #e0e4ec; margin-bottom: 14px; }
    .qr-wrap {
      width: 280px;
      max-width: 100%;
      margin: 0 auto;
      background: #fff;
      border-radius: 12px;
      padding: 16px;
      border: 1px solid #e0e4ec;
      position: relative;
      cursor: pointer;
      outline: none;
    }
    .qr-wrap:focus-visible { outline: 2px solid #6c8cff; outline-offset: 3px; }
    .qr-img { width: 240px; height: 240px; display: block; margin: 0 auto; image-rendering: pixelated; }
    .qr-loading { height: 240px; display: flex; align-items: center; justify-content: center; gap: 8px; color: #888; font-size: 13px; }
    .qr-caption { margin-top: 10px; font-size: 12px; color: #666; text-align: center; line-height: 1.5; }
    .qr-overlay {
      position: absolute;
      inset: 16px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      background: rgba(255,255,255,0.9);
      color: #c62828;
      border: 1px solid rgba(198,40,40,0.25);
    }
    .qr-muted .qr-img { opacity: 0.25; }

    .timer-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
    .ring { width: 44px; height: 44px; flex-shrink: 0; transform: rotate(-90deg); }
    .ring-track { fill: none; stroke: #e0e4ec; stroke-width: 4; }
    .ring-progress { fill: none; stroke: #6c8cff; stroke-width: 4; stroke-linecap: round; transition: stroke-dashoffset 250ms linear; }
    .timer-danger .ring-progress { stroke: #c62828; }
    .timer-expired .ring-progress { stroke: #999; }
    .timer-text { min-width: 0; }
    .timer-main { font-size: 14px; font-weight: 700; color: #1a1f36; }
    .timer-sub { font-size: 12px; color: #777; margin-top: 2px; }

    .action-bar { display: grid; gap: 10px; }
    .btn {
      width: 100%;
      border-radius: 12px;
      padding: 10px 12px;
      border: 1px solid #e0e4ec;
      background: #fff;
      cursor: pointer;
      font-weight: 700;
      font-size: 13px;
    }
    .btn:focus-visible { outline: 2px solid #6c8cff; outline-offset: 2px; }
    .btn[disabled] { opacity: 0.45; cursor: not-allowed; }
    .btn-primary { background: #6c8cff; border-color: #6c8cff; color: #fff; }
    .btn-primary:hover:not([disabled]) { filter: brightness(1.06); }
    .btn-secondary:hover:not([disabled]), .btn-tertiary:hover:not([disabled]) { box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
    .btn-tertiary { background: transparent; }
    .inline-note { font-size: 12px; color: #666; line-height: 1.5; }

    .tabs { display: flex; gap: 6px; border-bottom: 1px solid #e0e4ec; padding-bottom: 10px; margin-bottom: 12px; }
    .tab {
      border: 1px solid #e0e4ec;
      background: #fff;
      border-radius: 999px;
      padding: 8px 12px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      color: #666;
    }
    .tab.active { background: rgba(108,140,255,0.12); border-color: rgba(108,140,255,0.25); color: #2f51e4; }
    .tab:focus-visible { outline: 2px solid #6c8cff; outline-offset: 2px; }

    .section { margin-bottom: 14px; }
    .section-title { font-size: 14px; font-weight: 800; color: #1a1f36; margin-bottom: 8px; }
    .step { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 13px; color: #444; }
    .pill {
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.4px;
      border-radius: 8px;
      padding: 3px 8px;
      background: #f0f3ff;
      color: #2f51e4;
    }
    .hint { font-size: 13px; color: #666; line-height: 1.6; margin-top: 6px; }
    .code-block {
      margin: 0;
      background: #1a1f36;
      color: #e0e6ff;
      padding: 14px 16px;
      border-radius: 12px;
      overflow-x: auto;
      font-size: 12px;
      line-height: 1.6;
    }
    .kv { display: grid; gap: 8px; }
    .kv-row { display: grid; grid-template-columns: 190px 1fr; gap: 10px; align-items: baseline; font-size: 13px; color: #444; }
    .chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip {
      background: #f5f7fa;
      border: 1px solid #e0e4ec;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      color: #555;
    }

    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .domain-card-header { flex-wrap: wrap; }
      .domain-actions { width: 100%; justify-content: flex-end; }
      .details-grid { grid-template-columns: 1fr; }
      .qr-img { width: 200px; height: 200px; }
      .qr-loading { height: 200px; }
    }

    @media (prefers-color-scheme: dark) {
      .page-header h1 { color: #e8ecf7; }
      .domain-card { background: #121826; box-shadow: 0 1px 3px rgba(0,0,0,0.35); }
      .domain-info h3 { color: #e8ecf7; }
      .domain-info p { color: #a7b0c5; }
      .details-toggle { background: #121826; color: #e8ecf7; border-color: #25304a; }
      .view-docs-link { color: #8aa2ff; }
      .details { border-top-color: #25304a; }
      .left-panel, .right-panel { background: #121826; border-color: #25304a; }
      .panel-title { color: #e8ecf7; }
      .meta-value { background: #0b1020; }
      .qr-card { background: #0b1020; border-color: #25304a; }
      .qr-wrap { border-color: #25304a; }
      .ring-track { stroke: #25304a; }
      .timer-main { color: #e8ecf7; }
      .btn { background: #121826; border-color: #25304a; color: #e8ecf7; }
      .btn-primary { background: #8aa2ff; border-color: #8aa2ff; color: #0b1020; }
      .tabs { border-bottom-color: #25304a; }
      .tab { background: #121826; border-color: #25304a; color: #a7b0c5; }
      .section-title { color: #e8ecf7; }
      .chip { background: #0b1020; border-color: #25304a; color: #a7b0c5; }
      .kv-row { color: #e8ecf7; }
      .spec-panel { background: #121826; border-color: #25304a; }
      .spec-body { border-top-color: #25304a; }
      .spec-title { color: #e8ecf7; }
      .spec-sub { color: #a7b0c5; }
      .markdown-content { color: #e8ecf7; }
      .markdown-content code { background: rgba(138,162,255,0.14); color: #8aa2ff; }
      .markdown-content th { background: #0b1020; border-bottom-color: #25304a; color: #e8ecf7; }
      .markdown-content td { border-bottom-color: #25304a; }
    }
  `]
})
export class DomainListComponent implements OnInit, OnDestroy {
  private contentService = inject(ContentService);
  domains: Domain[] = [];
  loading = true;
  loadError = '';
  specOpen = true;
  specLoading = false;
  specError = '';
  specHtml = '';
  authSlug = 'smart-qr-auth';
  authExpanded = false;

  authBaseUrl = 'http://localhost:5100';
  authTab: 'flows' | 'responses' | 'errors' = 'flows';
  authStatus: 'pending' | 'scanned' | 'expired' | 'error' = 'pending';
  authDeepLink = '';
  authQrDataUrl = '';
  authOtpExpiredMinute: number | null = 5;
  authRemainingSeconds = 0;
  authInlineNote = '';
  authRegenerateDisabled = false;

  private authExpiresAt = 0;
  private authDurationSeconds = 0;
  private timerId: number | null = null;
  private regenWindowMs = 60_000;
  private regenCooldownMs = 30_000;
  private regenTimestamps: number[] = [];

  authResponseEnvelopeExample = JSON.stringify({
    status: 200,
    message: '...',
    resultObject: { token: '<jwt>', userid: '<userId>' }
  }, null, 2);

  authMfaRequiredExample = JSON.stringify({
    status: 4233,
    message: 'MfaRequired',
    resultObject: { userid: '<userId>', mfaContactInfo: '<masked contact>', OtpExpiredMinute: 5 }
  }, null, 2);

  get authStatusLabel(): string {
    if (this.authStatus === 'pending') return 'Pending';
    if (this.authStatus === 'scanned') return 'Scanned';
    if (this.authStatus === 'expired') return 'Expired';
    return 'Error';
  }

  get ringCircumference(): number {
    return 2 * Math.PI * 18;
  }

  get ringDashOffset(): number {
    const progress = this.authDurationSeconds <= 0 ? 0 : (this.authRemainingSeconds / this.authDurationSeconds);
    return this.ringCircumference * (1 - Math.max(0, Math.min(1, progress)));
  }

  get authRemainingFormatted(): string {
    const s = Math.max(0, this.authRemainingSeconds);
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }

  get timerAriaLabel(): string {
    const s = Math.max(0, this.authRemainingSeconds);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `OTP expires in ${m} minutes ${r} seconds`;
  }

  async ngOnInit() {
    void this.loadSpec();
    this.loading = true;
    this.loadError = '';
    try {
      this.domains = await this.contentService.getDomains();
    } catch (e) {
      this.loadError = 'Failed to load domains. Verify assets are reachable (assets/content/domains.json).';
      console.error('Failed to load domains', e);
      this.domains = [];
    } finally {
      this.loading = false;
    }
  }

  private async loadSpec() {
    this.specLoading = true;
    this.specError = '';
    const md = await this.contentService.getDocumentationMarkdown('SmartQR_System.md');
    if (!md) {
      this.specError = 'SmartQR_System.md could not be loaded. Verify it is served via /assets/documentation/.';
      this.specHtml = '';
      this.specLoading = false;
      return;
    }
    this.specHtml = marked.parse(md, { async: false }) as string;
    this.specLoading = false;
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  async toggleAuthDetails() {
    this.authExpanded = !this.authExpanded;
    if (this.authExpanded) {
      if (!this.authDeepLink || this.authStatus === 'expired') {
        await this.createAuthSession();
      }
      this.startTimer();
    } else {
      this.stopTimer();
      this.authInlineNote = '';
    }
  }

  closeAuthDetails() {
    this.authExpanded = false;
    this.stopTimer();
    this.authInlineNote = '';
  }

  markAuthScanned() {
    if (!this.authExpanded) return;
    if (this.authStatus === 'expired') return;
    if (!this.authDeepLink) return;
    this.authStatus = 'scanned';
  }

  async regenerateAuthSession() {
    if (this.authRegenerateDisabled) return;
    const now = Date.now();
    this.regenTimestamps = this.regenTimestamps.filter(t => now - t < this.regenWindowMs);
    this.regenTimestamps.push(now);
    if (this.regenTimestamps.length > 3) {
      this.authStatus = 'error';
      this.authInlineNote = 'Rate limited. Try again later.';
      this.authRegenerateDisabled = true;
      window.setTimeout(() => {
        this.authRegenerateDisabled = false;
        if (this.authStatus === 'error') this.authStatus = 'pending';
        this.authInlineNote = '';
      }, this.regenCooldownMs);
      return;
    }
    await this.createAuthSession();
    this.authInlineNote = 'OTP regenerated.';
    window.setTimeout(() => {
      if (this.authInlineNote === 'OTP regenerated.') this.authInlineNote = '';
    }, 1500);
  }

  async copyAuthLink() {
    if (!this.authDeepLink) return;
    try {
      await navigator.clipboard.writeText(this.authDeepLink);
      this.authInlineNote = 'Link copied.';
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = this.authDeepLink;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        this.authInlineNote = 'Link copied.';
      } catch {
        this.authStatus = 'error';
        this.authInlineNote = 'Copy failed. Please select and copy manually.';
      } finally {
        document.body.removeChild(textarea);
      }
    } finally {
      window.setTimeout(() => {
        if (this.authInlineNote === 'Link copied.') this.authInlineNote = '';
      }, 1500);
    }
  }

  private async createAuthSession() {
    this.authStatus = 'pending';
    this.authQrDataUrl = '';
    const userId = this.createId();
    const otpCode = this.createOtp();
    this.authOtpExpiredMinute = this.authOtpExpiredMinute ?? 5;
    this.authDurationSeconds = (this.authOtpExpiredMinute || 5) * 60;
    this.authExpiresAt = Date.now() + this.authDurationSeconds * 1000;
    this.authDeepLink = `${this.authBaseUrl}/AuthenticationApi/ValidateLoginOtp?userId=${encodeURIComponent(userId)}&otpCode=${encodeURIComponent(otpCode)}`;
    this.authRemainingSeconds = this.authDurationSeconds;
    this.stopTimer();
    this.startTimer();
    try {
      this.authQrDataUrl = await QRCode.toDataURL(this.authDeepLink, { width: 240, margin: 1 });
    } catch {
      this.authStatus = 'error';
      this.authInlineNote = 'Failed to generate QR code.';
    }
  }

  private startTimer() {
    if (this.timerId != null) return;
    this.tickTimer();
    this.timerId = window.setInterval(() => this.tickTimer(), 1000);
  }

  private stopTimer() {
    if (this.timerId == null) return;
    window.clearInterval(this.timerId);
    this.timerId = null;
  }

  private tickTimer() {
    const remainingMs = this.authExpiresAt - Date.now();
    this.authRemainingSeconds = Math.ceil(Math.max(0, remainingMs) / 1000);
    if (this.authRemainingSeconds <= 0 && this.authExpanded && this.authStatus !== 'expired') {
      this.authStatus = 'expired';
    }
  }

  private createOtp(): string {
    const v = Math.floor(100000 + Math.random() * 900000);
    return String(v);
  }

  private createId(): string {
    const anyCrypto = (globalThis as any).crypto as Crypto | undefined;
    if (anyCrypto?.randomUUID) return anyCrypto.randomUUID();
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  }
}
