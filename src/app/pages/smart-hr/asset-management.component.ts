import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-asset-management',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-hr" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart HR
      </a>
      <h1>Asset &amp; Resource Management Module</h1>
      <p class="subtitle">Comprehensive system for managing employee requests, allocation, tracking, and return of workplace resources. Module Prefix: Am* | Technology Stack: .NET 8.0, EF Core 8.0, SQL Server</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>The Asset &amp; Resource Management module is a comprehensive system for managing employee requests, allocation, tracking, and return of workplace resources including:</p>
        <ul>
          <li><strong>Uniforms</strong> &mdash; Work attire and safety equipment</li>
          <li><strong>Tools &amp; Equipment</strong> &mdash; Physical tools and machinery</li>
          <li><strong>Devices</strong> &mdash; Laptops, phones, tablets, accessories</li>
          <li><strong>Per Diem</strong> &mdash; Travel allowances and expense requests</li>
          <li><strong>Training</strong> &mdash; Course enrollments and certifications</li>
          <li><strong>Certificates</strong> &mdash; Employment letters and documents</li>
          <li><strong>And more</strong> &mdash; Fully configurable categories</li>
        </ul>
      </section>

      <!-- Key Features -->
      <section class="card">
        <h2>Key Features</h2>
        <ul>
          <li><strong>Complete Lifecycle Management</strong> &mdash; From request to approval to delivery to usage to return</li>
          <li><strong>Configurable Categories</strong> &mdash; Admin-defined request types with custom rules</li>
          <li><strong>Approval Workflow Integration</strong> &mdash; Links with existing AppApprovalRequest system</li>
          <li><strong>Asset Tracking</strong> &mdash; Serial numbers, condition monitoring, location tracking</li>
          <li><strong>Project &amp; Cost Center Binding</strong> &mdash; Charge costs to projects/departments</li>
          <li><strong>Return Management</strong> &mdash; Condition assessment, damage charges, payroll deduction</li>
          <li><strong>Inventory Management</strong> &mdash; Stock levels, reordering, procurement</li>
          <li><strong>Maintenance Tracking</strong> &mdash; Service history for reusable equipment</li>
          <li><strong>Financial Integration</strong> &mdash; Depreciation, cost recovery, insurance claims</li>
          <li><strong>Custom Fields</strong> &mdash; Category-specific dynamic fields</li>
          <li><strong>Multi-tenancy</strong> &mdash; Full LicenseId support</li>
          <li><strong>Complete Audit Trail</strong> &mdash; All changes logged</li>
        </ul>
      </section>

      <!-- Naming Conventions -->
      <section class="card">
        <h2>Module Architecture &amp; Naming Conventions</h2>
        <table>
          <thead><tr><th>Type</th><th>Pattern</th><th>Example</th></tr></thead>
          <tbody>
            <tr><td>Entity Classes</td><td><code>Am&#123;EntityName&#125;</code></td><td>AmAssetCategory, AmResourceRequest</td></tr>
            <tr><td>View Classes</td><td><code>Am&#123;EntityName&#125;View</code></td><td>AmResourceRequestView</td></tr>
            <tr><td>DTO Classes</td><td><code>&#123;EntityName&#125;DTO</code></td><td>ResourceRequestDTO</td></tr>
            <tr><td>Controller Interface</td><td><code>I&#123;EntityName&#125;Controller</code></td><td>IResourceRequestController</td></tr>
            <tr><td>Controller Implementation</td><td><code>&#123;EntityName&#125;Controller</code></td><td>ResourceRequestController</td></tr>
            <tr><td>API Controller</td><td><code>&#123;EntityName&#125;Api</code></td><td>ResourceRequestApi</td></tr>
            <tr><td>Database Tables</td><td><code>Am_&#123;TableName&#125;</code></td><td>Am_AssetCategory</td></tr>
            <tr><td>Database Views</td><td><code>Am_&#123;ViewName&#125;View</code></td><td>Am_ResourceRequestView</td></tr>
          </tbody>
        </table>

        <h3>Standard Entity Properties (Audit Fields)</h3>
        <pre><code>public string &#123;EntityId&#125; &#123; get; set; &#125;           // Primary Key (GUID)
