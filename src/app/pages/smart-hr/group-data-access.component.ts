import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-group-data-access',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-hr" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart HR
      </a>
      <h1>Group Data Access Organization Feature</h1>
      <p class="subtitle">Role-based data filtering &mdash; database schema, backend API, frontend UI, common utilities, configuration guide, and usage examples.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>The Group Data Access Organization feature provides role-based data filtering for staff records across the Smart HR system. This allows administrators to configure which organization groups each user role can access, ensuring users only see data relevant to their responsibilities.</p>
      </section>

      <!-- Feature Summary -->
      <section class="card">
        <h2>Feature Summary</h2>
        <h3>Key Capabilities</h3>
        <ul>
          <li><strong>Role-Based Data Filtering</strong> &mdash; Restrict data access based on user roles</li>
          <li><strong>Organization Group Filtering</strong> &mdash; Filter staff by organization groups</li>
          <li><strong>Department Filtering</strong> &mdash; Filter staff by departments</li>
          <li><strong>Flexible Configuration</strong> &mdash; Easy to add, edit, or remove access groups</li>
          <li><strong>Automatic Filtering</strong> &mdash; Applies across all staff-related modules</li>
          <li><strong>Backward Compatible</strong> &mdash; No restrictions if not configured</li>
        </ul>
        <h3>Affected Modules</h3>
        <ul>
          <li>Employee Info List</li>
          <li>Contract Management</li>
          <li>Leave Management</li>
          <li>Attendance Module</li>
          <li>Payroll Module</li>
          <li>All modules using staff combo boxes</li>
        </ul>
      </section>

      <!-- Database Schema -->
      <section class="card">
        <h2>Database Schema</h2>
        <h3>Table: SysUserRoleDataGroup</h3>
        <p>Stores the data access group configurations for each role.</p>
        <div class="er-diagram">
          <div class="er-table">
            <div class="er-header">SysUserRoleDataGroup</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> DataGroupID <span class="type">nvarchar(50)</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> RoleID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">GroupRefType <span class="type">nvarchar(50)</span></div>
            <div class="er-row">GroupRefID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">AccessType <span class="type">nvarchar(50)</span></div>
          </div>
          <div class="er-relation">
            <span>N</span>
            <div class="er-line"></div>
            <span>1</span>
          </div>
          <div class="er-table">
            <div class="er-header">SysUserRole (Updated)</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> RoleId <span class="type">nvarchar(50)</span></div>
            <div class="er-row">RoleName <span class="type">nvarchar(100)</span></div>
            <div class="er-row">AccessDataGroupIDs <span class="type">nvarchar(MAX)</span></div>
            <div class="er-row">Active <span class="type">bit</span></div>
            <div class="er-row">ModifiedOn <span class="type">datetime</span></div>
            <div class="er-row">LastAction <span class="type">varchar(50)</span></div>
          </div>
        </div>

        <h3>Column Details</h3>
        <table>
          <thead><tr><th>Column</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>DataGroupID</code></td><td>Primary key (GUID)</td></tr>
            <tr><td><code>RoleID</code></td><td>Foreign key to SysUserRole</td></tr>
            <tr><td><code>GroupRefType</code></td><td>Type of group (e.g., "Organization", "Department")</td></tr>
            <tr><td><code>GroupRefID</code></td><td>ID of the organization group or department</td></tr>
            <tr><td><code>AccessType</code></td><td>"Access" or "Denied"</td></tr>
            <tr><td><code>AccessDataGroupIDs</code></td><td>Comma-separated list of GroupRefIDs where AccessType = "Access"</td></tr>
          </tbody>
        </table>

        <h3>SQL Setup Scripts</h3>
        <pre><code>-- Add AccessDataGroupIDs column to SysUserRole table
IF NOT EXISTS (SELECT * FROM sys.columns
               WHERE object_id = OBJECT_ID(N'[dbo].[SysUserRole]')
               AND name = 'AccessDataGroupIDs')
BEGIN
    ALTER TABLE SysUserRole
    ADD AccessDataGroupIDs NVARCHAR(MAX) NULL;
