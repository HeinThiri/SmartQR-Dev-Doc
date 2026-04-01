import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-workspace',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-hr" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart HR
      </a>
      <h1>My Workspace - My Profile Module</h1>
      <p class="subtitle">Personalized employee dashboard showing profile information, approval requests, leave balances, and quick action shortcuts.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>The My Workspace module provides employees with a personalized dashboard showing their profile information, approval requests, leave balances, and quick action shortcuts.</p>
        <ul>
          <li><strong>Module</strong>: MyWorkspace Module</li>
          <li><strong>Page</strong>: My Profile</li>
          <li><strong>Route</strong>: <code>/myworkspace-module/my-profile</code></li>
          <li><strong>Permission Code</strong>: <code>PGM-MyWorkspace</code></li>
        </ul>
      </section>

      <!-- Page Layout -->
      <section class="card">
        <h2>Page Layout</h2>

        <h3>Row 1: Profile and Approvals (3 sections)</h3>

        <h4>1. My Info Panel (6 columns)</h4>
        <ul>
          <li>Staff photo with online status indicator</li>
          <li>Left column (5 cols): Profile photo, name, position, employee ID</li>
          <li>Right column (7 cols): Department, email, phone, join date, manager, location</li>
          <li>Two-column internal layout</li>
        </ul>

        <h4>2. My Request Cases (3 columns)</h4>
        <ul>
          <li>Lists user's own approval requests</li>
          <li>Shows pending requests and recently completed (last 7 days)</li>
          <li>Displays: workflow name, case title, current state, status, dates</li>
          <li>Scrollable list with max-height: 300px</li>
        </ul>

        <h4>3. Pending Approvals (3 columns)</h4>
        <ul>
          <li>Lists requests awaiting user's approval action</li>
          <li>Shows: workflow name, case title, requester name, timestamp</li>
          <li>Approve/Reject action buttons</li>
          <li>Scrollable list with max-height: 300px</li>
        </ul>

        <h3>Row 2: Monthly Overview (4 boxes)</h3>
        <ol>
          <li><strong>Leave Records Box</strong> &mdash; Shows leave dates, leave type, duration (from HR_DailyLeaveView)</li>
          <li><strong>Fine Box</strong> &mdash; Shows fine date and amount (no $ sign, no comma separator, Note = "N/A" if null, no status badge; from HR_FineView)</li>
          <li><strong>Attendance Rate Box</strong> &mdash; Coming Soon (placeholder, opacity 50%)</li>
          <li><strong>Overtime Hours Box</strong> &mdash; Coming Soon (placeholder, opacity 50%)</li>
        </ol>
        <p><strong>Month Selector:</strong> Shows actual month name (e.g., "January", "February") instead of "This Month".</p>

        <h3>Row 3: Yearly Leave Balance</h3>
        <ul>
          <li>Horizontal scrollable card layout</li>
          <li>Each card fixed width: 280px</li>
          <li>Progress bar with darker background (#e0e0e0) and border (1px solid #bdbdbd)</li>
          <li>Shows: Leave type, total, used, remaining</li>
          <li>Data from HrLeaveBalanceYearlyView</li>
          <li><strong>No Data Indicator:</strong> Shows inbox icon with "No Leave Balance Data" message when empty</li>
        </ul>

        <h3>Row 4: Quick Actions - Coming Soon</h3>
        <ul>
          <li>Request Leave, Submit Expense, OT Request, View Payslip, IT Support, Learning</li>
          <li>All buttons disabled with opacity 50%</li>
          <li>"Coming Soon" badge overlay</li>
        </ul>
      </section>

      <!-- Flow Diagram -->
      <section class="card">
        <h2>Data Loading Flow</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-play-circle"></i> ngOnInit()</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-person"></i> Load Staff Info</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-file-earmark-text"></i> Load Approvals<small>Requests + Pending</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-pending"><i class="bi bi-calendar-month"></i> Load Monthly Data<small>Leave + Fine</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-bar-chart"></i> Load Leave Balance<small>Yearly view</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check-lg"></i> Dashboard Ready</div>
          </div>
        </div>
      </section>

      <!-- Backend: Database Views -->
      <section class="card">
        <h2>Database Views Used</h2>
        <table>
          <thead><tr><th>#</th><th>View</th><th>Purpose</th><th>Key Fields</th></tr></thead>
          <tbody>
            <tr><td>1</td><td><code>HrStaffView</code></td><td>Staff personal info</td><td>StaffId, EmployeeId, FullName, PositionName, DepartmentName, Email, PhoneNo, JoinedDate, LocationName</td></tr>
            <tr><td>2</td><td><code>HrStaffApprovalPersonView</code></td><td>Staff's manager</td><td>StaffId, ApprovalStaffName, LicenseId, Active</td></tr>
            <tr><td>3</td><td><code>SysAttachment</code></td><td>Profile photo</td><td>ReferenceId = StaffId, Sector = "Profile", AttachUrl</td></tr>
            <tr><td>4</td><td><code>APP_ApprovalRequestView</code></td><td>User's own requests</td><td>RequestId, CaseTitle, CurrentState, Status, WorkflowName</td></tr>
            <tr><td>5</td><td><code>APP_ApprovalRequestLogView</code></td><td>Pending approvals</td><td>RequestId, ApproverUserId, Action, StepName</td></tr>
            <tr><td>6</td><td><code>HR_DailyLeaveView</code></td><td>Monthly leave records</td><td>LeaveDate, LeaveName, DurationType</td></tr>
            <tr><td>7</td><td><code>HR_FineView</code></td><td>Monthly fine records</td><td>FineDate, FineAmount, Note, Status</td></tr>
            <tr><td>8</td><td><code>HrLeaveBalanceYearlyView</code></td><td>Yearly leave balance</td><td>LeaveTypeId, LeaveName, Available, Used, Remain</td></tr>
          </tbody>
        </table>
      </section>

      <!-- API Endpoints -->
      <section class="card">
        <h2>API Endpoints</h2>
        <p>All endpoints are in <code>MyWorkspaceApi.cs</code> under route <code>[controller]</code>.</p>
        <table>
          <thead><tr><th>Method</th><th>Endpoint</th><th>Returns</th></tr></thead>
          <tbody>
            <tr><td>GET</td><td><code>/MyWorkspaceApi/GetStaffPersonalInfo</code></td><td>StaffPersonalInfoDTO</td></tr>
            <tr><td>GET</td><td><code>/MyWorkspaceApi/GetMyApprovalRequests</code></td><td>List&lt;UserRequestDTO&gt;</td></tr>
            <tr><td>GET</td><td><code>/MyWorkspaceApi/GetMyPendingApprovals</code></td><td>List&lt;PendingApprovalDTO&gt;</td></tr>
            <tr><td>GET</td><td><code>/MyWorkspaceApi/GetMyLeaveByMonth?year=&amp;month=</code></td><td>List&lt;LeaveRecordDTO&gt;</td></tr>
            <tr><td>GET</td><td><code>/MyWorkspaceApi/GetMyFineByMonth?year=&amp;month=</code></td><td>List&lt;FineRecordDTO&gt;</td></tr>
            <tr><td>GET</td><td><code>/MyWorkspaceApi/GetMyYearlyLeaveBalance?year=</code></td><td>List&lt;YearlyLeaveBalanceDTO&gt;</td></tr>
          </tbody>
        </table>
      </section>

      <!-- DTO Structures -->
      <section class="card">
        <h2>DTO Structures</h2>

        <h3>StaffPersonalInfoDTO</h3>
        <pre><code>public class StaffPersonalInfoDTO
&#123;
    public string StaffId &#123; get; set; &#125;
    public string StaffCode &#123; get; set; &#125;
    public string FullName &#123; get; set; &#125;
    public string PositionName &#123; get; set; &#125;
    public string DepartmentName &#123; get; set; &#125;
    public string Email &#123; get; set; &#125;
    public string PhoneNumber &#123; get; set; &#125;
    public DateTime? JoinDate &#123; get; set; &#125;
    public string ManagerName &#123; get; set; &#125;
    public string LocationName &#123; get; set; &#125;
    public string ProfilePhotoUrl &#123; get; set; &#125;
    public string EmploymentStatus &#123; get; set; &#125;
    public string EmploymentType &#123; get; set; &#125;
&#125;</code></pre>

        <h3>UserRequestDTO</h3>
        <pre><code>public class UserRequestDTO
&#123;
    public string RequestId &#123; get; set; &#125;
    public string CaseTitle &#123; get; set; &#125;
    public string CurrentState &#123; get; set; &#125;
    public string Status &#123; get; set; &#125;
    public DateTime InitiatedAt &#123; get; set; &#125;
    public DateTime? CompletedAt &#123; get; set; &#125;
    public string WorkflowName &#123; get; set; &#125;
    public string CurrentStepName &#123; get; set; &#125;
&#125;</code></pre>

        <h3>PendingApprovalDTO</h3>
        <pre><code>public class PendingApprovalDTO
&#123;
    public string RequestId &#123; get; set; &#125;
    public string CaseTitle &#123; get; set; &#125;
    public DateTime? Timestamp &#123; get; set; &#125;
    public string RequestByName &#123; get; set; &#125;
    public string DepartmentName &#123; get; set; &#125;
    public string PositionName &#123; get; set; &#125;
    public string WorkflowName &#123; get; set; &#125;
    public string StepName &#123; get; set; &#125;
    public string CurrentState &#123; get; set; &#125;
    public string Status &#123; get; set; &#125;
&#125;</code></pre>

        <h3>LeaveRecordDTO / FineRecordDTO / YearlyLeaveBalanceDTO</h3>
        <pre><code>public class LeaveRecordDTO
&#123;
    public DateTime LeaveDate &#123; get; set; &#125;
    public string LeaveName &#123; get; set; &#125;
    public string DurationType &#123; get; set; &#125;
&#125;

public class FineRecordDTO
&#123;
    public DateTime FineDate &#123; get; set; &#125;
    public decimal FineAmount &#123; get; set; &#125;
    public string Note &#123; get; set; &#125;
    public string Status &#123; get; set; &#125;
&#125;

public class YearlyLeaveBalanceDTO
&#123;
    public string LeaveTypeId &#123; get; set; &#125;
    public string LeaveName &#123; get; set; &#125;
    public decimal Available &#123; get; set; &#125;
    public decimal Used &#123; get; set; &#125;
    public decimal Remain &#123; get; set; &#125;
&#125;</code></pre>
      </section>

      <!-- Controller Logic -->
      <section class="card">
        <h2>Controller Logic</h2>
        <p><strong>File:</strong> <code>MyWorkspaceController.cs</code></p>
        <p>All methods follow this pattern:</p>
        <ol>
          <li>Get authorized user from token (userId, licenseId)</li>
          <li>Security check using <code>ProgramAccessChecker.CheckProgramAccess(ProgramCodes.permission_MyWorkspace, ActionCode.read, userId)</code></li>
          <li>Get StaffID from HrStaffView using userId</li>
          <li>Query relevant view with filters</li>
          <li>Map to DTO and return</li>
        </ol>
        <h3>Key Pattern</h3>
        <pre><code>// Get StaffID from current user
var staffId = await _context.HrStaffView
    .Where(s =&gt; s.UserId == requestid &amp;&amp; s.LicenseId == licenseid &amp;&amp; s.Active)
    .Select(s =&gt; s.StaffId)
    .FirstOrDefaultAsync();</code></pre>
      </section>

      <!-- Frontend Implementation -->
      <section class="card">
        <h2>Frontend Implementation</h2>
        <h3>Component Files</h3>
        <ul>
          <li><strong>Component:</strong> <code>my-profile.component.ts</code></li>
          <li><strong>Template:</strong> <code>my-profile.component.html</code></li>
          <li><strong>Styles:</strong> <code>my-profile.component.scss</code></li>
          <li><strong>Service:</strong> <code>my-workspace.service.ts</code></li>
        </ul>

        <h3>Service Methods</h3>
        <pre><code>getStaffPersonalInfo(): Observable&lt;ActionResult&gt;
getMyApprovalRequests(): Observable&lt;ActionResult&gt;
getMyPendingApprovals(): Observable&lt;ActionResult&gt;
getMyLeaveByMonth(year: number, month: number): Observable&lt;ActionResult&gt;
getMyFineByMonth(year: number, month: number): Observable&lt;ActionResult&gt;
getMyYearlyLeaveBalance(year: number): Observable&lt;ActionResult&gt;</code></pre>

        <h3>Data Mapping - Leave Records</h3>
        <pre><code>this.monthlyData.leaves = leaveRecords.map(leave =&gt; (&#123;
  date: new Date(leave.leaveDate).toISOString().split('T')[0],
  type: leave.leaveName,
  days: leave.durationType === 'Full Day' ? 1 : 0.5,
  status: 'Approved'
&#125;));</code></pre>

        <h3>Data Mapping - Fine Records</h3>
        <pre><code>this.monthlyData.fines = fineRecords.map(fine =&gt; (&#123;
  date: new Date(fine.fineDate).toISOString().split('T')[0],
  reason: fine.note,
  amount: fine.fineAmount,
  status: fine.status
&#125;));</code></pre>

        <h3>Data Mapping - Leave Balance</h3>
        <pre><code>const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4'];

this.leaveBalance = leaveBalances.map((balance, index) =&gt; (&#123;
  type: balance.leaveName,
  total: balance.available + balance.used,
  used: balance.used,
  remaining: balance.remain,
  color: colors[index % colors.length]
&#125;));</code></pre>
      </section>

      <!-- UI/UX Features -->
      <section class="card">
        <h2>UI/UX Features</h2>

        <h3>Main Panel Scrolling</h3>
        <p>Style: <code>max-height: calc(100vh - 150px); overflow-y: auto;</code></p>

        <h3>Progress Bar Styling</h3>
        <ul>
          <li><strong>Background:</strong> #e0e0e0 (darker gray for better visibility)</li>
          <li><strong>Border:</strong> 1px solid #bdbdbd</li>
          <li><strong>Height:</strong> 25px</li>
        </ul>

        <h3>Horizontal Scroll for Leave Balance</h3>
        <ul>
          <li><strong>Container:</strong> d-flex gap-3 with overflow-x: auto</li>
          <li><strong>Card Width:</strong> Fixed 280px (min-width and max-width)</li>
          <li><strong>Padding Bottom:</strong> 10px for scrollbar space</li>
        </ul>

        <h3>Coming Soon Indicators</h3>
        <ul>
          <li><strong>Overlay:</strong> position-absolute top-50 start-50 translate-middle</li>
          <li><strong>Badge:</strong> bg-primary fs-5/fs-6 with clock icon</li>
          <li><strong>Content:</strong> Opacity 50% with disabled buttons</li>
        </ul>

        <h3>Fine Display Enhancements</h3>
        <ol>
          <li>No Currency Symbol &mdash; Amount displayed without $ sign</li>
          <li>No Thousand Separator &mdash; No comma in amounts</li>
          <li>Null Handling &mdash; Shows "N/A" when note is null</li>
          <li>No Status Badge &mdash; Removed "Paid" status indicator</li>
        </ol>

        <h3>Monthly Overview Arrangement</h3>
        <p><strong>Order:</strong> Leave &rarr; Fine &rarr; Attendance &rarr; OT</p>

        <h3>Empty State Handling - Leave Balance</h3>
        <ul>
          <li>Large inbox icon (fa-inbox fa-4x)</li>
          <li>Heading: "No Leave Balance Data"</li>
          <li>Message: "No leave balance records found for &#123;year&#125;"</li>
        </ul>
      </section>

      <!-- Security & Permissions -->
      <section class="card">
        <h2>Security &amp; Permissions</h2>
        <ul>
          <li><strong>Permission Code:</strong> <code>PGM-MyWorkspace</code></li>
          <li><strong>Required Action:</strong> <code>read</code></li>
          <li><strong>Check Location:</strong> All controller methods</li>
          <li>Uses <code>AuthorizedUser</code> from JWT token</li>
          <li>Automatically gets <code>userId</code> and <code>licenseId</code> from token</li>
          <li>All queries filtered by current user's context</li>
        </ul>
      </section>

      <!-- Files Modified -->
      <section class="card">
        <h2>Files Modified</h2>

        <h3>Backend Files</h3>
        <table>
          <thead><tr><th>File</th><th>Contents</th></tr></thead>
          <tbody>
            <tr><td><code>MyWorkspaceDTO.cs</code></td><td>StaffPersonalInfoDTO, UserRequestDTO, PendingApprovalDTO, LeaveRecordDTO, FineRecordDTO, YearlyLeaveBalanceDTO</td></tr>
            <tr><td><code>MyWorkspaceController.cs</code></td><td>IMyWorkspaceController interface + implementation with 6 methods</td></tr>
            <tr><td><code>MyWorkspaceApi.cs</code></td><td>6 API endpoints registered</td></tr>
          </tbody>
        </table>

        <h3>Frontend Files</h3>
        <table>
          <thead><tr><th>File</th><th>Contents</th></tr></thead>
          <tbody>
            <tr><td><code>user-request-dto.ts</code></td><td>All frontend DTO interfaces</td></tr>
            <tr><td><code>my-workspace.service.ts</code></td><td>6 service methods</td></tr>
            <tr><td><code>my-profile.component.ts</code></td><td>Component logic, data loading, event handlers</td></tr>
            <tr><td><code>my-profile.component.html</code></td><td>Complete 4-row page template</td></tr>
            <tr><td><code>my-profile.component.scss</code></td><td>Component-specific styles</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Component Lifecycle -->
      <section class="card">
        <h2>Component Lifecycle</h2>
        <h3>ngOnInit()</h3>
        <ol>
          <li>Set page title</li>
          <li>Initialize years array (currentYear - 5 to currentYear + 1)</li>
          <li>Update selected month name</li>
          <li>Load staff personal info</li>
          <li>Load approval requests</li>
          <li>Load pending approvals</li>
          <li>Load monthly leave records</li>
          <li>Load monthly fine records</li>
          <li>Load yearly leave balance</li>
          <li>Prepare attendance chart (placeholder)</li>
        </ol>
        <h3>onMonthChange()</h3>
        <ul>
          <li>Updates selected month name</li>
          <li>Reloads leave records</li>
          <li>Reloads fine records</li>
        </ul>
        <h3>onYearChange()</h3>
        <ul>
          <li>Reloads yearly leave balance</li>
        </ul>
      </section>

      <!-- Testing Checklist -->
      <section class="card">
        <h2>Testing Checklist</h2>
        <table>
          <thead><tr><th>#</th><th>Test Case</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Verify permission check (PGM-MyWorkspace)</td></tr>
            <tr><td>2</td><td>Test with user having no staff record</td></tr>
            <tr><td>3</td><td>Test with user having no leave balance</td></tr>
            <tr><td>4</td><td>Test month selector changes</td></tr>
            <tr><td>5</td><td>Test year selector changes</td></tr>
            <tr><td>6</td><td>Test with no approval requests</td></tr>
            <tr><td>7</td><td>Test with no pending approvals</td></tr>
            <tr><td>8</td><td>Test fine records with null notes</td></tr>
            <tr><td>9</td><td>Test leave balance horizontal scroll</td></tr>
            <tr><td>10</td><td>Test main panel vertical scroll</td></tr>
            <tr><td>11</td><td>Verify profile photo loading</td></tr>
            <tr><td>12</td><td>Verify manager name retrieval</td></tr>
            <tr><td>13</td><td>Test empty state displays</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Future Enhancements -->
      <section class="card">
        <h2>Future Enhancements</h2>
        <ol>
          <li><strong>Attendance Rate Box</strong> &mdash; To be implemented</li>
          <li><strong>Overtime Hours Box</strong> &mdash; To be implemented</li>
          <li><strong>Quick Actions</strong> &mdash; 6 action buttons to be implemented:
            <ul>
              <li>Request Leave</li>
              <li>Submit Expense</li>
              <li>OT Request</li>
              <li>View Payslip</li>
              <li>IT Support</li>
              <li>Learning</li>
            </ul>
          </li>
        </ol>
      </section>

      <!-- Notes -->
      <section class="card">
        <h2>Notes</h2>
        <ul>
          <li>All data is filtered by current logged-in user automatically</li>
          <li>StaffID is retrieved from HrStaffView using UserId from token</li>
          <li>Month filtering uses start/end date calculation</li>
          <li>Year filtering uses exact year match</li>
          <li>All Active flags must be true</li>
          <li>Completed requests shown only if within last 7 days</li>
          <li>Leave balance colors cycle through predefined palette</li>
        </ul>
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
export class MyWorkspaceComponent {}
