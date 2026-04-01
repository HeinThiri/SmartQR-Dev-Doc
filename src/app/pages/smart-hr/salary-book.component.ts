import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-salary-book',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-hr" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart HR
      </a>
      <h1>Salary Book</h1>
      <p class="subtitle">Complete Salary Book Management — module design, database schema, policy-based organization, API integration, and implementation guide.</p>
      <div class="meta-row">
        <span class="meta-badge module"><i class="bi bi-box"></i> Payroll Module</span>
        <span class="meta-badge code"><i class="bi bi-hash"></i> PGM-SalaryBookPolicy</span>
        <span class="meta-badge status"><i class="bi bi-check-circle"></i> Phase 1 Complete</span>
      </div>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>The Salary Book Module manages salary payment records through a <strong>policy-based system</strong>. It provides a structured approach to organizing, tracking, and managing salary payments with flexible policy configurations that determine which employees are included in each salary book.</p>
        <h3>Key Features</h3>
        <ul>
          <li><strong>Salary Book Policy Management</strong> — Define reusable policies with filters to automatically categorize employees</li>
          <li><strong>Salary Book Creation</strong> — Create salary books based on policies and pay periods</li>
          <li><strong>Staff Assignment &amp; Access Control</strong> — Manage which staff members have access to salary books</li>
          <li><strong>Audit Trail</strong> — Track all actions and modifications with comprehensive logging</li>
          <li><strong>Integration</strong> — Seamlessly connects with existing Salary Calculation module</li>
        </ul>
        <h3>Business Value</h3>
        <ul>
          <li>Automates salary book organization based on configurable rules</li>
          <li>Reduces manual effort in grouping employees for salary processing</li>
          <li>Provides clear audit trails for compliance</li>
          <li>Enables flexible access control for different user groups</li>
        </ul>
        <h3>Routes</h3>
        <table>
          <thead><tr><th>View</th><th>Route</th></tr></thead>
          <tbody>
            <tr><td>List View</td><td><code>/payroll-module/book-policy</code></td></tr>
            <tr><td>Detail View</td><td><code>/payroll-module/book-policy-detail</code></td></tr>
          </tbody>
        </table>
      </section>

      <!-- Architecture -->
      <section class="card">
        <h2>Architecture</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-file-ruled"></i> Salary Book<small>Policy Management</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-book"></i> Salary Book<small>Management</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-pending"><i class="bi bi-people"></i> Staff Access<small>Management</small></div>
            <div class="diagram-arrow"></div>
            <div class="diagram-node node-step"><i class="bi bi-clock-history"></i> Action Logging<small>&amp; Audit Trail</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-success"><i class="bi bi-calculator"></i> Salary Calculation<small>Module (Existing)</small></div>
          </div>
        </div>
        <h3>Technology Stack</h3>
        <table>
          <thead><tr><th>Layer</th><th>Technology</th></tr></thead>
          <tbody>
            <tr><td>Backend</td><td>ASP.NET Core Web API</td></tr>
            <tr><td>Frontend</td><td>Angular + DevExtreme</td></tr>
            <tr><td>Database</td><td>SQL Server</td></tr>
            <tr><td>ORM</td><td>Entity Framework Core / Dapper</td></tr>
            <tr><td>Auth</td><td>JWT + Role-based Access Control (RBAC)</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Database Schema -->
      <section class="card">
        <h2>Database Schema</h2>
        <div class="er-diagram">
          <div class="er-table">
            <div class="er-header">HR_SalaryBookPolicy</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> SalaryBookPolicyID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">SalaryBookPolicyTitle <span class="type">nvarchar(50)</span></div>
            <div class="er-row">PolicyFilter <span class="type">nvarchar(MAX)</span></div>
            <div class="er-row">Description <span class="type">nvarchar(MAX)</span></div>
            <div class="er-row">Active <span class="type">bit</span></div>
            <div class="er-row">CreatedBy <span class="type">varchar(50)</span></div>
            <div class="er-row">CreatedOn <span class="type">datetime</span></div>
            <div class="er-row">ModifiedBy <span class="type">varchar(50)</span></div>
            <div class="er-row">ModifiedOn <span class="type">datetime</span></div>
            <div class="er-row">LastAction <span class="type">varchar(50)</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> LicenseId <span class="type">varchar(50)</span></div>
          </div>
          <div class="er-relation">
            <span>1</span>
            <div class="er-line"></div>
            <span>N</span>
          </div>
          <div class="er-table">
            <div class="er-header">HR_SalaryBook</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> SalaryBookID <span class="type">nvarchar(50)</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> SalaryBookPolicyID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">Title <span class="type">nvarchar(200)</span></div>
            <div class="er-row">PayMonth <span class="type">date</span></div>
            <div class="er-row">FromDate <span class="type">date</span></div>
            <div class="er-row">ToDate <span class="type">date</span></div>
            <div class="er-row">Remark <span class="type">nvarchar(500)</span></div>
            <div class="er-row">ActionLog <span class="type">nvarchar(MAX)</span></div>
            <div class="er-row">Status <span class="type">nvarchar(50)</span></div>
            <div class="er-row">Active <span class="type">bit</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> LicenseId <span class="type">varchar(50)</span></div>
          </div>
        </div>
        <div class="er-diagram" style="margin-top: 20px;">
          <div class="er-table">
            <div class="er-header">HR_SalaryBookPolicyStaff</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> StaffID <span class="type">nvarchar(50)</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> SalaryBookPolicyID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">AccessOn <span class="type">datetime</span></div>
          </div>
          <div class="er-relation">
            <span>1</span>
            <div class="er-line"></div>
            <span>N</span>
          </div>
          <div class="er-table">
            <div class="er-header">HR_SalaryBookPolicyAccess</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> PolicyStaffID <span class="type">nvarchar(50)</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> StaffID <span class="type">nvarchar(50)</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> SalaryBookPolicyID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">Status <span class="type">nvarchar(50)</span></div>
            <div class="er-row">AccessType <span class="type">nvarchar(50)</span></div>
            <div class="er-row">AccessOn <span class="type">datetime</span></div>
          </div>
          <div class="er-relation"><span></span><div class="er-line"></div><span></span></div>
          <div class="er-table">
            <div class="er-header">HR_SalaryBookPolicyView</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> SalaryBookPolicyID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">SalaryBookPolicyTitle <span class="type">nvarchar(50)</span></div>
            <div class="er-row">Active <span class="type">bit</span></div>
            <div class="er-row">CreatedByCode <span class="type">varchar(50)</span></div>
            <div class="er-row">ModifiedByCode <span class="type">varchar(50)</span></div>
          </div>
        </div>
      </section>

      <!-- Status Flow -->
      <section class="card">
        <h2>Salary Book Status Flow</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-pencil"></i> Draft<small>Initial, editable</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-hourglass-split"></i> Pending<small>Submitted for approval</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-check2-circle"></i> Approved<small>By authorized user</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-globe"></i> Published<small>Finalized</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-danger"><i class="bi bi-x-circle"></i> Cancelled<small>Void (from any status)</small></div>
          </div>
        </div>
        <h3>ActionLog JSON Structure</h3>
        <pre><code>[
  &#123;
    "action": "Created",
    "timestamp": "2026-02-28T09:00:00",
    "userId": "U001",
    "userName": "Admin User",
    "remarks": "Initial creation"
  &#125;,
  &#123;
    "action": "StatusChanged",
    "timestamp": "2026-02-28T10:00:00",
    "userId": "U002",
    "userName": "Manager User",
    "fromStatus": "Draft",
    "toStatus": "Pending",
    "remarks": "Submitted for approval"
  &#125;
]</code></pre>
      </section>

      <!-- Policy CRUD Flow -->
      <section class="card">
        <h2>Policy CRUD Flow</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-person"></i> HR Admin<small>Opens Policy List</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-list-ul"></i> List View<small>/payroll-module/book-policy</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-plus-circle"></i> Add New<small>or Click Row</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-pencil-square"></i> Detail Form<small>Title, Description, Filter</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-check2"></i> Validate<small>Required fields</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-cloud-upload"></i> POST /Save<small>API Call</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check-circle"></i> Saved<small>List Refreshed</small></div>
          </div>
        </div>

        <h3>Policy Filter Evaluation Flow</h3>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-funnel"></i> Policy Filter<small>JSON criteria</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-database"></i> Query Employees<small>Match criteria</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-people"></i> Matched Staff<small>Dept/Position/Type</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-book"></i> Assign to<small>Salary Book</small></div>
          </div>
        </div>
      </section>

      <!-- Policy Filter Format -->
      <section class="card">
        <h2>Policy Filter Format</h2>
        <p>The <code>policyFilter</code> field stores a JSON string that defines employee matching criteria.</p>
        <h3>Basic Filter</h3>
        <pre><code>&#123;
  "departments": ["IT", "Finance"],
  "positions": ["Manager", "Senior Manager"],
  "employeeTypes": ["Permanent"],
  "includeInactive": false
