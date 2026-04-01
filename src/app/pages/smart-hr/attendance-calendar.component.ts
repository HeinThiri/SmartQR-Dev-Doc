import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-attendance-calendar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-hr" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart HR
      </a>
      <h1>Attendance Calendar</h1>
      <p class="subtitle">Monthly read-only grid displaying each employee's daily attendance status across every date in the selected period, along with summary counts and leave totals. Found under the Attendance Module.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Architecture -->
      <section class="card">
        <h2>Architecture</h2>
        <pre><code>Frontend (Angular)                         Backend (ASP.NET Core)
─────────────────────────────────────      ──────────────────────────────────────────
AttendanceCalendarListComponent            AttendanceCalendarApi.cs  (REST controller)
  └─ attendance-calendar.service.ts   →    AttendanceCalendarController.cs (business logic)
  └─ attendance-calendar-dto.ts            └─ DB: HrStaffView, HrDailyAttendance,
                                                  HrDailyLeave, HrLeaveType,
                                                  HrHoliday, HrStaffDailyAssign,
                                                  HrWeeklyAssign, HrSetting</code></pre>

        <h3>Key Files</h3>
        <table>
          <thead><tr><th>Layer</th><th>File</th></tr></thead>
          <tbody>
            <tr><td>Angular Component</td><td><code>SmartHR_UI/src/app/pages/systematic/modules/attendance-module/attendance-calendar/attendance-calendar-list.component.ts</code></td></tr>
            <tr><td>Angular Template</td><td><code>SmartHR_UI/src/app/pages/systematic/modules/attendance-module/attendance-calendar/attendance-calendar-list.component.html</code></td></tr>
            <tr><td>Angular Service</td><td><code>SmartHR_UI/src/app/services/attendance/attendance-calendar.service.ts</code></td></tr>
            <tr><td>DTO</td><td><code>SmartHR_UI/src/app/dto/hr/attendance-calendar-dto.ts</code></td></tr>
            <tr><td>REST API</td><td><code>SmartHR_API/APIs/Attendance_Module/AttendanceCalendarApi.cs</code></td></tr>
            <tr><td>Business Logic</td><td><code>SmartHR_API/Infrastructure/Repository/Attendance_Module/AttendanceCalendarController.cs</code></td></tr>
          </tbody>
        </table>
      </section>

      <!-- API Contract -->
      <section class="card">
        <h2>API Contract</h2>
        <h3>Endpoint</h3>
        <pre><code>GET /AttendanceCalendarApi/GetAttendanceCalendar</code></pre>

        <h3>Query Parameters</h3>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>paramDate</code></td><td>DateTime (ISO 8601)</td><td>Yes</td><td>Any date within the target month</td></tr>
            <tr><td><code>divisionIds</code></td><td>string</td><td>No</td><td>Comma-separated division IDs</td></tr>
            <tr><td><code>departmentIds</code></td><td>string</td><td>No</td><td>Comma-separated department IDs</td></tr>
            <tr><td><code>sectionIds</code></td><td>string</td><td>No</td><td>Comma-separated section IDs</td></tr>
            <tr><td><code>orgGroupIds</code></td><td>string</td><td>No</td><td>Comma-separated org group IDs</td></tr>
            <tr><td><code>staffName</code></td><td>string</td><td>No</td><td>Free-text search on employee ID / first name / last name</td></tr>
          </tbody>
        </table>

        <h3>Response Shape</h3>
        <pre><code>&#123;
  "resultObject": &#123;
    "rows": [
      &#123;
        "staffID": "...",
        "employeeID": "EMP001",
        "fullName": "John Smith",
        "positionName": "...",
        "departmentID": "...",
        "departmentName": "...",
        "joinedDate": "2022-01-01",
        "dateColumns": &#123; "1/Mon": "NA", "2/Tue": "Off" &#125;,
        "leaveColumns": &#123; "AL/L": 1.5, "PL/L": 0.5 &#125;,
        "off": 8, "na": 18, "mo": 1, "late": 2,
        "pa": 0, "absent": 0, "non": 0,
        "totalPayDays": 27
      &#125;
    ],
    "startDate": "...",
    "endDate": "...",
    "leaveTypes": [
      &#123; "leaveTypeID": "...", "leaveTypeCode": "AL", "leaveName": "Annual Leave" &#125;
    ]
  &#125;
