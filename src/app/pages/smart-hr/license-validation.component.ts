import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-license-validation',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-hr" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart HR
      </a>
      <h1>License Validation Feature</h1>
      <p class="subtitle">License activation validation system &mdash; backend API, frontend integration, localStorage caching, navigation guards, and credit balance modal.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>This feature implements a license activation validation system that checks if the current user's license is activated before allowing navigation to module pages. The validation is performed once during login and stored in localStorage for efficient access throughout the application session.</p>
        <h3>Implementation Date</h3>
        <p>January 2025</p>
        <h3>Business Logic</h3>
        <p>The system validates license activation based on the following criteria:</p>
        <ul>
          <li>License must exist in the database</li>
          <li>License must be active (<code>Active == true</code>)</li>
          <li>License must have a ReviewStatus value (not null or empty)</li>
        </ul>
      </section>

      <!-- Technical Architecture -->
      <section class="card">
        <h2>Technical Architecture</h2>

        <h3>1. Backend API</h3>
        <h4>API Endpoint</h4>
        <pre><code>GET /SysLicenseApi/ValidateLicenseActivation</code></pre>
        <p><strong>Location:</strong> <code>SmartHR_API/APIs/System_Module/SysLicenseApi.cs</code> (Lines 363-373)</p>

        <h4>Response Format</h4>
        <pre><code>&#123;
  "status": "success",
  "statusTerm": "success",
  "message": "License is activated",
  "resultObject": &#123;
    "isActivated": true
  &#125;
&#125;</code></pre>

        <h4>Controller Logic</h4>
        <p><strong>Location:</strong> <code>SmartHR_API/Infrastructure/Repository/System_Module/SysLicenseController.cs</code> (Lines 1645-1667)</p>
        <pre><code>public ServiceActionResult ValidateLicenseActivation()