public bool Active &#123; get; set; &#125;                 // Logical delete flag
public string CreatedBy &#123; get; set; &#125;             // User ID who created
public DateTime CreatedOn &#123; get; set; &#125;           // Creation timestamp
public string ModifiedBy &#123; get; set; &#125;            // Last modifier user ID
public DateTime? ModifiedOn &#123; get; set; &#125;         // Last modification time
public string LastAction &#123; get; set; &#125;            // GUID for audit trail
public string LicenseId &#123; get; set; &#125;             // Multi-tenancy identifier</code></pre>
      </section>

      <!-- Request Lifecycle Flow -->
      <section class="card">
        <h2>Request Lifecycle Flow</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-pencil-square"></i> Draft<small>Status: 1</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-send"></i> Submitted<small>Status: 2</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-search"></i> Under Review<small>Status: 3</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-check-circle"></i> Approved<small>Status: 4</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-gear"></i> Processing<small>Status: 6</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-truck"></i> Ready for Delivery<small>Status: 7</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-box-seam"></i> Delivered<small>Status: 8</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check-all"></i> Completed<small>Status: 9</small></div>
          </div>
        </div>
      </section>

      <!-- ER Diagram -->
      <section class="card">
        <h2>Entity Relationship Diagram</h2>
        <div class="er-diagram">
          <div class="er-table">
            <div class="er-header">AmAssetCategory</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> AssetCategoryId (GUID)</div>
            <div class="er-row">CategoryCode, CategoryName, Description</div>
            <div class="er-row">IsReturnable, IsSerialTracked, IsConsumable</div>
            <div class="er-row">RequireApproval, ApprovalWorkflowId</div>
            <div class="er-row">HasInventoryControl, CheckStockAvailability</div>
          </div>
          <div class="er-relation">
            <div class="er-line">1 &mdash;&mdash; *</div>
          </div>
          <div class="er-table">
            <div class="er-header">AmAssetItem</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> AssetItemId (GUID)</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> AssetCategoryId</div>
            <div class="er-row">ItemCode, ItemName, Brand, Model</div>
            <div class="er-row">UnitPrice, CurrencyCode, CurrentStock</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> SupplierId</div>
          </div>
          <div class="er-relation">
            <div class="er-line">* &mdash;&mdash; *</div>
          </div>
          <div class="er-table">
            <div class="er-header">AmResourceRequest</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> ResourceRequestId (GUID)</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> AssetCategoryId</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> RequestedByStaffId</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> ApprovalRequestId</div>
            <div class="er-row">RequestNumber, RequestTitle, Status, Priority</div>
            <div class="er-row">TotalEstimatedValue, CurrencyCode</div>
          </div>
          <div class="er-relation">
            <div class="er-line">1 &mdash;&mdash; *</div>
          </div>
          <div class="er-table">
            <div class="er-header">AmResourceRequestItem</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> RequestItemId (GUID)</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> ResourceRequestId</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> AssetItemId</div>
            <div class="er-row">RequestedQuantity, ApprovedQuantity, DeliveredQuantity</div>
            <div class="er-row">UnitPrice, TotalPrice, ItemStatus</div>
          </div>
          <div class="er-relation">
            <div class="er-line">1 &mdash;&mdash; *</div>
          </div>
          <div class="er-table">
            <div class="er-header">AmAssetAllocation</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> AllocationId (GUID)</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> ResourceRequestId</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> RequestItemId</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> AssetItemId</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> AllocatedToStaffId</div>
            <div class="er-row">SerialNumber, AllocationStatus, DeliveryCondition</div>
          </div>
          <div class="er-relation">
            <div class="er-line">1 &mdash;&mdash; *</div>
          </div>
          <div class="er-table">
            <div class="er-header">AmAssetAllocationLog</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> LogId (GUID)</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> AllocationId</div>
            <div class="er-row">EventType, EventDate, EventDescription</div>
            <div class="er-row">PreviousStatus, CurrentStatus</div>
          </div>
        </div>
      </section>

      <!-- Core Entity: AmAssetCategory -->
      <section class="card">
        <h2>Core Entity: AmAssetCategory</h2>
        <p><strong>Table:</strong> <code>Am_AssetCategory</code> &mdash; Define configurable categories with specific rules and workflows.</p>
        <pre><code>public partial class AmAssetCategory
&#123;
    public string AssetCategoryId &#123; get; set; &#125;           // GUID PK
    public string CategoryCode &#123; get; set; &#125;              // e.g., "UNI", "TOOL", "DEV"
    public string CategoryName &#123; get; set; &#125;
    public string Description &#123; get; set; &#125;
    public string IconName &#123; get; set; &#125;
    public decimal DisplayOrder &#123; get; set; &#125;

    // Category Configuration
    public bool IsProjectBindingRequired &#123; get; set; &#125;
    public bool IsDepartmentBindingRequired &#123; get; set; &#125;
    public bool IsReturnable &#123; get; set; &#125;
    public bool IsSerialTracked &#123; get; set; &#125;
    public bool IsConsumable &#123; get; set; &#125;
    public bool RequireApproval &#123; get; set; &#125;
    public string ApprovalWorkflowId &#123; get; set; &#125;       // FK to AppWorkflow
    public bool AllowMultipleItems &#123; get; set; &#125;
    public decimal? MaxQuantityPerRequest &#123; get; set; &#125;
    public decimal? MaxValuePerRequest &#123; get; set; &#125;
    public bool RequireJustification &#123; get; set; &#125;
    public bool RequireAttachment &#123; get; set; &#125;
    public bool EnableAutoApprovalForValue &#123; get; set; &#125;
    public decimal? AutoApprovalThreshold &#123; get; set; &#125;

    // Inventory Integration
    public bool HasInventoryControl &#123; get; set; &#125;
    public bool CheckStockAvailability &#123; get; set; &#125;
    public bool AutoDeductFromStock &#123; get; set; &#125;

    // Return Configuration
    public bool RequireReturnConditionCheck &#123; get; set; &#125;
    public bool AllowDamageCharge &#123; get; set; &#125;
    public bool LinkToPayrollDeduction &#123; get; set; &#125;
    public decimal? DefaultReturnDays &#123; get; set; &#125;

    public string Status &#123; get; set; &#125;                    // "Active", "Inactive"
    // + Standard Audit Fields
