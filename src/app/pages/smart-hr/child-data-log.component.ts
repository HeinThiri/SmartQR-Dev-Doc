import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-child-data-log',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-hr" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart HR
      </a>
      <h1>Child Data Log</h1>
      <p class="subtitle">Records all create, update, and delete operations performed on an employee's child information (HrStaffChildInfo) in the Employee Profile page, with full audit trail via SysLog / SysLogItem.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Data Model -->
      <section class="card">
        <h2>Data Model</h2>

        <h3>Table: HrStaffChildInfo</h3>
        <div class="er-diagram">
          <div class="er-table">
            <div class="er-header">HrStaffChildInfo</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> ChildId <span>string (GUID)</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> StaffId <span>string — linked employee</span></div>
            <div class="er-row">Serial <span>int — row order number</span></div>
            <div class="er-row">ChildName <span>string — full name of the child</span></div>
            <div class="er-row">BirthDate <span>DateTime? — date of birth</span></div>
            <div class="er-row">Active <span>bool — soft-delete flag (false = deleted)</span></div>
            <div class="er-row">CreatedBy <span>string — user ID who created the record</span></div>
            <div class="er-row">CreatedOn <span>DateTime — creation timestamp</span></div>
            <div class="er-row">ModifiedBy <span>string — user ID of last modifier</span></div>
            <div class="er-row">ModifiedOn <span>DateTime? — last modification timestamp</span></div>
            <div class="er-row">LastAction <span>string — GUID refreshed on every save (triggers log comparison)</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> LicenseId <span>string — tenant/license identifier</span></div>
          </div>
        </div>
        <p><strong>View: HrStaffChildInfoView</strong> — same as above plus resolved UserName fields (used for read/display).</p>
      </section>

      <!-- Backend -->
      <section class="card">
        <h2>Backend</h2>
        <p><strong>File:</strong> <code>SmartHR_API/Infrastructure/Repository/Employee_Module/EmployeeInfoController.cs</code></p>
      </section>

      <!-- Save Child Info -->
      <section class="card">
        <h2>Save Child Info (Create / Update)</h2>
        <p><strong>Method:</strong> <code>SaveChildInfo(string staffId, ChildInfo requestData, DateTime localDateTime)</code></p>

        <h3>Logic Flow</h3>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-search"></i> Lookup by ChildId<small>where Active = true</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-question-circle"></i> Record Found?</div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-plus-circle"></i> Not Found: Create New<small>Fresh GUID ChildId, set CreatedOn,<br>CreatedBy, Active = true</small></div>
            <div class="diagram-arrow">/</div>
            <div class="diagram-node node-pending"><i class="bi bi-pencil"></i> Found: Update In-Place<small>Modify existing record</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-input-cursor-text"></i> Set Fields<small>ChildName, BirthDate, Serial,<br>ModifiedOn, ModifiedBy, LastAction</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-journal-text"></i> writeLog()<small>Detects and logs only changed fields<br>(or all fields for new records)</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-save"></i> SaveChanges()</div>
          </div>
        </div>

        <h3>Log Entry Written by writeLog()</h3>
        <pre><code>RecordType : HrStaffChildInfo
RecordID   : StaffId (parent employee)
Source     : EmployeeInfo (ControllerLogLabel)
Fields logged (new record) : all non-null fields
Fields logged (update)     : only changed fields
Ignored fields             : LastAction, ModifiedOn</code></pre>
      </section>

      <!-- Delete Child Info -->
      <section class="card">
        <h2>Delete Child Info (Soft Delete)</h2>
        <p><strong>Method:</strong> <code>DeleteChildInfo(RemoveChildInfo request)</code></p>

        <h3>Logic Flow</h3>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-clock"></i> Validate UTC<small>Client local date/time accuracy</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-shield-check"></i> Check Permission<small>permission_EmployeeInfo → delete</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-search"></i> Fetch Record<small>By ChildId where Active = true</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-pending"><i class="bi bi-card-text"></i> Capture Summary<small>"&#123;ChildName&#125; | Birth Date: &#123;dd/MM/yyyy&#125;"<br>or "N/A" if no birth date</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-danger"><i class="bi bi-trash"></i> Soft Delete<small>Active = false, set ModifiedBy,<br>ModifiedOn, LastAction</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-save"></i> SaveChangesAsync()</div>
          </div>
        </div>

        <h3>Log Entry Written by writeLogSinglePoint()</h3>
        <pre><code>RecordType : HrStaffChildInfo