&#123;
    AuthorizedUser user = _tokenManager.GetAuthorizedUser();
    string requestid = user.userID;
    string licenseid = user.license;

    try
    &#123;
        // Check if license exists, is active, and has ReviewStatus
        var license = _DBContext.SysLicense
            .FirstOrDefault(c =&gt; c.LicenseId == licenseid &amp;&amp; c.Active == true);

        if (license == null || string.IsNullOrEmpty(license.ReviewStatus))
        &#123;
            return new ServiceActionResult(
                ReturnStatus.success,
                "License not activated",
                new &#123; isActivated = false &#125;);
        &#125;

        return new ServiceActionResult(
            ReturnStatus.success,
            "License is activated",
            new &#123; isActivated = true &#125;);
    &#125;
    catch (Exception ex)
    &#123;
        return Common_Methods.doErrorLog(ControllerLogLabel, ex.Message, ex, requestid);
    &#125;
&#125;</code></pre>

        <h3>2. Frontend Implementation</h3>
        <h4>Angular Service</h4>
        <p><strong>Location:</strong> <code>SmartHR_UI/src/app/services/sys-license.service.ts</code> (Lines 107-110)</p>
        <pre><code>validateLicenseActivation(): Observable&lt;ActionResult&gt; &#123;
  return this.http.get&lt;ActionResult&gt;(
    this.baseAPIUrl + '/' + this.controllerName + '/ValidateLicenseActivation',
    &#123; 'headers': this.myCommon.createTokenHeader() &#125;);
&#125;</code></pre>

        <h4>Login Integration</h4>
        <p><strong>Location:</strong> <code>SmartHR_UI/src/app/pages/systematic/modules/auth/login-v2/login-v2.component.ts</code> (Lines 413-453)</p>
        <p><strong>Process:</strong></p>
        <ol>
          <li>User successfully logs in</li>
          <li>System calls <code>validateLicenseActivation()</code> API</li>
          <li>Result is stored in localStorage with key <code>'LRK'</code></li>
          <li>User is redirected to the appropriate landing page</li>
        </ol>
        <pre><code>// Validate license activation and store result in localStorage
this.sysLicenseService.validateLicenseActivation().subscribe(&#123;
  next: (result) =&gt; &#123;
    const validationResult = result.resultObject as &#123; isActivated: boolean &#125;;
    const isActivated = result
      &amp;&amp; result.statusTerm === 'success'
      &amp;&amp; validationResult?.isActivated === true;

    // Store license validation result: 6739 = activated, 2384 = not activated
    this.myStorage.saveData('LRK', isActivated ? '6739' : '2384', false, false);

    this.loading = false;
    this.toastr.success("Welcome, " + resultObject.username, "Success");

    // Navigate to appropriate page
    if (resultObject.showLoginInfo) &#123;
      this.router.navigate(["/Learning/onboarding-landing-page"]);
    &#125; else &#123;
      this.router.navigate(["/config-module/overview-landing-page"]);
    &#125;
  &#125;,
  error: (error) =&gt; &#123;
    console.error('Error validating license during login:', error);
    // On error, mark as not activated
    this.myStorage.saveData('LRK', '2384', false, false);
    // Continue with navigation...
  &#125;
&#125;);</code></pre>
      </section>

      <!-- LocalStorage Key Details -->
      <section class="card">
        <h2>LocalStorage Key Details</h2>
        <h3>Key: LRK (License Registration Key)</h3>
        <p><strong>Storage Type:</strong> LocalStorage (persistent across browser tabs)</p>
        <table>
          <thead><tr><th>Value</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><code>'6739'</code></td><td>License is activated</td></tr>
            <tr><td><code>'2384'</code></td><td>License is NOT activated</td></tr>
            <tr><td><code>null</code> or missing</td><td>Treated as not activated</td></tr>
          </tbody>
        </table>
        <h3>Security Notes</h3>
        <ul>
          <li>Values are obfuscated integers instead of boolean or clear text</li>
          <li>Cannot be easily guessed or manipulated by end users</li>
          <li>Validation still occurs at API level for security</li>
        </ul>
      </section>

      <!-- Navigation Guard Implementation -->
      <section class="card">
        <h2>Navigation Guard Implementation</h2>
        <h3>Landing Pages with License Validation</h3>
        <p>All module landing pages implement the same validation pattern in their <code>navigateTo()</code> method:</p>
        <table>
          <thead><tr><th>#</th><th>Landing Page</th><th>Location</th></tr></thead>
          <tbody>
            <tr><td>1</td><td><strong>Payroll Landing Page</strong></td><td><code>payroll-module/payroll-landing-page/payroll-landing-page.component.ts</code> (Lines 338-361)</td></tr>
            <tr><td>2</td><td><strong>KPI Landing Page</strong></td><td><code>kpi-module/kpi-landing-page/kpi-landing-page.component.ts</code> (Lines 358-381)</td></tr>
            <tr><td>3</td><td><strong>Reporting Landing Page</strong></td><td><code>bi-module/reporting-landing-page/reporting-landing-page.component.ts</code> (Lines 311-334)</td></tr>
            <tr><td>4</td><td><strong>Overview Landing Page</strong></td><td><code>config-module/overview-landing-page/overview-landing-page.component.ts</code> (Lines 359-381, 422-440)</td></tr>
            <tr><td>5</td><td><strong>Settings Page</strong></td><td><code>config-module/settings/settings.component.ts</code> (Lines 195-212)</td></tr>
          </tbody>
        </table>

        <h3>Standard Validation Pattern (With Credit Balance Modal)</h3>
        <p>Used in Payroll, KPI, and Reporting landing pages:</p>
        <pre><code>navigateTo(link: string) &#123;
  if (link) &#123;
    // Check license activation status from localStorage
    const lrkValue = this.myStorage.getData('LRK', false, false);

    if (lrkValue !== '6739') &#123;
      // License is not activated, show credit balance modal
      if (this.creditBalanceModalTemplate) &#123;
        this.openCreditBalanceModal(this.creditBalanceModalTemplate);
      &#125;
      return;
    &#125;

    // License is activated (LRK = 6739), proceed with navigation
    var list = this.resultList;
    let updateMenu = this.resultList?.find((parent) =&gt;
      parent.childInfo?.some((child) =&gt; child.link?.includes(link))
    )?.childInfo || [];

    this.menuService.updateMenu(updateMenu);
    this.router.navigate([link]);
  &#125;
&#125;</code></pre>

        <h3>Overview Page Pattern (No Credit Balance Modal)</h3>
        <pre><code>navigateTo(link: string) &#123;
  if (link) &#123;
    // Check license activation status from localStorage
    const lrkValue = this.myStorage.getData('LRK', false, false);

    if (lrkValue !== '6739') &#123;
      // License is not activated - log warning and block navigation
      console.warn('License not activated. Navigation blocked.');
      return;
    &#125;

    // License is activated (LRK = 6739), proceed with navigation
    // ... navigation logic
  &#125;
&#125;</code></pre>
      </section>

      <!-- User Experience Flow -->
      <section class="card">
        <h2>User Experience Flow</h2>
        <h3>Activated License Flow</h3>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-person"></i> User Logs In<small>Authentication</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-shield-check"></i> API Validates<small>isActivated: true</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-hdd"></i> Store '6739'<small>in localStorage</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-grid"></i> Landing Page<small>Click module card</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-search"></i> Check LRK<small>Value = '6739'</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check-circle"></i> Navigate<small>Immediate access</small></div>
          </div>
        </div>

        <h3>Non-Activated License Flow</h3>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-person"></i> User Logs In<small>Authentication</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-shield-x"></i> API Validates<small>isActivated: false</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-hdd"></i> Store '2384'<small>in localStorage</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-grid"></i> Landing Page<small>Click module card</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-search"></i> Check LRK<small>Value = '2384'</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-danger"><i class="bi bi-x-circle"></i> Blocked<small>Show modal</small></div>
          </div>
        </div>
      </section>

      <!-- Credit Balance Info Modal -->
      <section class="card">
        <h2>Credit Balance Info Modal</h2>
        <p>When a non-activated license is detected, the system displays a comprehensive modal with:</p>
        <ul>
          <li>Current credit balance information</li>
          <li>Credit usage statistics</li>
          <li>Pricing calculator</li>
          <li>Bank payment information</li>
          <li>Contact support details</li>
          <li>Coupon code redemption</li>
        </ul>
        <p><strong>Modal Component:</strong> <code>SmartHR_UI/src/app/pages/systematic/modules/common/credit-balance-info/</code></p>
      </section>

      <!-- Performance Benefits -->
      <section class="card">
        <h2>Performance Benefits</h2>
        <h3>Before (API-based validation)</h3>
        <ul>
          <li>API call on every navigation attempt</li>
          <li>Network latency (100-500ms per navigation)</li>
          <li>Increased server load</li>
          <li>Potential for rate limiting issues</li>
        </ul>
        <h3>After (localStorage-based validation)</h3>
        <ul>
          <li>Single API call during login only</li>
          <li>Instant validation (O(1) localStorage read)</li>
          <li>Reduced server load</li>
          <li>Better offline handling</li>
          <li>Consistent performance across all navigations</li>
        </ul>
      </section>

      <!-- Security Considerations -->
      <section class="card">
        <h2>Security Considerations</h2>
        <h3>Client-Side Validation</h3>
        <ul>
          <li>LocalStorage can be manipulated by determined users</li>
          <li>This is acceptable as it only affects UX, not actual access</li>
        </ul>
        <h3>Server-Side Protection</h3>
        <ul>
          <li>All API endpoints must still validate license status</li>
          <li>Backend checks are the source of truth</li>
          <li>Frontend validation is for UX optimization only</li>
        </ul>
        <h3>Multi-Tab Behavior</h3>
        <ul>
          <li>LocalStorage is shared across browser tabs</li>
          <li>All tabs will have consistent license validation state</li>
          <li>Login in one tab updates validation for all tabs</li>
        </ul>
      </section>

      <!-- Testing Checklist -->
      <section class="card">
        <h2>Testing Checklist</h2>
        <h3>Manual Testing</h3>
        <table>
          <thead><tr><th>#</th><th>Test Case</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Login with activated license &rarr; verify <code>LRK = '6739'</code></td><td>Required</td></tr>
            <tr><td>2</td><td>Login with non-activated license &rarr; verify <code>LRK = '2384'</code></td><td>Required</td></tr>
            <tr><td>3</td><td>Navigate to Payroll landing &rarr; click card &rarr; verify behavior</td><td>Required</td></tr>
            <tr><td>4</td><td>Navigate to KPI landing &rarr; click card &rarr; verify behavior</td><td>Required</td></tr>
            <tr><td>5</td><td>Navigate to Reporting landing &rarr; click card &rarr; verify behavior</td><td>Required</td></tr>
            <tr><td>6</td><td>Navigate to Overview landing &rarr; click card &rarr; verify behavior</td><td>Required</td></tr>
            <tr><td>7</td><td>Navigate to Settings page &rarr; click policy item &rarr; verify behavior</td><td>Required</td></tr>
            <tr><td>8</td><td>Test with missing ReviewStatus</td><td>Required</td></tr>
            <tr><td>9</td><td>Test with inactive license</td><td>Required</td></tr>
            <tr><td>10</td><td>Test with missing license record</td><td>Required</td></tr>
            <tr><td>11</td><td>Test credit balance modal display</td><td>Required</td></tr>
            <tr><td>12</td><td>Test navigation blocking when not activated</td><td>Required</td></tr>
          </tbody>
        </table>
        <h3>Edge Cases</h3>
        <table>
          <thead><tr><th>#</th><th>Test Case</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Login fails but validation succeeds &rarr; should default to <code>'2384'</code></td><td>Required</td></tr>
            <tr><td>2</td><td>API timeout during validation &rarr; should default to <code>'2384'</code></td><td>Required</td></tr>
            <tr><td>3</td><td>localStorage is full &rarr; should log error</td><td>Required</td></tr>
            <tr><td>4</td><td>localStorage is disabled &rarr; should gracefully degrade</td><td>Required</td></tr>
            <tr><td>5</td><td>User manually deletes <code>LRK</code> &rarr; should treat as not activated</td><td>Required</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Maintenance Notes -->
      <section class="card">
        <h2>Maintenance Notes</h2>
        <h3>Adding New Landing Pages</h3>
        <p>To add license validation to a new landing page:</p>
        <p><strong>1. Import necessary services:</strong></p>
        <pre><code>import &#123; LocalService &#125; from "src/app/common/systematic.localservice";</code></pre>
        <p><strong>2. Inject LocalService in constructor:</strong></p>
        <pre><code>constructor(
  // ... other services
  private myStorage: LocalService
) &#123;&#125;</code></pre>
        <p><strong>3. Add validation to navigateTo() method:</strong></p>
        <pre><code>navigateTo(link: string) &#123;
  if (link) &#123;
    const lrkValue = this.myStorage.getData('LRK', false, false);
    if (lrkValue !== '6739') &#123;
      // Show modal or block navigation
      return;
    &#125;
    // Proceed with navigation
  &#125;
&#125;</code></pre>
        <h3>Updating Validation Logic</h3>
        <ol>
          <li><strong>Update backend validation</strong> in <code>SysLicenseController.cs</code></li>
          <li><strong>Test the API endpoint</strong> thoroughly</li>
          <li><strong>No changes needed in frontend</strong> (uses same LRK pattern)</li>
        </ol>
        <h3>Changing Obfuscated Values</h3>
        <ol>
          <li>Search for <code>'6739'</code> across the codebase</li>
          <li>Search for <code>'2384'</code> across the codebase</li>
          <li>Update all occurrences consistently</li>
          <li>Update this documentation</li>
          <li>Test all landing pages</li>
        </ol>
      </section>

      <!-- Related Components -->
      <section class="card">
        <h2>Related Components</h2>
        <h3>Credit Balance Info Component</h3>
        <table>
          <thead><tr><th>Property</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td><strong>Path</strong></td><td><code>SmartHR_UI/src/app/pages/systematic/modules/common/credit-balance-info/</code></td></tr>
            <tr><td><strong>Purpose</strong></td><td>Displays credit balance and payment information when license is not activated</td></tr>
            <tr><td><strong>Integration</strong></td><td>Imported in landing page modules, shown when <code>LRK !== '6739'</code></td></tr>
          </tbody>
        </table>
        <h3>Credit Balance Auto-Open Feature</h3>
        <table>
          <thead><tr><th>Property</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td><strong>Timer Key</strong></td><td><code>_creditBalanceInfoTimer</code> in localStorage</td></tr>
            <tr><td><strong>Interval</strong></td><td>Configurable via <code>environment.creditBalanceAutoOpenInterval</code></td></tr>
          </tbody>
        </table>
      </section>

      <!-- API Dependencies -->
      <section class="card">
        <h2>API Dependencies</h2>
        <h3>Required Headers</h3>
        <ul>
          <li>Authorization token (from <code>createTokenHeader()</code>)</li>
          <li>Content-Type: application/json</li>
        </ul>
        <h3>Required User Context</h3>
        <table>
          <thead><tr><th>Field</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>userID</code></td><td>Current authenticated user ID</td></tr>
            <tr><td><code>license</code></td><td>License ID from user's context</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Troubleshooting -->
      <section class="card">
        <h2>Troubleshooting</h2>
        <table>
          <thead><tr><th>Issue</th><th>Cause</th><th>Solution</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Credit balance modal always shows even with activated license</strong></td>
              <td>LRK value is not being set correctly during login</td>
              <td>Check browser console for API errors. Verify <code>statusTerm === 'success'</code> check. Verify <code>isActivated</code> property. Check <code>localStorage.getItem('LRK')</code>.</td>
            </tr>
            <tr>
              <td><strong>Navigation blocked after login</strong></td>
              <td>API validation failed or returned false</td>
              <td>Check database: verify license exists, is active, and has ReviewStatus. Check API logs. Verify user's license ID.</td>
            </tr>
            <tr>
              <td><strong>Different behavior across browser tabs</strong></td>
              <td>LocalStorage should be synchronized but timing issues may occur</td>
              <td>Reload affected tabs. Clear browser cache. Re-login to refresh all tabs.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Future Enhancements -->
      <section class="card">
        <h2>Future Enhancements</h2>
        <h3>Potential Improvements</h3>
        <ol>
          <li><strong>Periodic Re-validation</strong> &mdash; Add background job to re-validate license every X hours</li>
          <li><strong>Server-Sent Events</strong> &mdash; Push license status changes to all active sessions</li>
          <li><strong>License Expiry Warning</strong> &mdash; Show warning modal when license is about to expire</li>
          <li><strong>Usage Analytics</strong> &mdash; Track which features are blocked most often</li>
          <li><strong>Grace Period</strong> &mdash; Allow limited access for X days after license expiration</li>
        </ol>
        <h3>Migration Path</h3>
        <ol>
          <li>Keep localStorage as fallback</li>
          <li>Add WebSocket connection for license updates</li>
          <li>Update LRK value when push notification received</li>
          <li>Gradually phase out localStorage-only approach</li>
        </ol>
      </section>

      <!-- Version History -->
      <section class="card">
        <h2>Version History</h2>
        <table>
          <thead><tr><th>Version</th><th>Date</th><th>Changes</th><th>Author</th></tr></thead>
          <tbody>
            <tr><td>1.0.0</td><td>Jan 2025</td><td>Initial implementation</td><td>Claude Code</td></tr>
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
    .card h4 { font-size: 14px; font-weight: 600; color: #1a1f36; margin: 16px 0 6px; }
    .card p { font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 12px; }
    .card ul, .card ol { padding-left: 22px; margin: 0 0 12px; font-size: 14px; color: #444; }
    .card li { margin-bottom: 4px; line-height: 1.6; }

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

    /* ER Diagram */
    .er-diagram {
      display: flex; align-items: flex-start; gap: 16px;
      flex-wrap: wrap; justify-content: center; padding: 12px 0;
    }
    .er-table {
      border: 2px solid #e0e4ec; border-radius: 10px; overflow: hidden;
      min-width: 220px; background: #fff;
    }
    .er-header {
      background: #1a1f36; color: #fff; padding: 10px 14px;
      font-weight: 700; font-size: 13px; text-align: center;
    }
    .er-row {
      padding: 6px 14px; font-size: 12px; color: #444;
      border-bottom: 1px solid #f0f0f0;
      display: flex; align-items: center; gap: 6px;
    }
    .er-row.pk { background: #f0f6ff; }
    .er-row.fk { background: #f5f0ff; }
    .er-row .type { margin-left: auto; color: #999; font-size: 11px; }
    .badge-pk {
      background: #f9a825; color: #fff; padding: 1px 5px;
      border-radius: 3px; font-size: 10px; font-weight: 700;
    }
    .badge-fk {
      background: #7c4dff; color: #fff; padding: 1px 5px;
      border-radius: 3px; font-size: 10px; font-weight: 700;
    }
    .er-relation {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; font-weight: 700; color: #6c8cff;
      align-self: center;
    }
    .er-line {
      width: 40px; height: 2px; background: #6c8cff;
      position: relative;
    }
    .er-line::after {
      content: ''; position: absolute; right: -4px; top: -4px;
      border: 5px solid transparent; border-left: 6px solid #6c8cff;
    }

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
    .node-start small { color: #888; }
    .node-action { background: #6c8cff; color: #fff; }
    .node-pending { background: #f9a825; color: #fff; }
    .node-step { background: #f0f3ff; color: #1a1f36; border: 2px solid #d0d8ff; }
    .node-step small { color: #888; }
    .node-success { background: #43a047; color: #fff; }
    .node-danger { background: #e53935; color: #fff; }
    .diagram-arrow { color: #bbb; font-size: 18px; }
    .diagram-down { text-align: center; color: #bbb; font-size: 20px; padding: 6px 0; }
    @media (max-width: 768px) {
      .diagram-row { flex-direction: column; gap: 0; }
      .diagram-arrow { transform: rotate(90deg); }
    }
  `]
})
export class LicenseValidationComponent {}
