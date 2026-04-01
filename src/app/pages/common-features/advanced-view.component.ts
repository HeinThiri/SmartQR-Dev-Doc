import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-advanced-view',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/common-features" class="back-link">
        <i class="bi bi-arrow-left"></i> Common Features
      </a>
      <h1>Advanced View</h1>
      <p class="subtitle">Grid state management system -- save, load, share, and manage custom views of data grids. Appears as a floating action button (FAB) at the bottom-right of supported listing pages. Supports custom SQL queries, policy-based toolbar controls, and page-level filter persistence.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- 1. Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>Advanced View allows users to save complex grid configurations and reuse them across sessions. Views are shared across all users within the same license. The toolbar also supports custom SQL queries for advanced analytics and policy-based auto-apply on page load.</p>

        <h3>Key Capabilities</h3>
        <ul>
          <li><strong>Save / Load / Share Views</strong> -- Persist grid state (sorting, grouping, column visibility, filters) to the database and share with all license users</li>
          <li><strong>Custom SQL Queries</strong> -- Execute admin-defined SQL queries with dynamic column generation for cross-table summaries and analytics</li>
          <li><strong>Policy-Based Toolbar</strong> -- Policies determine which toolbar buttons are available and can auto-apply a default view on page load</li>
          <li><strong>Page Filter Integration</strong> -- Optionally save page-level filters (date ranges, status dropdowns, search keywords) alongside grid state</li>
          <li><strong>Smart Period Handling</strong> -- Period types (Today, This Week, This Month, etc.) recalculate dates based on current date when loading saved views; only Custom period preserves exact dates</li>
        </ul>

        <h3>Grid-Level State (Always Saved)</h3>
        <ul>
          <li>Column sorting (single and multi-column)</li>
          <li>Column grouping (multi-level)</li>
          <li>Column visibility and order</li>
          <li>Column width</li>
          <li>Grid-level filters (filter row, header filter)</li>
        </ul>

        <h3>Page-Level State (Optional)</h3>
        <ul>
          <li>Date range filters (period selectors, from/to dates)</li>
          <li>Status dropdowns</li>
          <li>Search keywords</li>
          <li>Department / Employee / Division / Section filters</li>
          <li>Any custom page-level filter state</li>
        </ul>

        <h3>What Does NOT Get Saved</h3>
        <ul>
          <li>Selected rows or row focus</li>
          <li>Scroll position</li>
          <li>Expanded/collapsed groups</li>
          <li>Inline editing state</li>
        </ul>
      </section>

      <!-- 2. Database Diagram -->
      <section class="card">
        <h2>Database Diagram</h2>
        <div class="er-diagram">
          <div class="er-layer">
            <div class="er-label">Advanced View Storage</div>
            <div class="er-row">
              <div class="er-table er-primary">
                <div class="er-title"><i class="bi bi-table"></i> SysMenuAdvancedList</div>
                <div class="er-field"><span class="er-key">PK</span> AdvancedViewID</div>
                <div class="er-field"><span class="er-fk">FK</span> MenuID</div>
                <div class="er-field">ViewName</div>
                <div class="er-field">Grouping</div>
                <div class="er-field">Sorting</div>
                <div class="er-field">Columns</div>
                <div class="er-field">Filtered</div>
                <div class="er-field">PageFilterState</div>
                <div class="er-field">CustomQuery</div>
                <div class="er-field">LicenseID</div>
              </div>
              <div class="er-connector"><div class="er-line"></div> N:1 <div class="er-line"></div></div>
              <div class="er-table er-small">
                <div class="er-title"><i class="bi bi-table"></i> SysMenu</div>
                <div class="er-field"><span class="er-key">PK</span> MenuID</div>
                <div class="er-field">MenuName</div>
                <div class="er-field">LinkPage (route mapping)</div>
              </div>
            </div>
          </div>
        </div>
        <h3>Column Reference</h3>
        <table>
          <thead><tr><th>Column</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>AdvancedViewID</code></td><td>nvarchar(50)</td><td>Primary key (GUID)</td></tr>
            <tr><td><code>MenuID</code></td><td>nvarchar(50)</td><td>FK to SysMenu -- associates view with a page</td></tr>
            <tr><td><code>ViewName</code></td><td>nvarchar(50)</td><td>User-friendly display name</td></tr>
            <tr><td><code>Grouping</code></td><td>nvarchar(max)</td><td>JSON array of column grouping configuration</td></tr>
            <tr><td><code>Sorting</code></td><td>nvarchar(max)</td><td>JSON array of sort order and direction</td></tr>
            <tr><td><code>Columns</code></td><td>nvarchar(max)</td><td>JSON array of column visibility, width, order, filterValues</td></tr>
            <tr><td><code>Filtered</code></td><td>nvarchar(max)</td><td>JSON filter row values</td></tr>
            <tr><td><code>PageFilterState</code></td><td>nvarchar(max)</td><td>JSON page-level filter state (dates, status, search)</td></tr>
            <tr><td><code>CustomQuery</code></td><td>nvarchar(max)</td><td>Custom SQL query (admin-only, not UI-editable)</td></tr>
            <tr><td><code>LicenseID</code></td><td>varchar(50)</td><td>Multi-tenancy isolation key</td></tr>
            <tr><td><code>Active</code></td><td>bit</td><td>Soft delete flag</td></tr>
            <tr><td><code>CreatedBy / ModifiedBy</code></td><td>nvarchar(50)</td><td>Audit trail</td></tr>
            <tr><td><code>CreatedOn / ModifiedOn</code></td><td>datetime</td><td>Audit timestamps</td></tr>
          </tbody>
        </table>
      </section>

      <!-- 3. Architecture Flow -->
      <section class="card">
        <h2>Architecture Flow</h2>
        <p>End-to-end flow of how the Advanced View feature works, from user interaction to data persistence.</p>

        <h3>Component Architecture</h3>
        <table>
          <thead><tr><th>Layer</th><th>File</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td>UI Component</td><td><code>shared/ui/advanced-view-toolbar/</code></td><td>FAB toolbar UI (collapsed/expanded states)</td></tr>
            <tr><td>Service</td><td><code>services/advanced-view.service.ts</code></td><td>State management with BehaviorSubjects (currentView$, availableViews$, isDirty$)</td></tr>
            <tr><td>DTO</td><td><code>dto/advanced-view-dto.ts</code></td><td>Data transfer objects</td></tr>
            <tr><td>Backend API</td><td><code>APIs/System_Module/AdvancedViewApi.cs</code></td><td>REST API endpoints</td></tr>
            <tr><td>Business Logic</td><td><code>Infrastructure/.../AdvancedViewController.cs</code></td><td>Query execution, validation, CRUD</td></tr>
          </tbody>
        </table>

        <h3>Save Flow</h3>
        <div class="flow">
          <div class="flow-step">
            <div class="flow-num">1</div>
            <div><strong>User configures grid</strong><p>Sorts, groups, filters, reorders/hides columns, adjusts widths</p></div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">2</div>
            <div><strong>Dirty flag set</strong><p>Orange badge appears on FAB indicating unsaved changes</p></div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">3</div>
            <div><strong>User clicks Save / Save As</strong><p>Grid state captured + pageFilterProvider() called to get page filters</p></div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">4</div>
            <div><strong>State serialized to JSON</strong><p>Grouping, Sorting, Columns (with filterValues), Filtered, PageFilterState all serialized</p></div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">5</div>
            <div><strong>Sent to API and stored</strong><p>POST to /AdvancedViewApi -- saved to SysMenuAdvancedList table, dirty flag reset</p></div>
          </div>
        </div>

        <h3>Load Flow</h3>
        <div class="flow">
          <div class="flow-step">
            <div class="flow-num">1</div>
            <div><strong>User selects view from dropdown</strong><p>Or default view auto-applied by policy on page load</p></div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">2</div>
            <div><strong>Grid state applied</strong><p>beginUpdate() -> clear previous state -> apply sorting/grouping/columns -> endUpdate()</p></div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">3</div>
            <div><strong>Header filters applied separately</strong><p>filterValues applied AFTER endUpdate() with setTimeout(50ms) for array-bound grids</p></div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">4</div>
            <div><strong>Page filters restored</strong><p>pageFiltersLoaded event emitted -- component applies filters and calls loadList()</p></div>
          </div>
        </div>

        <h3>State Management (Observable Streams)</h3>
        <pre><code>// AdvancedViewService maintains three BehaviorSubjects:
