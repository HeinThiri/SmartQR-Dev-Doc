import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dynamic-procedure',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/common-features/approval-workflow" class="back-link">
        <i class="bi bi-arrow-left"></i> Approval Workflow
      </a>
      <h1>Dynamic Procedure Execution for Approval Actions</h1>
      <p class="subtitle">Create custom stored procedures that execute automatically when approval actions (Approved/Rejected) are processed with ActionLogicType = 'Do Next Procedure'.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>This feature allows you to create custom stored procedures that execute automatically when approval actions (Approved/Rejected) are processed, but only when the action has <code>ActionLogicType = 'Do Next Procedure'</code>.</p>
      </section>

      <!-- How It Works -->
      <section class="card">
        <h2>How It Works</h2>

        <h3>1. Generate a Procedure</h3>
        <p>In the Approval Policy configuration, when you create a step action with:</p>
        <ul>
          <li><strong>ActionType</strong>: <code>Approved</code> or <code>Rejected</code></li>
          <li><strong>ActionLogicType</strong>: <code>Do Next Procedure</code></li>
        </ul>
        <p>You can click the <strong>Generate Procedure</strong> button to create a new stored procedure with the naming pattern:</p>
        <pre><code>xxx_APP_ProcessAction_A000001
xxx_APP_ProcessAction_A000002
...</code></pre>

        <h3>2. Procedure Template</h3>
        <p>Each generated procedure has this signature:</p>
        <pre><code>CREATE PROCEDURE [dbo].[xxx_APP_ProcessAction_A000001]
    &#64;ActionType NVARCHAR(50),      -- 'Approved' or 'Rejected'
    &#64;LogID NVARCHAR(100),           -- The approval log ID
    &#64;ActionBy NVARCHAR(100),        -- The approver's user ID
    &#64;PassData NVARCHAR(MAX)         -- Custom data (currently NULL, can be extended)
AS
BEGIN
    SET NOCOUNT ON;

    -- TODO: Implement your custom logic here

END</code></pre>

        <h3>3. Automatic Execution</h3>
        <p>When an approver clicks "Approve" or "Reject", the main approval procedure (<code>APP_ProcessApprovalAction</code>) will:</p>
        <ol>
          <li>Update the approval status</li>
          <li>Check if the current step has any actions with <code>ActionLogicType = 'Do Next Procedure'</code></li>
          <li>If found, execute the procedure stored in <code>ActionPayload</code> with these parameters:
            <ul>
              <li><code>&#64;ActionType</code> = The action taken ('Approved' or 'Rejected')</li>
              <li><code>&#64;LogID</code> = The approval request log ID</li>
              <li><code>&#64;ActionBy</code> = The approver's user ID</li>
              <li><code>&#64;PassData</code> = NULL (reserved for future use)</li>
            </ul>
          </li>
        </ol>
      </section>

      <!-- Flow Diagram -->
      <section class="card">
        <h2>Execution Flow</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-person-check"></i> Approver Clicks<small>Approve / Reject</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-database"></i> APP_ProcessApprovalAction<small>Updates approval status</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-search"></i> Check ActionLogicType<small>'Do Next Procedure'</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-check2-circle"></i> Found?</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-play-circle"></i> Execute ActionPayload<small>sp_executesql</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check-lg"></i> Custom Logic Runs</div>
          </div>
        </div>
      </section>

      <!-- Example Use Cases -->
      <section class="card">
        <h2>Example Use Cases</h2>

        <h3>Example 1: Send Notification After Approval</h3>
        <pre><code>ALTER PROCEDURE [dbo].[xxx_APP_ProcessAction_A000001]
    &#64;ActionType NVARCHAR(50),
    &#64;LogID NVARCHAR(100),
    &#64;ActionBy NVARCHAR(100),
    &#64;PassData NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Get request details
    DECLARE &#64;RequestID NVARCHAR(50);
    SELECT &#64;RequestID = RequestID
    FROM APP_ApprovalRequestLog WHERE LogID = &#64;LogID;

    -- Send notification
    INSERT INTO SysNotiEmail (EmailTo, Subject, Body, CreatedOn)
    VALUES ('admin&#64;company.com',
            'Approval Action: ' + &#64;ActionType,
            'Request ' + &#64;RequestID + ' was ' + &#64;ActionType + ' by ' + &#64;ActionBy,
            GETDATE());
