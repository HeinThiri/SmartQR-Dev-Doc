import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-approval-workflow',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/common-features" class="back-link">
        <i class="bi bi-arrow-left"></i> Common Features
      </a>
      <h1>Approval Workflow</h1>
      <p class="subtitle">Enterprise-grade multi-step approval processes with flexible configuration, parallel/sequential approvals, audit trails, and seamless entity integration.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Key Features -->
      <section class="card">
        <h2>Key Features</h2>
        <ul>
          <li><strong>Multi-step workflows</strong> &mdash; define sequential or parallel approval steps per entity</li>
          <li><strong>Multiple approver types</strong> &mdash; individual users, roles, departments, or reporting lines</li>
          <li><strong>Conditional logic</strong> &mdash; skip or route steps based on field values or thresholds</li>
          <li><strong>Audit trail</strong> &mdash; every action (approve, reject, reassign) is logged with timestamp and user</li>
          <li><strong>Entry data lock</strong> &mdash; automatically locks the source record while approval is in progress</li>
          <li><strong>Case title</strong> &mdash; user-friendly label for each approval request (e.g. "Leave Request &mdash; John &mdash; 3 days")</li>
          <li><strong>Resubmission</strong> &mdash; rejected requests can be edited and resubmitted without creating a new record</li>
          <li><strong>Multi-tenancy</strong> &mdash; workflows are scoped per organization with tenant-aware data isolation</li>
        </ul>
      </section>

      <!-- Workflow Process Diagram -->
      <section class="card">
        <h2>Workflow Process</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-play-fill"></i><span>Entity Created</span></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-send"></i><span>Submit Request</span></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-hourglass-split"></i><span>Pending</span></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-1-circle"></i><span>Step 1<br><small>Approver(s)</small></span></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-2-circle"></i><span>Step 2<br><small>Approver(s)</small></span></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-3-circle"></i><span>Step N<br><small>Approver(s)</small></span></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row diagram-row-end">
            <div class="diagram-node node-approved"><i class="bi bi-check-circle"></i><span>Approved</span></div>
            <div class="diagram-or">or</div>
            <div class="diagram-node node-rejected"><i class="bi bi-x-circle"></i><span>Rejected</span></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-arrow-repeat"></i><span>Resubmit</span></div>
          </div>
        </div>
        <div class="diagram-legend">
          <span><span class="legend-dot" style="background:#6c8cff;"></span> Action</span>
          <span><span class="legend-dot" style="background:#f9a825;"></span> Pending</span>
          <span><span class="legend-dot" style="background:#43a047;"></span> Approved</span>
          <span><span class="legend-dot" style="background:#e53935;"></span> Rejected</span>
        </div>
      </section>

      <!-- Database ER Diagram -->
      <section class="card">
        <h2>Database Diagram</h2>
        <div class="er-diagram">
          <!-- Config layer -->
          <div class="er-layer">
            <div class="er-label">Configuration (Design-time)</div>
            <div class="er-row">
              <div class="er-table er-primary">
                <div class="er-title"><i class="bi bi-diagram-3"></i> APP_ApprovalWorkflow</div>
                <div class="er-field"><span class="er-key">PK</span> WorkflowId</div>
                <div class="er-field">WorkflowName</div>
                <div class="er-field">EntityTypeId</div>
                <div class="er-field">Status, Description</div>
              </div>
              <div class="er-connector">
                <div class="er-line"></div>
                <span>1 : N</span>
                <div class="er-line"></div>
              </div>
              <div class="er-table">
                <div class="er-title"><i class="bi bi-list-ol"></i> APP_ApprovalWorkflowStep</div>
                <div class="er-field"><span class="er-key">PK</span> StepId</div>
                <div class="er-field"><span class="er-fk">FK</span> WorkflowId</div>
                <div class="er-field">StepOrder, StepName</div>
                <div class="er-field">IsParallel, Conditions</div>
              </div>
            </div>
            <div class="er-sub-row">
              <div class="er-spacer"></div>
              <div class="er-branch">
                <div class="er-branch-line"></div>
                <div class="er-branch-items">
                  <div class="er-table er-small">
                    <div class="er-title"><i class="bi bi-person-check"></i> StepApprover</div>
                    <div class="er-field"><span class="er-fk">FK</span> StepId</div>
                    <div class="er-field">ApproverType, ApproverId</div>
                  </div>
                  <div class="er-table er-small">
                    <div class="er-title"><i class="bi bi-lightning"></i> StepAction</div>
                    <div class="er-field"><span class="er-fk">FK</span> StepId</div>
                    <div class="er-field">ActionType, Payload</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Runtime layer -->
          <div class="er-layer">
            <div class="er-label">Runtime (Execution)</div>
            <div class="er-row">
              <div class="er-table er-runtime">
                <div class="er-title"><i class="bi bi-file-earmark-text"></i> APP_ApprovalRequest</div>
                <div class="er-field"><span class="er-key">PK</span> RequestId</div>
                <div class="er-field"><span class="er-fk">FK</span> WorkflowId</div>
                <div class="er-field">EntryId, Status</div>
                <div class="er-field">CurrentStep, RequestedBy</div>
              </div>
              <div class="er-connector">
                <div class="er-line"></div>
                <span>1 : N</span>
                <div class="er-line"></div>
              </div>
              <div class="er-table er-small">
                <div class="er-title"><i class="bi bi-journal-text"></i> APP_ApprovalRequestLog</div>
                <div class="er-field"><span class="er-fk">FK</span> RequestId</div>
                <div class="er-field">Action, ActionBy</div>
                <div class="er-field">Comment, Timestamp</div>
              </div>
            </div>
            <div class="er-row" style="margin-top: 10px;">
              <div class="er-table er-small">
                <div class="er-title"><i class="bi bi-folder2"></i> APP_ApprovalCase</div>
                <div class="er-field"><span class="er-fk">FK</span> RequestId</div>
                <div class="er-field">EntityCode, EntryId</div>
                <div class="er-field">CaseTitle</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Database Tables -->
      <section class="card">
        <h2>Database Tables</h2>
        <table>
          <thead><tr><th>Table</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>APP_ApprovalWorkflow</code></td><td>Master workflow definition linked to an entity code</td></tr>
            <tr><td><code>APP_ApprovalWorkflowStep</code></td><td>Individual steps within a workflow (order, type, conditions)</td></tr>
            <tr><td><code>APP_ApprovalWorkflowStepApprover</code></td><td>Approvers assigned to each step (user, role, or dynamic)</td></tr>
            <tr><td><code>APP_ApprovalWorkflowStepAction</code></td><td>Configurable actions per step (approve, reject, reassign, etc.)</td></tr>
            <tr><td><code>APP_ApprovalRequest</code></td><td>Runtime approval request tied to a specific entity entry</td></tr>
            <tr><td><code>APP_ApprovalRequestLog</code></td><td>Audit log of every action taken on a request</td></tr>
            <tr><td><code>APP_ApprovalCase</code></td><td>Groups related requests under a single case with a title</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Status Values -->
      <section class="card">
        <h2>Status Values</h2>
        <table>
          <thead><tr><th>Status</th><th>Code</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><span style="color:#f9a825;">&#9679;</span> Pending</td><td>0</td><td>Request created, waiting for first approver</td></tr>
            <tr><td><span style="color:#1976d2;">&#9679;</span> In Progress</td><td>1</td><td>At least one step has been actioned, awaiting further steps</td></tr>
            <tr><td><span style="color:#43a047;">&#9679;</span> Approved</td><td>2</td><td>All steps completed successfully</td></tr>
            <tr><td><span style="color:#e53935;">&#9679;</span> Rejected</td><td>3</td><td>Rejected at any step; can be resubmitted</td></tr>
            <tr><td><span style="color:#1976d2;">&#9679;</span> Completed</td><td>4</td><td>Post-approval actions finished (e.g. record unlocked)</td></tr>
          </tbody>
        </table>
      </section>

      <!-- API Endpoints -->
      <section class="card">
        <h2>API Endpoints</h2>
        <p>Base URL: <code>/ApprovalRequestApi</code></p>
        <table>
          <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>GET</code></td><td><code>/GetAll</code></td><td>List all approval requests for the current tenant</td></tr>
            <tr><td><code>POST</code></td><td><code>/CreateNewRequest</code></td><td>Submit a new approval request for an entity entry</td></tr>
            <tr><td><code>GET</code></td><td><code>/GetWorkflowSummary/&#123;id&#125;</code></td><td>Get workflow details with all steps and current status</td></tr>
            <tr><td><code>GET</code></td><td><code>/GetWorkflowsByEntity/&#123;code&#125;</code></td><td>List all workflows configured for an entity code</td></tr>
            <tr><td><code>GET</code></td><td><code>/GetApprovalStatus/&#123;code&#125;/&#123;entryId&#125;</code></td><td>Check current approval status for a specific entry</td></tr>
            <tr><td><code>GET</code></td><td><code>/GetRequestHistory/&#123;code&#125;/&#123;entryId&#125;</code></td><td>Full audit history for an entry's approval requests</td></tr>
            <tr><td><code>GET</code></td><td><code>/GetRequestDetails/&#123;id&#125;</code></td><td>Detailed view of a single approval request</td></tr>
            <tr><td><code>POST</code></td><td><code>/ProcessApprovalAction</code></td><td>Approve, reject, or reassign a pending step</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Frontend Integration -->
      <section class="card">
        <h2>Frontend Integration</h2>
        <p>Use the <code>ApprovalRequestButtonComponent</code> to add approval functionality to any entity detail page.</p>

        <h3>Component Inputs &amp; Outputs</h3>
        <pre><code>// Inputs