currentView$: Observable&lt;AdvancedViewDTO | null&gt;
availableViews$: Observable&lt;AdvancedViewDTO[]&gt;
isDirty$: Observable&lt;boolean&gt;</code></pre>
      </section>

      <!-- 4. Custom Query Feature -->
      <section class="card">
        <h2>Custom Query Feature</h2>
        <p>Execute custom SQL queries and display results with dynamically generated columns. Useful for cross-table summaries, analytics, joins, aggregations, and stored procedures that cannot be represented by standard grid configurations.</p>

        <div class="warning">
          <i class="bi bi-exclamation-triangle"></i>
          <strong>Security:</strong> All custom queries MUST include <code>&#64;LicenseID</code> parameter in a WHERE clause. Queries without it are REJECTED by the backend. Custom queries are NOT editable through the UI -- admin-only database updates.
        </div>

        <h3>How It Works</h3>
        <ol>
          <li>Database admin inserts a custom query into <code>SysMenuAdvancedList.CustomQuery</code> column</li>
          <li>When the view is loaded, the toolbar detects the custom query</li>
          <li>Toolbar calls <code>POST /AdvancedViewApi/ExecuteCustomQuery</code></li>
          <li>Backend validates <code>&#64;LicenseID</code> presence, executes with parameterized query</li>
          <li>Column definitions dynamically generated from result schema</li>
          <li>Data and columns returned to frontend, grid columns rebuilt</li>
          <li>A blue "Custom Query" badge appears on the toolbar</li>
        </ol>

        <h3>Supported Query Types</h3>
        <ul>
          <li>SELECT with JOINs and aggregations</li>
          <li>Stored procedures: <code>EXEC sp_Name &#64;LicenseID = &#64;LicenseID</code></li>
          <li>Subqueries and CTEs</li>
        </ul>

        <h3>SQL to DevExtreme Type Mapping</h3>
        <table>
          <thead><tr><th>SQL Type</th><th>DevExtreme Type</th></tr></thead>
          <tbody>
            <tr><td>VARCHAR, NVARCHAR, TEXT</td><td>string</td></tr>
            <tr><td>INT, BIGINT, SMALLINT</td><td>number</td></tr>
            <tr><td>DECIMAL, FLOAT, REAL</td><td>number</td></tr>
            <tr><td>DATETIME, DATE, TIME</td><td>date</td></tr>
            <tr><td>BIT</td><td>boolean</td></tr>
          </tbody>
        </table>

        <h3>Column Naming</h3>
        <ul>
          <li>Column names become <code>dataField</code> in the grid</li>
          <li>Underscores converted to spaces for display (e.g., <code>Total_Amount</code> becomes "Total Amount")</li>
          <li>Use <code>AS</code> aliases to control names: <code>SELECT SUM(Amount) AS "Total Amount"</code></li>
        </ul>

        <h3>Example: Employee Penalties Summary</h3>
        <pre><code>SELECT
  e.EmployeeName AS "Employee",
  e.DepartmentName AS "Department",
  COUNT(p.PenaltyID) AS "Total Penalties",
  SUM(p.DeductionAmount) AS "Total Deductions",
  MAX(p.PenaltyDate) AS "Last Penalty Date"