END</code></pre>

        <h3>Example 2: Update Related Records After Rejection</h3>
        <pre><code>ALTER PROCEDURE [dbo].[xxx_APP_ProcessAction_A000002]
    &#64;ActionType NVARCHAR(50),
    &#64;LogID NVARCHAR(100),
    &#64;ActionBy NVARCHAR(100),
    &#64;PassData NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    IF &#64;ActionType = 'Rejected'
    BEGIN
        DECLARE &#64;RequestID NVARCHAR(50);
        DECLARE &#64;EntityID NVARCHAR(50);

        SELECT &#64;RequestID = L.RequestID, &#64;EntityID = R.EntityID
        FROM APP_ApprovalRequestLog L
        JOIN APP_ApprovalRequest R ON L.RequestID = R.RequestID
        WHERE L.LogID = &#64;LogID;

        UPDATE YourCustomTable
        SET Status = 'Rejected',
            RejectedBy = &#64;ActionBy,
            RejectedOn = GETDATE()
        WHERE EntityID = &#64;EntityID;
    END
END</code></pre>
      </section>

      <!-- Changes to APP_ProcessApprovalAction -->
      <section class="card">
        <h2>Changes to APP_ProcessApprovalAction</h2>

        <h3>Before (Old Code)</h3>
        <pre><code>-- Only checked ActionType and Active
select &#64;StepApprovedQuery=sa.ActionPayload
from APP_WorkflowStepAction as SA
where Stepid=&#64;CurrentStepID
and ActionType=&#64;Action
and Sa.Active=1

-- Passed wrong parameters
EXEC sp_executesql &#64;StepApprovedQuery,
    N'&#64;ApproverUserID Nvarchar(50), &#64;CurrentStepID nvarchar(50)',
    &#64;CurrentStepID = &#64;CurrentStepID,
    &#64;ApproverUserID=&#64;ApproverUserID;</code></pre>

        <h3>After (New Code)</h3>
        <pre><code>-- Now checks ActionLogicType = 'Do Next Procedure'
SELECT &#64;StepApprovedQuery = SA.ActionPayload
FROM APP_WorkflowStepAction AS SA
WHERE SA.StepID = &#64;CurrentStepID
    AND SA.ActionType = &#64;Action
    AND SA.ActionLogicType = 'Do Next Procedure'  -- NEW
    AND SA.Active = 1
    AND SA.ActionPayload IS NOT NULL
    AND SA.ActionPayload != '';

-- Passes correct parameters matching the generated procedure signature
EXEC sp_executesql &#64;StepApprovedQuery,
    N'&#64;ActionType NVARCHAR(50), &#64;LogID NVARCHAR(100), &#64;ActionBy NVARCHAR(100), &#64;PassData NVARCHAR(MAX)',
    &#64;ActionType = &#64;Action,
    &#64;LogID = &#64;LogIDToUpdate,
    &#64;ActionBy = &#64;ApproverUserID,
    &#64;PassData = NULL;</code></pre>
      </section>

      <!-- Key Changes -->
      <section class="card">
        <h2>Key Changes</h2>
        <ol>
          <li>Added <code>ActionLogicType = 'Do Next Procedure'</code> filter</li>
          <li>Changed parameters from <code>&#64;CurrentStepID</code>, <code>&#64;ApproverUserID</code> to <code>&#64;ActionType</code>, <code>&#64;LogID</code>, <code>&#64;ActionBy</code>, <code>&#64;PassData</code></li>
          <li>Added NULL checks for <code>ActionPayload</code></li>
          <li>Applied to both Approved and Rejected action sections</li>
        </ol>
      </section>

      <!-- Automatic Cleanup -->
      <section class="card">
        <h2>Automatic Cleanup</h2>
        <p>When you:</p>
        <ul>
          <li><strong>Delete an action</strong> with <code>ActionLogicType = 'Do Next Procedure'</code></li>
          <li><strong>Change ActionLogicType</strong> from "Do Next Procedure" to something else</li>
        </ul>
        <p>The system automatically drops the associated stored procedure from the database.</p>
      </section>

      <!-- Database Migration Files -->
      <section class="card">
        <h2>Database Migration Files</h2>
        <ol>
          <li><code>Add_APP_ProcessAction_RunningNo.sql</code> &mdash; Adds SysRunningNo configuration</li>
          <li><code>Update_APP_ProcessApprovalAction_For_DynamicProcedures.sql</code> &mdash; Updates the main approval procedure</li>
        </ol>
      </section>

      <!-- Testing -->
      <section class="card">
        <h2>Testing</h2>
        <ol>
          <li>Create an approval policy with a step action</li>
          <li>Set ActionType to "Approved" and ActionLogicType to "Do Next Procedure"</li>
          <li>Click "Generate Procedure" button</li>
          <li>Edit the generated procedure in SQL Server to add your custom logic</li>
          <li>Test by approving/rejecting a request through the approval workflow</li>
        </ol>
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
      .diagram-row { flex-direction: column; gap: 0; }
      .diagram-arrow { transform: rotate(90deg); }
    }
  `]
})
export class DynamicProcedureComponent {}