&#125;</code></pre>
      </section>

      <!-- Core Entity: AmAssetItem -->
      <section class="card">
        <h2>Core Entity: AmAssetItem</h2>
        <p><strong>Table:</strong> <code>Am_AssetItem</code> &mdash; Define specific items available for request.</p>
        <pre><code>public partial class AmAssetItem
&#123;
    public string AssetItemId &#123; get; set; &#125;               // GUID PK
    public string AssetCategoryId &#123; get; set; &#125;           // FK to AmAssetCategory
    public string ItemCode &#123; get; set; &#125;                  // e.g., "UNI-HELMET-001"
    public string ItemName &#123; get; set; &#125;
    public string Description &#123; get; set; &#125;
    public string Specification &#123; get; set; &#125;
    public string Brand &#123; get; set; &#125;
    public string Model &#123; get; set; &#125;
    public string Manufacturer &#123; get; set; &#125;

    // Financial
    public decimal UnitPrice &#123; get; set; &#125;
    public string CurrencyCode &#123; get; set; &#125;
    public decimal? ReplacementCost &#123; get; set; &#125;
    public decimal? DepreciationRate &#123; get; set; &#125;

    // Inventory
    public decimal CurrentStock &#123; get; set; &#125;
    public decimal? MinimumStock &#123; get; set; &#125;
    public decimal? MaximumStock &#123; get; set; &#125;
    public decimal ReservedStock &#123; get; set; &#125;
    public string UnitOfMeasure &#123; get; set; &#125;
    public string StorageLocation &#123; get; set; &#125;

    // Supplier
    public string SupplierId &#123; get; set; &#125;
    public string SupplierPartNumber &#123; get; set; &#125;
    public decimal? LeadTimeDays &#123; get; set; &#125;
    // + Standard Audit Fields
&#125;</code></pre>
      </section>

      <!-- Core Entity: AmResourceRequest -->
      <section class="card">
        <h2>Core Entity: AmResourceRequest</h2>
        <p><strong>Table:</strong> <code>Am_ResourceRequest</code> &mdash; Core request record submitted by staff.</p>
        <pre><code>public partial class AmResourceRequest
&#123;
    public string ResourceRequestId &#123; get; set; &#125;         // GUID PK
    public string RequestNumber &#123; get; set; &#125;             // Auto: RR-2025-00001
    public string RequestTitle &#123; get; set; &#125;
    public DateTime RequestDate &#123; get; set; &#125;
    public string AssetCategoryId &#123; get; set; &#125;           // FK

    // Requester
    public string RequestedByStaffId &#123; get; set; &#125;       // FK to HrStaff
    public string RequestedByUserId &#123; get; set; &#125;
    public string RequestedByDepartmentId &#123; get; set; &#125;
    public string RequestedByPositionId &#123; get; set; &#125;

    // Project &amp; Cost Center
    public string ProjectId &#123; get; set; &#125;
    public string DepartmentId &#123; get; set; &#125;
    public string CostCenterCode &#123; get; set; &#125;
    public string BudgetCode &#123; get; set; &#125;

    // Request Details
    public string Purpose &#123; get; set; &#125;
    public string Justification &#123; get; set; &#125;
    public DateTime? RequiredByDate &#123; get; set; &#125;
    public string Priority &#123; get; set; &#125;                 // Low, Medium, High, Urgent
    public decimal TotalEstimatedValue &#123; get; set; &#125;

    // Approval &amp; Workflow
    public string ApprovalRequestId &#123; get; set; &#125;        // FK to AppApprovalRequest
    public string Status &#123; get; set; &#125;                   // 1-11 status codes
    // + Standard Audit Fields
&#125;</code></pre>
      </section>

      <!-- Core Entity: AmResourceRequestItem -->
      <section class="card">
        <h2>Core Entity: AmResourceRequestItem</h2>
        <p><strong>Table:</strong> <code>Am_ResourceRequestItem</code> &mdash; Individual items within a request.</p>
        <pre><code>public partial class AmResourceRequestItem
&#123;
    public string RequestItemId &#123; get; set; &#125;             // GUID PK
    public string ResourceRequestId &#123; get; set; &#125;         // FK
    public string AssetItemId &#123; get; set; &#125;               // FK
    public string ItemName &#123; get; set; &#125;

    // Quantity &amp; Pricing
    public decimal RequestedQuantity &#123; get; set; &#125;
    public decimal ApprovedQuantity &#123; get; set; &#125;
    public decimal DeliveredQuantity &#123; get; set; &#125;
    public decimal UnitPrice &#123; get; set; &#125;
    public decimal TotalPrice &#123; get; set; &#125;
    public string ItemStatus &#123; get; set; &#125;               // Pending, Approved, Delivered, Cancelled

    // Return Info (for returnable items)
    public bool IsReturnable &#123; get; set; &#125;
    public DateTime? ExpectedReturnDate &#123; get; set; &#125;
    public string ReturnStatus &#123; get; set; &#125;             // Not Returned, Returned, Overdue, Lost
    // + Standard Audit Fields
