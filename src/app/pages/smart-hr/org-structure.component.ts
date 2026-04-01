import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-org-structure',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-hr" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart HR
      </a>
      <h1>Organization Structure</h1>
      <p class="subtitle">Interactive, zoomable, and collapsible org chart displaying the company hierarchy from root down to individual employees across Group, Division, Department, Section, and Staff levels.</p>
      <div class="meta-row">
        <span class="meta-badge module"><i class="bi bi-box"></i> Employee Module</span>
        <span class="meta-badge code"><i class="bi bi-hash"></i> PGM-OrgChart</span>
        <span class="meta-badge status"><i class="bi bi-check-circle"></i> Complete</span>
      </div>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Architecture -->
      <section class="card">
        <h2>Architecture</h2>
        <table>
          <thead><tr><th>Layer</th><th>File</th></tr></thead>
          <tbody>
            <tr><td>Angular Component</td><td><code>employee-module/org-structure-chart/org-chart/org-chart.component.ts</code></td></tr>
            <tr><td>Angular Template</td><td><code>org-chart/org-chart.component.html</code></td></tr>
            <tr><td>Angular Service</td><td><code>services/config/org-chart.service.ts</code></td></tr>
            <tr><td>REST API</td><td><code>SmartHR_API/APIs/Config_Module/OrgChartApi.cs</code></td></tr>
            <tr><td>Business Logic</td><td><code>SmartHR_API/Infrastructure/Repository/Config_Module/OrgChartController.cs</code></td></tr>
          </tbody>
        </table>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-display"></i> OrgChartComponent<small>PrimeNG p-organizationChart</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-gear"></i> org-chart.service.ts<small>Angular Service</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-cloud"></i> OrgChartApi.cs<small>REST Controller</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-database"></i> SQL Server<small>6 DB Views</small></div>
          </div>
        </div>
      </section>

      <!-- Database Diagram -->
      <section class="card">
        <h2>Database Tables &amp; Views</h2>
        <p>Six queries are executed to build the org tree:</p>

        <div class="er-diagram">
          <div class="er-table">
            <div class="er-header">HrOrgGroupView</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> OrgGroupID <span class="type">uniqueidentifier</span></div>
            <div class="er-row">OrgGroupName <span class="type">nvarchar</span></div>
            <div class="er-row">Active <span class="type">bit</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> LicenseID <span class="type">varchar</span></div>
          </div>

          <div class="er-relation">
            <span>1</span>
            <div class="er-line"></div>
            <span>N</span>
          </div>

          <div class="er-table">
            <div class="er-header">HrDivision</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> DivisionID <span class="type">uniqueidentifier</span></div>
            <div class="er-row">DivisionName <span class="type">nvarchar</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> OrgGroupID <span class="type">uniqueidentifier</span></div>
            <div class="er-row">Active <span class="type">bit</span></div>
          </div>

          <div class="er-relation">
            <span>1</span>
            <div class="er-line"></div>
            <span>N</span>
          </div>

          <div class="er-table">
            <div class="er-header">HrDepartmentView</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> DepartmentID <span class="type">uniqueidentifier</span></div>
            <div class="er-row">DepartmentName <span class="type">nvarchar</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> DivisionID <span class="type">uniqueidentifier</span></div>
            <div class="er-row">Active <span class="type">bit</span></div>
          </div>
        </div>

        <div class="er-diagram" style="margin-top: 16px;">
          <div class="er-table">
            <div class="er-header">HrDepartmentSectionView</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> SectionID <span class="type">uniqueidentifier</span></div>
            <div class="er-row">SectionName <span class="type">nvarchar</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> DepartmentID <span class="type">uniqueidentifier</span></div>
          </div>

          <div class="er-relation">
            <span></span>
            <div class="er-line"></div>
            <span></span>
          </div>

          <div class="er-table">
            <div class="er-header">HrPositionView</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> PositionID <span class="type">uniqueidentifier</span></div>
            <div class="er-row">PositionName <span class="type">nvarchar</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> LevelSeq <span class="type">int</span></div>
          </div>

          <div class="er-relation">
            <span></span>
            <div class="er-line"></div>
            <span></span>
          </div>

          <div class="er-table">
            <div class="er-header">HrStaffView</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> StaffID <span class="type">uniqueidentifier</span></div>
            <div class="er-row">StaffName <span class="type">nvarchar</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> DepartmentID <span class="type">uniqueidentifier</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> SectionID <span class="type">uniqueidentifier</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> PositionID <span class="type">uniqueidentifier</span></div>
            <div class="er-row">LevelCode <span class="type">int</span></div>
            <div class="er-row">IsOutSource <span class="type">bit</span></div>
          </div>
        </div>
      </section>

      <!-- API -->
      <section class="card">
        <h2>API Contract</h2>
        <table>
          <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><span class="method-get">GET</span></td><td><code>/OrgChartApi/GetOrgChart</code></td><td>Returns the full org tree (scoped by license &amp; access rights)</td></tr>
          </tbody>
        </table>
        <p>No query parameters. Result is scoped to the current user's license and access rights.</p>

        <h3>Response Shape</h3>
        <pre><code>&#123;
  "resultObject": &#123;
    "expanded": true,
    "type": "person",
    "level": "root",
    "data": &#123;
      "bgColor": "#196CD4",
      "color": "white",
      "name": "Organization Structure",
      "title": "",
      "lineType": "main"
    &#125;,
    "children": [
      &#123;
        "level": "group",
        "data": &#123; "name": "Finance Group", "title": "(12)", ... &#125;,
        "children": [
          &#123;
            "level": "division",
            "children": [
              &#123; "level": "department", "children": [
                &#123; "level": "section", "children": [
                  &#123; "level": "staff", "data": &#123; "name": "John", "subtitle": "Sr. Accountant" &#125; &#125;
                ] &#125;
              ] &#125;
            ]
          &#125;
        ]
      &#125;
    ]
  &#125;
