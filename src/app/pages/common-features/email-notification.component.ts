import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-email-notification',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/common-features" class="back-link">
        <i class="bi bi-arrow-left"></i> Common Features
      </a>
      <h1>SysNotiEmail - Email Notification Service</h1>
      <p class="subtitle">Automated email notification processing service that sends pending emails inserted by stored procedures, tracks delivery status, and provides comprehensive error handling.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>The <code>SysNotiEmail</code> service processes pending email notification records that are inserted into the database by stored procedures. It automatically sends emails via AWS SES, updates the delivery status, and logs all attempts for auditing.</p>
        <h3>Key Features</h3>
        <ul>
          <li><strong>Automated Processing</strong> &mdash; automatically queries and sends all pending email notifications</li>
          <li><strong>Status Tracking</strong> &mdash; tracks email lifecycle from <code>Requested</code> to <code>Notified</code> or <code>Failed</code></li>
          <li><strong>Error Handling</strong> &mdash; captures and stores error messages for failed deliveries</li>
          <li><strong>Batch Processing</strong> &mdash; processes multiple pending emails in a single API call</li>
          <li><strong>Comprehensive Logging</strong> &mdash; all email attempts are logged to <code>SysErrorLog</code> for auditing</li>
          <li><strong>Timestamp Tracking</strong> &mdash; records exact send time via <code>NotiOn</code> field upon successful delivery</li>
        </ul>
      </section>

      <!-- Database Diagram -->
      <section class="card">
        <h2>Database Diagram</h2>
        <div class="er-diagram">
          <div class="er-table">
            <div class="er-header">SysNotiEmail</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> NotiLogID <span class="er-type">nvarchar(50)</span></div>
            <div class="er-row">LogOn <span class="er-type">datetime</span></div>
            <div class="er-row">NotiEmailAddresses <span class="er-type">nvarchar(1000)</span></div>
            <div class="er-row">LogStatus <span class="er-type">nvarchar(50)</span></div>
            <div class="er-row">LogTriggerID <span class="er-type">nvarchar(50)</span></div>
            <div class="er-row">NotiTitle <span class="er-type">nvarchar(200)</span></div>
            <div class="er-row">NotiBody <span class="er-type">nvarchar(MAX)</span></div>
            <div class="er-row">NotiOn <span class="er-type">datetime</span></div>
            <div class="er-row">ErrorMessage <span class="er-type">nvarchar(MAX)</span></div>
            <div class="er-row">EmailTemplateID <span class="er-type">nvarchar(50)</span></div>
            <div class="er-row">EmailTemplateJson <span class="er-type">nvarchar(MAX)</span></div>
          </div>
          <div class="er-relation">
            <div class="er-line"></div>
            <span>logs to</span>
            <div class="er-line"></div>
          </div>
          <div class="er-table">
            <div class="er-header">SysErrorLog</div>
            <div class="er-row">Logs all email send attempts</div>
            <div class="er-row">Captures errors and stack traces</div>
            <div class="er-row">Used for auditing and debugging</div>
          </div>
        </div>
      </section>

      <!-- Processing Flow Diagram -->
      <section class="card">
        <h2>Processing Flow</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-database"></i><span>SP Inserts Record</span><small>Status = Requested</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-lightning"></i><span>API Triggered</span></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-search"></i><span>Query Requested Emails</span></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-envelope"></i><span>Send via AWS SES</span></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-success"><i class="bi bi-check-circle"></i><span>Success</span><small>Status = Notified, set NotiOn</small></div>
            <div class="diagram-arrow">/</div>
            <div class="diagram-node node-danger"><i class="bi bi-x-circle"></i><span>Failure</span><small>Status = Failed, set ErrorMessage</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-journal-text"></i><span>Log to SysErrorLog</span></div>
          </div>
        </div>
      </section>

      <!-- Status Values -->
      <section class="card">
        <h2>Status Values</h2>
        <table>
          <thead><tr><th>Status</th><th>Description</th><th>Set By</th></tr></thead>
          <tbody>
            <tr><td><code>Requested</code></td><td>Email is pending and waiting to be processed</td><td>Stored Procedure (on insert)</td></tr>
            <tr><td><code>Notified</code></td><td>Email has been successfully sent via AWS SES</td><td>API (after successful send)</td></tr>
            <tr><td><code>Failed</code></td><td>Email sending encountered an error</td><td>API (on error, with ErrorMessage)</td></tr>
          </tbody>
        </table>
      </section>

      <!-- API Endpoints -->
      <section class="card">
        <h2>API Endpoints</h2>
        <table>
          <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
          <tbody>
            <tr>
              <td><span class="method-post">POST</span></td>
              <td><code>/SysNotiEmailApi/ProcessPendingEmails</code></td>
              <td>Process and send all pending email notifications</td>
            </tr>
            <tr>
              <td><span class="method-post">POST</span></td>
              <td><code>/SysNotiEmailApi/ProcessPendingEmailsByTriggerID/&#123;id&#125;</code></td>
              <td>Process pending emails filtered by a specific trigger ID</td>
            </tr>
            <tr>
              <td><span class="method-get">GET</span></td>
              <td><code>/SysNotiEmailApi/GetPendingNotifications</code></td>
              <td>Retrieve list of all pending (Requested) email notifications</td>
            </tr>
          </tbody>
        </table>

        <h3>Response Examples</h3>
        <h4>ProcessPendingEmails - Success</h4>
        <pre><code>&#123;
  "success": true,
  "message": "3 email(s) processed successfully.",
  "processedCount": 3,
  "failedCount": 0