&#64;Input() entityCode: string;      // Entity code (e.g. 'LEAVE_REQUEST')
&#64;Input() entityId: number;         // Primary key of the entry
&#64;Input() entityTitle: string;      // Display name (e.g. 'Leave Request')
&#64;Input() caseTitle: string;        // Case title for the approval

// Outputs
&#64;Output() disableActionsChange = new EventEmitter&lt;boolean&gt;();
&#64;Output() requestCaseTitleUpdate = new EventEmitter&lt;string&gt;();</code></pre>

        <h3>HTML Template Example</h3>
        <pre><code>&lt;app-approval-request-button
  [entityCode]="'LEAVE_REQUEST'"
  [entityId]="selectedRecord.id"
  [entityTitle]="'Leave Request'"
  [caseTitle]="selectedRecord.employeeName + ' - ' + selectedRecord.leaveType"
  (disableActionsChange)="onDisableActions($event)"
  (requestCaseTitleUpdate)="onCaseTitleUpdate($event)"&gt;
&lt;/app-approval-request-button&gt;</code></pre>

        <h3>Event Handlers</h3>
        <pre><code>onDisableActions(disabled: boolean): void &#123;
  this.isLocked = disabled;
  // Disable form fields when approval is in progress
&#125;

onCaseTitleUpdate(title: string): void &#123;
  this.currentCaseTitle = title;