FROM EmpPenalty p
INNER JOIN EmpView e ON p.EmployeeID = e.EmployeeID
WHERE p.LicenseID = &#64;LicenseID
GROUP BY e.EmployeeName, e.DepartmentName
ORDER BY "Total Deductions" DESC</code></pre>

        <h3>Example: Department Budget Analysis</h3>
        <pre><code>SELECT
  d.DepartmentName AS "Department",
  COUNT(e.EmployeeID) AS "Headcount",
  SUM(e.BasicSalary) AS "Total Salary",
  AVG(e.BasicSalary) AS "Avg Salary"
FROM Department d
INNER JOIN EmpView e ON d.DepartmentID = e.DepartmentID
WHERE d.LicenseID = &#64;LicenseID AND e.Active = 1
GROUP BY d.DepartmentName
ORDER BY "Total Salary" DESC</code></pre>

        <h3>Example: Stored Procedure</h3>
        <pre><code>EXEC sp_GetEmployeeLeaveAnalysis &#64;LicenseID = &#64;LicenseID</code></pre>

        <h3>Insert Custom Query via SQL</h3>
        <pre><code>INSERT INTO SysMenuAdvancedList (
  AdvancedViewID, MenuID, ViewName, CustomQuery,
  Active, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn,
  LastAction, LicenseID
) VALUES (
  NEWID(),
  '689158b3-ed8d-4aa9-96fa-1c7c1afe9934', -- Penalty List MenuID
  'Employee Penalties Summary',
  'SELECT e.EmployeeName, COUNT(*) AS PenaltyCount
   FROM EmpPenalty p INNER JOIN EmpView e ON p.EmployeeID = e.EmployeeID
   WHERE p.LicenseID = &#64;LicenseID
   GROUP BY e.EmployeeName',
  1, 'admin', GETDATE(), 'admin', GETDATE(), 'CREATE', 'your-license-id'
);</code></pre>

        <h3>Troubleshooting Custom Queries</h3>
        <table>
          <thead><tr><th>Problem</th><th>Solution</th></tr></thead>
          <tbody>
            <tr><td>Security error</td><td>Add <code>WHERE LicenseID = &#64;LicenseID</code> to query</td></tr>
            <tr><td>Timeout (60s limit)</td><td>Optimize query with indexes, add WHERE clauses to reduce volume</td></tr>
            <tr><td>No data returned</td><td>Verify &#64;LicenseID filter and data existence for current license</td></tr>
            <tr><td>Columns not displaying</td><td>Use AS aliases with clean names, avoid special characters</td></tr>
            <tr><td>Query not executing</td><td>Check CustomQuery field populated and Active = 1</td></tr>
          </tbody>
        </table>
      </section>

      <!-- 5. Policy-Based Toolbar -->
      <section class="card">
        <h2>Policy-Based Toolbar</h2>
        <p>The Advanced View toolbar supports a policy system that controls which buttons are available and enables auto-applying a default view when the page loads.</p>

        <h3>What Policies Provide</h3>
        <ul>
          <li><strong>Button Visibility</strong> -- Control which toolbar actions (Save, Save As, Rename, Delete, Reset) are shown</li>
          <li><strong>Default View</strong> -- Automatically apply a specific view when the page loads, without user interaction</li>
          <li><strong>Auto-Apply on Page Load</strong> -- When a default view is configured, it is applied as soon as the grid data loads</li>
          <li><strong>Dirty State Tracking</strong> -- Orange badge indicator appears when the grid state differs from the saved view</li>
        </ul>

        <h3>Toolbar Buttons</h3>
        <table>
          <thead><tr><th>Button</th><th>Icon</th><th>Action</th><th>Disabled When</th></tr></thead>
          <tbody>
            <tr><td><strong>Save</strong></td><td>mdi-content-save + text</td><td>Save changes to current view (shows * when dirty)</td><td>No view selected</td></tr>
            <tr><td><strong>Save As</strong></td><td>mdi-content-save-plus + text</td><td>Create new view with name validation (must be unique)</td><td>Never</td></tr>
            <tr><td><strong>Rename</strong></td><td>mdi-pencil (icon only)</td><td>Rename existing view, preserves all settings</td><td>No view selected</td></tr>
            <tr><td><strong>Delete</strong></td><td>mdi-delete (icon only)</td><td>Remove view with confirmation dialog</td><td>No view selected</td></tr>
            <tr><td><strong>Reset</strong></td><td>mdi-refresh (icon only)</td><td>Clear all sorting/grouping/filters to default</td><td>Never</td></tr>
          </tbody>
        </table>

        <h3>FAB (Floating Action Button) States</h3>
        <p><strong>Collapsed:</strong> Circular button with <code>mdi-view-dashboard</code> icon at bottom-right. Orange dot badge when dirty.</p>
        <p><strong>Expanded:</strong> Shows current view name, "Custom Query" badge if applicable, view dropdown, action buttons, and last modified info.</p>

        <h3>Unsaved Changes Warning</h3>
        <p>When switching views or selecting "No View" with unsaved changes, a dialog appears with three options:</p>
        <ul>
          <li><strong>Save</strong> -- Saves changes to current view, then switches</li>
          <li><strong>Discard</strong> -- Discards changes and switches to new view</li>
          <li><strong>Cancel</strong> -- Stays on current view</li>
        </ul>
      </section>

      <!-- 6. Developer Integration Guide -->
      <section class="card">
        <h2>Developer Integration Guide</h2>
        <p>Step-by-step instructions to add Advanced View to any listing page. Only 3 files need modification: the feature module, HTML template, and TypeScript component.</p>

        <h3>Prerequisites</h3>
        <ul>
          <li>Backend API <code>AdvancedViewApi</code> controller deployed and running</li>
          <li>Database table <code>SysMenuAdvancedList</code> exists</li>
          <li>Page has a DevExtreme <code>dx-data-grid</code> component</li>
          <li><code>UIModule</code> is available and exports <code>AdvancedViewToolbarComponent</code></li>
        </ul>

        <h3>Step 1: Find Your Menu ID</h3>
        <pre><code>SELECT SysMenuID, MenuName, SubMenuName