&#125;</code></pre>

        <h4>GetPendingNotifications - Response</h4>
        <pre><code>[
  &#123;
    "notiLogID": "NL-20260327-001",
    "notiEmailAddresses": "john&#64;company.com",
    "logStatus": "Requested",
    "notiTitle": "Leave Request Approved",
    "logOn": "2026-03-27T10:30:00",
    "logTriggerID": "APR-001"
  &#125;
]</code></pre>

        <h4>ProcessPendingEmails - Partial Failure</h4>
        <pre><code>&#123;
  "success": true,
  "message": "2 email(s) processed, 1 failed.",
  "processedCount": 2,
  "failedCount": 1,
  "errors": [
    &#123;
      "notiLogID": "NL-20260327-003",
      "error": "Invalid email address format"
    &#125;
  ]
&#125;</code></pre>
      </section>

      <!-- C# Interface & Entity -->
      <section class="card">
        <h2>C# Interface &amp; Entity</h2>

        <h3>ISysNotiEmailController Interface</h3>
        <pre><code>public interface ISysNotiEmailController
&#123;
    Task&lt;ResponseMessage&gt; ProcessPendingNotificationEmails();
    Task&lt;ResponseMessage&gt; ProcessPendingNotificationEmailsByTriggerID(string triggerID);
    Task&lt;List&lt;SysNotiEmail&gt;&gt; GetPendingNotifications();
&#125;</code></pre>

        <h3>SysNotiEmail Entity Class</h3>
        <pre><code>public class SysNotiEmail
&#123;
    public string NotiLogID &#123; get; set; &#125;
    public DateTime? LogOn &#123; get; set; &#125;
    public string NotiEmailAddresses &#123; get; set; &#125;
    public string LogStatus &#123; get; set; &#125;
    public string LogTriggerID &#123; get; set; &#125;
    public string NotiTitle &#123; get; set; &#125;
    public string NotiBody &#123; get; set; &#125;
    public DateTime? NotiOn &#123; get; set; &#125;
    public string ErrorMessage &#123; get; set; &#125;
    public string EmailTemplateID &#123; get; set; &#125;
    public string EmailTemplateJson &#123; get; set; &#125;
&#125;</code></pre>
      </section>

      <!-- File Structure -->
      <section class="card">
        <h2>File Structure</h2>
        <table>
          <thead><tr><th>File</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>SysNotiEmail.cs</code></td><td>Entity model class defining the SysNotiEmail database table structure</td></tr>
            <tr><td><code>SysNotiEmailController.cs</code></td><td>Business logic controller implementing ISysNotiEmailController interface</td></tr>
            <tr><td><code>SysNotiEmailApi.cs</code></td><td>API endpoint definitions exposing email notification processing routes</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Usage Scenarios -->
      <section class="card">
        <h2>Usage Scenarios</h2>

        <h3>1. Approval Workflow Integration</h3>
        <p>A stored procedure (e.g. <code>APP_ProcessApprovalAction</code>) inserts a notification record into <code>SysNotiEmail</code> with status <code>Requested</code>. Immediately after the SP completes, the C# code calls <code>ProcessPendingNotificationEmails()</code> to send the email.</p>
        <pre><code>// After approval action completes
await sysNotiEmailController.ProcessPendingNotificationEmails();</code></pre>

        <h3>2. Scheduled Background Job</h3>
        <p>A Hangfire recurring job runs every 5 minutes to catch any unsent emails, acting as a safety net for records that were not processed immediately.</p>
        <pre><code>// Hangfire job registration
RecurringJob.AddOrUpdate&lt;ISysNotiEmailController&gt;(
    "process-pending-emails",
    x =&gt; x.ProcessPendingNotificationEmails(),
    "*/5 * * * *"  // Every 5 minutes
);</code></pre>

        <h3>3. Manual Trigger After Approval Action</h3>
        <p>After a specific approval action (e.g. final approval step), the system calls the API endpoint with the trigger ID to process only the emails related to that action.</p>
        <pre><code>// Process emails for a specific trigger
await sysNotiEmailController
    .ProcessPendingNotificationEmailsByTriggerID(approvalCaseID);</code></pre>
      </section>

      <!-- Integration with Approval Workflow -->
      <section class="card">
        <h2>Integration with Approval Workflow</h2>

        <h3>SQL: Insert Notification from Stored Procedure</h3>
        <pre><code>-- Inside APP_ProcessApprovalAction stored procedure
