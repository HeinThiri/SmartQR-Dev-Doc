import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-totp-mfa',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/common-features" class="back-link">
        <i class="bi bi-arrow-left"></i> Common Features
      </a>
      <h1>TOTP MFA &amp; Okta MFA</h1>
      <p class="subtitle">MFA Type 3 (Local TOTP via Otp.NET) and Type 4 (Okta Authenticator). Both use time-based one-time passwords but differ in secret management and provider.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- DB Diagram -->
      <section class="card">
        <h2>Database Diagram</h2>
        <div class="er-diagram">
          <div class="er-layer">
            <div class="er-label">MFA Security Table</div>
            <div class="er-row">
              <div class="er-table er-primary">
                <div class="er-title"><i class="bi bi-table"></i> AutUserLoginSecurity</div>
                <div class="er-field"><span class="er-key">PK</span> UserId</div>
                <div class="er-field">SecretCode</div>
                <div class="er-field">IsMfaEnabled</div>
                <div class="er-field">IsMfaEnabledPortal</div>
                <div class="er-field">PreferredMfaType</div>
              </div>
            </div>
            <p style="font-size:12px; color:#888; margin:10px 0 0 0;"><strong>Note:</strong> SecretCode = Base32 secret (type 3) OR Okta User ID (type 4)</p>
          </div>
        </div>
      </section>

      <!-- Flow Diagram: Setup -->
      <section class="card">
        <h2>Flow Diagram &mdash; Setup</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-person-gear"></i> Admin Opens User</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-shield-lock"></i> Select Google Auth</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-save"></i> Save</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-gear"></i> Setup TOTP</div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-key"></i> Generate Secret<small>+ QR</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-qr-code"></i> Scan QR</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-input-cursor-text"></i> Enter Code</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-check2-circle"></i> Verify</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check-lg"></i> Active</div>
          </div>
        </div>
      </section>

      <!-- Flow Diagram: Login -->
      <section class="card">
        <h2>Flow Diagram &mdash; Login</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-person"></i> User Login</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-shield-check"></i> MFA Required<small>type 3/4</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-phone"></i> Enter Auth Code</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-check2-circle"></i> Verify<small>local or Okta API</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-ticket-detailed"></i> JWT Issued</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check-lg"></i> Login Complete</div>
          </div>
        </div>
      </section>

      <!-- Comparison -->
      <section class="card">
        <h2>Local TOTP vs Okta MFA</h2>
        <table>
          <thead><tr><th>Aspect</th><th>Type 3 &mdash; Local TOTP</th><th>Type 4 &mdash; Okta</th></tr></thead>
          <tbody>
            <tr><td>Library</td><td><code>Otp.NET</code> (server-side)</td><td>Okta Management SDK</td></tr>
            <tr><td>Authenticator</td><td>Any TOTP app (Google, Microsoft, etc.)</td><td>Okta Verify</td></tr>
            <tr><td>Secret storage</td><td><code>AutUserLoginSecurity.SecretCode</code> = Base32 key</td><td><code>AutUserLoginSecurity.SecretCode</code> = Okta User ID</td></tr>
            <tr><td>QR code</td><td>Generated in-app via <code>otpauth://</code> URI</td><td>Generated by Okta enrollment API</td></tr>
            <tr><td>Backend service</td><td><code>TotpService.cs</code></td><td><code>OktaMfaService.cs</code></td></tr>
            <tr><td>External dependency</td><td>None</td><td>Okta tenant + API token</td></tr>
          </tbody>
        </table>
      </section>

      <!-- User Flows -->
      <section class="card">
        <h2>User Flows</h2>

        <h3>Setup (First Time)</h3>
        <ol>
          <li>Admin enables MFA Type 3 or 4 on the organization license</li>
          <li>User logs in and is redirected to the TOTP setup page</li>
          <li>Backend generates a secret (or enrolls in Okta) and returns a QR code</li>
          <li>User scans QR code with their authenticator app</li>
          <li>User enters a verification code to confirm setup</li>
          <li>Backend saves the secret/Okta ID to <code>AutUserLoginSecurity</code></li>
        </ol>

        <h3>Login (After Setup)</h3>
        <ol>
          <li>User enters credentials on login page</li>
          <li>Backend returns <code>requireMfa: true</code> with MFA type</li>
          <li>Frontend navigates to the get-code page</li>
          <li>User enters the 6-digit code from their authenticator</li>
          <li>Backend validates the code and issues JWT on success</li>
        </ol>

        <h3>Disable / Re-enable</h3>
        <ol>
          <li>Admin calls the disable endpoint to clear the user's MFA enrollment</li>
          <li>On next login, the user is prompted to set up MFA again</li>
          <li>Re-enable generates a new secret &mdash; the old one is permanently invalidated</li>
        </ol>
      </section>

      <!-- Backend Files -->
      <section class="card">
        <h2>Backend Files</h2>
        <table>
          <thead><tr><th>File</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>TotpService.cs</code></td><td>Generates TOTP secrets, creates QR URI, validates codes using Otp.NET</td></tr>
            <tr><td><code>OktaMfaService.cs</code></td><td>Enrolls users in Okta, verifies Okta TOTP codes, manages Okta factors</td></tr>
            <tr><td><code>TotpDTO.cs</code></td><td>Data transfer objects for setup/verify requests and responses</td></tr>
            <tr><td><code>AuthenticationApi.cs</code></td><td>API endpoints for TOTP and Okta MFA operations</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Database -->
      <section class="card">
        <h2>Database</h2>
        <h3>AutUserLoginSecurity Table</h3>
        <table>
          <thead><tr><th>Column</th><th>Type 3 (Local TOTP)</th><th>Type 4 (Okta)</th></tr></thead>
          <tbody>
            <tr><td><code>UserId</code></td><td colspan="2">Foreign key to SysUser</td></tr>
            <tr><td><code>MfaType</code></td><td><code>3</code></td><td><code>4</code></td></tr>
            <tr><td><code>SecretCode</code></td><td>Base32-encoded TOTP secret</td><td>Okta User ID (e.g. <code>00u...</code>)</td></tr>
            <tr><td><code>IsVerified</code></td><td colspan="2">True after user confirms setup with a valid code</td></tr>
            <tr><td><code>CreatedDate</code></td><td colspan="2">Timestamp of enrollment</td></tr>
          </tbody>
        </table>
        <div class="warning">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <span><code>SecretCode</code> is sensitive. For Type 3 it is the actual TOTP secret &mdash; if leaked, anyone can generate valid codes. Ensure database encryption at rest.</span>
        </div>
      </section>

      <!-- API Endpoints -->
      <section class="card">
        <h2>API Endpoints</h2>

        <h3>Local TOTP (Type 3)</h3>
        <table>
          <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>POST</td><td><code>/Authentication/SetupTotp</code></td><td>Generates secret + QR code URI for the user</td></tr>
            <tr><td>POST</td><td><code>/Authentication/VerifyTotpSetup</code></td><td>Confirms setup by validating a code from the authenticator</td></tr>
            <tr><td>POST</td><td><code>/Authentication/DisableTotp</code></td><td>Clears the user's TOTP enrollment (admin action)</td></tr>
          </tbody>
        </table>

        <h3>Example: SetupTotp Response</h3>
        <pre><code>&#123;
  "qrCodeUri": "otpauth://totp/SmartHR:user&#64;example.com?secret=JBSWY3DPEHPK3PXP&amp;issuer=SmartHR",
  "manualEntryKey": "JBSWY3DPEHPK3PXP"
