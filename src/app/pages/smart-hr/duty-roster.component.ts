import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-duty-roster',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-hr" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart HR
      </a>
      <h1>Duty Roster</h1>
      <p class="subtitle">Displays each employee's shift assignment across a rolling 31-day period. Supports viewing, single-cell editing, bulk switch, and bulk change of assignments with audit logging.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Architecture -->
      <section class="card">
        <h2>Architecture</h2>
        <pre><code>Frontend (Angular)                          Backend (ASP.NET Core)
────────────────────────────────────────    ────────────────────────────────────────────
DutyRosterComponent (main grid)             DutyRosterApi.cs  (REST controller)
  ├─ AssignSwitchComponent  (bulk switch)   DutyRosterController.cs (business logic)
  ├─ AssignChangeComponent  (bulk change)   └─ DB: HrStaffView, HrStaffDailyAssignView,
  ├─ SelectAssignPopup      (single cell)          HrWeeklyAssign, HrAssignView,
  └─ duty-roster.service.ts                        HrHolidayView, HrSetting,
  └─ duty-roster-dto.ts                            HrStaffDailyAssign (write)</code></pre>

        <h3>Key Files</h3>
        <table>
          <thead><tr><th>Layer</th><th>File</th></tr></thead>
          <tbody>
            <tr><td>Angular Component</td><td><code>SmartHR_UI/src/app/pages/systematic/modules/attendance-module/duty-roster/duty-roster.component.ts</code></td></tr>
            <tr><td>Angular Template</td><td><code>SmartHR_UI/src/app/pages/systematic/modules/attendance-module/duty-roster/duty-roster.component.html</code></td></tr>
            <tr><td>Assign Switch</td><td><code>duty-roster/assign-switch/assign-switch.component.ts</code></td></tr>
            <tr><td>Assign Change</td><td><code>duty-roster/assign-change/assign-change.component.ts</code></td></tr>
            <tr><td>Select Assign Popup</td><td><code>duty-roster/select-assign-popup/select-assign-popup.component.ts</code></td></tr>
            <tr><td>Angular Service</td><td><code>SmartHR_UI/src/app/services/attendance/duty-roster.service.ts</code></td></tr>
            <tr><td>DTO</td><td><code>SmartHR_UI/src/app/dto/hr/duty-roster-dto.ts</code></td></tr>
            <tr><td>REST API</td><td><code>SmartHR_API/APIs/Attendance_Module/DutyRosterApi.cs</code></td></tr>
            <tr><td>Business Logic</td><td><code>SmartHR_API/Infrastructure/Repository/Attendance_Module/DutyRosterController.cs</code></td></tr>
            <tr><td>Request DTOs</td><td><code>SmartHR_API/DTO/Attendance_Module/DutyRosterDTO.cs</code></td></tr>
          </tbody>
        </table>
      </section>

      <!-- API Endpoints -->
      <section class="card">
        <h2>API Endpoints</h2>
        <p>All endpoints require JWT authorization (<code>[Authorize]</code>) and read permission on <code>permission_Duty_Roaster</code>.</p>
        <table>
          <thead><tr><th>Method</th><th>Endpoint</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>GET</code></td><td><code>/DutyRosterApi/GetDutyRosterHeader</code></td><td>Returns 31 date strings for the display period</td></tr>
            <tr><td><code>POST</code></td><td><code>/DutyRosterApi/GetDutyRoster</code></td><td>Returns the full duty roster grid data</td></tr>
            <tr><td><code>POST</code></td><td><code>/DutyRosterApi/GetDutyRosterSwitchAssign</code></td><td>Preview data for the Switch Assign dialog</td></tr>
            <tr><td><code>POST</code></td><td><code>/DutyRosterApi/GetDutyRosterChangeAssign</code></td><td>Preview data for the Change Assign dialog</td></tr>
            <tr><td><code>POST</code></td><td><code>/DutyRosterApi/SwitchAssign</code></td><td>Executes the assign switch for selected staff</td></tr>
            <tr><td><code>POST</code></td><td><code>/DutyRosterApi/ChangeAssign</code></td><td>Executes the assign change for selected staff</td></tr>
            <tr><td><code>POST</code></td><td><code>/DutyRosterApi/SaveDailyAssign</code></td><td>Saves a single-cell assignment override</td></tr>
            <tr><td><code>GET</code></td><td><code>/DutyRosterApi/AssignGetAll</code></td><td>Returns all available assign options (for dropdowns)</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Date Range Calculation -->
      <section class="card">
        <h2>Date Range Calculation</h2>
        <p>Both <code>GetDutyRosterHeader</code> and <code>GetDutyRoster</code> derive the 31-day period from <code>HrSetting.LeaveEndDate</code>:</p>
        <table>
          <thead><tr><th>LeaveEndDate</th><th>Period Start</th><th>Period Length</th></tr></thead>
          <tbody>
            <tr><td><code>0</code></td><td>1st of selected month</td><td>31 days</td></tr>
            <tr><td><code>N</code></td><td>N + 1 of the <strong>previous</strong> month</td><td>31 days</td></tr>
          </tbody>
        </table>
        <p>This matches the same payroll-cycle-aware range used in the Attendance Calendar.</p>
      </section>

      <!-- GetDutyRoster Grid Data Builder -->
      <section class="card">
        <h2>GetDutyRoster — Grid Data Builder</h2>

        <h3>Data Loaded</h3>
        <ol>
          <li><strong>Staff</strong> — <code>HrStaffView</code>: active, same license, within access rights (dept + org group), filtered by Division/Department/Section/OrgGroup from request, <code>IncludeInAttendance = true</code>, joined before period end, not departed before period start.</li>
          <li><strong>Daily Assigns</strong> — <code>HrStaffDailyAssignView</code>: all records in the 31-day window.</li>
          <li><strong>Weekly Assigns</strong> — <code>HrWeeklyAssign</code>: all for the license (default recurring schedules).</li>
          <li><strong>All Assigns</strong> — <code>HrAssignView</code>: used as a lookup for weekly assign resolution.</li>
          <li><strong>Holidays</strong> — <code>HrHolidayView</code>: dates in range (for "Pub OFF" label override).</li>
          <li><strong>Off-Day Color</strong> — <code>HrAssignView</code> where AssignId == licenseId + "077" (the off-day assign's background color).</li>
        </ol>

        <h3>Per-Staff Per-Date Resolution (Priority)</h3>
        <ol>
          <li><strong>Daily assign exists</strong> — use it (overrides weekly schedule). If the date is also a public holiday, append " / Pub OFF" to the code and optionally override background color with <code>offDayAssignColor</code>.</li>
          <li><strong>No daily assign, weekly assign exists</strong> — resolve the day of week (Mon-Sun) from <code>HrWeeklyAssign.AssignId1-7</code>, look up assign details from <code>HrAssignView</code>. Same Pub OFF suffix logic applies.</li>
          <li><strong>Neither</strong> — the cell is empty (no assignment).</li>
        </ol>

        <h3>Cell String Format</h3>
        <p>Each <code>dayN_assignResult</code> is a <code>~</code>-delimited string:</p>
        <pre><code>&#123;date&#125;~&#123;assignId(s)&#125;~&#123;assignCode(s)&#125;~&#123;borderColor&#125;~&#123;fontColor&#125;~&#123;uuid&#125;~&#123;staffName&#125;~&#123;staffId&#125;~&#123;startTime(s)&#125;~&#123;endTime(s)&#125;</code></pre>

        <p>For multiple assigns on the same date, <code>assignId</code>, <code>assignCode</code>, <code>startTime</code>, and <code>endTime</code> fields are <code>|</code>-delimited within their segment:</p>
        <pre><code>26/05/2025~id1|id2~CODE1|CODE2~#FF0000~#FFFFFF~&lt;uuid&gt;~John Smith~&lt;staffId&gt;~08:00|14:00~16:00|22:00</code></pre>

        <h3>Segment Index Reference</h3>
        <table>
          <thead><tr><th>Segment Index</th><th>Field</th></tr></thead>
          <tbody>
            <tr><td>0</td><td>Date (dd/MM/yyyy)</td></tr>
            <tr><td>1</td><td>Assign ID(s) (|-separated)</td></tr>
            <tr><td>2</td><td>Assign code(s) (|-separated), may include "/ Pub OFF"</td></tr>
            <tr><td>3</td><td>Background/border color (last assign's color, or off-day color)</td></tr>
            <tr><td>4</td><td>Font color (last assign's font color)</td></tr>
            <tr><td>5</td><td>UUID (cache-busting)</td></tr>
            <tr><td>6</td><td>Staff full name</td></tr>
            <tr><td>7</td><td>Staff ID</td></tr>
            <tr><td>8</td><td>Start time(s) (|-separated, hh:mm)</td></tr>
            <tr><td>9</td><td>End time(s) (|-separated, hh:mm)</td></tr>
          </tbody>
        </table>
      </section>

      <!-- SwitchAssign -->
      <section class="card">
        <h2>SwitchAssign — Swap Two Dates</h2>
        <p><strong>Purpose:</strong> For each selected staff, swap the assignments between <code>start_date</code> and <code>end_date</code>.</p>

        <h3>Flow</h3>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-people"></i> Validate Staff IDs<small>Active, joined, not departed</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-danger"><i class="bi bi-trash"></i> Delete Existing<small>HrStaffDailyAssign for 2 dates</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-database"></i> Call Stored Proc<small>GetDutyRosterForSwitchAssign</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-arrow-left-right"></i> Cross-Insert<small>day1 assigns → end_date<br>day2 assigns → start_date</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-save"></i> Save Changes</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-journal-text"></i> Audit Log<small>writeLogSinglePoint</small></div>
          </div>
        </div>
        <p><strong>Validation:</strong> <code>start_date</code> must differ from <code>end_date</code> (enforced in frontend).</p>
      </section>

      <!-- ChangeAssign -->
      <section class="card">
        <h2>ChangeAssign — Replace Assignment on a Date</h2>
        <p><strong>Purpose:</strong> For each selected staff, replace all assignments on <code>assign_date</code> with the supplied <code>assign_ids</code>.</p>

        <h3>Flow</h3>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-check-circle"></i> Validate Assign IDs<small>Must exist in HrAssignView</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-people"></i> Validate Staff<small>Joined and not departed</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-danger"><i class="bi bi-trash"></i> Delete Existing<small>HrStaffDailyAssign rows</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-plus-circle"></i> Insert New Rows<small>One per staff per assignId</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-journal-text"></i> Audit Log<small>Before/after per staff</small></div>
          </div>
        </div>
      </section>

      <!-- SaveDailyAssign -->
      <section class="card">
        <h2>SaveDailyAssign — Single-Cell Override</h2>
        <p><strong>Purpose:</strong> Save a new daily assignment for one staff on one date (from the inline cell popup).</p>

        <h3>Flow</h3>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-shield-check"></i> Validate License</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-danger"><i class="bi bi-trash"></i> Delete Existing<small>All rows for staff + date</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-plus-circle"></i> Insert New Rows<small>One per assignId</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-journal-text"></i> Audit Log<small>Old → New assign summary</small></div>
          </div>
        </div>
      </section>

      <!-- Audit Logging -->
      <section class="card">
        <h2>Audit Logging</h2>
        <p>All three write operations log to <code>HrStaffDailyAssign</code> via <code>writeLogSinglePoint</code>:</p>
        <table>
          <thead><tr><th>Operation</th><th>Log Field Label</th></tr></thead>
          <tbody>
            <tr><td>Single cell save</td><td>Duty (dd/MM/yyyy)</td></tr>
            <tr><td>Switch assign</td><td>Duty Switch (dd/MM/yyyy)</td></tr>
            <tr><td>Change assign</td><td>Duty Change (dd/MM/yyyy)</td></tr>
          </tbody>
        </table>
        <p>Old value = comma-joined assign titles before change; new value = comma-joined assign titles after change. Only logs when old ≠ new.</p>
      </section>

      <!-- Frontend Component -->
      <section class="card">
        <h2>Frontend Component (DutyRosterComponent)</h2>

        <h3>Initialization Flow</h3>
        <pre><code>ngOnInit
  └─ check ExcelExport permission

onFiltersRestored  (from SearchComponent cookie)
  └─ loadHeaderList()
       └─ GetDutyRosterHeader(selectedDate) → headerColumns[] (31 date strings)
            └─ loadList()
                 └─ GetDutyRoster(&#123; startDate, divisionIds, ... &#125;) → dataSource[]</code></pre>

        <h3>Filters</h3>
        <p>All org filters are <strong>server-side</strong> (re-fetches on every change):</p>
        <table>
          <thead><tr><th>Filter</th><th>Source</th></tr></thead>
          <tbody>
            <tr><td>Month (prev/next/datepicker)</td><td><code>selectedDate</code> field</td></tr>
            <tr><td>Division / Department / Section / Org Group</td><td><code>app-search</code> component</td></tr>
          </tbody>
        </table>
        <p>Keyword search (name / employee ID) is <strong>client-side</strong> — filters <code>originalDataSource</code> without re-fetching.</p>
        <p>Filter selections are persisted via <code>SearchComponent</code> cookie and restored on load via <code>onFiltersRestored()</code>.</p>

        <h3>Grid Layout</h3>
        <p>The DevExtreme <code>dx-data-grid</code> uses fixed info columns and 31 dynamic day columns:</p>
        <pre><code>[Checkbox] [Name / Employee ID] [Day 1] [Day 2] ... [Day 31]</code></pre>
        <ul>
          <li><strong>Header row</strong>: each day column caption is the day number (1-31). Weekend day headers get background color <code>#f5dab0</code>.</li>
          <li><strong>Data cells</strong>: rendered via a custom cell template that calls <code>getCellValue()</code>, <code>getCellColor()</code>, <code>getCellBackColor()</code>.</li>
          <li><strong>Tooltip on hover</strong>: calls <code>getHoverCellValue()</code> which formats multi-assign cells with &lt;br&gt; separators showing CODE - startTime ~ endTime.</li>
        </ul>
      </section>

      <!-- Cell Parsing Helpers -->
      <section class="card">
        <h2>Cell Parsing Helpers</h2>
        <table>
          <thead><tr><th>Method</th><th>Returns</th></tr></thead>
          <tbody>
            <tr><td><code>getCellValue(raw)</code></td><td>segments[2] — assign code(s) display string</td></tr>
            <tr><td><code>getCellColor(raw)</code></td><td>segments[4] — font color</td></tr>
            <tr><td><code>getCellBorderColor(raw)</code></td><td>segments[3] — border/background color</td></tr>
            <tr><td><code>getCellBackColor(raw)</code></td><td>segments[3] converted to rgba at 15% opacity</td></tr>
            <tr><td><code>parseCellData(raw)</code></td><td>Object &#123; codes[], colors[], startTimes[], endTimes[] &#125;</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Row Selection & Detail Panel -->
      <section class="card">
        <h2>Row Selection &amp; Detail Panel</h2>
        <ul>
          <li><strong>Single row selected</strong> → shows a mini calendar detail panel below the grid with the selected employee's daily duties for the period. Each day tile can be clicked to open the <code>SelectAssignPopup</code>.</li>
          <li><strong>Multiple rows selected</strong> → hides the detail panel; enables the Switch/Change bulk action buttons.</li>
          <li><code>Escape</code> key closes the detail panel.</li>
        </ul>
      </section>

      <!-- Popups -->
      <section class="card">
        <h2>Popups</h2>
        <table>
          <thead><tr><th>Popup</th><th>Trigger</th><th>Component</th></tr></thead>
          <tbody>
            <tr><td><strong>Select Assign Popup</strong></td><td>Click on a day cell OR click a day in the detail panel</td><td><code>app-select-assign-popup</code></td></tr>
            <tr><td><strong>Assign Switch</strong></td><td>Click "Switch" button (requires ≥1 selected row)</td><td><code>app-assign-switch</code></td></tr>
            <tr><td><strong>Assign Change</strong></td><td>Click "Change" button (requires ≥1 selected row)</td><td><code>app-assign-change</code></td></tr>
          </tbody>
        </table>
        <p>After any save, the parent <code>loadList()</code> is re-triggered via <code>EventEmitter</code>.</p>
      </section>

      <!-- Sub-Components -->
      <section class="card">
        <h2>Sub-Components</h2>

        <h3>AssignSwitchComponent</h3>
        <ul>
          <li><strong>Inputs:</strong> <code>selectedData</code> (comma-separated staff IDs), <code>isLoading</code></li>
          <li><strong>Form:</strong> <code>assignDateFrom</code> + <code>assignDateTo</code></li>
          <li>On form change → calls <code>GetDutyRosterSwitchAssign</code> to preview the two date columns</li>
          <li>On submit → calls <code>SwitchAssign</code>, then emits <code>loadList</code> to refresh parent</li>
          <li><strong>Validation:</strong> dates must differ</li>
        </ul>

        <h3>AssignChangeComponent</h3>
        <ul>
          <li><strong>Inputs:</strong> <code>selectedData</code>, <code>isLoading</code></li>
          <li><strong>Form:</strong> <code>assignDate</code> + <code>assignId[]</code> (multi-select from <code>AssignGetAll</code>)</li>
          <li>On form change → calls <code>GetDutyRosterChangeAssign</code> to preview the current assignment for the selected date</li>
          <li>On submit → calls <code>ChangeAssign</code> with <code>assignDate</code>, joined <code>assignIds</code>, and <code>selectedData</code></li>
        </ul>

        <h3>SelectAssignPopupComponent</h3>
        <ul>
          <li><strong>Receives:</strong> <code>staffInfo[]</code> (staffId, name, employeeId), <code>cellInfo</code> (raw cell string), date context</li>
          <li>Allows selecting one or more assigns for a single staff x date</li>
          <li>On save → calls <code>SaveDailyAssign</code>, then triggers parent <code>loadList</code></li>
        </ul>
      </section>

      <!-- Excel Export & Import -->
      <section class="card">
        <h2>Excel Export &amp; Import</h2>

        <h3>Excel Export</h3>
        <p>Triggered from the toolbar (requires <code>ExcelExport</code> permission). Exports the current <code>dataSource</code> rows:</p>
        <table>
          <thead><tr><th>Column</th><th>Source</th></tr></thead>
          <tbody>
            <tr><td><code>Name</code></td><td>row.full_name</td></tr>
            <tr><td><code>EmployeeID</code></td><td>row.employeeIdNo</td></tr>
            <tr><td>&#123;date string&#125; x 31</td><td>getCellValue(row.dayN_assignResult) — code only, no colors</td></tr>
          </tbody>
        </table>
        <p><strong>Output file:</strong> <code>Duty Roster.xlsx</code></p>

        <h3>Excel Import</h3>
        <p>The component supports importing duty roster data via the shared <code>app-excel-upload</code> component (<code>importType = "duty-roster"</code>). Expected columns: <code>No.</code>, <code>Employee ID</code>, <code>Staff Name</code>, <code>1</code>-<code>31</code>.</p>
      </section>

      <!-- Data Models -->
      <section class="card">
        <h2>Data Models</h2>

        <h3>Frontend DTO (duty-roster-dto.ts)</h3>
        <pre><code>interface DutyRosterDTO &#123;
  staffId: string;
  departmentId: string;
  full_name: string;
  local_full_name: string;
  employeeIdNo: string;
  day1_assignResult: string;   // "~"-delimited cell string
  day2_assignResult: string;
  // ... day3 through day31
  day31_assignResult: string;
&#125;</code></pre>

        <h3>Backend Request DTOs (DutyRosterDTO.cs)</h3>
        <pre><code>class FilterDutyRosterDTO &#123;
    DateTime StartDate;
    List&lt;string&gt; DivisionIds;
    List&lt;string&gt; DepartmentIds;
    List&lt;string&gt; SectionIds;
    List&lt;string&gt; OrgGroupIds;
&#125;

class FilterDutyRosterSwitchAssignDTO &#123;
    DateTime StartDate; DateTime EndDate; string? StaffIds;
&#125;

class FilterDutyRosterChangeAssignDTO &#123;
    DateTime AssignDate; string? StaffIds;
&#125;

class SwitchAssignDTO &#123;
    DateTime StartDate; DateTime EndDate; string? StaffIds;
&#125;

class ChangeAssignDTO &#123;
    DateTime AssignDate; string? AssignIds; string? StaffIds;
&#125;</code></pre>
      </section>

      <!-- Permissions -->
      <section class="card">
        <h2>Permissions</h2>
        <table>
          <thead><tr><th>Endpoint</th><th>Program Access Check</th><th>Dept/OrgGroup Access Filter</th></tr></thead>
          <tbody>
            <tr><td><code>GetDutyRosterHeader</code></td><td><code>permission_Duty_Roaster</code> (read)</td><td>—</td></tr>
            <tr><td><code>GetDutyRoster</code></td><td><code>permission_Duty_Roaster</code> (read)</td><td>Yes — allow/deny lists applied to staff query</td></tr>
            <tr><td><code>GetDutyRosterSwitchAssign</code></td><td><code>permission_Duty_Roaster</code> (read)</td><td>Via stored procedure (passes requestid)</td></tr>
            <tr><td><code>GetDutyRosterChangeAssign</code></td><td><code>permission_Duty_Roaster</code> (read)</td><td>Via stored procedure (passes requestid)</td></tr>
            <tr><td><code>SwitchAssign</code></td><td><code>permission_Duty_Roaster</code> (read)</td><td>Yes — allow/deny lists applied to staff query</td></tr>
            <tr><td><code>ChangeAssign</code></td><td><code>permission_Duty_Roaster</code> (read)</td><td>Yes — allow/deny lists applied to staff query</td></tr>
            <tr><td><code>SaveDailyAssign</code></td><td><code>permission_Duty_Roaster</code> (read)</td><td>Yes — AnyAsync check against allow/deny lists</td></tr>
            <tr><td><code>AssignGetAll</code></td><td><code>permission_Duty_Roaster</code> (read)</td><td>—</td></tr>
            <tr><td>Excel export (frontend)</td><td><code>checkExcelExportPermission(currentRoute)</code></td><td>—</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Off-Day Assign Convention -->
      <section class="card">
        <h2>Off-Day Assign Convention</h2>
        <p>The special assign ID <code>&#123;licenseId&#125;077</code> (e.g. "ABC-001077") represents a day-off. This ID:</p>
        <ul>
          <li>Is used in <code>IsStaffDayOff()</code> in the Attendance Calendar to detect off days.</li>
          <li>Its <code>AssignColour</code> is loaded as <code>offDayAssignColor</code> in the duty roster and used to override the background color of any cell on a public holiday.</li>
          <li>Is shown in the roster with its code label (e.g. "OFF") like any other assign.</li>
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
export class DutyRosterComponent {}