INSERT INTO SysNotiEmail (
    NotiLogID, LogOn, NotiEmailAddresses,
    LogStatus, LogTriggerID, NotiTitle,
    NotiBody, EmailTemplateID, EmailTemplateJson
)
VALUES (
    NEWID(), GETDATE(), &#64;ApproverEmail,
    'Requested', &#64;ApprovalCaseID, &#64;EmailSubject,
    &#64;EmailBody, &#64;TemplateID, &#64;TemplateJson
);</code></pre>

        <h3>C#: Process After Approval Action</h3>
        <pre><code>// In ApprovalWorkflowController after SP execution
public async Task&lt;ResponseMessage&gt; ProcessApprovalAction(ApprovalActionRequest request)
&#123;
    // 1. Execute the approval stored procedure
    await ExecuteStoredProcedure("APP_ProcessApprovalAction", parameters);

    // 2. Process any pending notification emails inserted by the SP
    await sysNotiEmailController.ProcessPendingNotificationEmails();

    return new ResponseMessage &#123; Success = true &#125;;
&#125;</code></pre>
      </section>

      <!-- Best Practices -->
      <section class="card">
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Insert from Stored Procedures</strong> &mdash; always insert notification records from SPs to keep email logic close to the business transaction and ensure data consistency</li>
          <li><strong>Process Immediately After Insert</strong> &mdash; call <code>ProcessPendingNotificationEmails()</code> right after the SP completes to minimize delivery delay</li>
          <li><strong>Monitor Failed Emails</strong> &mdash; regularly check for <code>Failed</code> status records and review <code>ErrorMessage</code> to identify recurring issues</li>
          <li><strong>Retry Failed Emails</strong> &mdash; reset failed records back to <code>Requested</code> to allow reprocessing</li>
        </ul>
        <h3>SQL: Retry Failed Emails</h3>
        <pre><code>-- Reset failed emails for reprocessing
UPDATE SysNotiEmail
SET LogStatus = 'Requested',
    ErrorMessage = NULL
WHERE LogStatus = 'Failed'
  AND LogOn &gt;= DATEADD(DAY, -1, GETDATE());</code></pre>
      </section>

      <!-- Troubleshooting -->
      <section class="card">
        <h2>Troubleshooting</h2>
        <table>
          <thead><tr><th>Issue</th><th>Possible Cause</th><th>Resolution</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Emails Not Sending</strong></td>
              <td>No records with <code>Requested</code> status; AWS SES credentials expired; email addresses invalid</td>
              <td>Verify records exist in <code>SysNotiEmail</code> with status <code>Requested</code>. Check AWS SES configuration and credentials. Validate email addresses in <code>NotiEmailAddresses</code>.</td>
            </tr>
            <tr>
              <td><strong>Status Not Updating</strong></td>
              <td>Database connection issues; transaction rollback; concurrent processing conflicts</td>
              <td>Check database connectivity. Review <code>SysErrorLog</code> for transaction errors. Ensure only one instance of the processor is running at a time.</td>
            </tr>
            <tr>
              <td><strong>Missing Email Logs</strong></td>
              <td>Error logging disabled; <code>SysErrorLog</code> table permissions; unhandled exceptions before logging</td>
              <td>Verify <code>SysErrorLog</code> table exists and has proper write permissions. Check application logs for unhandled exceptions. Ensure error logging is enabled in configuration.</td>
            </tr>
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
    .card h4 { font-size: 14px; font-weight: 600; color: #555; margin: 16px 0 6px; }
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

    /* Method Badges */
    .method-post {
      display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px;
      font-weight: 700; background: #fff3e0; color: #e65100;
    }
    .method-get {
      display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px;
      font-weight: 700; background: #e8f5e9; color: #2e7d32;
    }

    /* ER Diagram */
    .er-diagram {
      display: flex; align-items: flex-start; gap: 20px;
      flex-wrap: wrap; justify-content: center; padding: 16px 0;
    }
    .er-table {
      border: 2px solid #d0d8ff; border-radius: 10px; overflow: hidden;
      min-width: 260px; background: #fff;
    }
    .er-header {
      background: #6c8cff; color: #fff; padding: 10px 14px;
      font-weight: 700; font-size: 14px;
    }
    .er-row {
      padding: 6px 14px; font-size: 13px; color: #444;
      border-bottom: 1px solid #f0f0f0;
      display: flex; align-items: center; gap: 8px;
    }
    .er-row:last-child { border-bottom: none; }
    .er-row.pk { background: #f0f3ff; font-weight: 600; }
    .er-row.fk { background: #fff8e1; }
    .er-type { margin-left: auto; font-size: 11px; color: #999; }
    .badge-pk {
      display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 10px;
      font-weight: 700; background: #6c8cff; color: #fff;
    }
    .badge-fk {
      display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 10px;
      font-weight: 700; background: #f9a825; color: #fff;
    }
    .er-relation {
      display: flex; align-items: center; gap: 8px;
      font-size: 12px; color: #999; font-weight: 500; padding-top: 30px;
    }
    .er-line { width: 30px; height: 2px; background: #d0d8ff; }

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
      .er-diagram { flex-direction: column; align-items: center; }
    }
  `]
})
export class EmailNotificationComponent {}
