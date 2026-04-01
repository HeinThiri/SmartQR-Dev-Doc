import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sms-poh-integration',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/common-features" class="back-link">
        <i class="bi bi-arrow-left"></i> Common Features
      </a>
      <h1>SmsPoh SMS Integration</h1>
      <p class="subtitle">SmsPoh Myanmar SMS gateway for OTP delivery during MFA login. Implements MFA Type 2 (SMS-based one-time password).</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- DB Diagram -->
      <section class="card">
        <h2>Database Diagram</h2>
        <div class="er-diagram">
          <div class="er-layer">
            <div class="er-label">SMS Configuration Tables</div>
            <div class="er-row">
              <div class="er-table er-primary">
                <div class="er-title"><i class="bi bi-table"></i> SysLicense</div>
                <div class="er-field">SmsPohApikey</div>
                <div class="er-field">SmsPohApisecret</div>
                <div class="er-field">SmsPohSenderId</div>
                <div class="er-field">Smslimit</div>
                <div class="er-field">IsMfaenabled</div>
              </div>
              <div class="er-table er-primary">
                <div class="er-title"><i class="bi bi-table"></i> SysUser</div>
                <div class="er-field">PhoneNumber</div>
                <div class="er-field">SmsusageLastTime</div>
                <div class="er-field">SmsreachLimit</div>
              </div>
              <div class="er-table er-small">
                <div class="er-title"><i class="bi bi-table"></i> SysConfig</div>
                <div class="er-field">OtpExpiredMinute</div>
              </div>
              <div class="er-table er-runtime">
                <div class="er-title"><i class="bi bi-table"></i> HrSmsException</div>
                <div class="er-field"><span class="er-key">PK</span> ExceptionId</div>
                <div class="er-field">UserId</div>
                <div class="er-field">Otpcode</div>
                <div class="er-field">LicenseId</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Flow Diagram -->
      <section class="card">
        <h2>Flow Diagram</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-person"></i> User Login</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-shield-check"></i> MFA Required?<small>SMS Type</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-speedometer2"></i> Check Daily<small>Limit</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-key"></i> Generate OTP</div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-send"></i> SmsPoh API<small>POST</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-phone"></i> SMS Delivered</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-input-cursor-text"></i> User Enters OTP</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-check2-circle"></i> Validate</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check-lg"></i> Login Complete</div>
          </div>
        </div>
      </section>

      <!-- Architecture Flow -->
      <section class="card">
        <h2>Architecture Flow</h2>
        <div class="flow">
          <div class="flow-step">
            <div class="flow-num">1</div>
            <div>
              <strong>User logs in</strong>
              <p>POST /Authentication/login with credentials</p>
            </div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">2</div>
            <div>
              <strong>MFA check</strong>
              <p>Backend checks <code>SysLicense.MFAType == 2</code> (SMS)</p>
            </div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">3</div>
            <div>
              <strong>SmsPoh API v3</strong>
              <p>POST <code>https://v3.smspoh.com/api/rest/send</code> with Basic Auth (Base64 token)</p>
            </div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">4</div>
            <div>
              <strong>OTP entry</strong>
              <p>User enters the 6-digit code on the get-code page</p>
            </div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">5</div>
            <div>
              <strong>Validate &amp; complete</strong>
              <p>GET /ValidateLoginOtp verifies code, issues JWT on success</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SmsPoh API -->
      <section class="card">
        <h2>SmsPoh API</h2>
        <p>The gateway uses the SmsPoh v3 REST API with Basic Authentication.</p>
        <pre><code>POST https://v3.smspoh.com/api/rest/send
Authorization: Basic &#123;Base64-encoded-token&#125;
Content-Type: application/json

&#123;
  "to": "959xxxxxxxxx",
  "message": "Your OTP code is 123456",
  "sender": "SmartHR"