RecordID   : StaffId (parent employee)
Source     : EmployeeInfo
Field      : Child Name
Old Value  : "&#123;ChildName&#125; | Birth Date: &#123;dd/MM/yyyy&#125;"
New Value  : "(Deleted)"</code></pre>
      </section>

      <!-- Frontend -->
      <section class="card">
        <h2>Frontend</h2>
        <p><strong>File:</strong> <code>SmartHR_UI/src/app/pages/systematic/modules/employee-module/employee-info/employeeinfo-detail/employeeinfo-detail.component.ts</code></p>

        <h3>Form Structure</h3>
        <p>Child data is stored as a <code>FormArray</code> named <code>childInfoList</code> inside <code>employeeinfoForm</code>.</p>
        <p>Each child entry is a <code>FormGroup</code> with:</p>
        <table>
          <thead><tr><th>Control</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>childId</code></td><td>Record ID (empty for new)</td></tr>
            <tr><td><code>staffId</code></td><td>Parent employee ID</td></tr>
            <tr><td><code>childName</code></td><td>Child's name</td></tr>
            <tr><td><code>birthDate</code></td><td>Date of birth</td></tr>
            <tr><td><code>Serial</code></td><td>Row order</td></tr>
          </tbody>
        </table>

        <h3>Key Methods</h3>
        <table>
          <thead><tr><th>Method</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>getChildInfoList(childInfo[])</code></td><td>Populates the childInfoList FormArray from the API response on load</td></tr>
            <tr><td><code>createChildInfoGroup()</code></td><td>Adds a new empty child row; validates that the last row is not empty before adding</td></tr>
            <tr><td><code>removeChildInfo(index)</code></td><td>If the row has no saved childId, removes it locally. Otherwise calls apiService.removeChild() which calls DeleteChildInfo on the backend</td></tr>
            <tr><td><code>isChildInfoChanged(current, initial)</code></td><td>Compares JSON stringified current vs initial values to detect changes</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Save Flow -->
      <section class="card">
        <h2>Save Flow (on Form Submit)</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-ui-checks"></i> Form Submit<small>requestData.childInfoList<br>populated from FormArray</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-calendar"></i> Format Dates<small>formatBirthYear() on each entry</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-funnel"></i> Filter Changed<small>isChildInfoChanged() vs<br>initialChildInfo snapshot</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-cloud-upload"></i> API Call<small>SaveChildInfo() for each entry</small></div>
          </div>
        </div>

        <h3>On New Employee Creation</h3>
        <p>After the main employee record is saved and the new <code>StaffId</code> is returned, pending <code>childInfoList</code> entries are re-mapped with the new StaffId before being submitted.</p>
      </section>

      <!-- Log Behaviour Summary -->
      <section class="card">
        <h2>Log Behaviour Summary</h2>
        <table>
          <thead><tr><th>Action</th><th>Log Method</th><th>Field(s) Logged</th><th>Old Value</th><th>New Value</th></tr></thead>
          <tbody>
            <tr><td><strong>Create</strong></td><td><code>writeLog()</code></td><td>All non-null fields (ChildName, BirthDate, Serial, StaffId, etc.)</td><td><em>(empty)</em></td><td>actual values</td></tr>
            <tr><td><strong>Update</strong></td><td><code>writeLog()</code></td><td>Only fields that changed</td><td>previous value</td><td>new value</td></tr>
            <tr><td><strong>Delete</strong></td><td><code>writeLogSinglePoint()</code></td><td>Child Name</td><td>"&#123;Name&#125; | Birth Date: &#123;date&#125;"</td><td>(Deleted)</td></tr>
          </tbody>
        </table>
        <p>Logs are viewable via the <strong>Log Note</strong> link in the Employee Profile detail form, filtered to the parent employee's StaffId as the recordId.</p>
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

    /* ER Diagram */
    .er-diagram { margin: 0 0 14px; }
    .er-table {
      border: 2px solid #e0e4ec; border-radius: 10px; overflow: hidden;
      max-width: 520px;
    }
    .er-header {
      background: #6c8cff; color: #fff; padding: 10px 16px;
      font-weight: 700; font-size: 15px;
    }
    .er-row {
      padding: 7px 16px; font-size: 13px; color: #444;
      border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 8px;
    }
    .er-row span { color: #888; font-size: 12px; margin-left: auto; }
    .er-row.pk { background: #fffbeb; }
    .er-row.fk { background: #f5f0ff; }
    .badge-pk {
      background: #f9a825; color: #fff; font-size: 10px; font-weight: 700;
      padding: 2px 6px; border-radius: 4px;
    }
    .badge-fk {
      background: #7c4dff; color: #fff; font-size: 10px; font-weight: 700;
      padding: 2px 6px; border-radius: 4px;
    }
    .er-relation { font-size: 13px; color: #888; margin: 10px 0; }
    .er-line { color: #bbb; }

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
export class ChildDataLogComponent {}