&#125;</code></pre>
      </section>

      <!-- Backend Processing Steps -->
      <section class="card">
        <h2>Backend Processing Steps</h2>

        <h3>Step 1 — Determine Date Range (GetDateRangeAsync)</h3>
        <p>The calendar period is driven by <code>HrSetting.LeaveEndDate</code>:</p>
        <table>
          <thead><tr><th>LeaveEndDate</th><th>Start Date</th><th>End Date</th></tr></thead>
          <tbody>
            <tr><td><code>0</code> (zero)</td><td>1st of selected month</td><td>Last day of selected month</td></tr>
            <tr><td><code>N</code> (any day)</td><td>N + 1 of the <strong>previous</strong> month</td><td>N of the <strong>selected</strong> month</td></tr>
          </tbody>
        </table>
        <p>This supports payroll cycles that span two calendar months (e.g., the 26th-25th cycle).</p>

        <h3>Step 2 — Fetch Data (FetchAllDataAsync)</h3>
        <p>Six database queries are executed sequentially (EF Core forbids concurrent use of the same DbContext):</p>
        <ol>
          <li><strong>Staff</strong> — <code>HrStaffView</code> filtered by: active, licenseId, user access rights (department + org group), division/department/section/orgGroup filters, staff name search, and excluding staff whose tenure does not overlap the period.</li>
          <li><strong>Attendance</strong> — <code>HrDailyAttendance</code> for the date range.</li>
          <li><strong>Leave</strong> — <code>HrDailyLeave</code> joined with <code>HrLeaveType</code> for the date range.</li>
          <li><strong>Public Holidays</strong> — <code>HrHoliday</code> dates in the range.</li>
          <li><strong>Daily Assigns</strong> — <code>HrStaffDailyAssign</code> (per-staff schedule overrides).</li>
          <li><strong>Weekly Assigns</strong> — <code>HrWeeklyAssign</code> (default recurring weekly schedule).</li>
        </ol>
        <p>All data is loaded into a <code>BatchData</code> object with fast Dictionary lookups keyed by (StaffID, Date).</p>

        <h3>Step 3 — Build Calendar (BuildCalendar)</h3>
        <p>For every staff member x every date in the range, <code>EvaluateAttendanceStatus</code> is called using a priority hierarchy:</p>
      </section>

      <!-- Attendance Status Priority -->
      <section class="card">
        <h2>Attendance Status Priority Hierarchy</h2>

        <h3>Priority 1: NON (outside employment period)</h3>
        <table>
          <thead><tr><th>Condition</th><th>Result</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td>date &lt; JoinedDate</td><td><code>+</code></td><td>Before joining</td></tr>
            <tr><td>date &gt; LastWorkingDate</td><td><code>-</code></td><td>After leaving</td></tr>
          </tbody>
        </table>

        <h3>Priority 2: Leave exists (HrDailyLeave)</h3>
        <table>
          <thead><tr><th>Condition</th><th>Result</th></tr></thead>
          <tbody>
            <tr><td>+ no attendance</td><td>&#123;Code&#125;/L (or AML/PML for half-day)</td></tr>
            <tr><td>+ MO attendance</td><td>MO &#123;Code&#125;/L</td></tr>
            <tr><td>+ full working hours</td><td>&#10003;, &#123;Code&#125;/L</td></tr>
            <tr><td>+ partial hours (PA)</td><td>&#8854;, &#123;Code&#125;/L</td></tr>
          </tbody>
        </table>

        <h3>Priority 3: Off day</h3>
        <table>
          <thead><tr><th>Condition</th><th>Result</th></tr></thead>
          <tbody>
            <tr><td>Public holiday (no att)</td><td>Pub Off</td></tr>
            <tr><td>Public holiday + MO</td><td>MO, Pub Off</td></tr>
            <tr><td>Public holiday + full</td><td>&#10003;, Pub Off</td></tr>
            <tr><td>Public holiday + partial</td><td>&#8854;, Pub Off</td></tr>
            <tr><td>Day off (no att)</td><td>Off</td></tr>
            <tr><td>Day off + MO</td><td>MO, Off</td></tr>
            <tr><td>Day off + full hours</td><td>&#10003;, Off</td></tr>
            <tr><td>Day off + partial</td><td>&#8854;, Off</td></tr>
          </tbody>
        </table>

        <h3>Priority 4: Regular working day (has attendance)</h3>
        <table>
          <thead><tr><th>Condition</th><th>Result</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td>IsMovementOrder = true</td><td><code>MO</code></td><td>Movement Order</td></tr>
            <tr><td>IsOutSide = true</td><td><code>OD</code></td><td>On Duty</td></tr>
            <tr><td>IsSiteVisit = true</td><td><code>SV</code></td><td>Site Visit</td></tr>
            <tr><td>Working hours &gt; 0, late</td><td><code>Late</code></td><td>Late Arrival</td></tr>
            <tr><td>Working hours &gt; 0</td><td><code>NA</code></td><td>Normal Attendance</td></tr>
            <tr><td>No working hours</td><td><code>PA</code></td><td>Partial Attendance</td></tr>
          </tbody>
        </table>

        <h3>Priority 5: No attendance, no leave, not off day</h3>
        <p>Result: <strong>Absence</strong></p>
      </section>

      <!-- Day-Off Detection & Half-Day Leave -->
      <section class="card">
        <h2>Day-Off Detection &amp; Half-Day Leave</h2>

        <h3>Day-Off Detection (IsStaffDayOff)</h3>
        <ol>
          <li>Check <code>HrStaffDailyAssign</code> for the specific staff + date. If found and <code>AssignId</code> contains <code>"077"</code> → day off.</li>
          <li>If no daily assign exists, fall back to <code>HrWeeklyAssign</code> for the staff's weekly schedule. If the day-of-week slot contains <code>"077"</code> → day off.</li>
        </ol>

        <h3>Half-Day Leave (DurationType)</h3>
        <table>
          <thead><tr><th>DurationType</th><th>Meaning</th><th>Leave Format Suffix</th></tr></thead>
          <tbody>
            <tr><td><code>"1"</code></td><td>Morning half-day</td><td>AML</td></tr>
            <tr><td><code>"2"</code></td><td>Afternoon half-day</td><td>PML</td></tr>
            <tr><td><code>"3"</code></td><td>Full day</td><td><em>(none)</em></td></tr>
          </tbody>
        </table>
        <p>Half-day leaves contribute <code>0.5</code> to the NA summary count.</p>

        <h3>Summary Column Formulas</h3>
        <table>
          <thead><tr><th>Column</th><th>Formula</th></tr></thead>
          <tbody>
            <tr><td><code>OFF</code></td><td>Count of "Off" or "Pub Off" days (no attendance)</td></tr>
            <tr><td><code>NA</code></td><td>Sum of naValue per day (1 for full attendance, 0.5 for half-day leave with attendance)</td></tr>
            <tr><td><code>MO</code></td><td>Count of Movement Order days</td></tr>
            <tr><td><code>Late</code></td><td>Count of days where StartFineMinute &gt; 0</td></tr>
            <tr><td><code>PA</code></td><td>Count of Partial Attendance days</td></tr>
            <tr><td><code>Absent</code></td><td>Count of Absence days</td></tr>
            <tr><td><code>NON</code></td><td>Count of days outside employment period</td></tr>
            <tr><td><strong>Total Pay Days</strong></td><td>OFF + NA + MO</td></tr>
          </tbody>
        </table>
        <p>Leave summary columns (e.g., "AL/L") are calculated as: fullDays + (halfDays / 2).</p>
      </section>

      <!-- Frontend Component -->
      <section class="card">
        <h2>Frontend Component</h2>

        <h3>Filtering</h3>
        <p>All main filters are <strong>server-side</strong> (re-fetches API on every change):</p>
        <table>
          <thead><tr><th>Filter</th><th>Source</th></tr></thead>
          <tbody>
            <tr><td>Month navigation</td><td>Prev/next buttons or date picker</td></tr>
            <tr><td>Division / Department / Section / Org Group</td><td>Shared <code>app-search</code> component</td></tr>
            <tr><td>Keyword search</td><td>Employee ID, first name, last name</td></tr>
          </tbody>
        </table>
        <p>An additional <strong>client-side</strong> <code>staffNameFilter</code> is available inside the expanded filter panel.</p>
        <p>Previous filter selections are persisted via cookie (<code>attendance_calendar_search_history</code>) and restored on page load via <code>onFiltersRestored()</code>.</p>

        <h3>Grid Layout</h3>
        <p>The DevExtreme <code>dx-data-grid</code> columns are built dynamically after each API call:</p>
        <pre><code>[Fixed Info]                          [Dynamic Date Cols]      [Summary]         [Dynamic Leave Cols]   [More Summary]