&#125;</code></pre>
        <p>The API token is stored in <code>SysLicense.SmsToken</code> per organization. The token is Base64-encoded before being sent in the Authorization header.</p>
      </section>

      <!-- Backend Files -->
      <section class="card">
        <h2>Backend Files</h2>
        <table>
          <thead><tr><th>File</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>SysSMSGatewayController.cs</code></td><td>Sends SMS via SmsPoh API, handles API response and error logging</td></tr>
            <tr><td><code>AuthenticationController.cs</code></td><td>Login flow, OTP generation, validation, and resend logic</td></tr>
            <tr><td><code>OtpRequestRateLimiter.cs</code></td><td>Limits OTP request frequency (3 requests/hour per user)</td></tr>
            <tr><td><code>OtpRateLimiter.cs</code></td><td>Limits failed OTP attempts (5 failures = 15-min lockout)</td></tr>
            <tr><td><code>SmsPohBalanceAlertService.cs</code></td><td>Hangfire background job to monitor SMS credit balance</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Rate Limiting -->
      <section class="card">
        <h2>Rate Limiting</h2>
        <table>
          <thead><tr><th>Rule</th><th>Limit</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td>OTP request frequency</td><td>3 requests per hour</td><td>Returns error, no SMS sent</td></tr>
            <tr><td>Failed OTP attempts</td><td>5 consecutive failures</td><td>15-minute lockout</td></tr>
            <tr><td>Daily SMS per user</td><td>Configured via <code>SysLicense.Smslimit</code></td><td>Blocks further SMS for the day</td></tr>
          </tbody>
        </table>
        <div class="warning">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <span>Rate limiters use in-memory tracking. Restarting the API server resets all counters.</span>
        </div>
      </section>

      <!-- Database Tables -->
      <section class="card">
        <h2>Database Tables</h2>
        <table>
          <thead><tr><th>Table</th><th>Key Columns</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>SysLicense</code></td><td><code>MFAType</code>, <code>SmsToken</code>, <code>Smslimit</code></td><td>Per-organization MFA and SMS configuration</td></tr>
            <tr><td><code>SysUser</code></td><td><code>OtpCode</code>, <code>OtpExpiry</code>, <code>DailySmsCount</code></td><td>Per-user OTP tracking and daily SMS usage</td></tr>
            <tr><td><code>SysConfig</code></td><td><code>OtpLength</code>, <code>OtpExpiryMinutes</code></td><td>Global OTP settings (code length, expiry duration)</td></tr>
          </tbody>
        </table>
      </section>

      <!-- API Endpoints -->
      <section class="card">
        <h2>API Endpoints</h2>

        <h3>POST /Authentication/login</h3>
        <p>Standard login. If MFA Type 2 is enabled, returns a partial response with <code>requireMfa: true</code> and sends an OTP via SMS.</p>

        <h3>GET /Authentication/ValidateLoginOtp</h3>
        <p>Validates the OTP code entered by the user. On success, returns the full JWT token. On failure, increments the failed attempt counter.</p>
        <pre><code>GET /Authentication/ValidateLoginOtp?userId=&#123;id&#125;&amp;otpCode=&#123;code&#125;</code></pre>

        <h3>GET /Authentication/ResendLoginOtp</h3>
        <p>Generates a new OTP and sends it via SMS. Subject to rate limiting (3 requests/hour).</p>
        <pre><code>GET /Authentication/ResendLoginOtp?userId=&#123;id&#125;</code></pre>
      </section>

      <!-- Balance Alert -->
      <section class="card">
        <h2>Balance Alert Service</h2>
        <p><code>SmsPohBalanceAlertService</code> runs as a Hangfire recurring job.</p>
        <ul>
          <li><strong>Frequency</strong>: Every 30 minutes</li>
          <li><strong>Action</strong>: Queries SmsPoh API for remaining credit balance</li>
          <li><strong>Alert</strong>: Sends email via AWS SES when balance drops below threshold</li>
          <li><strong>Cooldown</strong>: 7-day cooldown between alert emails to avoid spam</li>
        </ul>
      </section>

      <!-- Security Features -->
      <section class="card">
        <h2>Security Features</h2>
        <table>
          <thead><tr><th>Feature</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>OTP expiry</td><td>Codes expire after configured minutes (default 5 min)</td></tr>
            <tr><td>Single-use codes</td><td>OTP is cleared from DB after successful validation</td></tr>
            <tr><td>Brute-force protection</td><td>5 failed attempts triggers 15-minute lockout</td></tr>
            <tr><td>Request throttling</td><td>Max 3 OTP requests per hour per user</td></tr>
            <tr><td>Daily cap</td><td>Per-user daily SMS limit prevents abuse</td></tr>
            <tr><td>Secure transport</td><td>SmsPoh API called over HTTPS with Basic Auth</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Configuration Guide -->
      <section class="card">
        <h2>Configuration Guide (New License)</h2>
        <ol>
          <li>Set <code>SysLicense.MFAType = 2</code> for the target organization</li>
          <li>Add the SmsPoh API token to <code>SysLicense.SmsToken</code></li>
          <li>Set <code>SysLicense.Smslimit</code> for daily SMS cap per user</li>
          <li>Configure <code>SysConfig.OtpLength</code> and <code>SysConfig.OtpExpiryMinutes</code> if defaults are not suitable</li>
          <li>Ensure Hangfire is running for the balance alert job</li>
        </ol>
      </section>

      <!-- Troubleshooting -->
      <section class="card">
        <h2>Troubleshooting</h2>
        <table>
          <thead><tr><th>Problem</th><th>Cause</th><th>Solution</th></tr></thead>
          <tbody>
            <tr><td>SMS not received</td><td>Invalid or expired SmsPoh token</td><td>Verify <code>SysLicense.SmsToken</code> and test via SmsPoh dashboard</td></tr>
            <tr><td>"Too many requests" error</td><td>Rate limiter triggered</td><td>Wait for cooldown or restart API to reset in-memory counters</td></tr>
            <tr><td>OTP always invalid</td><td>Clock skew or OTP expired</td><td>Check server time sync; increase <code>OtpExpiryMinutes</code> if needed</td></tr>
            <tr><td>Daily limit reached</td><td><code>Smslimit</code> exceeded</td><td>Increase <code>SysLicense.Smslimit</code> or wait until next day</td></tr>
            <tr><td>Balance alert emails not sent</td><td>AWS SES config or cooldown active</td><td>Check SES credentials and verify 7-day cooldown has elapsed</td></tr>
            <tr><td>User locked out</td><td>5 failed OTP attempts</td><td>Wait 15 minutes or restart API to clear lockout</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Frontend Files -->
      <section class="card">
        <h2>Frontend Files</h2>
        <table>
          <thead><tr><th>File / Component</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>auth/login-v2/</code></td><td>Login page, initiates MFA flow when <code>requireMfa</code> is returned</td></tr>
            <tr><td><code>auth/get-code/</code></td><td>OTP entry page, handles validate and resend actions</td></tr>
            <tr><td><code>modules/.../sys-user-detail/</code></td><td>Admin view of user MFA status and SMS usage</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Doc Log -->
      <section class="card">
        <h2>Doc Log</h2>
        <table>
          <thead><tr><th>Date</th><th>Author</th><th>Change</th></tr></thead>
          <tbody>
            <tr><td>2026-03-27</td><td>Hein Htet Zaw</td><td>Initial documentation</td></tr>
          </tbody>
        </table>
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
    .subtitle { font-size: 15px; color: #666; margin: 0 0 28px; line-height: 1.5; }
    .doc-status {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 600; padding: 4px 14px;
      border-radius: 20px; margin-bottom: 24px;
      background: #e8f5e9; color: #43a047;
    }

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
    .card li { margin-bottom: 6px; line-height: 1.6; }

    code {
      background: #f0f3ff; color: #4a6cf7; padding: 2px 7px;
      border-radius: 4px; font-size: 13px;
    }
    pre {
      background: #1a1f36; border-radius: 10px; padding: 18px 22px;
      overflow-x: auto; margin: 0 0 14px;
    }
    pre code {
      background: none; color: #e0e6ff; padding: 0;
      font-size: 13px; line-height: 1.6; white-space: pre;
    }

    table {
      width: 100%; border-collapse: collapse; margin: 0 0 14px; font-size: 13px;
    }
    th {
      text-align: left; padding: 10px 12px; background: #f5f7fa;
      border-bottom: 2px solid #e0e4ec; font-weight: 600; color: #444;
    }
    td { padding: 9px 12px; border-bottom: 1px solid #f0f0f0; color: #444; }
    tr:hover td { background: #fafbfd; }

    strong { color: #1a1f36; }

    .warning {
      background: #fff8e1; border: 1px solid #ffe082; border-radius: 8px;
      padding: 12px 16px; margin: 0 0 14px; display: flex;
      align-items: flex-start; gap: 10px; font-size: 14px; color: #7a6100;
    }
    .warning i { font-size: 18px; color: #f9a825; }

    /* Flow diagram */
    .flow { display: flex; flex-direction: column; align-items: flex-start; gap: 0; }
    .flow-step {
      display: flex; align-items: flex-start; gap: 14px;
      background: #f8f9ff; border-radius: 10px; padding: 14px 18px; width: 100%;
    }
    .flow-num {
      width: 28px; height: 28px; flex-shrink: 0;
      background: #6c8cff; color: #fff; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px;
    }
    .flow-step strong { font-size: 14px; display: block; margin-bottom: 2px; }
    .flow-step p { margin: 0; font-size: 13px; color: #666; }
    .flow-arrow { padding: 4px 0 4px 12px; color: #6c8cff; font-size: 16px; }

    /* ER Diagram */
    .er-diagram { padding: 8px 0; }
    .er-layer {
      margin-bottom: 20px; padding: 18px; border-radius: 12px;
      background: #f8f9ff; border: 1px solid #e8ecf4;
    }
    .er-label {
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 1px; color: #6c8cff; margin-bottom: 14px;
    }
    .er-row { display: flex; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
    .er-table {
      background: #fff; border-radius: 10px; border: 2px solid #e0e4ec;
      overflow: hidden; min-width: 180px; flex-shrink: 0;
    }
    .er-table.er-primary { border-color: #6c8cff; }
    .er-table.er-runtime { border-color: #43a047; }
    .er-table.er-small { min-width: 160px; }
    .er-title {
      padding: 10px 14px; font-size: 13px; font-weight: 700; color: #1a1f36;
      background: #f5f7fa; border-bottom: 1px solid #e8ecf1;
      display: flex; align-items: center; gap: 8px;
    }
    .er-primary .er-title { background: #f0f3ff; color: #4a6cf7; }
    .er-runtime .er-title { background: #e8f5e9; color: #2e7d32; }
    .er-field {
      padding: 6px 14px; font-size: 12px; color: #555;
      border-bottom: 1px solid #f5f5f5;
    }
    .er-field:last-child { border-bottom: none; }
    .er-key {
      background: #6c8cff; color: #fff; padding: 1px 5px; border-radius: 3px;
      font-size: 10px; font-weight: 700; margin-right: 4px;
    }
    .er-fk {
      background: #e8ecf1; color: #666; padding: 1px 5px; border-radius: 3px;
      font-size: 10px; font-weight: 700; margin-right: 4px;
    }
    .er-connector {
      display: flex; align-items: center; gap: 6px;
      font-size: 11px; color: #999; font-weight: 600;
    }
    .er-line { width: 20px; height: 2px; background: #ccc; }

    /* Flow Diagram */
    .diagram { padding: 8px 0; }
    .diagram-row {
      display: flex; align-items: center; gap: 10px;
      flex-wrap: wrap; justify-content: center;
    }
    .diagram-node {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 14px 18px; border-radius: 12px; min-width: 110px;
      text-align: center; font-size: 13px; font-weight: 500;
    }
    .diagram-node i { font-size: 22px; }
    .diagram-node small { font-weight: 400; color: rgba(255,255,255,0.7); font-size: 11px; }
    .node-start { background: #e8ecf1; color: #555; }
    .node-action { background: #6c8cff; color: #fff; }
    .node-pending { background: #f9a825; color: #fff; }
    .node-step { background: #f0f3ff; color: #1a1f36; border: 2px solid #d0d8ff; }
    .node-step small { color: #888; }
    .node-success { background: #43a047; color: #fff; }
    .node-danger { background: #e53935; color: #fff; }
    .diagram-arrow { color: #bbb; font-size: 18px; }
    .diagram-down { text-align: center; color: #bbb; font-size: 20px; padding: 6px 0; }
    @media (max-width: 768px) {
      .er-row { flex-direction: column; }
      .diagram-row { flex-direction: column; gap: 0; }
      .diagram-arrow { transform: rotate(90deg); }
    }
  `]
})
export class SmsPohIntegrationComponent {}