&#125;</code></pre>
      </section>

      <!-- Core Entity: AmAssetAllocation -->
      <section class="card">
        <h2>Core Entity: AmAssetAllocation</h2>
        <p><strong>Table:</strong> <code>Am_AssetAllocation</code> &mdash; Track individual assets allocated to staff.</p>
        <pre><code>public partial class AmAssetAllocation
&#123;
    public string AllocationId &#123; get; set; &#125;              // GUID PK
    public string AllocationNumber &#123; get; set; &#125;          // Auto: AL-2025-00001
    public string ResourceRequestId &#123; get; set; &#125;         // FK
    public string RequestItemId &#123; get; set; &#125;             // FK
    public string AssetItemId &#123; get; set; &#125;               // FK

    // Asset Info
    public string AssetCode &#123; get; set; &#125;
    public string SerialNumber &#123; get; set; &#125;
    public decimal Quantity &#123; get; set; &#125;

    // Allocated To
    public string AllocatedToStaffId &#123; get; set; &#125;       // FK to HrStaff
    public DateTime AllocationDate &#123; get; set; &#125;
    public string AllocationStatus &#123; get; set; &#125;         // Active, Returned, Lost, Damaged...

    // Condition at Delivery
    public string DeliveryCondition &#123; get; set; &#125;        // New, Good, Fair, Used
    public bool AcknowledgedByStaff &#123; get; set; &#125;

    // Return Information
    public DateTime? ReturnDate &#123; get; set; &#125;
    public string ReturnCondition &#123; get; set; &#125;

    // Damage Assessment
    public bool IsDamaged &#123; get; set; &#125;
    public bool IsLost &#123; get; set; &#125;
    public decimal? DamageAssessmentCost &#123; get; set; &#125;
    public bool ChargeToStaff &#123; get; set; &#125;
    public decimal? ChargeAmount &#123; get; set; &#125;

    // Financial Tracking
    public decimal AllocationValue &#123; get; set; &#125;
    public decimal CurrentValue &#123; get; set; &#125;
    public decimal AccumulatedDepreciation &#123; get; set; &#125;
    // + Standard Audit Fields
&#125;</code></pre>
      </section>

      <!-- Core Entity: AmAssetAllocationLog -->
      <section class="card">
        <h2>Core Entity: AmAssetAllocationLog</h2>
        <p><strong>Table:</strong> <code>Am_AssetAllocationLog</code> &mdash; Complete history of asset lifecycle events.</p>
        <pre><code>public partial class AmAssetAllocationLog
&#123;
    public string LogId &#123; get; set; &#125;                     // GUID PK
    public string AllocationId &#123; get; set; &#125;              // FK
    public string AssetCode &#123; get; set; &#125;
    public string SerialNumber &#123; get; set; &#125;

    // Event
    public string EventType &#123; get; set; &#125;                // Allocated, Transferred, Returned, Damaged, Lost, Repaired, Disposed
    public DateTime EventDate &#123; get; set; &#125;
    public string EventDescription &#123; get; set; &#125;

    // State Change
    public string PreviousStatus &#123; get; set; &#125;
    public string CurrentStatus &#123; get; set; &#125;
    public string PreviousHolder &#123; get; set; &#125;
    public string CurrentHolder &#123; get; set; &#125;
    public decimal? CostIncurred &#123; get; set; &#125;
    // + Standard Audit Fields
&#125;</code></pre>
      </section>

      <!-- Core Entity: AmAssetMaintenance -->
      <section class="card">
        <h2>Core Entity: AmAssetMaintenance</h2>
        <p><strong>Table:</strong> <code>Am_AssetMaintenance</code> &mdash; Track maintenance/repair history.</p>
        <pre><code>public partial class AmAssetMaintenance
&#123;
    public string MaintenanceId &#123; get; set; &#125;             // GUID PK
    public string AllocationId &#123; get; set; &#125;              // FK
    public string AssetItemId &#123; get; set; &#125;               // FK

    public string MaintenanceType &#123; get; set; &#125;          // Preventive, Corrective, Breakdown
    public string MaintenanceCategory &#123; get; set; &#125;      // Routine, Repair, Upgrade, Inspection
    public DateTime ScheduledDate &#123; get; set; &#125;
    public string MaintenanceStatus &#123; get; set; &#125;        // Scheduled, In Progress, Completed, Cancelled

    public string ProblemDescription &#123; get; set; &#125;
    public string ActionTaken &#123; get; set; &#125;
    public string MaintenanceResult &#123; get; set; &#125;        // Fixed, Partially Fixed, Unable to Fix, Requires Replacement

    // Cost
    public decimal LaborCost &#123; get; set; &#125;
    public decimal PartsCost &#123; get; set; &#125;
    public decimal TotalCost &#123; get; set; &#125;
    // + Standard Audit Fields