Employee Name/ID | Position | Dept | 1/Mon ... 31/Sun | OFF | NA | MO | Late | AL/L ... | PA | Absent | NON | Total Pay Days</code></pre>
        <ul>
          <li><strong>Date columns</strong> — key format "D/DDD" (e.g., "1/Mon"), flattened to date_1_Mon on the row object</li>
          <li><strong>Leave columns</strong> — key format "CODE/L" (e.g., "AL/L"), flattened to leave_AL_L</li>
          <li>Weekend date columns receive the CSS class <code>weekend-header</code></li>
        </ul>
      </section>

      <!-- Status Display Mapping -->
      <section class="card">
        <h2>Status Display Mapping</h2>
        <table>
          <thead><tr><th>Raw API Value</th><th>Displayed</th><th>Color</th></tr></thead>
          <tbody>
            <tr><td><code>NA</code></td><td>&#10003;</td><td>Green</td></tr>
            <tr><td><code>PA</code></td><td>&#8854;</td><td>Pink/Red</td></tr>
            <tr><td><code>ABSENCE</code> / <code>A</code></td><td>A</td><td>Red</td></tr>
            <tr><td><code>LATE</code></td><td>LA</td><td>Yellow</td></tr>
            <tr><td><code>MO</code></td><td>MO</td><td>Cyan</td></tr>
            <tr><td><code>OD</code></td><td>OD</td><td>Blue</td></tr>
            <tr><td><code>SV</code></td><td>SV</td><td>Teal</td></tr>
            <tr><td><code>Off</code></td><td>Off</td><td>Gray</td></tr>
            <tr><td><code>Pub Off</code></td><td>Pub Off</td><td>Blue</td></tr>
            <tr><td><code>+</code></td><td>+</td><td>Dark Red</td></tr>
            <tr><td><code>-</code></td><td>-</td><td>Dark Red</td></tr>
            <tr><td>Combined (e.g., &#10003;, AL/L)</td><td>kept as-is</td><td>varies</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Excel Export & Keyboard Shortcuts -->
      <section class="card">
        <h2>Excel Export &amp; Keyboard Shortcuts</h2>

        <h3>Excel Export</h3>
        <p>Triggered by the toolbar button or <code>Ctrl+E</code>. Requires the <code>ExcelExport</code> permission for the current route.</p>
        <p><strong>Output file:</strong> <code>Attendance_Calendar_YYYY-MM.xlsx</code></p>
        <p><strong>Column order:</strong> Employee ID → Full Name → Position → Department → [date cols] → OFF → NA → MO → Late → [leave cols] → PA → Absent → NON → Total Pay Days</p>

        <h3>Keyboard Shortcuts</h3>
        <table>
          <thead><tr><th>Shortcut</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><code>Ctrl+F</code> / <code>Cmd+F</code></td><td>Reload calendar</td></tr>
            <tr><td><code>Ctrl+E</code> / <code>Cmd+E</code></td><td>Export to Excel</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Permissions -->
      <section class="card">
        <h2>Permissions</h2>
        <table>
          <thead><tr><th>Check</th><th>Code</th></tr></thead>
          <tbody>
            <tr><td>Page access</td><td><code>ProgramCodes.permission_AttendanceCalendar</code> (read action)</td></tr>
            <tr><td>Data row access</td><td>User's allowed/denied department and org group lists via <code>Common_Methods.GetUserAccessData_*</code></td></tr>
            <tr><td>Excel export</td><td><code>myCommon.checkExcelExportPermission(currentRoute)</code></td></tr>
          </tbody>
        </table>
      </section>

      <!-- Status Definitions Reference -->
      <section class="card">
        <h2>Status Definitions Reference</h2>

        <h3>Date Column Statuses</h3>
        <table>
          <thead><tr><th>Symbol</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><code>NA</code> / <code>&#10003;</code></td><td>Normal Attendance</td></tr>
            <tr><td><code>OD</code></td><td>On Duty (counted as NA)</td></tr>
            <tr><td><code>DO</code></td><td>Day Off (counted as NA)</td></tr>
            <tr><td><code>SV</code></td><td>Site Visit (counted as NA)</td></tr>
            <tr><td><code>&#8854;</code></td><td>Partial Attendance (one-time in/out only)</td></tr>
            <tr><td><code>MO</code></td><td>Movement Order</td></tr>
            <tr><td><code>A</code></td><td>Absence</td></tr>
            <tr><td><code>LA</code></td><td>Late</td></tr>
            <tr><td><code>Off</code></td><td>Off Day (Sat/Sun)</td></tr>
            <tr><td><code>Pub Off</code></td><td>Public Holiday</td></tr>
            <tr><td>&#123;CODE&#125;/L</td><td>Full Day Leave (e.g., AL/L)</td></tr>
            <tr><td>&#123;CODE&#125;/L AML</td><td>Morning Half-Day Leave</td></tr>
            <tr><td>&#123;CODE&#125;/L PML</td><td>Afternoon Half-Day Leave</td></tr>
            <tr><td><code>+</code></td><td>NON — before joined date</td></tr>
            <tr><td><code>-</code></td><td>NON — after last working date</td></tr>
          </tbody>
        </table>

        <h3>Combined Statuses</h3>
        <table>
          <thead><tr><th>Symbol</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td>&#10003;, Off / &#10003;, Pub Off</td><td>Normal Attendance + Off or Public Off</td></tr>
            <tr><td>&#8854;, Off / &#8854;, Pub Off</td><td>Partial Attendance + Off or Public Off</td></tr>
            <tr><td>MO, Off / MO, Pub Off</td><td>Movement Order + Off or Public Off</td></tr>
            <tr><td>&#10003;, &#123;CODE&#125;/L</td><td>Normal Attendance + Full/Half Day Leave</td></tr>
            <tr><td>&#8854;, &#123;CODE&#125;/L</td><td>Partial Attendance + Full/Half Day Leave</td></tr>
            <tr><td>MO &#123;CODE&#125;/L</td><td>Movement Order + Full/Half Day Leave</td></tr>
          </tbody>
        </table>

        <h3>Summary Column Definitions</h3>
        <table>
          <thead><tr><th>Column</th><th>Definition</th></tr></thead>
          <tbody>
            <tr><td><code>OFF</code></td><td>Total Off + Pub Off days</td></tr>
            <tr><td><code>NA</code></td><td>&#10003; + OD + SV + WFH total</td></tr>
            <tr><td><code>MO</code></td><td>Movement Order total</td></tr>
            <tr><td><code>Late</code></td><td>Late arrival total</td></tr>
            <tr><td><code>PA</code></td><td>Partial Attendance (&#8854;) total</td></tr>
            <tr><td><code>Absence</code></td><td>Absence (A) total</td></tr>
            <tr><td><code>NON</code></td><td>Non-Operation (+ / -) total</td></tr>
            <tr><td><code>Total Pay Days</code></td><td>NA + MO + OFF + Paid Leaves</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Data Models -->
      <section class="card">
        <h2>Data Models</h2>

        <h3>Frontend DTO (attendance-calendar-dto.ts)</h3>
        <pre><code>interface AttendanceCalendarRow &#123;
  staffID: string;
  employeeID: string;
  fullName: string;
  positionName: string;
  departmentName: string;
  joinedDate: Date;
  dateColumns: &#123; [key: string]: string &#125;;   // "1/Thu" -&gt; "NA"
  leaveColumns: &#123; [key: string]: number &#125;;  // "AL/L" -&gt; 2.5
  off: number;
  na: number;       // decimal to support 0.5 half-day
  mo: number;
  late: number;
  pa: number;
  absent: number;
  non: number;
  totalPayDays: number;
&#125;

interface AttendanceCalendarResult &#123;
  rows: AttendanceCalendarRow[];
  startDate: Date;
  endDate: Date;
  leaveTypes: LeaveTypeInfo[];
&#125;</code></pre>

        <h3>Backend Internal Models (AttendanceCalendarController.cs)</h3>
        <pre><code>class BatchData &#123;
    List&lt;StaffInfo&gt; Staff;
    List&lt;AttendanceRecord&gt; Attendance;
    List&lt;LeaveRecord&gt; Leave;
    HashSet&lt;DateTime&gt; PublicHolidays;
    Dictionary&lt;(StaffID, Date), string&gt; DailyAssigns;
    Dictionary&lt;string, WeeklyAssignInfo&gt; WeeklyAssigns;
&#125;

class AttendanceRecord &#123;
    string StaffID; DateTime AttendanceDate;
    int? TotalWorkingHour; int? TotalWorkingMinute;
    bool IsMovementOrder; bool IsOutSide; bool IsSiteVisit;
    int? StartFineMinute;   // &gt; 0 means late
&#125;

class LeaveRecord &#123;
    string StaffID; DateTime LeaveDate;
    string LeaveTypeID; string DurationType;  // 1=Morning, 2=Afternoon, 3=FullDay
    string LeaveTypeCode;
&#125;</code></pre>
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
export class AttendanceCalendarComponent {}