&#125;</code></pre>
      </section>

      <!-- Tree Building Algorithm -->
      <section class="card">
        <h2>Tree Building Algorithm</h2>
        <h3>Pass 1 — Org Group to Staff Traversal</h3>
        <p>For each org group, all staff members are iterated (ordered by <code>LevelCode</code> descending). Intermediate nodes are inserted on the path using <code>AddOrGetChild</code>:</p>
        <pre><code>root
 └─ [Group] (AddOrGetChild)
     └─ [Division]   — if staff has DivisionId
         └─ [Department] — if staff has DepartmentId
             └─ [Section]    — if staff has SectionId
                 └─ [Staff]
             or (no section)
             └─ [Staff]</code></pre>
        <p><code>AddOrGetChild</code> deduplicates nodes by <code>(name, bgColor)</code> — if a node with the same name and color already exists as a child, it is reused instead of creating a duplicate.</p>

        <h3>Pass 2 — Position-based Sub-tree</h3>
        <p>For positions with <code>LevelSeq &ge; 30</code>, child positions that cross into a new Group/Department/Division/Section boundary get intermediate grouping nodes inserted via <code>BuildPositionNode</code>.</p>
      </section>

      <!-- Node Data Model -->
      <section class="card">
        <h2>Node Data Model</h2>
        <h3>OrgTreeNode</h3>
        <pre><code>class OrgTreeNode &#123;
    bool expanded;
    string type;      // always "person" (PrimeNG template name)
    string level;     // "root" | "group" | "division" | "department" | "section" | "staff"
    NodeData data;
    List&lt;OrgTreeNode&gt; children;