&#125;</code></pre>
      </section>

      <!-- Core Entity: AmReturnRequest -->
      <section class="card">
        <h2>Core Entity: AmReturnRequest</h2>
        <p><strong>Table:</strong> <code>Am_ReturnRequest</code> &mdash; Staff initiates return of allocated asset.</p>
        <pre><code>public partial class AmReturnRequest
&#123;
    public string ReturnRequestId &#123; get; set; &#125;           // GUID PK
    public string ReturnRequestNumber &#123; get; set; &#125;      // Auto: RR-2025-00001
    public string AllocationId &#123; get; set; &#125;              // FK
    public string ReturnedByStaffId &#123; get; set; &#125;        // FK to HrStaff

    public string ReturnReason &#123; get; set; &#125;             // Project Completed, Resignation, etc.
    public DateTime ProposedReturnDate &#123; get; set; &#125;
    public string CurrentCondition &#123; get; set; &#125;
    public bool HasDamage &#123; get; set; &#125;
    public string DamageDescription &#123; get; set; &#125;
    public string Status &#123; get; set; &#125;                   // Submitted, Approved, Collected, Completed

    public DateTime? ActualReturnDate &#123; get; set; &#125;
    public string CollectedByUserId &#123; get; set; &#125;
    // + Standard Audit Fields
&#125;</code></pre>
      </section>

      <!-- Custom Fields -->
      <section class="card">
        <h2>Dynamic Custom Fields</h2>

        <h3>AmCustomFieldDefinition</h3>
        <p><strong>Table:</strong> <code>Am_CustomFieldDefinition</code> &mdash; Configure custom fields for specific asset categories.</p>
        <pre><code>public partial class AmCustomFieldDefinition
&#123;
    public string FieldDefinitionId &#123; get; set; &#125;         // GUID PK
    public string AssetCategoryId &#123; get; set; &#125;           // FK
    public string FieldName &#123; get; set; &#125;
    public string FieldLabel &#123; get; set; &#125;
    public string FieldType &#123; get; set; &#125;                // Text, Number, Date, Dropdown, Checkbox, File
    public bool IsRequired &#123; get; set; &#125;
    public string FieldOptions &#123; get; set; &#125;             // JSON: ["Option1", "Option2"]
    public bool ShowInRequestForm &#123; get; set; &#125;
    public bool ShowInApprovalForm &#123; get; set; &#125;
    public bool ShowInAllocationForm &#123; get; set; &#125;
&#125;</code></pre>

        <h3>AmCustomFieldValue</h3>
        <p><strong>Table:</strong> <code>Am_CustomFieldValue</code> &mdash; Store values for custom fields.</p>
        <pre><code>public partial class AmCustomFieldValue
&#123;
    public string FieldValueId &#123; get; set; &#125;              // GUID PK
    public string FieldDefinitionId &#123; get; set; &#125;         // FK
    public string EntityType &#123; get; set; &#125;               // Request, RequestItem, Allocation
    public string EntityId &#123; get; set; &#125;

    public string StringValue &#123; get; set; &#125;
    public decimal? NumberValue &#123; get; set; &#125;
    public DateTime? DateValue &#123; get; set; &#125;
    public bool? BooleanValue &#123; get; set; &#125;
    public string FileUrl &#123; get; set; &#125;