FROM SysMenu
WHERE Active = 1
  AND MenuName LIKE '%YourPageName%'
ORDER BY MenuName;</code></pre>
        <p><strong>Note:</strong> You can also use auto-detection by omitting <code>[menuID]</code>. The toolbar will resolve it from the current route via <code>GetByLinkPage</code> API. Auto-detection works when the browser URL matches <code>SysMenu.LinkPage</code>.</p>

        <h3>Step 2: Import UIModule</h3>
        <pre><code>import &#123; UIModule &#125; from 'src/app/shared/ui/ui.module';

&#64;NgModule(&#123;
  declarations: [YourListComponent],
  imports: [
    CommonModule,
    FormsModule,
    UIModule  // Add this
  ]
&#125;)
export class YourFeatureModule &#123; &#125;</code></pre>

        <h3>Step 3: Add Template Reference and Toolbar to HTML</h3>
        <pre><code>&lt;dx-data-grid
  #yourGrid
  [dataSource]="isCustomQueryView ? customQueryDataSource : dataSource"
  [showBorders]="true"
  [allowColumnReordering]="true"
  [allowColumnResizing]="true"&gt;

  &lt;dxo-header-filter [visible]="true"&gt;&lt;/dxo-header-filter&gt;
  &lt;dxo-filter-row [visible]="true"&gt;&lt;/dxo-filter-row&gt;
  &lt;dxo-group-panel [visible]="true"&gt;&lt;/dxo-group-panel&gt;
  &lt;dxo-column-chooser [enabled]="true"&gt;&lt;/dxo-column-chooser&gt;

  &lt;dxi-column dataField="name" caption="Name"&gt;&lt;/dxi-column&gt;
  &lt;!-- other columns --&gt;
