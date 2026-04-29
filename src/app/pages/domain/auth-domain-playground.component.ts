import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import QRCode from 'qrcode';

type RequestMode = 'simulated' | 'live';
type SimulatedError = 'none' | '401-unauthorized' | '401-session-expired' | '429' | 'network';
type StatusVariant = 'idle' | 'loading' | 'success' | 'error';

type EndpointFieldSource = 'Body' | 'Query' | 'Route' | 'Header';
type FieldType = 'text' | 'email' | 'password' | 'number' | 'textarea';

type EndpointFieldSpec = {
  name: string;
  label: string;
  source: EndpointFieldSource;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
};

type EndpointSpec = {
  id: string;
  title: string;
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  authRequired: boolean;
  rateLimitPolicy?: string;
  fields: EndpointFieldSpec[];
};

@Component({
  selector: 'app-auth-domain-playground',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-playground">
      <div class="hero">
        <div class="hero-title">
          <h2>Authentication UI Playground</h2>
          <p>
            Built from <code>documentation/Authentication_System.md</code>: JWT Bearer tokens, OTP flows, single-session
            enforcement, and rate-limit behavior.
          </p>
        </div>
        <div class="hero-controls">
          <label class="field">
            <span class="label">Mode</span>
            <select [value]="mode" (change)="setMode(($any($event.target).value))">
              <option value="simulated">Simulated (Recommended)</option>
              <option value="live">Live API</option>
            </select>
          </label>
          <label class="field">
            <span class="label">Base URL</span>
            <input type="text" [value]="baseUrl" (input)="baseUrl = $any($event.target).value" />
          </label>
          <label class="field">
            <span class="label">Simulated error</span>
            <select [value]="simulatedError" (change)="simulatedError = ($any($event.target).value)">
              <option value="none">None</option>
              <option value="401-unauthorized">401 Unauthorized</option>
              <option value="401-session-expired">401 SessionExpired</option>
              <option value="429">429 Too Many Requests</option>
              <option value="network">Network error</option>
            </select>
          </label>
        </div>
      </div>

      <div class="grid">
        <section class="panel">
          <h3>Primary Flows</h3>

          <form class="card" [formGroup]="loginForm" (ngSubmit)="submitLogin()">
            <div class="card-head">
              <div>
                <div class="card-title">Login</div>
                <div class="card-subtitle"><code>POST /AuthenticationApi/login</code></div>
              </div>
              <span class="policy" aria-label="Rate limit policy">auth-login</span>
            </div>

            <div class="row-2">
              <label class="field">
                <span class="label">User code</span>
                <input type="text" formControlName="usercode" autocomplete="username" />
                <span class="error" *ngIf="showError(loginForm, 'usercode', 'required')">Required</span>
              </label>
              <label class="field">
                <span class="label">Passcode</span>
                <input type="password" formControlName="passcode" autocomplete="current-password" />
                <span class="error" *ngIf="showError(loginForm, 'passcode', 'required')">Required</span>
              </label>
            </div>
            <div class="row-2">
              <label class="field">
                <span class="label">Local time zone</span>
                <input type="text" formControlName="localTimeZone" placeholder="Asia/Yangon" />
              </label>
              <label class="check">
                <input type="checkbox" formControlName="simulateMfaRequired" />
                <span>Simulate MFA required (status 4233)</span>
              </label>
            </div>

            <div class="actions">
              <button type="submit" class="btn btn-primary" [disabled]="status.login === 'loading'">
                <span class="spinner" *ngIf="status.login === 'loading'"></span>
                Login
              </button>
              <button type="button" class="btn btn-secondary" (click)="resetLogin()">Reset</button>
            </div>
            <div class="result" role="status" aria-live="polite" *ngIf="results.login">
              <div class="badge" [attr.data-variant]="results.login.variant">{{ results.login.label }}</div>
              <pre class="payload"><code>{{ results.login.payload }}</code></pre>
            </div>
          </form>

          <form class="card" [formGroup]="otpForm" (ngSubmit)="submitValidateOtp()">
            <div class="card-head">
              <div>
                <div class="card-title">Validate Login OTP</div>
                <div class="card-subtitle"><code>GET /AuthenticationApi/ValidateLoginOtp</code></div>
              </div>
              <span class="policy">auth-otp</span>
            </div>

            <div class="row-2">
              <label class="field">
                <span class="label">User ID</span>
                <input type="text" formControlName="userId" />
                <span class="error" *ngIf="showError(otpForm, 'userId', 'required')">Required</span>
              </label>
              <label class="field">
                <span class="label">OTP code</span>
                <input type="text" inputmode="numeric" formControlName="otpCode" />
                <span class="error" *ngIf="showError(otpForm, 'otpCode', 'required')">Required</span>
              </label>
            </div>

            <div class="otp-tools">
              <div class="qr-box">
                <div class="qr-wrap">
                  <img *ngIf="otpQrDataUrl" [src]="otpQrDataUrl" class="qr-img" alt="ValidateLoginOtp QR code" />
                  <div *ngIf="!otpQrDataUrl" class="qr-placeholder">
                    <i class="bi bi-qr-code"></i>
                    <div>QR preview</div>
                  </div>
                  <div class="qr-overlay" *ngIf="otpTimerState === 'expired'">Expired</div>
                </div>
                <div class="qr-hint">
                  Encodes <code>userId</code> and <code>otpCode</code> as query params.
                </div>
              </div>
              <div class="timer">
                <div class="timer-top">
                  <div class="timer-title">OTP countdown</div>
                  <span class="timer-badge" [attr.data-variant]="otpTimerState">{{ otpTimerStateLabel }}</span>
                </div>
                <div class="timer-body">
                  <svg class="ring" viewBox="0 0 48 48" aria-hidden="true">
                    <circle class="ring-track" cx="24" cy="24" r="18"></circle>
                    <circle class="ring-progress"
                            cx="24"
                            cy="24"
                            r="18"
                            [attr.stroke-dasharray]="ringCircumference"
                            [attr.stroke-dashoffset]="otpRingDashOffset"></circle>
                  </svg>
                  <div>
                    <div class="timer-main" [attr.aria-label]="otpTimerAriaLabel">Expires in {{ otpRemainingFormatted }}</div>
                    <div class="timer-sub">OtpExpiredMinute: {{ otpExpiredMinute }}</div>
                  </div>
                </div>
                <div class="timer-actions">
                  <button type="button" class="btn btn-secondary" (click)="generateOtpQr()">
                    Generate QR
                  </button>
                  <button type="button" class="btn btn-tertiary" (click)="restartOtpTimer()">Restart timer</button>
                </div>
              </div>
            </div>

            <div class="actions">
              <button type="submit" class="btn btn-primary" [disabled]="status.otp === 'loading'">
                <span class="spinner" *ngIf="status.otp === 'loading'"></span>
                Validate OTP
              </button>
              <button type="button" class="btn btn-secondary" (click)="copyOtpLink()" [disabled]="!otpDeepLink">
                Copy link
              </button>
            </div>
            <div class="result" role="status" aria-live="polite" *ngIf="results.otp">
              <div class="badge" [attr.data-variant]="results.otp.variant">{{ results.otp.label }}</div>
              <pre class="payload"><code>{{ results.otp.payload }}</code></pre>
            </div>
          </form>

          <div class="card">
            <div class="card-head">
              <div>
                <div class="card-title">Password reset</div>
                <div class="card-subtitle">OTP → reset token → new password</div>
              </div>
              <span class="policy">auth-password-reset</span>
            </div>

            <form class="subform" [formGroup]="forgotForm" (ngSubmit)="submitForgotPassword()">
              <div class="subhead">Step 1 — Forgot password</div>
              <div class="row-2">
                <label class="field">
                  <span class="label">Email</span>
                  <input type="email" formControlName="email" autocomplete="email" />
                  <span class="error" *ngIf="showError(forgotForm, 'email', 'required')">Required</span>
                  <span class="error" *ngIf="showError(forgotForm, 'email', 'email')">Invalid email</span>
                </label>
                <div class="actions-inline">
                  <button type="submit" class="btn btn-primary" [disabled]="status.forgot === 'loading'">
                    <span class="spinner" *ngIf="status.forgot === 'loading'"></span>
                    Send OTP
                  </button>
                </div>
              </div>
              <div class="result" role="status" aria-live="polite" *ngIf="results.forgot">
                <div class="badge" [attr.data-variant]="results.forgot.variant">{{ results.forgot.label }}</div>
                <pre class="payload"><code>{{ results.forgot.payload }}</code></pre>
              </div>
            </form>

            <form class="subform" [formGroup]="verifyForgotForm" (ngSubmit)="submitVerifyForgotOtp()">
              <div class="subhead">Step 2 — Verify OTP (returns resetToken)</div>
              <div class="row-2">
                <label class="field">
                  <span class="label">User ID</span>
                  <input type="text" formControlName="userId" />
                  <span class="error" *ngIf="showError(verifyForgotForm, 'userId', 'required')">Required</span>
                </label>
                <label class="field">
                  <span class="label">OTP code</span>
                  <input type="text" inputmode="numeric" formControlName="otpCode" />
                  <span class="error" *ngIf="showError(verifyForgotForm, 'otpCode', 'required')">Required</span>
                </label>
              </div>
              <div class="actions">
                <button type="submit" class="btn btn-primary" [disabled]="status.verifyForgot === 'loading'">
                  <span class="spinner" *ngIf="status.verifyForgot === 'loading'"></span>
                  Verify OTP
                </button>
              </div>
              <div class="result" role="status" aria-live="polite" *ngIf="results.verifyForgot">
                <div class="badge" [attr.data-variant]="results.verifyForgot.variant">{{ results.verifyForgot.label }}</div>
                <pre class="payload"><code>{{ results.verifyForgot.payload }}</code></pre>
              </div>
            </form>

            <form class="subform" [formGroup]="resetPasswordForm" (ngSubmit)="submitResetPassword()">
              <div class="subhead">Step 3 — Reset password</div>
              <div class="row-2">
                <label class="field">
                  <span class="label">User ID</span>
                  <input type="text" formControlName="userId" />
                  <span class="error" *ngIf="showError(resetPasswordForm, 'userId', 'required')">Required</span>
                </label>
                <label class="field">
                  <span class="label">Reset token</span>
                  <input type="text" formControlName="resetToken" />
                  <span class="error" *ngIf="showError(resetPasswordForm, 'resetToken', 'required')">Required</span>
                </label>
              </div>
              <label class="field">
                <span class="label">New password</span>
                <input type="password" formControlName="newPassword" autocomplete="new-password" />
                <span class="error" *ngIf="showError(resetPasswordForm, 'newPassword', 'required')">Required</span>
              </label>
              <div class="actions">
                <button type="submit" class="btn btn-primary" [disabled]="status.resetPassword === 'loading'">
                  <span class="spinner" *ngIf="status.resetPassword === 'loading'"></span>
                  Reset password
                </button>
                <button type="button" class="btn btn-secondary" (click)="prefillResetFromVerify()">Use returned resetToken</button>
              </div>
              <div class="result" role="status" aria-live="polite" *ngIf="results.resetPassword">
                <div class="badge" [attr.data-variant]="results.resetPassword.variant">{{ results.resetPassword.label }}</div>
                <pre class="payload"><code>{{ results.resetPassword.payload }}</code></pre>
              </div>
            </form>
          </div>
        </section>

        <section class="panel">
          <h3>Endpoint Explorer</h3>
          <p class="muted">
            This section mirrors the “API Endpoints → Summary” table. Live mode sends real requests; simulated mode returns
            <code>ServiceActionResult</code>-shaped mock payloads.
          </p>

          <div class="accordion">
            <div *ngFor="let ep of endpoints" class="endpoint" [class.open]="openEndpointId === ep.id">
              <button type="button" class="endpoint-head"
                      (click)="toggleEndpoint(ep.id)"
                      [attr.aria-expanded]="openEndpointId === ep.id">
                <span class="method" [attr.data-method]="ep.method">{{ ep.method }}</span>
                <span class="path"><code>{{ ep.path }}</code></span>
                <span class="meta">
                  <span class="auth" [attr.data-auth]="ep.authRequired">{{ ep.authRequired ? 'Auth' : 'Public' }}</span>
                  <span class="rate" *ngIf="ep.rateLimitPolicy">{{ ep.rateLimitPolicy }}</span>
                </span>
              </button>

              <div class="endpoint-body" *ngIf="openEndpointId === ep.id">
                <form class="endpoint-form" [formGroup]="endpointForms[ep.id]" (ngSubmit)="sendEndpoint(ep)">
                  <div class="fields">
                    <ng-container *ngFor="let f of ep.fields">
                      <label class="field" [class.full]="f.type === 'textarea'">
                        <span class="label">{{ f.label }} <span class="pill-mini">{{ f.source }}</span></span>
                        <textarea *ngIf="f.type === 'textarea'" rows="7" formControlName="{{ f.name }}"
                                  [placeholder]="f.placeholder || ''"></textarea>
                        <input *ngIf="f.type !== 'textarea'" [type]="inputType(f.type)" formControlName="{{ f.name }}"
                               [placeholder]="f.placeholder || ''" />
                        <span class="error" *ngIf="showError(endpointForms[ep.id], f.name, 'required')">Required</span>
                        <span class="error" *ngIf="showError(endpointForms[ep.id], f.name, 'email')">Invalid email</span>
                      </label>
                    </ng-container>
                  </div>
                  <div class="actions">
                    <button type="submit" class="btn btn-primary" [disabled]="endpointStatus[ep.id] === 'loading'">
                      <span class="spinner" *ngIf="endpointStatus[ep.id] === 'loading'"></span>
                      Send request
                    </button>
                    <button type="button" class="btn btn-secondary" (click)="copyCurl(ep)">Copy curl</button>
                  </div>
                </form>

                <div class="result" role="status" aria-live="polite" *ngIf="endpointResults[ep.id]">
                  <div class="badge" [attr.data-variant]="endpointResults[ep.id]!.variant">{{ endpointResults[ep.id]!.label }}</div>
                  <pre class="payload"><code>{{ endpointResults[ep.id]!.payload }}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .auth-playground { display: grid; gap: 14px; }

    .hero {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
      padding: 18px 20px;
      border-radius: 14px;
      border: 1px solid #e0e4ec;
      background: #fff;
    }
    .hero-title h2 { font-size: 18px; font-weight: 800; color: #1a1f36; margin: 0 0 6px; }
    .hero-title p { margin: 0; color: #666; font-size: 13px; line-height: 1.6; max-width: 620px; }

    .hero-controls {
      display: grid;
      grid-template-columns: 170px 260px 220px;
      gap: 10px;
      align-items: end;
      min-width: 0;
    }

    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .panel {
      background: #fff;
      border: 1px solid #e0e4ec;
      border-radius: 14px;
      padding: 18px;
    }
    .panel h3 { margin: 0 0 8px; font-size: 16px; font-weight: 800; color: #1a1f36; }
    .muted { margin: 0 0 12px; color: #777; font-size: 13px; line-height: 1.6; }

    .card {
      border: 1px solid #e0e4ec;
      border-radius: 14px;
      padding: 14px;
      background: #fff;
      margin-bottom: 12px;
    }
    .card-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 12px;
    }
    .card-title { font-size: 14px; font-weight: 900; color: #1a1f36; }
    .card-subtitle { margin-top: 4px; color: #666; font-size: 12px; }
    .policy { font-size: 11px; font-weight: 800; color: #2f51e4; background: #f0f3ff; padding: 4px 10px; border-radius: 999px; }

    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-items: end; }
    .field { display: grid; gap: 6px; }
    .field.full { grid-column: 1 / -1; }
    .label { font-size: 12px; font-weight: 700; color: #444; display: flex; align-items: center; gap: 8px; }
    input, select, textarea {
      border: 1px solid #e0e4ec;
      border-radius: 12px;
      padding: 10px 12px;
      font-size: 13px;
      outline: none;
      background: #fff;
      color: #1a1f36;
    }
    textarea { resize: vertical; min-height: 120px; font-family: inherit; }
    input:focus, select:focus, textarea:focus { border-color: rgba(108, 140, 255, 0.8); box-shadow: 0 0 0 3px rgba(108,140,255,0.14); }
    .error { color: #c62828; font-size: 12px; }
    .check { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #555; padding: 10px 0; }

    .actions { display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap; }
    .actions-inline { display: flex; justify-content: flex-end; align-items: end; height: 100%; }
    .btn {
      border-radius: 12px;
      padding: 10px 12px;
      border: 1px solid #e0e4ec;
      background: #fff;
      cursor: pointer;
      font-weight: 800;
      font-size: 13px;
      color: #1a1f36;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn[disabled] { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: #6c8cff; border-color: #6c8cff; color: #fff; }
    .btn-primary:hover:not([disabled]) { filter: brightness(1.06); }
    .btn-secondary:hover:not([disabled]), .btn-tertiary:hover:not([disabled]) { box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
    .btn-tertiary { background: transparent; }

    .spinner {
      width: 14px; height: 14px;
      border-radius: 999px;
      border: 2px solid rgba(255,255,255,0.5);
      border-top-color: rgba(255,255,255,0.95);
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .result { margin-top: 12px; }
    .badge {
      font-size: 11px; font-weight: 900; letter-spacing: 0.6px;
      display: inline-flex; align-items: center;
      padding: 4px 10px; border-radius: 999px;
      border: 1px solid transparent;
      text-transform: uppercase;
    }
    .badge[data-variant="success"] { background: rgba(67,160,71,0.12); color: #2e7d32; border-color: rgba(67,160,71,0.25); }
    .badge[data-variant="error"] { background: rgba(198,40,40,0.12); color: #c62828; border-color: rgba(198,40,40,0.25); }
    .badge[data-variant="info"] { background: rgba(108,140,255,0.12); color: #2f51e4; border-color: rgba(108,140,255,0.25); }
    .payload {
      margin: 10px 0 0;
      background: #1a1f36;
      color: #e0e6ff;
      border-radius: 12px;
      padding: 12px 14px;
      overflow-x: auto;
      font-size: 12px;
      line-height: 1.6;
    }

    .otp-tools { display: grid; grid-template-columns: 1.1fr 1fr; gap: 12px; margin-top: 10px; }
    .qr-box { border: 1px solid #e0e4ec; border-radius: 14px; padding: 12px; background: #f8f9fc; }
    .qr-wrap { position: relative; border-radius: 12px; border: 1px solid #e0e4ec; background: #fff; padding: 12px; display: grid; place-items: center; min-height: 210px; }
    .qr-img { width: 190px; height: 190px; display: block; }
    .qr-placeholder { display: grid; place-items: center; gap: 8px; color: #999; font-weight: 700; font-size: 13px; }
    .qr-placeholder i { font-size: 28px; }
    .qr-overlay {
      position: absolute; inset: 12px;
      border-radius: 10px;
      display: grid; place-items: center;
      background: rgba(255,255,255,0.9);
      color: #c62828;
      border: 1px solid rgba(198,40,40,0.25);
      font-weight: 900;
      letter-spacing: 0.6px;
      text-transform: uppercase;
    }
    .qr-hint { margin-top: 10px; font-size: 12px; color: #666; line-height: 1.5; }

    .timer {
      border: 1px solid #e0e4ec;
      border-radius: 14px;
      padding: 12px;
      background: #fff;
    }
    .timer-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
    .timer-title { font-size: 13px; font-weight: 900; color: #1a1f36; }
    .timer-badge {
      font-size: 11px; font-weight: 900; letter-spacing: 0.6px;
      padding: 4px 10px; border-radius: 999px; border: 1px solid transparent;
      text-transform: uppercase;
      user-select: none;
    }
    .timer-badge[data-variant="idle"] { background: rgba(153,153,153,0.14); color: #666; border-color: rgba(153,153,153,0.25); }
    .timer-badge[data-variant="running"] { background: rgba(108,140,255,0.12); color: #2f51e4; border-color: rgba(108,140,255,0.25); }
    .timer-badge[data-variant="expired"] { background: rgba(153,153,153,0.14); color: #666; border-color: rgba(153,153,153,0.25); }
    .timer-body { display: flex; align-items: center; gap: 12px; }
    .ring { width: 44px; height: 44px; flex-shrink: 0; transform: rotate(-90deg); }
    .ring-track { fill: none; stroke: #e0e4ec; stroke-width: 4; }
    .ring-progress { fill: none; stroke: #6c8cff; stroke-width: 4; stroke-linecap: round; transition: stroke-dashoffset 250ms linear; }
    .timer-main { font-size: 14px; font-weight: 900; color: #1a1f36; }
    .timer-sub { font-size: 12px; color: #777; margin-top: 2px; }
    .timer-actions { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }

    .subform { border-top: 1px solid #f0f0f0; padding-top: 12px; margin-top: 12px; }
    .subhead { font-weight: 900; color: #1a1f36; margin-bottom: 10px; }

    .accordion { display: grid; gap: 10px; }
    .endpoint { border: 1px solid #e0e4ec; border-radius: 14px; overflow: hidden; background: #fff; }
    .endpoint-head {
      width: 100%;
      background: #fff;
      border: 0;
      cursor: pointer;
      padding: 12px 14px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 12px;
      text-align: left;
    }
    .method {
      font-size: 11px; font-weight: 900; letter-spacing: 0.5px;
      padding: 4px 10px; border-radius: 8px;
      border: 1px solid #e0e4ec;
      background: #f5f7fa;
      color: #444;
    }
    .method[data-method="POST"] { background: rgba(108,140,255,0.12); border-color: rgba(108,140,255,0.25); color: #2f51e4; }
    .method[data-method="GET"] { background: rgba(67,160,71,0.12); border-color: rgba(67,160,71,0.25); color: #2e7d32; }
    .method[data-method="DELETE"] { background: rgba(198,40,40,0.12); border-color: rgba(198,40,40,0.25); color: #c62828; }
    .meta { display: flex; gap: 8px; align-items: center; }
    .auth, .rate {
      font-size: 11px; font-weight: 800;
      padding: 4px 10px; border-radius: 999px;
      border: 1px solid #e0e4ec;
      color: #666; background: #fff;
    }
    .auth[data-auth="true"] { color: #1a1f36; }
    .endpoint-body { border-top: 1px solid #f0f0f0; padding: 14px; }
    .endpoint-form .fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .pill-mini { font-size: 10px; font-weight: 900; color: #666; border: 1px solid #e0e4ec; border-radius: 999px; padding: 2px 8px; background: #fff; }

    @media (max-width: 980px) {
      .grid { grid-template-columns: 1fr; }
      .hero-controls { grid-template-columns: 1fr; }
      .row-2 { grid-template-columns: 1fr; }
      .otp-tools { grid-template-columns: 1fr; }
      .endpoint-form .fields { grid-template-columns: 1fr; }
    }

    @media (prefers-color-scheme: dark) {
      .hero, .panel, .card, .endpoint, .timer { background: #121826; border-color: #25304a; }
      .hero-title h2, .panel h3, .card-title, .timer-title, .timer-main, .subhead { color: #e8ecf7; }
      .hero-title p, .muted, .card-subtitle, .label, .check, .qr-hint, .timer-sub { color: #a7b0c5; }
      input, select, textarea { background: #0b1020; border-color: #25304a; color: #e8ecf7; }
      .btn { background: #121826; border-color: #25304a; color: #e8ecf7; }
      .btn-primary { background: #8aa2ff; border-color: #8aa2ff; color: #0b1020; }
      .qr-box { background: #0b1020; border-color: #25304a; }
      .qr-wrap { background: #121826; border-color: #25304a; }
      .ring-track { stroke: #25304a; }
      .method, .auth, .rate, .pill-mini { background: #0b1020; border-color: #25304a; color: #a7b0c5; }
      .endpoint-head { background: #121826; }
      .endpoint-body, .subform { border-top-color: #25304a; }
    }
  `]
})
export class AuthDomainPlaygroundComponent implements OnDestroy {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  mode: RequestMode = 'simulated';
  simulatedError: SimulatedError = 'none';
  baseUrl = 'http://localhost:5100';

  status: {
    login: StatusVariant;
    otp: StatusVariant;
    forgot: StatusVariant;
    verifyForgot: StatusVariant;
    resetPassword: StatusVariant;
  } = {
    login: 'idle',
    otp: 'idle',
    forgot: 'idle',
    verifyForgot: 'idle',
    resetPassword: 'idle'
  };

  results: {
    login: { variant: 'success' | 'error' | 'info'; label: string; payload: string } | null;
    otp: { variant: 'success' | 'error' | 'info'; label: string; payload: string } | null;
    forgot: { variant: 'success' | 'error' | 'info'; label: string; payload: string } | null;
    verifyForgot: { variant: 'success' | 'error' | 'info'; label: string; payload: string } | null;
    resetPassword: { variant: 'success' | 'error' | 'info'; label: string; payload: string } | null;
  } = {
    login: null,
    otp: null,
    forgot: null,
    verifyForgot: null,
    resetPassword: null
  };

  loginForm = this.fb.group({
    usercode: ['', Validators.required],
    passcode: ['', Validators.required],
    localTimeZone: ['Asia/Yangon'],
    simulateMfaRequired: [false]
  });

  otpForm = this.fb.group({
    userId: ['', Validators.required],
    otpCode: ['', Validators.required]
  });

  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  verifyForgotForm = this.fb.group({
    userId: ['', Validators.required],
    otpCode: ['', Validators.required]
  });

  resetPasswordForm = this.fb.group({
    userId: ['', Validators.required],
    resetToken: ['', Validators.required],
    newPassword: ['', Validators.required]
  });

  endpoints: EndpointSpec[] = [
    {
      id: 'change-timezone',
      title: 'Change user time zone',
      method: 'POST',
      path: '/AuthenticationApi/ChangeUserTimeZone',
      authRequired: true,
      fields: [
        { name: 'userId', label: 'userId', source: 'Body', type: 'text', required: true },
        { name: 'timeZone', label: 'timeZone', source: 'Body', type: 'text', required: true }
      ]
    },
    {
      id: 'ftp-login',
      title: 'FTP login',
      method: 'POST',
      path: '/AuthenticationApi/ftpLogin',
      authRequired: false,
      rateLimitPolicy: 'auth-login',
      fields: [
        { name: 'licenseno', label: 'licenseno', source: 'Query', type: 'text', required: true }
      ]
    },
    {
      id: 'google-login',
      title: 'Google login',
      method: 'POST',
      path: '/AuthenticationApi/googleLogin',
      authRequired: false,
      rateLimitPolicy: 'auth-login',
      fields: [
        { name: 'idToken', label: 'idToken', source: 'Body', type: 'text', required: true },
        { name: 'localTimeZone', label: 'localTimeZone', source: 'Body', type: 'text' }
      ]
    },
    {
      id: 'login',
      title: 'Login',
      method: 'POST',
      path: '/AuthenticationApi/login',
      authRequired: false,
      rateLimitPolicy: 'auth-login',
      fields: [
        { name: 'usercode', label: 'usercode', source: 'Body', type: 'text', required: true },
        { name: 'passcode', label: 'passcode', source: 'Body', type: 'password', required: true },
        { name: 'localTimeZone', label: 'localTimeZone', source: 'Body', type: 'text' }
      ]
    },
    {
      id: 'login-with-forgot-otp',
      title: 'Login with forgot password OTP',
      method: 'GET',
      path: '/AuthenticationApi/LoginWithForgotPasswordOtp',
      authRequired: false,
      rateLimitPolicy: 'auth-otp',
      fields: [
        { name: 'userId', label: 'userId', source: 'Query', type: 'text', required: true },
        { name: 'otpCode', label: 'otpCode', source: 'Query', type: 'text', required: true }
      ]
    },
    {
      id: 'logout',
      title: 'Logout',
      method: 'POST',
      path: '/AuthenticationApi/logout',
      authRequired: true,
      fields: [
        { name: 'token', label: 'Authorization Bearer token', source: 'Header', type: 'text', required: true, placeholder: 'Bearer <jwt>' }
      ]
    },
    {
      id: 'register',
      title: 'Register',
      method: 'POST',
      path: '/AuthenticationApi/Register',
      authRequired: false,
      rateLimitPolicy: 'auth-register',
      fields: [
        { name: 'email', label: 'email', source: 'Body', type: 'email', required: true },
        { name: 'password', label: 'password', source: 'Body', type: 'password', required: true },
        { name: 'userName', label: 'userName', source: 'Body', type: 'text' },
        { name: 'phoneNumber', label: 'phoneNumber', source: 'Body', type: 'text' },
        { name: 'localTimeZone', label: 'localTimeZone', source: 'Body', type: 'text' }
      ]
    },
    {
      id: 'resend-login-otp',
      title: 'Resend login OTP',
      method: 'GET',
      path: '/AuthenticationApi/ResendLoginOtp/{userId}',
      authRequired: false,
      rateLimitPolicy: 'auth-otp',
      fields: [
        { name: 'userId', label: 'userId', source: 'Route', type: 'text', required: true }
      ]
    },
    {
      id: 'reset-password',
      title: 'Reset password',
      method: 'POST',
      path: '/AuthenticationApi/ResetPassword',
      authRequired: false,
      rateLimitPolicy: 'auth-password-reset',
      fields: [
        { name: 'userId', label: 'userId', source: 'Body', type: 'text', required: true },
        { name: 'resetToken', label: 'resetToken', source: 'Body', type: 'text', required: true },
        { name: 'newPassword', label: 'newPassword', source: 'Body', type: 'password', required: true }
      ]
    },
    {
      id: 'update-show-login',
      title: 'Update show login info',
      method: 'POST',
      path: '/AuthenticationApi/UpdateShowLoginInfo/{id}',
      authRequired: true,
      fields: [
        { name: 'id', label: 'id', source: 'Route', type: 'text', required: true }
      ]
    },
    {
      id: 'validate-login-otp',
      title: 'Validate login OTP',
      method: 'GET',
      path: '/AuthenticationApi/ValidateLoginOtp',
      authRequired: false,
      rateLimitPolicy: 'auth-otp',
      fields: [
        { name: 'userId', label: 'userId', source: 'Query', type: 'text', required: true },
        { name: 'otpCode', label: 'otpCode', source: 'Query', type: 'text', required: true }
      ]
    },
    {
      id: 'verify-forgot-otp',
      title: 'Verify forgot password OTP',
      method: 'GET',
      path: '/AuthenticationApi/VerifyForgotPasswordOtp',
      authRequired: false,
      rateLimitPolicy: 'auth-otp',
      fields: [
        { name: 'userId', label: 'userId', source: 'Query', type: 'text', required: true },
        { name: 'otpCode', label: 'otpCode', source: 'Query', type: 'text', required: true }
      ]
    },
    {
      id: 'sysuser-change-password',
      title: 'SysUser ChangePassword',
      method: 'GET',
      path: '/SysUser/ChangePassword',
      authRequired: true,
      rateLimitPolicy: 'auth-password-reset',
      fields: [
        { name: 'userid', label: 'userid', source: 'Query', type: 'text', required: true },
        { name: 'oldpassword', label: 'oldpassword', source: 'Query', type: 'password', required: true },
        { name: 'newpassword', label: 'newpassword', source: 'Query', type: 'password', required: true }
      ]
    },
    {
      id: 'sysuser-create',
      title: 'SysUser Create',
      method: 'POST',
      path: '/SysUser/Create',
      authRequired: true,
      fields: [
        {
          name: 'body',
          label: '_requestData (SysUserDTO JSON)',
          source: 'Body',
          type: 'textarea',
          required: true,
          placeholder: JSON.stringify({ userId: 'string', userCode: 'string', userName: 'string', email: 'string', phoneNumber: 'string' }, null, 2)
        }
      ]
    },
    {
      id: 'sysuser-force-logout',
      title: 'SysUser ForceLogout',
      method: 'POST',
      path: '/SysUser/ForceLogout',
      authRequired: true,
      fields: [
        { name: 'userId', label: 'userId', source: 'Query', type: 'text', required: true }
      ]
    },
    {
      id: 'sysuser-forgot-password',
      title: 'SysUser ForgotPassword',
      method: 'GET',
      path: '/SysUser/ForgotPassword',
      authRequired: false,
      rateLimitPolicy: 'auth-password-reset',
      fields: [
        { name: 'email', label: 'email', source: 'Query', type: 'email', required: true }
      ]
    },
    {
      id: 'sysuser-getall',
      title: 'SysUser GetAll',
      method: 'GET',
      path: '/SysUser/GetAll',
      authRequired: true,
      fields: [
        { name: 'fromDate', label: 'fromDate', source: 'Query', type: 'text' },
        { name: 'toDate', label: 'toDate', source: 'Query', type: 'text' },
        { name: 'moduleName', label: 'moduleName', source: 'Query', type: 'text' }
      ]
    },
    {
      id: 'sysuser-getbyid',
      title: 'SysUser GetByID',
      method: 'GET',
      path: '/SysUser/GetByID/{recordid}',
      authRequired: true,
      fields: [
        { name: 'recordid', label: 'recordid', source: 'Route', type: 'text', required: true }
      ]
    },
    {
      id: 'sysuser-getupdateversion',
      title: 'SysUser GetUpdateVersion',
      method: 'GET',
      path: '/SysUser/GetUpdateVersion',
      authRequired: false,
      fields: []
    },
    {
      id: 'sysuser-get-qrcode-limit',
      title: 'SysUser GetUserQRCodeLimit',
      method: 'GET',
      path: '/SysUser/GetUserQRCodeLimit/{userId}',
      authRequired: true,
      fields: [
        { name: 'userId', label: 'userId', source: 'Route', type: 'text', required: true }
      ]
    },
    {
      id: 'sysuser-is-email',
      title: 'SysUser IsAlreadyExistedEmail',
      method: 'GET',
      path: '/SysUser/IsAlreadyExistedEmail',
      authRequired: true,
      fields: [
        { name: 'email', label: 'email', source: 'Query', type: 'email', required: true }
      ]
    },
    {
      id: 'sysuser-is-dup-usercode',
      title: 'SysUser IsDuplicateUserCode',
      method: 'GET',
      path: '/SysUser/IsDuplicateUserCode',
      authRequired: true,
      fields: [
        { name: 'userCode', label: 'userCode', source: 'Query', type: 'text', required: true }
      ]
    },
    {
      id: 'sysuser-remove',
      title: 'SysUser Remove',
      method: 'DELETE',
      path: '/SysUser/Remove/{recordid}',
      authRequired: true,
      fields: [
        { name: 'recordid', label: 'recordid', source: 'Route', type: 'text', required: true }
      ]
    },
    {
      id: 'sysuser-unban',
      title: 'SysUser Unban',
      method: 'POST',
      path: '/SysUser/Unban/{recordid}',
      authRequired: true,
      fields: [
        { name: 'recordid', label: 'recordid', source: 'Route', type: 'text', required: true }
      ]
    },
    {
      id: 'sysuser-update-role',
      title: 'SysUser UpdateRole',
      method: 'POST',
      path: '/SysUser/UpdateRole/{userId}/{roleId}',
      authRequired: true,
      fields: [
        { name: 'userId', label: 'userId', source: 'Route', type: 'text', required: true },
        { name: 'roleId', label: 'roleId', source: 'Route', type: 'text', required: true }
      ]
    },
    {
      id: 'sysuser-update-limit',
      title: 'SysUser UpdateUserQRCodeLimit',
      method: 'POST',
      path: '/SysUser/UpdateUserQRCodeLimit',
      authRequired: true,
      fields: [
        { name: 'userId', label: 'userId', source: 'Body', type: 'text', required: true },
        { name: 'qRCodeLimitPerUser', label: 'qRCodeLimitPerUser', source: 'Body', type: 'number', required: true }
      ]
    }
  ];

  endpointForms: Record<string, any> = {};
  endpointStatus: Record<string, StatusVariant> = {};
  endpointResults: Record<string, { variant: 'success' | 'error' | 'info'; label: string; payload: string } | null> = {};
  openEndpointId: string | null = null;

  otpExpiredMinute = 5;
  otpExpiresAt = 0;
  otpRemainingSeconds = 0;
  otpTimerState: 'idle' | 'running' | 'expired' = 'idle';
  otpTimerId: number | null = null;
  otpDeepLink = '';
  otpQrDataUrl = '';

  get ringCircumference(): number {
    return 2 * Math.PI * 18;
  }

  get otpRingDashOffset(): number {
    const duration = this.otpExpiredMinute * 60;
    const progress = duration <= 0 ? 0 : (this.otpRemainingSeconds / duration);
    return this.ringCircumference * (1 - Math.max(0, Math.min(1, progress)));
  }

  get otpRemainingFormatted(): string {
    const s = Math.max(0, this.otpRemainingSeconds);
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }

  get otpTimerAriaLabel(): string {
    const s = Math.max(0, this.otpRemainingSeconds);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `OTP expires in ${m} minutes ${r} seconds`;
  }

  get otpTimerStateLabel(): string {
    if (this.otpTimerState === 'idle') return 'Ready';
    return this.otpTimerState === 'running' ? 'Running' : 'Expired';
  }

  constructor() {
    for (const ep of this.endpoints) {
      const groupConfig: Record<string, any> = {};
      for (const f of ep.fields) {
        const v = f.required ? [Validators.required] : [];
        if (f.type === 'email') v.push(Validators.email);
        groupConfig[f.name] = ['', v];
      }
      this.endpointForms[ep.id] = this.fb.group(groupConfig);
      this.endpointStatus[ep.id] = 'idle';
      this.endpointResults[ep.id] = null;
    }
  }

  ngOnDestroy() {
    if (this.otpTimerId != null) window.clearInterval(this.otpTimerId);
  }

  setMode(mode: RequestMode) {
    this.mode = mode;
  }

  toggleEndpoint(id: string) {
    this.openEndpointId = this.openEndpointId === id ? null : id;
  }

  inputType(t: FieldType): string {
    if (t === 'email') return 'email';
    if (t === 'password') return 'password';
    if (t === 'number') return 'number';
    return 'text';
  }

  showError(form: any, controlName: string, error: string): boolean {
    const c = form.get(controlName);
    return !!c && c.touched && c.hasError(error);
  }

  resetLogin() {
    this.loginForm.reset({ usercode: '', passcode: '', localTimeZone: 'Asia/Yangon', simulateMfaRequired: false });
    this.results.login = null;
  }

  async submitLogin() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;
    this.status.login = 'loading';
    this.results.login = null;
    await Promise.resolve();

    try {
      const body = {
        usercode: this.loginForm.value.usercode!,
        passcode: this.loginForm.value.passcode!,
        localTimeZone: this.loginForm.value.localTimeZone || ''
      };

      const simulateMfa = !!this.loginForm.value.simulateMfaRequired;
      const res = await this.request('POST', '/AuthenticationApi/login', { body, public: true, simulateMfa });
      this.results.login = this.formatResult('login', res);

      if (res?.status === 4233 && res?.resultObject?.userid) {
        this.otpForm.patchValue({ userId: res.resultObject.userid, otpCode: '123456' });
        await this.generateOtpQr();
        this.restartOtpTimer(res.resultObject.OtpExpiredMinute ?? 5);
      }
    } catch (e) {
      this.results.login = this.formatError(e);
    } finally {
      this.status.login = 'idle';
    }
  }

  async submitValidateOtp() {
    this.otpForm.markAllAsTouched();
    if (this.otpForm.invalid) return;
    this.status.otp = 'loading';
    this.results.otp = null;
    await Promise.resolve();
    try {
      const params = {
        userId: this.otpForm.value.userId!,
        otpCode: this.otpForm.value.otpCode!
      };
      const res = await this.request('GET', '/AuthenticationApi/ValidateLoginOtp', { params, public: true });
      this.results.otp = this.formatResult('otp', res);
    } catch (e) {
      this.results.otp = this.formatError(e);
    } finally {
      this.status.otp = 'idle';
    }
  }

  async submitForgotPassword() {
    this.forgotForm.markAllAsTouched();
    if (this.forgotForm.invalid) return;
    this.status.forgot = 'loading';
    this.results.forgot = null;
    await Promise.resolve();
    try {
      const params = { email: this.forgotForm.value.email! };
      const res = await this.request('GET', '/SysUser/ForgotPassword', { params, public: true });
      this.results.forgot = this.formatResult('forgot', res);
    } catch (e) {
      this.results.forgot = this.formatError(e);
    } finally {
      this.status.forgot = 'idle';
    }
  }

  async submitVerifyForgotOtp() {
    this.verifyForgotForm.markAllAsTouched();
    if (this.verifyForgotForm.invalid) return;
    this.status.verifyForgot = 'loading';
    this.results.verifyForgot = null;
    await Promise.resolve();
    try {
      const params = {
        userId: this.verifyForgotForm.value.userId!,
        otpCode: this.verifyForgotForm.value.otpCode!
      };
      const res = await this.request('GET', '/AuthenticationApi/VerifyForgotPasswordOtp', { params, public: true });
      this.results.verifyForgot = this.formatResult('verifyForgot', res);
    } catch (e) {
      this.results.verifyForgot = this.formatError(e);
    } finally {
      this.status.verifyForgot = 'idle';
    }
  }

  prefillResetFromVerify() {
    const maybe = this.results.verifyForgot?.payload;
    if (!maybe) return;
    try {
      const json = JSON.parse(maybe);
      const userId = json?.resultObject?.userid || this.resetPasswordForm.value.userId;
      const resetToken = json?.resultObject?.resetToken || json?.resultObject?.token || '';
      this.resetPasswordForm.patchValue({ userId, resetToken });
    } catch {}
  }

  async submitResetPassword() {
    this.resetPasswordForm.markAllAsTouched();
    if (this.resetPasswordForm.invalid) return;
    this.status.resetPassword = 'loading';
    this.results.resetPassword = null;
    await Promise.resolve();
    try {
      const body = {
        userId: this.resetPasswordForm.value.userId!,
        resetToken: this.resetPasswordForm.value.resetToken!,
        newPassword: this.resetPasswordForm.value.newPassword!
      };
      const res = await this.request('POST', '/AuthenticationApi/ResetPassword', { body, public: true });
      this.results.resetPassword = this.formatResult('resetPassword', res);
    } catch (e) {
      this.results.resetPassword = this.formatError(e);
    } finally {
      this.status.resetPassword = 'idle';
    }
  }

  async generateOtpQr() {
    this.otpForm.markAllAsTouched();
    if (this.otpForm.invalid) return;
    const userId = this.otpForm.value.userId!;
    const otpCode = this.otpForm.value.otpCode!;
    this.otpDeepLink = `${this.baseUrl}/AuthenticationApi/ValidateLoginOtp?userId=${encodeURIComponent(userId)}&otpCode=${encodeURIComponent(otpCode)}`;
    this.otpQrDataUrl = await QRCode.toDataURL(this.otpDeepLink, { width: 220, margin: 1 });
    if (this.otpTimerState !== 'running') this.restartOtpTimer();
  }

  restartOtpTimer(expiredMinute?: number) {
    if (expiredMinute != null && Number.isFinite(expiredMinute)) {
      this.otpExpiredMinute = Math.max(1, Math.floor(expiredMinute));
    }
    if (this.otpTimerId != null) window.clearInterval(this.otpTimerId);
    this.otpTimerId = null;
    setTimeout(() => {
      this.otpExpiresAt = Date.now() + this.otpExpiredMinute * 60 * 1000;
      this.otpTimerState = 'running';
      this.tickOtpTimer();
      this.otpTimerId = window.setInterval(() => this.tickOtpTimer(), 1000);
    }, 0);
  }

  private tickOtpTimer() {
    const remainingMs = this.otpExpiresAt - Date.now();
    this.otpRemainingSeconds = Math.ceil(Math.max(0, remainingMs) / 1000);
    if (this.otpRemainingSeconds <= 0) this.otpTimerState = 'expired';
  }

  async copyOtpLink() {
    if (!this.otpDeepLink) return;
    await navigator.clipboard.writeText(this.otpDeepLink);
  }

  async sendEndpoint(ep: EndpointSpec) {
    const form = this.endpointForms[ep.id];
    form.markAllAsTouched();
    if (form.invalid) return;

    this.endpointStatus[ep.id] = 'loading';
    this.endpointResults[ep.id] = null;
    await Promise.resolve();
    try {
      const value = form.value as Record<string, any>;
      const headers: Record<string, string> = {};
      const params: Record<string, string> = {};
      let body: any = null;
      let path = ep.path;

      for (const f of ep.fields) {
        const v = value[f.name];
        if (v == null || v === '') continue;
        if (f.source === 'Header') headers['Authorization'] = String(v);
        if (f.source === 'Query') params[f.name] = String(v);
        if (f.source === 'Route') path = path.replace(`{${f.name}}`, encodeURIComponent(String(v)));
        if (f.source === 'Body') {
          if (f.name === 'body' && f.type === 'textarea') {
            body = JSON.parse(String(v));
          } else {
            body ??= {};
            body[f.name] = f.type === 'number' ? Number(v) : v;
          }
        }
      }

      const res = await this.request(ep.method, path.replace('{recordid}', ''), { body, params, headers, public: !ep.authRequired });
      this.endpointResults[ep.id] = this.formatResult(ep.id, res);
    } catch (e) {
      this.endpointResults[ep.id] = this.formatError(e);
    } finally {
      this.endpointStatus[ep.id] = 'idle';
    }
  }

  async copyCurl(ep: EndpointSpec) {
    const form = this.endpointForms[ep.id];
    const value = form.value as Record<string, any>;
    let path = ep.path;
    const queryPairs: string[] = [];
    let body: any = null;
    let authHeader = '';

    for (const f of ep.fields) {
      const v = value[f.name];
      if (v == null || v === '') continue;
      if (f.source === 'Header') authHeader = String(v);
      if (f.source === 'Query') queryPairs.push(`${encodeURIComponent(f.name)}=${encodeURIComponent(String(v))}`);
      if (f.source === 'Route') path = path.replace(`{${f.name}}`, encodeURIComponent(String(v)));
      if (f.source === 'Body') {
        if (f.name === 'body' && f.type === 'textarea') {
          try { body = JSON.parse(String(v)); } catch { body = String(v); }
        } else {
          body ??= {};
          body[f.name] = v;
        }
      }
    }

    const url = `${this.baseUrl}${path}${queryPairs.length ? `?${queryPairs.join('&')}` : ''}`;
    const parts = [`curl -X ${ep.method} "${url}"`];
    if (authHeader) parts.push(`-H "Authorization: ${authHeader.replace(/"/g, '\\"')}"`);
    if (body != null) parts.push(`-H "Content-Type: application/json" -d "${JSON.stringify(body).replace(/"/g, '\\"')}"`);
    await navigator.clipboard.writeText(parts.join(' '));
  }

  private async request(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    opts: { body?: any; params?: Record<string, string>; headers?: Record<string, string>; public?: boolean; simulateMfa?: boolean }
  ): Promise<any> {
    if (this.mode === 'simulated') return this.simulate(method, path, opts);
    return this.live(method, path, opts);
  }

  private async live(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    opts: { body?: any; params?: Record<string, string>; headers?: Record<string, string> }
  ): Promise<any> {
    const url = new URL(`${this.baseUrl}${path}`);
    for (const [k, v] of Object.entries(opts.params || {})) url.searchParams.set(k, v);
    const headers = new HttpHeaders({ ...(opts.headers || {}) });
    const request$ =
      method === 'GET' ? this.http.get(url.toString(), { headers }) :
      method === 'DELETE' ? this.http.delete(url.toString(), { headers }) :
      this.http.post(url.toString(), opts.body ?? {}, { headers });

    try {
      return await firstValueFrom(request$);
    } catch (e) {
      throw e;
    }
  }

  private async simulate(
    method: string,
    path: string,
    opts: { body?: any; params?: Record<string, string>; headers?: Record<string, string>; simulateMfa?: boolean }
  ): Promise<any> {
    if (this.simulatedError === 'network') throw new Error('NetworkError');
    if (this.simulatedError === '429') return { status: 429, message: 'Too Many Requests', resultObject: null };
    if (this.simulatedError === '401-unauthorized') return { status: 401, message: 'Unauthorized', resultObject: null };
    if (this.simulatedError === '401-session-expired') return { status: 401, message: 'SessionExpired', resultObject: null };

    if (method === 'POST' && path === '/AuthenticationApi/login') {
      if (opts.simulateMfa) {
        return {
          status: 4233,
          message: 'MfaRequired',
          resultObject: { userid: this.createId(), mfaContactInfo: '***@***', OtpExpiredMinute: this.otpExpiredMinute }
        };
      }
      return { status: 200, message: 'OK', resultObject: { token: 'jwt.mock.token', userid: this.createId() } };
    }

    if (method === 'GET' && path.startsWith('/AuthenticationApi/ValidateLoginOtp')) {
      const otp = opts.params?.['otpCode'] || '0';
      if (otp !== '123456') return { status: 401, message: 'Unauthorized', resultObject: null };
      return { status: 200, message: 'OK', resultObject: { token: 'jwt.mock.token', userid: opts.params?.['userId'] || this.createId() } };
    }

    if (method === 'GET' && path.startsWith('/AuthenticationApi/VerifyForgotPasswordOtp')) {
      return { status: 200, message: 'OK', resultObject: { userid: opts.params?.['userId'] || this.createId(), resetToken: 'reset.mock.token' } };
    }

    if (method === 'GET' && path.startsWith('/SysUser/ForgotPassword')) {
      return { status: 200, message: 'OK', resultObject: { sent: true } };
    }

    if (method === 'POST' && path.startsWith('/AuthenticationApi/ResetPassword')) {
      return { status: 200, message: 'OK', resultObject: { changed: true } };
    }

    return { status: 200, message: 'OK', resultObject: { method, path, body: opts.body ?? null, params: opts.params ?? null } };
  }

  private formatResult(key: string, res: any) {
    if (res?.status === 4233) {
      return { variant: 'info' as const, label: 'MfaRequired', payload: JSON.stringify(res, null, 2) };
    }
    if (res?.status && res.status >= 400) {
      return { variant: 'error' as const, label: String(res.message || res.status), payload: JSON.stringify(res, null, 2) };
    }
    return { variant: 'success' as const, label: 'Success', payload: JSON.stringify(res, null, 2) };
  }

  private formatError(e: unknown) {
    const label = e instanceof HttpErrorResponse ? `${e.status} ${e.statusText}` : 'Error';
    const payload = e instanceof HttpErrorResponse ? JSON.stringify(e.error ?? { message: e.message }, null, 2) : JSON.stringify({ message: String((e as any)?.message || e) }, null, 2);
    return { variant: 'error' as const, label, payload };
  }

  private createId(): string {
    const anyCrypto = (globalThis as any).crypto as Crypto | undefined;
    if (anyCrypto?.randomUUID) return anyCrypto.randomUUID();
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  }
}