&#125;</code></pre>
      </section>

      <!-- Supporting Entities -->
      <section class="card">
        <h2>Supporting Entities</h2>

        <h3>AmSupplier (Am_Supplier)</h3>
        <p>Vendor management: SupplierCode, SupplierName, ContactPerson, Email, PhoneNumber, Address, TaxIdentificationNumber, PaymentTerms, SupplierCategory, Status.</p>

        <h3>AmPurchaseOrder (Am_PurchaseOrder)</h3>
        <p>Procurement: PurchaseOrderNumber (PO-2025-00001), SupplierId (FK), OrderDate, TotalAmount, Status (Draft/Submitted/Approved/Ordered/Received/Cancelled).</p>

        <h3>AmPurchaseOrderItem (Am_PurchaseOrderItem)</h3>
        <p>PO line items: PurchaseOrderId (FK), AssetItemId (FK), OrderQuantity, ReceivedQuantity, UnitPrice, TotalPrice, ItemStatus.</p>

        <h3>AmStockTransaction (Am_StockTransaction)</h3>
        <p>Inventory movement: TransactionNumber (ST-2025-00001), AssetItemId (FK), TransactionType (Receipt/Issue/Return/Adjustment/Transfer/Disposal), Quantity, BalanceAfterTransaction.</p>
      </section>

      <!-- View Entities -->
      <section class="card">
        <h2>View Entities</h2>

        <h3>AmResourceRequestView</h3>
        <p>Optimized read-only view for request listing and reporting with joined requester info, category info, project info, approval info, and item counts (TotalItems, DeliveredItems, PendingItems).</p>

        <h3>AmAssetAllocationView</h3>
        <p>Optimized view for tracking allocated assets with joined staff info, asset info, project info. Includes calculated fields: IsOverdue, DaysOverdue, CurrentValue, ChargeAmount.</p>

        <h3>AmAssetItemView</h3>
        <p>Item catalog with inventory status. Includes AvailableStock (CurrentStock - ReservedStock), IsLowStock, StockStatus ("In Stock", "Low Stock", "Out of Stock"), TotalInventoryValue.</p>
      </section>

      <!-- Foreign Key Relationships -->
      <section class="card">
        <h2>Foreign Key Relationships</h2>
        <table>
          <thead><tr><th>Child Table</th><th>FK Column</th><th>Parent Table</th><th>Parent Column</th></tr></thead>
          <tbody>
            <tr><td><code>Am_AssetItem</code></td><td>AssetCategoryId</td><td><code>Am_AssetCategory</code></td><td>AssetCategoryId</td></tr>
            <tr><td><code>Am_AssetItem</code></td><td>SupplierId</td><td><code>Am_Supplier</code></td><td>SupplierId</td></tr>
            <tr><td><code>Am_ResourceRequest</code></td><td>AssetCategoryId</td><td><code>Am_AssetCategory</code></td><td>AssetCategoryId</td></tr>
            <tr><td><code>Am_ResourceRequest</code></td><td>RequestedByStaffId</td><td><code>Hr_Staff</code></td><td>StaffId</td></tr>
            <tr><td><code>Am_ResourceRequest</code></td><td>ApprovalRequestId</td><td><code>App_ApprovalRequest</code></td><td>RequestId</td></tr>
            <tr><td><code>Am_ResourceRequestItem</code></td><td>ResourceRequestId</td><td><code>Am_ResourceRequest</code></td><td>ResourceRequestId</td></tr>
            <tr><td><code>Am_ResourceRequestItem</code></td><td>AssetItemId</td><td><code>Am_AssetItem</code></td><td>AssetItemId</td></tr>
            <tr><td><code>Am_AssetAllocation</code></td><td>ResourceRequestId</td><td><code>Am_ResourceRequest</code></td><td>ResourceRequestId</td></tr>
            <tr><td><code>Am_AssetAllocation</code></td><td>RequestItemId</td><td><code>Am_ResourceRequestItem</code></td><td>RequestItemId</td></tr>
            <tr><td><code>Am_AssetAllocation</code></td><td>AssetItemId</td><td><code>Am_AssetItem</code></td><td>AssetItemId</td></tr>
            <tr><td><code>Am_AssetAllocation</code></td><td>AllocatedToStaffId</td><td><code>Hr_Staff</code></td><td>StaffId</td></tr>
            <tr><td><code>Am_AssetAllocationLog</code></td><td>AllocationId</td><td><code>Am_AssetAllocation</code></td><td>AllocationId</td></tr>
            <tr><td><code>Am_AssetMaintenance</code></td><td>AllocationId</td><td><code>Am_AssetAllocation</code></td><td>AllocationId</td></tr>
            <tr><td><code>Am_ReturnRequest</code></td><td>AllocationId</td><td><code>Am_AssetAllocation</code></td><td>AllocationId</td></tr>
            <tr><td><code>Am_CustomFieldDefinition</code></td><td>AssetCategoryId</td><td><code>Am_AssetCategory</code></td><td>AssetCategoryId</td></tr>
            <tr><td><code>Am_CustomFieldValue</code></td><td>FieldDefinitionId</td><td><code>Am_CustomFieldDefinition</code></td><td>FieldDefinitionId</td></tr>
            <tr><td><code>Am_PurchaseOrder</code></td><td>SupplierId</td><td><code>Am_Supplier</code></td><td>SupplierId</td></tr>
            <tr><td><code>Am_PurchaseOrderItem</code></td><td>AssetItemId</td><td><code>Am_AssetItem</code></td><td>AssetItemId</td></tr>
            <tr><td><code>Am_StockTransaction</code></td><td>AssetItemId</td><td><code>Am_AssetItem</code></td><td>AssetItemId</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Database Tables Summary -->
      <section class="card">
        <h2>Database Tables Summary</h2>
        <h3>Key Tables (14)</h3>
        <table>
          <thead><tr><th>#</th><th>Table</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td>1</td><td><code>Am_AssetCategory</code></td><td>Category definitions</td></tr>
            <tr><td>2</td><td><code>Am_AssetItem</code></td><td>Item catalog</td></tr>
            <tr><td>3</td><td><code>Am_ResourceRequest</code></td><td>Main request table</td></tr>
            <tr><td>4</td><td><code>Am_ResourceRequestItem</code></td><td>Request line items</td></tr>
            <tr><td>5</td><td><code>Am_AssetAllocation</code></td><td>Asset tracking</td></tr>
            <tr><td>6</td><td><code>Am_AssetAllocationLog</code></td><td>Audit trail</td></tr>
            <tr><td>7</td><td><code>Am_AssetMaintenance</code></td><td>Maintenance records</td></tr>
            <tr><td>8</td><td><code>Am_ReturnRequest</code></td><td>Return workflow</td></tr>
            <tr><td>9</td><td><code>Am_CustomFieldDefinition</code></td><td>Dynamic field definitions</td></tr>
            <tr><td>10</td><td><code>Am_CustomFieldValue</code></td><td>Dynamic field values</td></tr>
            <tr><td>11</td><td><code>Am_Supplier</code></td><td>Vendor management</td></tr>
            <tr><td>12</td><td><code>Am_PurchaseOrder</code></td><td>Procurement</td></tr>
            <tr><td>13</td><td><code>Am_PurchaseOrderItem</code></td><td>PO line items</td></tr>
            <tr><td>14</td><td><code>Am_StockTransaction</code></td><td>Inventory movements</td></tr>
          </tbody>
        </table>
        <h3>Key Views (3)</h3>
        <table>
          <thead><tr><th>#</th><th>View</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td>1</td><td><code>Am_ResourceRequestView</code></td><td>Request listing</td></tr>
            <tr><td>2</td><td><code>Am_AssetAllocationView</code></td><td>Allocation tracking</td></tr>
            <tr><td>3</td><td><code>Am_AssetItemView</code></td><td>Item catalog with stock status</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Status Codes -->
      <section class="card">
        <h2>Status Codes Reference</h2>

        <h3>AmResourceRequest Status Codes</h3>
        <table>
          <thead><tr><th>Code</th><th>Status Name</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>"1"</td><td>Draft</td><td>Request created but not submitted</td></tr>
            <tr><td>"2"</td><td>Submitted</td><td>Waiting for approval</td></tr>
            <tr><td>"3"</td><td>Under Review</td><td>Being evaluated by approver</td></tr>
            <tr><td>"4"</td><td>Approved</td><td>Approved, awaiting fulfillment</td></tr>
            <tr><td>"5"</td><td>Rejected</td><td>Request denied</td></tr>
            <tr><td>"6"</td><td>Processing</td><td>Items being prepared for delivery</td></tr>
            <tr><td>"7"</td><td>Ready for Delivery</td><td>Ready to be handed over</td></tr>
            <tr><td>"8"</td><td>Delivered</td><td>Items delivered (partially or fully)</td></tr>
            <tr><td>"9"</td><td>Completed</td><td>All items delivered/returned</td></tr>
            <tr><td>"10"</td><td>Cancelled</td><td>Request cancelled</td></tr>
            <tr><td>"11"</td><td>On Hold</td><td>Temporarily paused</td></tr>
          </tbody>
        </table>

        <h3>AmAssetAllocation Status Codes</h3>
        <table>
          <thead><tr><th>Status</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>"Active"</td><td>Currently allocated to staff</td></tr>
            <tr><td>"Returned"</td><td>Successfully returned</td></tr>
            <tr><td>"Lost"</td><td>Item lost by staff</td></tr>
            <tr><td>"Damaged"</td><td>Item damaged beyond repair</td></tr>
            <tr><td>"Under Maintenance"</td><td>Currently being serviced</td></tr>
            <tr><td>"Transferred"</td><td>Transferred to another staff</td></tr>
            <tr><td>"Disposed"</td><td>Item disposed/retired</td></tr>
          </tbody>
        </table>

        <h3>Priority Levels</h3>
        <table>
          <thead><tr><th>Priority</th><th>Description</th><th>SLA</th></tr></thead>
          <tbody>
            <tr><td>"Low"</td><td>Normal request</td><td>7 days</td></tr>
            <tr><td>"Medium"</td><td>Standard priority</td><td>3 days</td></tr>
            <tr><td>"High"</td><td>Important request</td><td>1 day</td></tr>
            <tr><td>"Urgent"</td><td>Critical/emergency</td><td>Same day</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Implementation Phases -->
      <section class="card">
        <h2>Implementation Phases</h2>

        <h3>Phase 1: Core Request Flow (MVP) &mdash; 2-3 weeks</h3>
        <p><strong>Priority:</strong> High</p>
        <ul>
          <li>AmAssetCategory &mdash; Define categories</li>
          <li>AmAssetItem &mdash; Build item catalog</li>
          <li>AmResourceRequest &mdash; Request submission</li>
          <li>AmResourceRequestItem &mdash; Request line items</li>
          <li>Integration with AppApprovalRequest</li>
        </ul>

        <h3>Phase 2: Delivery &amp; Asset Tracking &mdash; 2-3 weeks</h3>
        <p><strong>Priority:</strong> High</p>
        <ul>
          <li>AmAssetAllocation &mdash; Track delivered assets</li>
          <li>AmAssetAllocationLog &mdash; Audit trail</li>
          <li>AmStockTransaction &mdash; Inventory movements</li>
          <li>AmResourceRequestView &amp; AmAssetAllocationView &mdash; Reporting</li>
        </ul>

        <h3>Phase 3: Return &amp; Financial Management &mdash; 2 weeks</h3>
        <p><strong>Priority:</strong> Medium</p>
        <ul>
          <li>AmReturnRequest &mdash; Return workflow</li>
          <li>Damage assessment features</li>
          <li>Payroll deduction integration</li>
        </ul>

        <h3>Phase 4: Advanced Features &mdash; 2-3 weeks</h3>
        <p><strong>Priority:</strong> Low</p>
        <ul>
          <li>AmAssetMaintenance &mdash; Maintenance tracking</li>
          <li>AmCustomFieldDefinition/Value &mdash; Dynamic fields</li>
          <li>AmSupplier &mdash; Vendor management</li>
          <li>AmPurchaseOrder/Item &mdash; Procurement</li>
        </ul>
      </section>

      <!-- Best Practices -->
      <section class="card">
        <h2>Best Practices</h2>

        <h3>1. Transaction Management</h3>
        <pre><code>using (var transaction = _context.Database.BeginTransaction())