&#125;</code></pre>
      </section>

      <!-- UI Components -->
      <section class="card">
        <h2>UI Components</h2>
        <table>
          <thead><tr><th>Component</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>ApprovalRequestButtonComponent</code></td><td>Embeddable button that shows current status and triggers approval actions</td></tr>
            <tr><td><code>ApprovalRequestModalComponent</code></td><td>Modal dialog for submitting a new approval request with comments</td></tr>
            <tr><td><code>ApprovalHistoryModalComponent</code></td><td>Modal showing full approval history timeline for an entry</td></tr>
            <tr><td><code>ApprovalRequestListComponent</code></td><td>Listing page for all pending/completed approval requests</td></tr>
            <tr><td><code>ApprovalPolicyDetailComponent</code></td><td>Admin page for configuring workflow steps, approvers, and actions</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Backend Files -->
      <section class="card">
        <h2>Backend Files</h2>
        <table>
          <thead><tr><th>File</th><th>Path</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>ApprovalRequestController.cs</code></td><td><code>SmartHR_API/Controllers/</code></td><td>API endpoints for approval requests and actions</td></tr>
            <tr><td><code>ApprovalWorkflowController.cs</code></td><td><code>SmartHR_API/Controllers/</code></td><td>CRUD for workflow definitions</td></tr>
            <tr><td><code>ApprovalWorkflowStepController.cs</code></td><td><code>SmartHR_API/Controllers/</code></td><td>CRUD for workflow steps</td></tr>
            <tr><td><code>ApprovalRequest.cs</code></td><td><code>SmartHR_API/Models/</code></td><td>Entity model for approval requests</td></tr>
            <tr><td><code>ApprovalWorkflow.cs</code></td><td><code>SmartHR_API/Models/</code></td><td>Entity model for workflow definitions</td></tr>
            <tr><td><code>ApprovalWorkflowStep.cs</code></td><td><code>SmartHR_API/Models/</code></td><td>Entity model for workflow steps</td></tr>
            <tr><td><code>ApprovalWorkflowStepApprover.cs</code></td><td><code>SmartHR_API/Models/</code></td><td>Entity model for step approvers</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Integration Checklist -->
      <section class="card">
        <h2>Integration Checklist</h2>
        <table>
          <thead><tr><th>#</th><th>Task</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Create workflow</td><td>Define an approval workflow for your entity code in the admin panel</td></tr>
            <tr><td>2</td><td>Define steps</td><td>Add sequential or parallel steps with ordering and conditions</td></tr>
            <tr><td>3</td><td>Assign approvers</td><td>Configure approvers for each step (users, roles, or reporting lines)</td></tr>
            <tr><td>4</td><td>Configure actions</td><td>Set available actions per step (approve, reject, reassign)</td></tr>
            <tr><td>5</td><td>Add button component</td><td>Embed <code>ApprovalRequestButtonComponent</code> in your detail page</td></tr>
            <tr><td>6</td><td>Handle events</td><td>Listen to <code>disableActionsChange</code> and <code>requestCaseTitleUpdate</code> outputs</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Related -->
      <section class="card">
        <h2>Related Documentation</h2>
        <a routerLink="/common-features/dynamic-procedure" style="display:flex;align-items:center;gap:14px;padding:16px 18px;border-radius:10px;background:#f8f9fc;text-decoration:none;color:inherit;transition:background 0.2s;">
          <i class="bi bi-gear-wide-connected" style="font-size:24px;color:#6c8cff;"></i>
          <div>
            <strong style="font-size:14px;display:block;margin-bottom:2px;">Dynamic Procedure Execution</strong>
            <small style="font-size:12px;color:#888;">Custom stored procedures that execute on approval actions (Approved/Rejected)</small>
          </div>
          <i class="bi bi-chevron-right" style="color:#ccc;margin-left:auto;"></i>
        </a>
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

    /* Workflow Process Diagram */
    .diagram { padding: 8px 0; }
    .diagram-row {
      display: flex; align-items: center; gap: 10px;
      flex-wrap: wrap; justify-content: center;
    }
    .diagram-row-end { justify-content: center; }
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
    .node-approved { background: #43a047; color: #fff; }
    .node-rejected { background: #e53935; color: #fff; }
    .diagram-arrow { color: #bbb; font-size: 18px; }
    .diagram-down { text-align: center; color: #bbb; font-size: 20px; padding: 6px 0; }
    .diagram-or { font-size: 13px; color: #999; font-weight: 500; padding: 0 6px; }
    .diagram-legend {
      display: flex; gap: 18px; justify-content: center; margin-top: 16px;
      font-size: 12px; color: #666;
    }
    .legend-dot {
      display: inline-block; width: 10px; height: 10px; border-radius: 50%;
      margin-right: 5px; vertical-align: middle;
    }

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
    .er-sub-row { display: flex; gap: 12px; margin-top: 10px; }
    .er-spacer { width: 200px; flex-shrink: 0; }
    .er-table {
      background: #fff; border-radius: 10px; border: 2px solid #e0e4ec;
      overflow: hidden; min-width: 200px; flex-shrink: 0;
    }
    .er-table.er-primary { border-color: #6c8cff; }
    .er-table.er-runtime { border-color: #43a047; }
    .er-table.er-small { min-width: 170px; }
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
    .er-branch { flex: 1; }
    .er-branch-line { width: 2px; height: 14px; background: #ccc; margin-left: 100px; }
    .er-branch-items { display: flex; gap: 12px; }

    @media (max-width: 768px) {
      .diagram-row { flex-direction: column; gap: 0; }
      .diagram-arrow { transform: rotate(90deg); }
      .er-row { flex-direction: column; }
      .er-sub-row { flex-direction: column; }
      .er-spacer { display: none; }
      .er-connector { flex-direction: column; }
      .er-line { width: 2px; height: 16px; }
    }
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
  `]
})
export class ApprovalWorkflowComponent {}