&#125;</code></pre>

        <h3>Okta MFA (Type 4)</h3>
        <table>
          <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>POST</td><td><code>/Authentication/SetupOktaMfa</code></td><td>Enrolls user in Okta Verify factor, returns QR code</td></tr>
            <tr><td>POST</td><td><code>/Authentication/VerifyOktaMfaSetup</code></td><td>Confirms Okta factor enrollment with a verification code</td></tr>
            <tr><td>POST</td><td><code>/Authentication/DisableOktaMfa</code></td><td>Removes Okta factor from the user (admin action)</td></tr>
            <tr><td>POST</td><td><code>/Authentication/SyncOktaGroup</code></td><td>Syncs organization users with Okta group membership</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Frontend Files -->
      <section class="card">
        <h2>Frontend Files</h2>
        <table>
          <thead><tr><th>File / Component</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>auth/totp-setup/</code></td><td>QR code display, manual key fallback, verification code input</td></tr>
            <tr><td><code>auth/get-code/</code></td><td>TOTP code entry during login (shared with SMS OTP flow)</td></tr>
            <tr><td><code>modules/.../sys-user-detail/</code></td><td>Admin controls to view MFA status, disable/re-enable TOTP or Okta</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Security Notes -->
      <section class="card">
        <h2>Security Notes</h2>
        <ul>
          <li><strong>Time window</strong>: TOTP codes are valid for a 30-second window. The server accepts +/- 1 step to account for clock drift.</li>
          <li><strong>Single verification</strong>: Each code can only be used once. Replay attempts are rejected.</li>
          <li><strong>Secret rotation</strong>: Disabling and re-enabling MFA generates a completely new secret. The old QR code becomes permanently invalid.</li>
          <li><strong>Okta token security</strong>: The Okta API token is stored in server configuration, never exposed to the frontend.</li>
          <li><strong>No SMS dependency</strong>: Unlike Type 2 (SMS), TOTP-based MFA does not depend on external SMS delivery, making it more reliable.</li>
        </ul>
      </section>

      <!-- Enable/Disable Summary -->
      <section class="card">
        <h2>Enable / Disable / Re-enable Summary</h2>
        <table>
          <thead><tr><th>Action</th><th>Who</th><th>What Happens</th></tr></thead>
          <tbody>
            <tr><td><strong>Enable MFA</strong></td><td>Admin</td><td>Sets <code>SysLicense.MFAType</code> to 3 or 4 for the organization</td></tr>
            <tr><td><strong>User setup</strong></td><td>User</td><td>Scans QR, verifies code, <code>IsVerified = true</code> in DB</td></tr>
            <tr><td><strong>Login with MFA</strong></td><td>User</td><td>Enters TOTP code after credentials, backend validates</td></tr>
            <tr><td><strong>Disable (user)</strong></td><td>Admin</td><td>Calls disable endpoint, clears <code>SecretCode</code> and <code>IsVerified</code></td></tr>
            <tr><td><strong>Re-enable</strong></td><td>User</td><td>Next login triggers new setup flow with fresh secret</td></tr>
            <tr><td><strong>Disable (org)</strong></td><td>Admin</td><td>Sets <code>SysLicense.MFAType = 0</code>, MFA skipped for all users</td></tr>
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
export class TotpMfaComponent {}