&#125;</code></pre>

        <h3>NodeData Fields</h3>
        <table>
          <thead><tr><th>Field</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>bgColor</code></td><td>Background color of the node card</td></tr>
            <tr><td><code>color</code></td><td>Text color</td></tr>
            <tr><td><code>name</code></td><td>Display name of the node</td></tr>
            <tr><td><code>title</code></td><td>Staff count badge, e.g. <code>"(12)"</code></td></tr>
            <tr><td><code>subtitle</code></td><td>Position name (staff nodes only)</td></tr>
            <tr><td><code>lineType</code></td><td><code>"main"</code> = solid border; <code>"obligated"</code> = dotted (outsourced)</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Node Color Scheme -->
      <section class="card">
        <h2>Node Color Scheme</h2>
        <div class="color-legend">
          <div class="color-row">
            <span class="color-box" style="background:#196CD4;"></span>
            <span><strong>Root</strong> — Organization (dark blue, white text)</span>
          </div>
          <div class="color-row">
            <span class="color-box" style="background:rgb(25,108,212);"></span>
            <span><strong>Group</strong> — Org Group (blue, white text)</span>
          </div>
          <div class="color-row">
            <span class="color-box" style="background:rgb(64,160,210);"></span>
            <span><strong>Division</strong> — Division (light blue, white text)</span>
          </div>
          <div class="color-row">
            <span class="color-box" style="background:rgb(145,217,255);"></span>
            <span><strong>Department</strong> — Department (sky blue, black text)</span>
          </div>
          <div class="color-row">
            <span class="color-box" style="background:rgb(196,225,243);"></span>
            <span><strong>Section</strong> — Section (pale blue, black text)</span>
          </div>
          <div class="color-row">
            <span class="color-box" style="background:#fff;border:2px solid #ddd;"></span>
            <span><strong>Staff</strong> — Employee (white, black text)</span>
          </div>
        </div>
        <h3>Border Styles</h3>
        <table>
          <thead><tr><th>lineType</th><th>Style</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><code>"main"</code></td><td>Solid border</td><td>Regular positions</td></tr>
            <tr><td><code>"obligated"</code></td><td>Dotted border</td><td>Outsourced positions (<code>IsOutSource = true</code>)</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Frontend Flow -->
      <section class="card">
        <h2>Frontend Initialization Flow</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-play-circle"></i> ngOnInit<small>Component init</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-building"></i> getCompanyName()<small>From localStorage</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-cloud-download"></i> loadOrgChart()<small>API call</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-pending"><i class="bi bi-tags"></i> addLabelsToTree()<small>node.label = node.data.name</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-eye"></i> changeView('group')<small>Default view level</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-diagram-3"></i> Chart Rendered<small>PrimeNG org chart</small></div>
          </div>
        </div>
      </section>

      <!-- View Modes -->
      <section class="card">
        <h2>View Modes</h2>
        <table>
          <thead><tr><th>Label</th><th>Value</th><th>Expanded Levels</th></tr></thead>
          <tbody>
            <tr><td>Division View</td><td><code>group</code></td><td>root, group</td></tr>
            <tr><td>Department View</td><td><code>division</code></td><td>root, group, division</td></tr>
            <tr><td>Section View</td><td><code>department</code></td><td>root, group, division, department</td></tr>
            <tr><td>View All</td><td><code>all</code></td><td>root, group, division, department, section, staff</td></tr>
          </tbody>
        </table>
        <p><code>changeView(view)</code> first collapses all nodes, then re-expands nodes whose <code>level</code> is in the allowed set.</p>

        <h3>Node Expansion Defaults</h3>
        <table>
          <thead><tr><th>Level</th><th>Default Expanded</th></tr></thead>
          <tbody>
            <tr><td>root</td><td>true</td></tr>
            <tr><td>group</td><td>true</td></tr>
            <tr><td>division</td><td>true</td></tr>
            <tr><td>department</td><td>false</td></tr>
            <tr><td>section</td><td>false</td></tr>
            <tr><td>staff</td><td>false</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Canvas Controls -->
      <section class="card">
        <h2>Canvas Controls (Floating Panel)</h2>
        <p>A draggable (CDK Drag) floating control panel provides:</p>
        <table>
          <thead><tr><th>Button</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><i class="bi bi-arrows-collapse"></i> Collapse All</td><td>Sets <code>expanded = false</code> on all nodes, scrolls to first</td></tr>
            <tr><td><i class="bi bi-arrows-expand"></i> Expand All</td><td>Sets <code>expanded = true</code> on all nodes, scrolls to first</td></tr>
            <tr><td><i class="bi bi-bullseye"></i> Center View</td><td>Scrolls chart node into view</td></tr>
            <tr><td><i class="bi bi-printer"></i> Print</td><td><code>expandAll()</code> then <code>window.print()</code> after 300ms</td></tr>
            <tr><td><i class="bi bi-arrow-counterclockwise"></i> Reset Zoom</td><td>Reset to 100%, offsets to 0</td></tr>
            <tr><td><i class="bi bi-zoom-out"></i> Zoom Out</td><td>-10% (min 10%)</td></tr>
            <tr><td><i class="bi bi-zoom-in"></i> Zoom In</td><td>+10% (max 200%)</td></tr>
            <tr><td><i class="bi bi-search"></i> Search</td><td>In-line node name search with prev/next</td></tr>
          </tbody>
        </table>

        <h3>Pan &amp; Zoom</h3>
        <pre><code>transform: translate(offsetX + dragOffsetX px, offsetY + dragOffsetY px)
          scale(zoomLevel / 100)