&#123;
    try
    &#123;
        await _context.AmResourceRequest.AddAsync(request);
        await _context.AmResourceRequestItem.AddRangeAsync(items);
        await _context.AppApprovalRequest.AddAsync(approvalRequest);
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
    &#125;
    catch (Exception)
    &#123;
        await transaction.RollbackAsync();
        throw;
    &#125;
&#125;</code></pre>

        <h3>2. Multi-tenancy Filtering</h3>
        <pre><code>var requests = await _context.AmResourceRequest
    .Where(x =&gt; x.Active == true &amp;&amp; x.LicenseId == licenseId)
    .AsNoTracking()
    .ToListAsync();</code></pre>

        <h3>3. Use Views for Read Operations</h3>
        <pre><code>var requestList = await _context.AmResourceRequestView
    .Where(x =&gt; x.Active == true &amp;&amp; x.LicenseId == licenseId)
    .AsNoTracking()
    .ToListAsync();</code></pre>

        <h3>4. Permission Checking</h3>
        <pre><code>if (!ProgramAccessChecker.CheckProgramAccess(
    ProgramCodes.permission_Asset_Request,
    ActionCode.create.ToString(),
    requestId))
&#123;
    return new ServiceActionResult(ReturnStatus.error_NoCreatePermission);
&#125;</code></pre>

        <h3>5. Logging</h3>
        <pre><code>_logControl.writeLog(_context, dataRecord, "AmResourceRequest", "",
    "ResourceRequestController", dataRecord.ResourceRequestId, requestId);</code></pre>
      </section>

      <!-- API Endpoint Structure -->
      <section class="card">
        <h2>API Endpoint Structure</h2>
        <table>
          <thead><tr><th>Controller</th><th>Method</th><th>Endpoint</th></tr></thead>
          <tbody>
            <tr><td rowspan="5"><code>/ResourceRequest</code></td><td>GET</td><td>/GetAll</td></tr>
            <tr><td>GET</td><td>/GetByID/&#123;id&#125;</td></tr>
            <tr><td>POST</td><td>/Create</td></tr>
            <tr><td>PUT</td><td>/Update</td></tr>
            <tr><td>DELETE</td><td>/Delete/&#123;id&#125;</td></tr>
            <tr><td rowspan="5"><code>/AssetAllocation</code></td><td>GET</td><td>/GetAll</td></tr>
            <tr><td>GET</td><td>/GetByStaff/&#123;staffId&#125;</td></tr>
            <tr><td>POST</td><td>/Allocate</td></tr>
            <tr><td>PUT</td><td>/UpdateCondition</td></tr>
            <tr><td>POST</td><td>/Return</td></tr>
            <tr><td rowspan="5"><code>/AssetCategory</code></td><td>GET</td><td>/GetAll</td></tr>
            <tr><td>GET</td><td>/GetByID/&#123;id&#125;</td></tr>
            <tr><td>POST</td><td>/Create</td></tr>
            <tr><td>PUT</td><td>/Update</td></tr>
            <tr><td>DELETE</td><td>/Delete/&#123;id&#125;</td></tr>
            <tr><td rowspan="5"><code>/AssetItem</code></td><td>GET</td><td>/GetAll</td></tr>
            <tr><td>GET</td><td>/GetByCategory/&#123;categoryId&#125;</td></tr>
            <tr><td>GET</td><td>/GetAvailableStock</td></tr>
            <tr><td>POST</td><td>/Create</td></tr>
            <tr><td>PUT</td><td>/Update</td></tr>
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
    .er-diagram {
      display: flex; flex-direction: column; align-items: center; gap: 0; padding: 12px 0;
    }
    .er-table {
      border: 2px solid #d0d8ff; border-radius: 10px; min-width: 340px;
      overflow: hidden; background: #fff;
    }
    .er-header {
      background: #6c8cff; color: #fff; font-weight: 700; font-size: 15px;
      padding: 10px 16px; text-align: center;
    }
    .er-row {
      padding: 7px 16px; font-size: 13px; color: #444;
      border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 8px;
    }
    .er-row.pk { background: #fffbea; }
    .er-row.fk { background: #f3eaff; }
    .badge-pk {
      background: #f5c542; color: #7a5900; font-size: 10px; font-weight: 700;
      padding: 2px 7px; border-radius: 4px;
    }
    .badge-fk {
      background: #c084fc; color: #4a1d96; font-size: 10px; font-weight: 700;
      padding: 2px 7px; border-radius: 4px;
    }
    .er-relation { display: flex; justify-content: center; padding: 6px 0; }
    .er-line { color: #aaa; font-size: 14px; font-weight: 600; }

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
export class AssetManagementComponent {}