&lt;/dx-data-grid&gt;

&lt;app-advanced-view-toolbar
  #advancedViewToolbar
  [dataGrid]="yourGrid"
  [menuID]="'YOUR-MENU-ID'"
  [pageFilterProvider]="getCurrentPageFilters.bind(this)"
  (pageFiltersLoaded)="onPageFiltersLoaded($event)"
  (customQueryDataLoaded)="onCustomQueryDataLoaded($event)"&gt;
&lt;/app-advanced-view-toolbar&gt;</code></pre>

        <h3>Step 4: Add ViewChild and Handler Methods</h3>
        <pre><code>import &#123; Component, ViewChild &#125; from '&#64;angular/core';
import &#123; DxDataGridComponent &#125; from 'devextreme-angular';
import &#123; AdvancedViewToolbarComponent &#125; from
  'src/app/shared/ui/advanced-view-toolbar/advanced-view-toolbar.component';

export class YourListComponent &#123;
  &#64;ViewChild('yourGrid', &#123; static: false &#125;)
    yourGrid!: DxDataGridComponent;
  &#64;ViewChild('advancedViewToolbar', &#123; static: false &#125;)
    advancedViewToolbar!: AdvancedViewToolbarComponent;

  dataSource: any[] = [];
  customQueryDataSource: any[] = [];
  isCustomQueryView: boolean = false;

  // Page filter properties (adjust to your page)
  selectedPeriod: string = 'thisMonth';
  fromDate: Date = new Date();
  toDate: Date = new Date();
  selectedStatus: string = 'all';
  searchKeyword: string = '';

  loadList(): void &#123;
    this.yourService.getList(this.fromDate, this.toDate,
      this.selectedStatus, this.searchKeyword
    ).subscribe(&#123;
      next: (response) =&gt; &#123;
        this.dataSource = response.data || [];
        // IMPORTANT: Apply pending view state after data loads
        setTimeout(() =&gt; &#123;
          if (this.advancedViewToolbar) &#123;
            this.advancedViewToolbar.applyPendingViewState();
          &#125;
        &#125;, 100);
      &#125;
    &#125;);
  &#125;

  getCurrentPageFilters(): any &#123;
    return &#123;
      selectedPeriod: this.selectedPeriod,
      fromDate: this.fromDate.toISOString(),
      toDate: this.toDate.toISOString(),
      selectedStatus: this.selectedStatus,
      searchKeyword: this.searchKeyword
    &#125;;
  &#125;

  onPageFiltersLoaded(pageFilters: any): void &#123;
    const wasCustomQuery = this.isCustomQueryView;
    this.isCustomQueryView = false;
    this.customQueryDataSource = [];

    if (wasCustomQuery || !pageFilters) &#123;
      this.loadList();
      return;
    &#125;
    try &#123;
      if (pageFilters.selectedPeriod !== undefined)
        this.selectedPeriod = pageFilters.selectedPeriod;
      if (pageFilters.fromDate)
        this.fromDate = new Date(pageFilters.fromDate);
      if (pageFilters.toDate)
        this.toDate = new Date(pageFilters.toDate);
      if (pageFilters.selectedStatus !== undefined)
        this.selectedStatus = pageFilters.selectedStatus;
      if (pageFilters.searchKeyword !== undefined)
        this.searchKeyword = pageFilters.searchKeyword || '';
      this.loadList();
    &#125; catch (error) &#123;
      console.error('Failed to apply page filters:', error);
      this.loadList();
    &#125;
  &#125;

  onCustomQueryDataLoaded(data: any[]): void &#123;
    this.isCustomQueryView = true;
    this.customQueryDataSource = data || [];
    this.recordCount = this.customQueryDataSource.length;
  &#125;
&#125;</code></pre>

        <h3>Manual vs Auto-Detection</h3>
        <table>
          <thead><tr><th>Approach</th><th>Code</th><th>Best For</th></tr></thead>
          <tbody>
            <tr><td>Manual</td><td><code>[menuID]="'abc-123'"</code></td><td>Production code, explicit control</td></tr>
            <tr><td>Auto-Detection</td><td>Omit menuID parameter</td><td>Quick integration, cleaner code. Works when route matches SysMenu.LinkPage</td></tr>
          </tbody>
        </table>
      </section>

      <!-- 7. Page Filter Integration -->
      <section class="card">
        <h2>Page Filter Integration</h2>
        <p>Page filter integration is <strong>optional</strong> and backward-compatible. Without it, only grid-level state is saved. With it, users get complete page snapshots.</p>

        <h3>How It Works</h3>
        <h4>Saving</h4>
        <ol>
          <li>User configures both grid and page filters</li>
          <li>User clicks Save / Save As</li>
          <li>Toolbar calls <code>pageFilterProvider()</code> to get current page filter state</li>
          <li>Page filter state serialized to JSON and stored in <code>PageFilterState</code> column</li>
          <li>Grid state stored in existing columns (Grouping, Sorting, Columns, Filtered)</li>
        </ol>

        <h4>Loading</h4>
        <ol>
          <li>User selects a saved view from dropdown</li>
          <li>Toolbar applies grid state to the grid</li>
          <li>Toolbar emits <code>pageFiltersLoaded</code> event with the saved page filter state</li>
          <li>Component receives event, applies filters, and calls <code>loadList()</code></li>
        </ol>

        <h3>Without vs With Page Filters</h3>
        <h4>Without (grid-only):</h4>
        <pre><code>&lt;app-advanced-view-toolbar
  [dataGrid]="yourGrid"&gt;
&lt;/app-advanced-view-toolbar&gt;</code></pre>

        <h4>With page filters:</h4>
        <pre><code>&lt;app-advanced-view-toolbar
  [dataGrid]="yourGrid"
  [pageFilterProvider]="getCurrentPageFilters.bind(this)"
  (pageFiltersLoaded)="onPageFiltersLoaded($event)"&gt;
&lt;/app-advanced-view-toolbar&gt;</code></pre>

        <h3>Input Properties</h3>
        <table>
          <thead><tr><th>Property</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>dataGrid</code></td><td>DxDataGridComponent</td><td>Yes</td><td>Reference to the DevExtreme grid</td></tr>
            <tr><td><code>menuID</code></td><td>string</td><td>No</td><td>Menu ID (auto-detected from route if omitted)</td></tr>
            <tr><td><code>pageFilterProvider</code></td><td>() =&gt; any</td><td>No</td><td>Function returning current page filter state</td></tr>
          </tbody>
        </table>

        <h3>Output Events</h3>
        <table>
          <thead><tr><th>Event</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>pageFiltersLoaded</code></td><td>EventEmitter&lt;any&gt;</td><td>Emitted when a view with page filters is loaded</td></tr>
            <tr><td><code>customQueryDataLoaded</code></td><td>EventEmitter&lt;any[]&gt;</td><td>Emitted when a custom query view returns data</td></tr>
          </tbody>
        </table>

        <h3>Best Practices</h3>
        <ul>
          <li><strong>Serialize dates as ISO strings:</strong> <code>this.fromDate.toISOString()</code> when saving; <code>new Date(pageFilters.fromDate)</code> when loading</li>
          <li><strong>Check for undefined:</strong> Always guard with <code>if (pageFilters.field !== undefined)</code> before applying</li>
          <li><strong>Reload data after applying:</strong> Always call <code>this.loadList()</code> after restoring page filters</li>
          <li><strong>Use .bind(this):</strong> The pageFilterProvider must be bound: <code>getCurrentPageFilters.bind(this)</code></li>
          <li><strong>Wrap in try-catch:</strong> Handle errors gracefully in <code>onPageFiltersLoaded</code></li>
        </ul>
      </section>

      <!-- 8. Integration Tracker -->
      <section class="card">
        <h2>Integration Tracker</h2>
        <p>Pages currently integrated with Advanced View and their supported features.</p>
        <table>
          <thead><tr><th>#</th><th>Module</th><th>Page</th><th>Route</th><th>Features</th><th>Date</th></tr></thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Employee Module</td>
              <td>Contract List</td>
              <td><code>/employee-module/contract-list</code></td>
              <td>Grid state, Custom queries, Page filters (period, dates, status, search, division/dept/section), Smart period handling, Auto menu detection</td>
              <td>2025-02-14</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Attendance Module</td>
              <td>Penalty List</td>
              <td><code>/attendance-module/penalty-list</code></td>
              <td>Grid state, Custom queries, Page filters (period, dates, status, search), Smart period handling, Auto menu detection</td>
              <td>2025-02-14</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Attendance Module</td>
              <td>Activity Log List</td>
              <td><code>/attendance-module/activity-log-list</code></td>
              <td>Grid state, Custom queries, Page filters (period, dates, search), Smart period handling, Auto menu detection</td>
              <td>2025-02-14</td>
            </tr>
          </tbody>
        </table>

        <h3>Planned Integrations</h3>
        <ul>
          <li>Daily Overtime List</li>
          <li>Leave Request List</li>
          <li>Shift List</li>
          <li>Department List</li>
          <li>Section List</li>
          <li>Position List</li>
          <li>Employee List</li>
        </ul>

        <h3>Per-Page Integration Checklist</h3>
        <table>
          <thead><tr><th>#</th><th>Task</th><th>Required</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Import <code>UIModule</code> in feature module</td><td>Yes</td></tr>
            <tr><td>2</td><td>Add <code>#gridRef</code> template reference to <code>&lt;dx-data-grid&gt;</code></td><td>Yes</td></tr>
            <tr><td>3</td><td>Add <code>ViewChild</code> references for grid and toolbar</td><td>Yes</td></tr>
            <tr><td>4</td><td>Add <code>&lt;app-advanced-view-toolbar&gt;</code> after grid closing tag</td><td>Yes</td></tr>
            <tr><td>5</td><td>Add <code>customQueryDataSource</code> and <code>isCustomQueryView</code> properties</td><td>Yes</td></tr>
            <tr><td>6</td><td>Update grid <code>[dataSource]</code> to conditionally use custom query data</td><td>Yes</td></tr>
            <tr><td>7</td><td>Update <code>loadList()</code> to call <code>applyPendingViewState()</code> after data loads</td><td>Yes</td></tr>
            <tr><td>8</td><td>Implement <code>getCurrentPageFilters()</code></td><td>Optional</td></tr>
            <tr><td>9</td><td>Implement <code>onPageFiltersLoaded()</code> with custom query mode reset</td><td>Optional</td></tr>
            <tr><td>10</td><td>Implement <code>onCustomQueryDataLoaded()</code></td><td>Optional</td></tr>
            <tr><td>11</td><td>Test all CRUD operations (create/load/update/delete views)</td><td>Yes</td></tr>
            <tr><td>12</td><td>Verify menuID auto-detection works</td><td>Yes</td></tr>
          </tbody>
        </table>
      </section>

      <!-- 9. API Endpoints -->
      <section class="card">
        <h2>API Endpoints</h2>
        <p>Backend REST API for Advanced View CRUD operations and custom query execution.</p>

        <h3>Service Methods</h3>
        <table>
          <thead><tr><th>Method</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>loadViewsByMenu(menuID)</code></td><td>Loads all views for a specific menu</td></tr>
            <tr><td><code>getViewByID(viewID)</code></td><td>Retrieves a specific view by ID</td></tr>
            <tr><td><code>createView(request)</code></td><td>Creates a new view</td></tr>
            <tr><td><code>updateView(request)</code></td><td>Updates an existing view</td></tr>
            <tr><td><code>deleteView(viewID)</code></td><td>Soft-deletes a view</td></tr>
            <tr><td><code>setCurrentView(view)</code></td><td>Sets the active view in state</td></tr>
            <tr><td><code>setDirty(dirty)</code></td><td>Marks state as modified</td></tr>
            <tr><td><code>parseGridState(view)</code></td><td>Parses JSON strings to GridState object</td></tr>
            <tr><td><code>serializeGridState(state)</code></td><td>Serializes GridState to JSON strings</td></tr>
          </tbody>
        </table>

        <h3>Execute Custom Query</h3>
        <p><strong>POST</strong> <code>/AdvancedViewApi/ExecuteCustomQuery</code></p>
        <pre><code>// Request
&#123; "customQuery": "SELECT ... WHERE LicenseID = &#64;LicenseID" &#125;

// Response
&#123;
  "statusTerm": "success",
  "resultObject": &#123;
    "data": [
      &#123; "EmployeeName": "John Doe", "TotalPenalties": 5 &#125;,
      &#123; "EmployeeName": "Jane Smith", "TotalPenalties": 2 &#125;
    ],
    "columns": [
      &#123; "dataField": "EmployeeName", "caption": "Employee Name", "dataType": "string" &#125;,
      &#123; "dataField": "TotalPenalties", "caption": "Total Penalties", "dataType": "number" &#125;
    ]
  &#125;
&#125;</code></pre>

        <h3>Get Views by Menu</h3>
        <p><strong>GET</strong> <code>/AdvancedViewApi/GetViewsByMenuID/&#123;menuID&#125;</code></p>

        <h3>Get Menu by Route (Auto-Detection)</h3>
        <p><strong>GET</strong> <code>/AdvancedViewApi/GetByLinkPage</code> -- Resolves MenuID from the current page route</p>

        <h3>Backend Validation (Custom Query)</h3>
        <pre><code>// C# Backend -- rejects queries without &#64;LicenseID
if (!request.CustomQuery.Contains("&#64;LicenseID",
    StringComparison.OrdinalIgnoreCase))
&#123;
  return new ServiceActionResult(ReturnStatus.BadRequest,
    "Security Error: Custom query must include &#64;LicenseID parameter");
&#125;</code></pre>
      </section>

      <!-- 10. Permissions -->
      <section class="card">
        <h2>Permissions &amp; Access Control</h2>

        <h3>View Sharing Model</h3>
        <ul>
          <li>All views are stored per <code>LicenseID</code> -- users only see views for their license</li>
          <li>All users within the same license can see, load, edit, and delete any view (collaborative workspace)</li>
          <li>Views are stored in the database, not browser storage -- they sync across devices and browsers</li>
        </ul>

        <h3>Custom Query Access</h3>
        <ul>
          <li>Custom queries are <strong>NOT editable through the UI</strong> -- only database administrators can insert/update them</li>
          <li>Users can only <strong>view and execute</strong> pre-defined custom queries</li>
          <li>The <code>&#64;LicenseID</code> parameter is automatically injected by the backend based on the authenticated user</li>
        </ul>

        <h3>Security Notes</h3>
        <ul>
          <li>SQL injection protection via parameterized queries (&#64;LicenseID is the ONLY supported parameter)</li>
          <li>Do NOT allow user input in custom queries</li>
          <li>Ensure custom queries only expose data appropriate for the user's role</li>
          <li>Apply row-level security requirements where applicable</li>
          <li>Query execution timeout: 60 seconds</li>
        </ul>
      </section>

      <!-- 11. Doc Log -->
      <section class="card">
        <h2>Doc Log</h2>
        <table>
          <thead><tr><th>Date</th><th>Author</th><th>Change</th></tr></thead>
          <tbody>
            <tr><td>2026-03-27</td><td>Hein Htet Zaw</td><td>Initial documentation</td></tr>
            <tr><td>2026-03-27</td><td>Hein Htet Zaw</td><td>Expanded with custom query, policy toolbar, integration guide, page filter integration, integration tracker, API reference, and permissions</td></tr>
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
      padding: 12px 16px; margin: 0 0 14px;
      display: flex; align-items: flex-start; gap: 10px;
      font-size: 14px; color: #7a6100;
    }
    .warning i { font-size: 18px; color: #f9a825; flex-shrink: 0; margin-top: 1px; }

    .flow { display: flex; flex-direction: column; align-items: flex-start; gap: 0; }
    .flow-step {
      display: flex; align-items: flex-start; gap: 14px;
      background: #f8f9ff; border-radius: 10px; padding: 14px 18px; width: 100%;
    }
    .flow-num {
      width: 28px; height: 28px; flex-shrink: 0;
      background: #6c8cff; color: #fff; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px;
    }
    .flow-step strong { font-size: 14px; display: block; margin-bottom: 2px; }
    .flow-step p { margin: 0; font-size: 13px; color: #666; }
    .flow-arrow { padding: 4px 0 4px 12px; color: #6c8cff; font-size: 16px; }

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
  `]
})
export class AdvancedViewComponent {}
