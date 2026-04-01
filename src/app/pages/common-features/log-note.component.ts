import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-log-note',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/common-features" class="back-link">
        <i class="bi bi-arrow-left"></i> Common Features
      </a>
      <h1>Log Note (Audit Trail)</h1>
      <p class="subtitle">Comprehensive audit trail with timeline UI, field-level change tracking, and modal support for any entity.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>The Log Note system provides automatic audit logging for any entity in the application. It tracks field-level changes using EF Core change detection and presents them in a clean timeline interface.</p>
        <ul>
          <li><strong>Auto-detects field changes</strong> &mdash; compares original and current values via EF Core <code>ChangeTracker</code></li>
          <li><strong>Timeline UI</strong> &mdash; chronological display with visual circles, time-ago labels, and user attribution</li>
          <li><strong>Modal and page modes</strong> &mdash; embed as a modal dialog in detail forms or as a standalone page</li>
          <li><strong>Search</strong> &mdash; filter log entries by keyword across all fields and values</li>
          <li><strong>HTML formatting</strong> &mdash; supports rich-text log descriptions with safe HTML rendering</li>
        </ul>
      </section>

      <!-- DB Diagram -->
      <section class="card">
        <h2>Database Diagram</h2>
        <div class="er-diagram">
          <div class="er-layer">
            <div class="er-label">Audit Log Tables</div>
            <div class="er-row">
              <div class="er-table er-primary">
                <div class="er-title"><i class="bi bi-table"></i> SysLog</div>
                <div class="er-field"><span class="er-key">PK</span> SystemLogId</div>
                <div class="er-field">RecordId</div>
                <div class="er-field">RecordType</div>
                <div class="er-field">LogBy</div>
                <div class="er-field">LogDateTime</div>
                <div class="er-field">Source</div>
                <div class="er-field">RefernceNo</div>
              </div>
              <div class="er-connector"><div class="er-line"></div> 1:N <div class="er-line"></div></div>
              <div class="er-table er-runtime">
                <div class="er-title"><i class="bi bi-table"></i> SysLogItem</div>
                <div class="er-field"><span class="er-key">PK</span> SystemLogItemId</div>
                <div class="er-field"><span class="er-fk">FK</span> SystemLogId</div>
                <div class="er-field">FieldName</div>
                <div class="er-field">OldValue</div>
                <div class="er-field">NewValue</div>
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
            <div class="diagram-node node-start"><i class="bi bi-save"></i> Entity Save</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-search"></i> EF Core Detects<small>Changes</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-code-slash"></i> writeLog()</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-database"></i> Create SysLog</div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-pending"><i class="bi bi-list-ul"></i> Create SysLogItem<small>per field</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-clock-history"></i> Timeline UI<small>displays</small></div>
          </div>
        </div>
      </section>

      <!-- Database Tables -->
      <section class="card">
        <h2>Database Tables</h2>

        <h3>SysLog (Parent)</h3>
        <p>Stores each log entry with metadata about the change event.</p>
        <table>
          <thead><tr><th>Column</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>Id</code></td><td>int</td><td>Primary key</td></tr>
            <tr><td><code>RecordType</code></td><td>string</td><td>Entity identifier (e.g. "Employee", "LeaveRequest")</td></tr>
            <tr><td><code>RecordId</code></td><td>int</td><td>Primary key of the source record</td></tr>
            <tr><td><code>Action</code></td><td>string</td><td>Action type: "Create", "Update", "Delete"</td></tr>
            <tr><td><code>Description</code></td><td>string</td><td>HTML-formatted summary of changes</td></tr>
            <tr><td><code>CreatedBy</code></td><td>int</td><td>User ID who made the change</td></tr>
            <tr><td><code>CreatedDate</code></td><td>datetime</td><td>Timestamp of the change</td></tr>
          </tbody>
        </table>

        <h3>SysLogItem (Child Field Changes)</h3>
        <p>Stores individual field-level changes for each log entry.</p>
        <table>
          <thead><tr><th>Column</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>Id</code></td><td>int</td><td>Primary key</td></tr>
            <tr><td><code>SysLogId</code></td><td>int</td><td>Foreign key to <code>SysLog</code></td></tr>
            <tr><td><code>FieldName</code></td><td>string</td><td>Name of the changed field</td></tr>
            <tr><td><code>OldValue</code></td><td>string</td><td>Previous value (null for new records)</td></tr>
            <tr><td><code>NewValue</code></td><td>string</td><td>New value after the change</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Backend Integration -->
      <section class="card">
        <h2>Backend Integration</h2>

        <h3>Method 1: writeLog (Multi-Field Auto-Detect)</h3>
        <p>Automatically detects all changed fields by comparing EF Core entity state before and after modification.</p>
        <pre><code>// In your controller or service, after modifying the entity:
await _sysLogService.writeLog(
  recordType: "Employee",
  recordId: employee.Id,
  action: "Update",
  description: "&lt;b&gt;Updated employee profile&lt;/b&gt;&lt;br&gt;Modified by HR admin",
  userId: currentUserId,
  dbContext: _context
);</code></pre>
        <p>This method reads the EF Core <code>ChangeTracker</code> to automatically capture all modified properties and their old/new values into <code>SysLogItem</code> records.</p>

        <h3>Method 2: writeLogSinglePoint (Single Custom Field)</h3>
        <p>Manually logs a single field change when auto-detection is not suitable.</p>
        <pre><code>// Log a specific field change manually:
await _sysLogService.writeLogSinglePoint(
  recordType: "LeaveRequest",
  recordId: leaveRequest.Id,
  action: "Update",
  fieldName: "Status",
  oldValue: "Pending",
  newValue: "Approved",
  description: "&lt;b&gt;Leave request approved&lt;/b&gt;",
  userId: currentUserId
);</code></pre>
      </section>

      <!-- Frontend Integration -->
      <section class="card">
        <h2>Frontend Integration</h2>

        <h3>Modal Mode</h3>
        <p>Open the log note as a modal dialog from any detail form.</p>
        <pre><code>&lt;app-sys-log
  [recordType]="'Employee'"
  [recordId]="selectedRecord?.id"
  [isModal]="true"
  [modalVisible]="showLogModal"
  (onModalClose)="showLogModal = false"&gt;
&lt;/app-sys-log&gt;</code></pre>

        <h3>Page Mode</h3>
        <p>Embed the log note timeline directly within a page layout.</p>
        <pre><code>&lt;app-sys-log
  [recordType]="'Employee'"
  [recordId]="selectedRecord?.id"
  [isModal]="false"&gt;
&lt;/app-sys-log&gt;</code></pre>

        <h3>TypeScript Properties</h3>
        <pre><code>// In your component class:
showLogModal: boolean = false;

openLogNote(): void &#123;
  this.showLogModal = true;
&#125;</code></pre>
      </section>

      <!-- UI Design -->
      <section class="card">
        <h2>UI Design</h2>

        <h3>Left Panel &mdash; Timeline</h3>
        <ul>
          <li><strong>Timeline circles</strong> &mdash; colored dots on a vertical line indicating each log entry</li>
          <li><strong>Time ago</strong> &mdash; relative timestamp (e.g. "2 hours ago", "3 days ago")</li>
          <li><strong>User name</strong> &mdash; display name of the user who made the change</li>
        </ul>

        <h3>Right Panel &mdash; Details</h3>
        <ul>
          <li><strong>Search box</strong> &mdash; filter entries by keyword across fields and values</li>
          <li><strong>Field changes</strong> &mdash; each changed field shown with old value (strikethrough) and new value (highlighted)</li>
          <li><strong>Description</strong> &mdash; HTML-formatted summary rendered safely with <code>[innerHTML]</code></li>
        </ul>
      </section>

      <!-- Backend Files -->
      <section class="card">
        <h2>Backend Files</h2>
        <table>
          <thead><tr><th>File</th><th>Path</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>SysLogController.cs</code></td><td><code>SmartHR_API/Controllers/</code></td><td>API endpoints for retrieving log entries</td></tr>
            <tr><td><code>SysLog.cs</code></td><td><code>SmartHR_API/Models/</code></td><td>Entity model for log entries</td></tr>
            <tr><td><code>SysLogItem.cs</code></td><td><code>SmartHR_API/Models/</code></td><td>Entity model for field-level changes</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Frontend Files -->
      <section class="card">
        <h2>Frontend Files</h2>
        <table>
          <thead><tr><th>File</th><th>Path</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>SysLogComponent</code></td><td><code>SmartHR_UI/src/app/common/sys-log/</code></td><td>Timeline UI component with modal and page modes</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Best Practices -->
      <section class="card">
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Log after SaveChanges</strong> &mdash; always call <code>writeLog</code> after <code>SaveChangesAsync()</code> to ensure the EF Core change tracker has the correct state</li>
          <li><strong>Meaningful RecordType</strong> &mdash; use consistent, descriptive names (e.g. "Employee", "LeaveRequest") so logs can be filtered and grouped</li>
          <li><strong>HTML formatting for readability</strong> &mdash; use <code>&lt;b&gt;</code>, <code>&lt;br&gt;</code>, and <code>&lt;span&gt;</code> in descriptions for clear audit summaries</li>
          <li><strong>Modal mode for detail forms</strong> &mdash; use <code>[isModal]="true"</code> when showing logs from a detail/edit page to avoid navigation</li>
        </ul>
      </section>

      <!-- Troubleshooting -->
      <section class="card">
        <h2>Troubleshooting</h2>
        <table>
          <thead><tr><th>Issue</th><th>Cause</th><th>Solution</th></tr></thead>
          <tbody>
            <tr><td>Logs not appearing</td><td><code>writeLog</code> called before <code>SaveChangesAsync</code> or incorrect <code>RecordType</code>/<code>RecordId</code></td><td>Ensure <code>writeLog</code> is called after <code>SaveChangesAsync</code> succeeds and verify the <code>RecordType</code> and <code>RecordId</code> match the frontend bindings</td></tr>
            <tr><td>HTML not rendering</td><td>Description displayed as plain text instead of rendered HTML</td><td>Ensure the frontend uses <code>[innerHTML]</code> binding for the description field, not interpolation</td></tr>
            <tr><td>Performance issues</td><td>Too many log entries loaded at once for high-activity records</td><td>Implement pagination or lazy loading; consider archiving old logs for records with thousands of entries</td></tr>
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
    .warning {
      background: #fff8e1; border: 1px solid #ffe082; border-radius: 8px;
      padding: 12px 16px; margin: 0 0 14px; display: flex; align-items: flex-start;
      gap: 10px; font-size: 14px; color: #7a6100;
    }
    .warning i { font-size: 18px; color: #f9a825; flex-shrink: 0; margin-top: 1px; }
    .info {
      background: #e3f2fd; border: 1px solid #90caf9; border-radius: 8px;
      padding: 12px 16px; margin: 0 0 14px; font-size: 14px; color: #0d47a1;
      display: flex; align-items: flex-start; gap: 10px;
    }
    .info i { font-size: 18px; color: #1565c0; flex-shrink: 0; margin-top: 1px; }

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
export class LogNoteComponent {}