// Drag: mousedown/mousemove/mouseup → dragOffsetX/Y
// Scroll wheel: focal-point zoom (keeps cursor point fixed)
// Range: 10% – 200%</code></pre>
      </section>

      <!-- Search -->
      <section class="card">
        <h2>Search Feature</h2>
        <ul>
          <li>Searches <code>node.data.name</code> recursively across the entire tree</li>
          <li>Results highlighted via <code>search-highlight</code> CSS class on matching node card</li>
          <li><kbd>Enter</kbd> or next/prev buttons cycle through all matches</li>
          <li>When navigating to a result, all ancestor nodes are expanded and node is scrolled into view</li>
        </ul>
      </section>

      <!-- Permissions -->
      <section class="card">
        <h2>Permissions</h2>
        <table>
          <thead><tr><th>Check</th><th>Code / Method</th></tr></thead>
          <tbody>
            <tr><td>Page access</td><td><code>ProgramCodes.permission_Org_Chart</code> (read action)</td></tr>
            <tr><td>Department data access</td><td><code>Common_Methods.GetUserAccessData_DepartmentIDs</code> / <code>GetUserDenyData_DepartmentIDs</code></td></tr>
            <tr><td>Org group data access</td><td><code>Common_Methods.GetUserAccessData_OrgGroupIDs</code> / <code>GetUserDenyData_OrgGroupIDs</code></td></tr>
          </tbody>
        </table>
        <p>Staff who have a <code>LastWorkingDate</code> in the past are excluded from all node staff counts.</p>
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
    .subtitle { font-size: 15px; color: #666; margin: 0 0 12px; line-height: 1.5; }
    .doc-status {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 600; padding: 4px 14px;
      border-radius: 20px; margin-bottom: 24px;
      background: #e8f5e9; color: #43a047;
    }

    .meta-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 28px; }
    .meta-badge {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 6px;
    }
    .meta-badge.module { background: #f0f3ff; color: #6c8cff; }
    .meta-badge.code { background: #f5f5f5; color: #666; }
    .meta-badge.status { background: #e8f5e9; color: #43a047; }

    .card {
      background: #fff; border-radius: 14px; padding: 28px 32px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06); margin-bottom: 16px;
    }
    .card h2 {
      font-size: 20px; font-weight: 700; color: #1a1f36; margin: 0 0 16px;
      padding-bottom: 10px; border-bottom: 2px solid #f0f0f0;
    }
    .card h3 { font-size: 16px; font-weight: 600; color: #1a1f36; margin: 20px 0 8px; }
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

    kbd {
      background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px;
      padding: 2px 6px; font-size: 12px; font-family: monospace; color: #333;
      box-shadow: 0 1px 0 rgba(0,0,0,0.1);
    }

    .method-get {
      background: #e8f5e9; color: #2e7d32; padding: 2px 8px;
      border-radius: 4px; font-size: 12px; font-weight: 700;
    }

    /* Color Legend */
    .color-legend { display: flex; flex-direction: column; gap: 8px; padding: 8px 0; }
    .color-row { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #444; }
    .color-box {
      width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    }

    /* ER Diagram */
    .er-diagram {
      display: flex; align-items: flex-start; gap: 16px;
      flex-wrap: wrap; justify-content: center; padding: 12px 0;
    }
    .er-table {
      border: 2px solid #e0e4ec; border-radius: 10px; overflow: hidden;
      min-width: 200px; background: #fff;
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
    .diagram-arrow { color: #bbb; font-size: 18px; }
    .diagram-down { text-align: center; color: #bbb; font-size: 20px; padding: 6px 0; }
    @media (max-width: 768px) {
      .diagram-row { flex-direction: column; gap: 0; }
      .diagram-arrow { transform: rotate(90deg); }
    }
  `]
})
export class OrgStructureComponent {}