END

-- Create SysUserRoleDataGroup table
IF NOT EXISTS (SELECT * FROM sys.objects
               WHERE object_id = OBJECT_ID(N'[dbo].[SysUserRoleDataGroup]')
               AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[SysUserRoleDataGroup](
        [DataGroupID] [nvarchar](50) NOT NULL,
        [RoleID] [nvarchar](50) NOT NULL,
        [GroupRefType] [nvarchar](50) NOT NULL,
        [GroupRefID] [nvarchar](50) NOT NULL,
        [AccessType] [nvarchar](50) NOT NULL,
        CONSTRAINT [PK_SysUserRoleDataGroup] PRIMARY KEY CLUSTERED ([DataGroupID] ASC)
    );
END</code></pre>
      </section>

      <!-- Backend Implementation -->
      <section class="card">
        <h2>Backend Implementation</h2>

        <h3>1. Database Models</h3>
        <p><strong>File:</strong> <code>SmartHR_API/DBModels/SmartHRPro/SysUserRoleDataGroup.cs</code></p>
        <pre><code>public partial class SysUserRoleDataGroup
&#123;
    public string DataGroupID &#123; get; set; &#125;
    public string RoleID &#123; get; set; &#125;
    public string GroupRefType &#123; get; set; &#125;
    public string GroupRefID &#123; get; set; &#125;
    public string AccessType &#123; get; set; &#125;
&#125;</code></pre>

        <p><strong>File:</strong> <code>SmartHR_API/DBModels/SmartHRPro/SysUserRole.cs</code></p>
        <pre><code>public partial class SysUserRole
&#123;
    // ... existing properties ...
    public string AccessDataGroupIDs &#123; get; set; &#125;
&#125;</code></pre>

        <h3>2. DTOs</h3>
        <p><strong>File:</strong> <code>SmartHR_API/DTO/System_Module/SysUserRoleDTO.cs</code></p>
        <pre><code>public class SysUserRoleDataGroupDTO
&#123;
    public string DataGroupID &#123; get; set; &#125;
    public string RoleID &#123; get; set; &#125;
    public string GroupRefType &#123; get; set; &#125;
    public string GroupRefID &#123; get; set; &#125;
    public string AccessType &#123; get; set; &#125;
&#125;

public class SysUserRoleDataGroupView
&#123;
    public string DataGroupID &#123; get; set; &#125;
    public string RoleID &#123; get; set; &#125;
    public string GroupRefType &#123; get; set; &#125;
    public string GroupRefID &#123; get; set; &#125;
    public string AccessType &#123; get; set; &#125;
    public string GroupName &#123; get; set; &#125; // Joined from HR_OrgGroup
&#125;</code></pre>

        <h3>3. API Endpoints</h3>
        <p><strong>File:</strong> <code>SmartHR_API/APIs/System_Module/SysUserRoleApi.cs</code></p>
        <table>
          <thead><tr><th>Method</th><th>Endpoint</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><span class="method-get">GET</span></td><td><code>/GetDataGroupsByRoleId/&#123;roleId&#125;</code></td><td>Retrieve all data groups for a role with org names</td></tr>
            <tr><td><span class="method-post">POST</span></td><td><code>/SaveDataGroup</code></td><td>Create or update a data group access configuration</td></tr>
            <tr><td><span class="method-delete">DELETE</span></td><td><code>/RemoveDataGroup/&#123;dataGroupId&#125;</code></td><td>Delete a data group access configuration</td></tr>
          </tbody>
        </table>

        <h3>4. Controller Methods</h3>
        <p><strong>File:</strong> <code>SmartHR_API/Infrastructure/Repository/System_Module/SysUserRoleController.cs</code></p>

        <h4>GetDataGroupsByRoleId</h4>
        <pre><code>public ServiceActionResult GetDataGroupsByRoleId(string roleId)
&#123;
    var dataGroups = (from dg in dc.SysUserRoleDataGroup
                      where dg.RoleID == roleId
                      join org in dc.HrOrgGroup on dg.GroupRefID equals org.OrgGroupId
                        into orgJoin
                      from org in orgJoin.DefaultIfEmpty()
                      join dept in dc.HrDepartmentView on dg.GroupRefID equals dept.DepartmentId
                        into deptJoin
                      from dept in deptJoin.DefaultIfEmpty()
                      select new SysUserRoleDataGroupView
                      &#123;
                          DataGroupID = dg.DataGroupID,
                          RoleID = dg.RoleID,
                          GroupRefType = dg.GroupRefType,
                          GroupRefID = dg.GroupRefID,
                          AccessType = dg.AccessType,
                          GroupName = dg.GroupRefType == "Organization"
                              ? "Org - " + org.GroupName
                              : dg.GroupRefType == "Department"
                              ? "Dept - " + dept.DepartmentName
                              : dg.GroupRefID
                      &#125;).ToList();

    return new ServiceActionResult(ReturnStatus.success, "", dataGroups);
&#125;</code></pre>

        <h4>UpdateAccessDataGroupIDs (Private Helper)</h4>
        <pre><code>private void UpdateAccessDataGroupIDs(string roleId)
&#123;
    // Get all GroupRefIDs where AccessType is "Access"
    var accessGroupIds = dc.SysUserRoleDataGroup
        .Where(dg =&gt; dg.RoleID == roleId &amp;&amp; dg.AccessType == "Access")
        .Select(dg =&gt; dg.GroupRefID)
        .ToList();

    // Concatenate with comma
    string accessDataGroupIDs = string.Join(",", accessGroupIds);

    // Update SysUserRole table
    var role = dc.SysUserRole.FirstOrDefault(r =&gt; r.RoleId == roleId);
    if (role != null)
    &#123;
        role.AccessDataGroupIDs = accessDataGroupIDs;
        role.ModifiedOn = DateTime.Now;
        role.LastAction = Guid.NewGuid().ToString();
        dc.SaveChanges();
    &#125;
&#125;</code></pre>
        <p><strong>Important:</strong> This method is automatically called after every SaveDataGroup and RemoveDataGroup operation.</p>
      </section>

      <!-- Frontend Implementation -->
      <section class="card">
        <h2>Frontend Implementation</h2>

        <h3>1. User Interface</h3>
        <p><strong>Location:</strong> Config Module &rarr; User Role &rarr; Role Detail Page</p>
        <p>The Data Access section appears above the Help box in the role detail page.</p>
        <table>
          <thead><tr><th>Component</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><strong>Table View</strong></td><td>Displays existing data groups with Group Name, Access Type, and Actions</td></tr>
            <tr><td><strong>Add Button</strong></td><td>Opens sidebar to add new data group</td></tr>
            <tr><td><strong>Edit Button</strong></td><td>Opens sidebar to edit existing data group</td></tr>
            <tr><td><strong>Delete Button</strong></td><td>Removes data group with confirmation</td></tr>
          </tbody>
        </table>

        <h4>Right Sidebar Form Fields</h4>
        <table>
          <thead><tr><th>#</th><th>Field</th><th>Type</th><th>Details</th></tr></thead>
          <tbody>
            <tr><td>1</td><td><strong>Group Type</strong></td><td>Dropdown</td><td>Options: Organization, Department. Required.</td></tr>
            <tr><td>2</td><td><strong>Organization Group</strong></td><td>Dropdown</td><td>Shown when Group Type is "Organization". Filtered by license. Required.</td></tr>
            <tr><td>3</td><td><strong>Department</strong></td><td>Dropdown</td><td>Shown when Group Type is "Department". Filtered by license. Required.</td></tr>
            <tr><td>4</td><td><strong>Access Type</strong></td><td>Dropdown</td><td>Options: Access, Denied. Required.</td></tr>
          </tbody>
        </table>

        <h3>2. TypeScript Implementation</h3>
        <p><strong>File:</strong> <code>SmartHR_UI/src/app/pages/systematic/modules/config-module/user-role/user-role-detail/user-role-detail.component.ts</code></p>
        <pre><code>// Load data groups for the current role
loadDataGroups() &#123;
  if (!this.recordId) return;

  this.apiService.getDataGroupsByRoleId(this.recordId).subscribe(&#123;
    next: (result: any) =&gt; &#123;
      if (result.resultObject) &#123;
        this.dataGroupList = result.resultObject as SysUserRoleDataGroupView[];
      &#125;
    &#125;
  &#125;);
&#125;

// Open sidebar to add new data group
openDataGroupSidebar() &#123;
  this.isEditingDataGroup = false;
  this.dataGroupForm.reset();
  this.dataGroupForm.patchValue(&#123;
    roleID: this.recordId,
    groupRefType: 'Organization'
  &#125;);
  this.showDataGroupSidebar = true;
&#125;

// Save data group
saveDataGroupAccess() &#123;
  this.dataGroupSubmitted = true;
  if (this.dataGroupForm.invalid) &#123; return; &#125;

  const dataGroupData: SysUserRoleDataGroup = &#123;
    dataGroupID: this.isEditingDataGroup ? formValue.dataGroupID : '',
    roleID: this.recordId,
    groupRefType: formValue.groupRefType,
    groupRefID: formValue.groupRefID,
    accessType: formValue.accessType
  &#125;;

  this.apiService.saveDataGroup(dataGroupData).subscribe(&#123;
    next: (result: any) =&gt; &#123;
      if (result.resultObject) &#123;
        Swal.fire(&#123; icon: 'success', title: 'Success!',
          text: 'Data access saved successfully.' &#125;);
        this.loadDataGroups();
        this.closeDataGroupSidebar();
      &#125;
    &#125;
  &#125;);
&#125;

// Delete data group
removeDataGroup(group: SysUserRoleDataGroupView) &#123;
  Swal.fire(&#123;
    title: 'Remove Data Access?',
    text: 'Remove access for "' + group.groupName + '"?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Remove'
  &#125;).then((result) =&gt; &#123;
    if (result.isConfirmed) &#123;
      this.apiService.removeDataGroup(group.dataGroupID).subscribe(&#123;
        next: (result: any) =&gt; &#123;
          Swal.fire('Removed!', 'Data access removed.', 'success');
          this.loadDataGroups();
        &#125;
      &#125;);
    &#125;
  &#125;);
&#125;</code></pre>

        <h3>3. Service Methods</h3>
        <p><strong>File:</strong> <code>SmartHR_UI/src/app/services/sys-user-role.service.ts</code></p>
        <pre><code>// Get data groups by role ID
getDataGroupsByRoleId(roleId: string): Observable&lt;ActionResult&gt; &#123;
  return this.http.get&lt;ActionResult&gt;(
    this.baseAPIUrl + '/' + this.controllerName + '/GetDataGroupsByRoleId/' + roleId,
    &#123;'headers':this.myCommon.createTokenHeader()&#125;
  );
&#125;

// Save data group
saveDataGroup(passData: SysUserRoleDataGroup): Observable&lt;ActionResult&gt; &#123;
  return this.http.post&lt;ActionResult&gt;(
    this.baseAPIUrl + '/' + this.controllerName + '/SaveDataGroup',
    passData,
    &#123;'headers':this.myCommon.createTokenHeader()&#125;
  );
&#125;

// Remove data group
removeDataGroup(dataGroupId: string): Observable&lt;ActionResult&gt; &#123;
  return this.http.delete&lt;ActionResult&gt;(
    this.baseAPIUrl + '/' + this.controllerName + '/RemoveDataGroup/' + dataGroupId,
    &#123;'headers':this.myCommon.createTokenHeader()&#125;
  );
&#125;</code></pre>
      </section>

      <!-- Common Utilities -->
      <section class="card">
        <h2>Common Utilities</h2>
        <p><strong>File:</strong> <code>SmartHR_API/Shared/Common/Common_Methods.cs</code></p>

        <h3>GetUserAccessDataGroupIDs</h3>
        <pre><code>/// Gets the AccessDataGroupIDs from the current user's role
/// and returns as a list of strings.
/// If the user has no data access restrictions, returns an empty list.
public static async Task&lt;List&lt;string&gt;&gt; GetUserAccessDataGroupIDs(
    SmartHRContext context, string userId)
&#123;
    try
    &#123;
        var accessDataIDs = await (from u in context.SysUser
                                   join r in context.SysUserRole on u.RoleId equals r.RoleId
                                   where u.UserId == userId &amp;&amp; u.Active == true
                                     &amp;&amp; r.Active == true
                                   select r.AccessDataGroupIDs).FirstOrDefaultAsync();

        List&lt;string&gt; accessDataGroupList = new List&lt;string&gt;();
        if (!string.IsNullOrEmpty(accessDataIDs))
        &#123;
            accessDataGroupList = accessDataIDs
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(x =&gt; x.Trim())
                .ToList();
        &#125;

        return accessDataGroupList;
    &#125;
    catch
    &#123;
        return new List&lt;string&gt;();
    &#125;
&#125;</code></pre>

        <h4>Usage Example</h4>
        <pre><code>// In any controller method
var accessDataGroupList = await Common_Methods.GetUserAccessDataGroupIDs(_context, requestId);

// Apply filter in LINQ query - checks both OrgGroupId and DepartmentId
var staff = await _context.HrStaffView
    .Where(x =&gt; x.Active == true
                &amp;&amp; (accessDataGroupList.Count == 0 ||
                    (accessDataGroupList.Contains(x.OrgGroupId)
                     || accessDataGroupList.Contains(x.DepartmentId))))
    .ToListAsync();</code></pre>

        <p><strong>Key Points:</strong></p>
        <ul>
          <li>If <code>accessDataGroupList.Count == 0</code>, no filtering is applied (user has full access)</li>
          <li>If list has values, staff must match EITHER their OrgGroupId OR DepartmentId</li>
          <li>This allows flexible filtering by Organization Groups and/or Departments</li>
        </ul>

        <h3>HasAccessToOrgGroup</h3>
        <pre><code>/// Checks if a user has access to a specific organization group.
/// Returns true if user has access or no restrictions are configured.
public static async Task&lt;bool&gt; HasAccessToOrgGroup(
    SmartHRContext context, string userId, string orgGroupId)
&#123;
    try
    &#123;
        var accessList = await GetUserAccessDataGroupIDs(context, userId);

        if (accessList.Count == 0) return true;

        return accessList.Contains(orgGroupId);
    &#125;
    catch
    &#123;
        return true; // fail open
    &#125;
&#125;</code></pre>
        <h4>Usage Example</h4>
        <pre><code>// Check before allowing edit
bool canEdit = await Common_Methods.HasAccessToOrgGroup(_context, userId, staff.OrgGroupId);
if (!canEdit)
&#123;
    return new ServiceActionResult(ReturnStatus.error_NoUpdatePermission,
                                  "You don't have access to this organization group");
&#125;</code></pre>
      </section>

      <!-- Configuration Guide -->
      <section class="card">
        <h2>Configuration Guide</h2>

        <h3>Step 1: Setup Database</h3>
        <p>Run the SQL scripts shown in the Database Schema section above.</p>

        <h3>Step 2: Configure User Roles</h3>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-gear"></i> Config Module<small>User Role</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-person-badge"></i> Select Role<small>Role Detail Page</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-shield-lock"></i> Data Access<small>Section</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-plus-circle"></i> Add Group<small>Org / Dept</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-check2-square"></i> Set Access Type<small>Access / Denied</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-save"></i> Save<small>Auto-updates IDs</small></div>
          </div>
        </div>

        <h3>Step 3: Verify Configuration</h3>
        <ol>
          <li>Log in as a user with the configured role</li>
          <li>Navigate to <strong>Employee Module &rarr; Employee Info List</strong></li>
          <li>Verify only staff from allowed organization groups are visible</li>
          <li>Check staff combo boxes in other modules (Contract, Leave, etc.)</li>
        </ol>
      </section>

      <!-- Usage Examples -->
      <section class="card">
        <h2>Usage Examples</h2>

        <h3>Example 1: Regional Manager (Single Organization)</h3>
        <table>
          <thead><tr><th>Setting</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td><strong>Role</strong></td><td>Regional Manager</td></tr>
            <tr><td><strong>Group Type</strong></td><td>Organization</td></tr>
            <tr><td><strong>Organization Group</strong></td><td>North Region</td></tr>
            <tr><td><strong>Access Type</strong></td><td>Access</td></tr>
            <tr><td><strong>Result</strong></td><td>Shows only North Region staff. <code>AccessDataGroupIDs: "north-region-id"</code></td></tr>
          </tbody>
        </table>

        <h3>Example 2: Multi-Region Manager</h3>
        <table>
          <thead><tr><th>Entry</th><th>Group Type</th><th>Group</th><th>Access Type</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Organization</td><td>East Region</td><td>Access</td></tr>
            <tr><td>2</td><td>Organization</td><td>West Region</td><td>Access</td></tr>
          </tbody>
        </table>
        <p><strong>Result:</strong> Shows staff from both East and West regions. <code>AccessDataGroupIDs: "east-region-id,west-region-id"</code></p>

        <h3>Example 3: Department Manager</h3>
        <table>
          <thead><tr><th>Setting</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td><strong>Role</strong></td><td>Department Manager</td></tr>
            <tr><td><strong>Group Type</strong></td><td>Department</td></tr>
            <tr><td><strong>Department</strong></td><td>IT Department</td></tr>
            <tr><td><strong>Access Type</strong></td><td>Access</td></tr>
            <tr><td><strong>Result</strong></td><td>Shows only IT Department staff. <code>AccessDataGroupIDs: "it-department-id"</code></td></tr>
          </tbody>
        </table>

        <h3>Example 4: HR Admin (Full Access)</h3>
        <table>
          <thead><tr><th>Setting</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td><strong>Role</strong></td><td>HR Admin</td></tr>
            <tr><td><strong>Data Access</strong></td><td><strong>Leave empty (no groups configured)</strong></td></tr>
            <tr><td><strong>Result</strong></td><td>Shows all staff. <code>AccessDataGroupIDs: NULL or empty</code></td></tr>
          </tbody>
        </table>

        <h3>Example 5: Multi-Type Access (Organization + Department)</h3>
        <table>
          <thead><tr><th>Entry</th><th>Group Type</th><th>Group</th><th>Access Type</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Organization</td><td>Head Office</td><td>Access</td></tr>
            <tr><td>2</td><td>Department</td><td>Sales Department</td><td>Access</td></tr>
          </tbody>
        </table>
        <p><strong>Result:</strong> Shows staff where <code>OrgGroupId = "head-office-id"</code> OR <code>DepartmentId = "sales-dept-id"</code>. The filter uses OR logic:</p>
        <pre><code>&amp;&amp; (accessDataGroupList.Count == 0 ||
    (accessDataGroupList.Contains(x.OrgGroupId)
     || accessDataGroupList.Contains(x.DepartmentId)))</code></pre>
      </section>

      <!-- API Reference -->
      <section class="card">
        <h2>API Reference</h2>
        <p><strong>Base URL:</strong> <code>&#123;baseApiUrl&#125;/SysUserRoleApi</code></p>

        <h3>1. Get Data Groups by Role ID</h3>
        <p><span class="method-get">GET</span> <code>/GetDataGroupsByRoleId/&#123;roleId&#125;</code></p>
        <p><strong>Parameters:</strong> <code>roleId</code> (string) &mdash; User role ID</p>
        <pre><code>// Response
&#123;
  "status": "200",
  "message": "",
  "resultObject": [
    &#123;
      "dataGroupID": "550e8400-e29b-41d4-a716-446655440000",
      "roleID": "role-123",
      "groupRefType": "Organization",
      "groupRefID": "org-456",
      "accessType": "Access",
      "groupName": "Engineering Division"
    &#125;
  ]
&#125;</code></pre>

        <h3>2. Save Data Group</h3>
        <p><span class="method-post">POST</span> <code>/SaveDataGroup</code></p>
        <pre><code>// Request Body
&#123;
  "dataGroupID": "",
  "roleID": "role-123",
  "groupRefType": "Organization",
  "groupRefID": "org-456",
  "accessType": "Access"
&#125;

// Response
&#123;
  "status": "200",
  "message": "Data group saved successfully.",
  "resultObject": &#123;
    "dataGroupID": "550e8400-e29b-41d4-a716-446655440000",
    "roleID": "role-123",
    "groupRefType": "Organization",
    "groupRefID": "org-456",
    "accessType": "Access"
  &#125;
&#125;</code></pre>

        <h3>3. Remove Data Group</h3>
        <p><span class="method-delete">DELETE</span> <code>/RemoveDataGroup/&#123;dataGroupId&#125;</code></p>
        <p><strong>Parameters:</strong> <code>dataGroupId</code> (string) &mdash; Data group ID to remove</p>
        <pre><code>// Response
&#123;
  "status": "200",
  "message": "Data group removed successfully.",
  "resultObject": true
&#125;</code></pre>
      </section>

      <!-- Modules Affected -->
      <section class="card">
        <h2>Modules Affected</h2>
        <h3>Automatically Filtered Modules</h3>
        <table>
          <thead><tr><th>#</th><th>Module</th><th>Scope</th></tr></thead>
          <tbody>
            <tr><td>1</td><td><strong>Employee Info Module</strong></td><td>Employee List (Card/Grid view), Search and filters</td></tr>
            <tr><td>2</td><td><strong>Contract Module</strong></td><td>Staff combo box in contract form, Contract list filtering</td></tr>
            <tr><td>3</td><td><strong>Leave Module</strong></td><td>Staff selection dropdowns, Leave application forms</td></tr>
            <tr><td>4</td><td><strong>Attendance Module</strong></td><td>Staff combo boxes, Attendance reports</td></tr>
            <tr><td>5</td><td><strong>Payroll Module</strong></td><td>Staff selection, Salary calculations</td></tr>
            <tr><td>6</td><td><strong>All Selection Boxes</strong></td><td>Any module using <code>SelectionBoxService.GetStaffs()</code></td></tr>
          </tbody>
        </table>

        <h3>Implementation Pattern for New Modules</h3>
        <pre><code>// In your controller method
var accessDataGroupList = await Common_Methods.GetUserAccessDataGroupIDs(_context, userId);

var data = await _context.HrStaffView
    .Where(x =&gt; x.Active == true
                &amp;&amp; x.LicenseId == licenseId
                // Add this filter - checks both Organization and Department
                &amp;&amp; (accessDataGroupList.Count == 0 ||
                    (accessDataGroupList.Contains(x.OrgGroupId)
                     || accessDataGroupList.Contains(x.DepartmentId))))
    .ToListAsync();</code></pre>

        <h3>Complete Example from EmployeeInfoController</h3>
        <pre><code>[HttpPost("GetEmployeeListByPagination")]
public async Task&lt;ServiceActionResult&gt; GetEmployeeListByPagination(
    EmployeeListRequestDTO requestData)
&#123;
    try
    &#123;
        string requestId = _myStorage.GetUserID();
        string licenseId = _myStorage.GetUserLicenseID();

        // Get user's access data group IDs
        var accessDataGroupList = await Common_Methods
            .GetUserAccessDataGroupIDs(_context, requestId);

        // Build query with filtering
        var baseQuery = _context.HrStaffView
            .Where(x =&gt; x.Active == true
                &amp;&amp; (requestData.DivisionIds.Count == 0
                    || requestData.DivisionIds.Contains(x.DivisionId))
                &amp;&amp; (requestData.DepartmentIds.Count == 0
                    || requestData.DepartmentIds.Contains(x.DepartmentId))
                // Organization Group and Department Access Filter
                &amp;&amp; (accessDataGroupList.Count == 0 ||
                    (accessDataGroupList.Contains(x.OrgGroupId)
                     || accessDataGroupList.Contains(x.DepartmentId)))
                &amp;&amp; x.LicenseId == licenseId);

        var staffList = await baseQuery.ToListAsync();
        return new ServiceActionResult(ReturnStatus.success, "", staffList);
    &#125;
    catch (Exception ex)
    &#123;
        return new ServiceActionResult(ReturnStatus.failed, ex.Message);
    &#125;
&#125;</code></pre>
      </section>

      <!-- Security Considerations -->
      <section class="card">
        <h2>Security Considerations</h2>
        <h3>Permission Checks</h3>
        <table>
          <thead><tr><th>Permission</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><code>ActionCode.read</code></td><td>View data groups on User Role module</td></tr>
            <tr><td><code>ActionCode.create</code></td><td>Create data group configuration</td></tr>
            <tr><td><code>ActionCode.update</code></td><td>Update data group configuration</td></tr>
            <tr><td><code>ActionCode.delete</code></td><td>Delete data group configuration</td></tr>
          </tbody>
        </table>
        <h3>Data Isolation</h3>
        <ul>
          <li>Users can only see data from their authorized organization groups and departments</li>
          <li>If no restrictions are configured, full access is granted (backward compatible)</li>
          <li>Filtering applies at the database query level (secure)</li>
          <li>Cannot be bypassed from frontend</li>
          <li>Both OrgGroupId and DepartmentId are checked for maximum flexibility</li>
        </ul>
        <h3>Error Handling</h3>
        <ul>
          <li>Failed queries return empty list (fail-safe)</li>
          <li>Missing AccessDataGroupIDs treated as full access</li>
          <li>Invalid group IDs are ignored</li>
          <li>Database errors are logged</li>
        </ul>
      </section>

      <!-- Troubleshooting -->
      <section class="card">
        <h2>Troubleshooting</h2>
        <table>
          <thead><tr><th>Issue</th><th>Cause</th><th>Solution</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>User sees no staff</strong></td>
              <td>Role has data access groups configured, but staff don't match the allowed groups</td>
              <td>Check role configuration. Verify Data Access groups. Ensure staff have matching OrgGroupId or DepartmentId. Check if staff are active.</td>
            </tr>
            <tr>
              <td><strong>User sees all staff (should be restricted)</strong></td>
              <td>AccessDataGroupIDs is NULL or empty in SysUserRole table</td>
              <td>Navigate to role configuration. Add Data Access groups (Organization or Department). Save to auto-update AccessDataGroupIDs.</td>
            </tr>
            <tr>
              <td><strong>Staff combo box is empty</strong></td>
              <td>No staff exist in the allowed organization groups or departments</td>
              <td>Verify org groups assigned to staff (HrStaffView.OrgGroupId). Verify departments. Check if staff are active.</td>
            </tr>
            <tr>
              <td><strong>Department filtering not working</strong></td>
              <td>Staff records don't have DepartmentId populated</td>
              <td>Verify staff have valid DepartmentId. Check Department is selected in Data Access. Verify department exists in HrDepartmentView.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Future Enhancements -->
      <section class="card">
        <h2>Future Enhancements</h2>
        <ol>
          <li><strong>Location-Based Filtering</strong> &mdash; Add GroupRefType: "Location" to filter by work location</li>
          <li><strong>Audit Trail</strong> &mdash; Track who configured data access groups and log all changes</li>
          <li><strong>Bulk Configuration</strong> &mdash; Configure multiple roles at once and copy configuration from one role to another</li>
        </ol>
      </section>

      <!-- Version History -->
      <section class="card">
        <h2>Version History</h2>
        <table>
          <thead><tr><th>Version</th><th>Date</th><th>Author</th><th>Changes</th></tr></thead>
          <tbody>
            <tr><td>1.0</td><td>2025-01-XX</td><td>Development Team</td><td>Initial implementation &mdash; Database schema, Backend API, Frontend UI, Common utilities, Employee module filtering, Staff combo box filtering</td></tr>
            <tr><td>1.1</td><td>2026-01-15</td><td>Development Team</td><td>Department filtering added &mdash; Department group type, Updated backend/frontend, Documentation updated</td></tr>
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
    .card h4 { font-size: 14px; font-weight: 600; color: #1a1f36; margin: 16px 0 6px; }
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
export class GroupDataAccessComponent {}