&#125;</code></pre>
        <h3>Advanced Filter</h3>
        <pre><code>&#123;
  "departments": ["D001", "D002"],
  "positions": ["P001"],
  "orgGroups": ["OG001"],
  "employeeTypes": ["Permanent", "Contract"],
  "payrollTypes": ["Monthly"],
  "joinDateRange": &#123;
    "from": "2020-01-01",
    "to": "2025-12-31"
  &#125;,
  "includeInactive": false
&#125;</code></pre>
        <h3>Filter Fields</h3>
        <table>
          <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>departments</code></td><td>string[]</td><td>Array of department IDs</td></tr>
            <tr><td><code>positions</code></td><td>string[]</td><td>Array of position IDs</td></tr>
            <tr><td><code>orgGroups</code></td><td>string[]</td><td>Array of organization group IDs</td></tr>
            <tr><td><code>employeeTypes</code></td><td>string[]</td><td>Permanent, Contract, etc.</td></tr>
            <tr><td><code>payrollTypes</code></td><td>string[]</td><td>Monthly, Daily, etc.</td></tr>
            <tr><td><code>joinDateRange</code></td><td>object</td><td>&#123; from, to &#125; date range</td></tr>
            <tr><td><code>includeInactive</code></td><td>boolean</td><td>Include inactive employees</td></tr>
          </tbody>
        </table>
      </section>

      <!-- File Structure -->
      <section class="card">
        <h2>File Structure</h2>
        <h3>Backend (C# .NET)</h3>
        <pre><code>SmartHR_API/
├── APIs/Payroll_Module/
│   └── SalaryBookPolicyApi.cs              # API Controller
├── DTO/Payroll_Module/
│   └── SalaryBookPolicyDTO.cs              # Data Transfer Objects
├── Infrastructure/Repository/Payroll_Module/
│   └── SalaryBookPolicyController.cs       # Business Logic
├── Shared/Utilities/
│   └── ProgramCodes.cs                     # Permission constant
└── Program.cs                               # DI registration</code></pre>
        <h3>Frontend (Angular)</h3>
        <pre><code>SmartHR_UI/src/app/
├── dto/hr/
│   └── salary-book-policy-dto.ts           # TypeScript Interface
├── services/payroll/
│   └── salary-book-policy.service.ts       # Angular Service
└── pages/systematic/modules/payroll-module/
    ├── salary-book-policy/
    │   ├── book-policy-list/
    │   │   ├── book-policy-list.component.ts
    │   │   ├── book-policy-list.component.html
    │   │   └── book-policy-list.component.scss
    │   └── book-policy-detail/
    │       ├── book-policy-detail.component.ts
    │       ├── book-policy-detail.component.html
    │       └── book-policy-detail.component.scss
    ├── payroll-module-routing.module.ts     # Routes
    └── payroll-module.module.ts             # Declarations</code></pre>
      </section>

      <!-- API Endpoints -->
      <section class="card">
        <h2>API Endpoints</h2>
        <p>Base URL: <code>&#123;baseApiUrl&#125;/SalaryBookPolicyApi</code></p>
        <table>
          <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th><th>Auth</th></tr></thead>
          <tbody>
            <tr><td><span class="method-get">GET</span></td><td><code>/GetAll?status=&#123;status&#125;</code></td><td>Get all policies</td><td>Yes</td></tr>
            <tr><td><span class="method-get">GET</span></td><td><code>/GetByID/&#123;id&#125;</code></td><td>Get single policy by ID</td><td>Yes</td></tr>
            <tr><td><span class="method-post">POST</span></td><td><code>/Save</code></td><td>Create or update policy</td><td>Yes</td></tr>
            <tr><td><span class="method-delete">DELETE</span></td><td><code>/Delete</code></td><td>Soft delete policy</td><td>Yes</td></tr>
          </tbody>
        </table>
        <h3>Status Filter Values</h3>
        <table>
          <thead><tr><th>Value</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>All</code></td><td>All policies</td></tr>
            <tr><td><code>Active</code></td><td>Only active policies (Active=true)</td></tr>
            <tr><td><code>Inactive</code></td><td>Only inactive policies (Active=false)</td></tr>
          </tbody>
        </table>
        <h3>Create / Update Request</h3>
        <pre><code>POST /SalaryBookPolicyApi/Save
Authorization: Bearer &#123;token&#125;
Content-Type: application/json

&#123;
  "salaryBookPolicyID": "",
  "salaryBookPolicyTitle": "Management Staff Policy",
  "description": "Policy for management staff salary book",
  "policyFilter": "&#123;\"departments\":[\"IT\"],\"employeeTypes\":[\"Permanent\"]&#125;",
  "active": true,
  "localDateTimeForValidation": "2026-02-28T10:00:00"
&#125;</code></pre>
        <h3>Delete Request</h3>
        <pre><code>DELETE /SalaryBookPolicyApi/Delete
Authorization: Bearer &#123;token&#125;
Content-Type: application/json

&#123;
  "salaryBookPolicyID": "&#123;existing-id&#125;",
  "localDateTimeForValidation": "2026-02-28T12:00:00"
&#125;</code></pre>
      </section>

      <!-- C# Entity Models -->
      <section class="card">
        <h2>C# Entity Models</h2>
        <h3>SalaryBookPolicy.cs</h3>
        <pre><code>namespace SmartHR.Models.HR.SalaryBook
&#123;
    public class SalaryBookPolicy
    &#123;
        public string SalaryBookPolicyID &#123; get; set; &#125;
        public string SalaryBookPolicyTitle &#123; get; set; &#125;
        public string PolicyFilter &#123; get; set; &#125;
        public string Description &#123; get; set; &#125;
        public bool Active &#123; get; set; &#125;
        public string CreatedBy &#123; get; set; &#125;
        public DateTime CreatedOn &#123; get; set; &#125;
        public string ModifiedBy &#123; get; set; &#125;
        public DateTime? ModifiedOn &#123; get; set; &#125;
        public string LastAction &#123; get; set; &#125;
        public string LicenseId &#123; get; set; &#125;
    &#125;
&#125;</code></pre>
        <h3>SalaryBookPolicyView.cs</h3>
        <pre><code>namespace SmartHR.Models.HR.SalaryBook
&#123;
    public class SalaryBookPolicyView : SalaryBookPolicy
    &#123;
        public string CreatedByCode &#123; get; set; &#125;
        public string ModifiedByCode &#123; get; set; &#125;
    &#125;
&#125;</code></pre>
      </section>

      <!-- Access Types -->
      <section class="card">
        <h2>Access Types</h2>
        <table>
          <thead><tr><th>Type</th><th>Permission</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>View</code></td><td>Read-only</td><td>Can view salary book data</td></tr>
            <tr><td><code>Edit</code></td><td>Read-write</td><td>Can edit salary book data</td></tr>
            <tr><td><code>Approve</code></td><td>Approval</td><td>Can approve salary books</td></tr>
            <tr><td><code>Admin</code></td><td>Full access</td><td>Full administrative access</td></tr>
          </tbody>
        </table>
        <h3>Access Status Values</h3>
        <table>
          <thead><tr><th>Status</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>Active</code></td><td>Access is currently granted</td></tr>
            <tr><td><code>Revoked</code></td><td>Access has been revoked by admin</td></tr>
            <tr><td><code>Expired</code></td><td>Access has expired</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Permissions -->
      <section class="card">
        <h2>Permissions</h2>
        <table>
          <thead><tr><th>Permission</th><th>Action</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>read</code></td><td>View</td><td>Access policy list and detail pages</td></tr>
            <tr><td><code>create</code></td><td>Create</td><td>Create new policies</td></tr>
            <tr><td><code>update</code></td><td>Update</td><td>Edit existing policies</td></tr>
            <tr><td><code>delete</code></td><td>Delete</td><td>Soft-delete policies</td></tr>
            <tr><td><code>export</code></td><td>Export</td><td>Export policy list to Excel</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Keyboard Shortcuts -->
      <section class="card">
        <h2>Keyboard Shortcuts</h2>
        <table>
          <thead><tr><th>Shortcut</th><th>Action</th><th>View</th></tr></thead>
          <tbody>
            <tr><td><kbd>Ctrl</kbd> + <kbd>S</kbd></td><td>Save policy</td><td>Detail</td></tr>
            <tr><td><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>L</kbd></td><td>Copy link</td><td>Detail</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Deployment -->
      <section class="card">
        <h2>Deployment Steps</h2>
        <h3>Step 1: Database Setup</h3>
        <ol>
          <li>Run schema creation script: <code>Documentation/Database/HR_SalaryBook_Schema.sql</code></li>
          <li>Register program &amp; permissions: <code>Documentation/Database/Register_SalaryBookPolicy_Program.sql</code></li>
          <li>Assign permissions to roles (via script or Admin UI)</li>
        </ol>
        <h3>Step 2: Backend</h3>
        <pre><code>cd SmartHR_API
dotnet build
dotnet run
# Verify: https://localhost:xxxx/swagger → SalaryBookPolicyApi endpoints</code></pre>
        <h3>Step 3: Frontend</h3>
        <pre><code>cd SmartHR_UI
npm install
ng serve
# Navigate to: http://localhost:4200/payroll-module/book-policy</code></pre>
        <h3>Step 4: Menu Configuration (Optional)</h3>
        <pre><code>INSERT INTO SysMenu (
  MenuId, MenuName, MenuUrl, ModuleId,
  Icon, ParentMenuId, OrderNo, Active
) VALUES (
  NEWID(),
  'Salary Book Policy',
  'payroll-module/book-policy',
  &#64;PayrollModuleId,
  'fas fa-book',
  &#64;PayrollParentMenuId,
  100, 1
)</code></pre>
      </section>

      <!-- Business Requirements -->
      <section class="card">
        <h2>Business Requirements</h2>
        <h3>Functional Requirements</h3>
        <table>
          <thead><tr><th>ID</th><th>Requirement</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>FR1.1</td><td>Policy CRUD</td><td>Create, read, update, and delete salary book policies</td></tr>
            <tr><td>FR1.2</td><td>Policy Filters</td><td>Define filter criteria to auto-categorize employees</td></tr>
            <tr><td>FR1.3</td><td>Policy Status</td><td>Activate/deactivate policies without deletion</td></tr>
            <tr><td>FR2.1</td><td>Book Creation</td><td>Create salary books based on approved policies</td></tr>
            <tr><td>FR2.2</td><td>Pay Period</td><td>Define pay month, date range, and period info</td></tr>
            <tr><td>FR2.3</td><td>Book Status</td><td>Track status: Draft &rarr; Pending &rarr; Approved &rarr; Published</td></tr>
            <tr><td>FR3.1</td><td>Staff Assignment</td><td>Assign staff members to salary book policies</td></tr>
            <tr><td>FR3.3</td><td>Access Types</td><td>Define View, Edit, Approve, Admin access levels</td></tr>
            <tr><td>FR4.1</td><td>Salary Integration</td><td>Connect salary books with salary payment records</td></tr>
          </tbody>
        </table>
        <h3>Non-Functional Requirements</h3>
        <table>
          <thead><tr><th>ID</th><th>Requirement</th><th>Target</th></tr></thead>
          <tbody>
            <tr><td>NFR1</td><td>Policy filter evaluation</td><td>&lt; 2 seconds for 10,000 employees</td></tr>
            <tr><td>NFR2</td><td>Salary book creation</td><td>&lt; 5 seconds</td></tr>
            <tr><td>NFR3</td><td>Scalability</td><td>Up to 50,000 employees, 100 concurrent users</td></tr>
            <tr><td>NFR4</td><td>Security</td><td>Encrypted at rest/transit, RBAC at all levels</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Implementation Phases -->
      <section class="card">
        <h2>Implementation Phases</h2>
        <table>
          <thead><tr><th>Phase</th><th>Scope</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td><strong>Phase 1</strong></td><td>Salary Book Policy — CRUD, filters, permissions, audit</td><td><span style="color:#43a047;font-weight:600;">Complete</span></td></tr>
            <tr><td><strong>Phase 2</strong></td><td>Salary Book Management — create books, status workflow, action log</td><td><span style="color:#f9a825;font-weight:600;">Planned</span></td></tr>
            <tr><td><strong>Phase 3</strong></td><td>Salary Calculation Integration — connect with existing module</td><td><span style="color:#999;font-weight:600;">Future</span></td></tr>
            <tr><td><strong>Phase 4</strong></td><td>Advanced Reporting — analytics, dashboards, exports</td><td><span style="color:#999;font-weight:600;">Future</span></td></tr>
          </tbody>
        </table>
      </section>

      <!-- Troubleshooting -->
      <section class="card">
        <h2>Troubleshooting</h2>
        <table>
          <thead><tr><th>Issue</th><th>Solution</th></tr></thead>
          <tbody>
            <tr><td><strong>401 Unauthorized</strong></td><td>Verify JWT token is valid and not expired. Ensure user is logged in.</td></tr>
            <tr><td><strong>403 Forbidden</strong></td><td>Check user has required permissions. Verify program code <code>PGM-SalaryBookPolicy</code> in database.</td></tr>
            <tr><td><strong>"Policy title already exists"</strong></td><td>Expected — choose a unique title or update the existing policy.</td></tr>
            <tr><td><strong>Cannot delete policy</strong></td><td>Policy may be used in active salary books. Deactivate associated books first, or set policy to inactive.</td></tr>
            <tr><td><strong>Page not found (404)</strong></td><td>Verify routing in <code>payroll-module-routing.module.ts</code>. Clear browser cache. Restart dev server.</td></tr>
            <tr><td><strong>Components not rendering</strong></td><td>Check browser console. Verify module declarations and service injections.</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Testing Checklist -->
      <section class="card">
        <h2>Testing Checklist</h2>
        <h3>Database</h3>
        <table>
          <thead><tr><th>#</th><th>Task</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Tables created: HR_SalaryBookPolicy, HR_SalaryBookPolicyView, HR_SalaryBook, HR_SalaryBookPolicyStaff, HR_SalaryBookPolicyAccess</td><td>Required</td></tr>
            <tr><td>2</td><td>Program registered in SysProgram</td><td>Required</td></tr>
            <tr><td>3</td><td>Permissions created in SysProgramAction</td><td>Required</td></tr>
            <tr><td>4</td><td>Permissions assigned to test role</td><td>Required</td></tr>
          </tbody>
        </table>
        <h3>List View</h3>
        <table>
          <thead><tr><th>#</th><th>Task</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Page loads without errors</td><td>Required</td></tr>
            <tr><td>2</td><td>Grid displays correctly</td><td>Required</td></tr>
            <tr><td>3</td><td>Search functionality works</td><td>Required</td></tr>
            <tr><td>4</td><td>Status filter works (All/Active/Inactive)</td><td>Required</td></tr>
            <tr><td>5</td><td>Excel export works</td><td>Required</td></tr>
            <tr><td>6</td><td>Add New button opens detail form</td><td>Required</td></tr>
            <tr><td>7</td><td>Row click opens detail form</td><td>Required</td></tr>
          </tbody>
        </table>
        <h3>Detail View</h3>
        <table>
          <thead><tr><th>#</th><th>Task</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Create new policy — save succeeds</td><td>Required</td></tr>
            <tr><td>2</td><td>Update existing policy — save succeeds</td><td>Required</td></tr>
            <tr><td>3</td><td>Delete policy — confirmation + soft delete</td><td>Required</td></tr>
            <tr><td>4</td><td>Required field validation (Policy Title)</td><td>Required</td></tr>
            <tr><td>5</td><td>Active/Inactive toggle</td><td>Required</td></tr>
            <tr><td>6</td><td>Audit info displays (Created By, Modified By)</td><td>Required</td></tr>
          </tbody>
        </table>
        <h3>Integration</h3>
        <table>
          <thead><tr><th>#</th><th>Task</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Policy filter evaluation matches correct employees</td><td>Required</td></tr>
            <tr><td>2</td><td>Duplicate title validation works</td><td>Required</td></tr>
            <tr><td>3</td><td>Cannot delete policy used in active salary books</td><td>Required</td></tr>
            <tr><td>4</td><td>Audit logging (SysLog table)</td><td>Required</td></tr>
            <tr><td>5</td><td>License-based data isolation</td><td>Required</td></tr>
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
    .method-post {
      background: #fff3e0; color: #e65100; padding: 2px 8px;
      border-radius: 4px; font-size: 12px; font-weight: 700;
    }
    .method-delete {
      background: #ffebee; color: #c62828; padding: 2px 8px;
      border-radius: 4px; font-size: 12px; font-weight: 700;
    }

    /* ER Diagram */
    .er-diagram {
      display: flex; align-items: flex-start; gap: 16px;
      flex-wrap: wrap; justify-content: center; padding: 12px 0;
    }
    .er-table {
      border: 2px solid #e0e4ec; border-radius: 10px; overflow: hidden;
      min-width: 220px; background: #fff;
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
    .node-danger { background: #e53935; color: #fff; }
    .diagram-arrow { color: #bbb; font-size: 18px; }
    .diagram-down { text-align: center; color: #bbb; font-size: 20px; padding: 6px 0; }
    @media (max-width: 768px) {
      .diagram-row { flex-direction: column; gap: 0; }
      .diagram-arrow { transform: rotate(90deg); }
    }
  `]
})
export class SalaryBookComponent {}
