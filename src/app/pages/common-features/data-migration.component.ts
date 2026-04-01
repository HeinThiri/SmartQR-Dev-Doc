import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-data-migration',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/common-features" class="back-link">
        <i class="bi bi-arrow-left"></i> Common Features
      </a>
      <h1>Data Migration</h1>
      <p class="subtitle">Configurable Excel import module with policy-based column mappings, validation, transformation, lookup resolution, and row-level tracking.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>The Data Migration Module provides a comprehensive, configurable solution for importing data into the Smart HR system from Excel files. Administrators define migration policies with custom column mappings, validation rules, data transformations, and duplicate detection strategies.</p>

        <h3>Key Features</h3>
        <ul>
          <li><strong>Configurable Migration Policies</strong>: Define reusable import templates with column specifications</li>
          <li><strong>CSV Template Download</strong>: Export CSV template with column headers for data entry</li>
          <li><strong>Row-by-Row Validation</strong>: Track success/failure status for each imported row</li>
          <li><strong>Cell-Level Data Storage</strong>: Store original and transformed values for audit trail</li>
          <li><strong>Data Type Support</strong>: String, Date, Number, Boolean with automatic conversion</li>
          <li><strong>Validation Engine</strong>: Required fields, regex patterns, min/max values</li>
          <li><strong>Transformation Engine</strong>: Trim, case conversion, date formatting</li>
          <li><strong>Lookup Resolution</strong>: Automatic foreign key resolution from reference tables</li>
          <li><strong>Duplicate Detection</strong>: Identify existing records using primary columns</li>
          <li><strong>Create vs Update Logic</strong>: Configurable create/update behavior per column</li>
          <li><strong>Partial Success Support</strong>: Continue importing valid rows when errors occur</li>
          <li><strong>Reprocess Failed Rows</strong>: Retry import for previously failed rows</li>
        </ul>

        <h3>Module Information</h3>
        <table>
          <thead><tr><th>Property</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td><strong>Module Prefix</strong></td><td>Mrg (Migration)</td></tr>
            <tr><td><strong>Module Name</strong></td><td>Data Migration Module</td></tr>
            <tr><td><strong>Version</strong></td><td>1.0</td></tr>
            <tr><td><strong>Database Tables</strong></td><td>5 main tables + 4 views</td></tr>
            <tr><td><strong>API Controllers</strong></td><td>2 (MrgPolicyApi, MrgImportApi)</td></tr>
            <tr><td><strong>Program Codes</strong></td><td>PGM-MigrationPolicy</td></tr>
          </tbody>
        </table>

        <h3>Source Files</h3>
        <pre><code>SmartHR_API/DBModels/SmartHRPro/          -- Entity models (9 files)
SmartHR_API/DTO/Migration_Module/          -- DTOs (6 files)
SmartHR_API/Infrastructure/Repository/Migration_Module/  -- Repository controllers
SmartHR_API/Controllers/Migration_Module/  -- API controllers</code></pre>
      </section>

      <!-- Database Schema -->
      <section class="card">
        <h2>Database Schema (ER Diagram)</h2>
        <div class="er-diagram">

          <div class="er-table">
            <div class="er-header">MRG_Policy</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> PolicyID <small>nvarchar(50)</small></div>
            <div class="er-row">PolicyName <small>nvarchar(200)</small></div>
            <div class="er-row">Status <small>nvarchar(50)</small></div>
            <div class="er-row">LicenseID <small>nvarchar(50)</small></div>
            <div class="er-row">Description <small>nvarchar(1000)</small></div>
            <div class="er-row">PolicyType <small>nvarchar(100)</small></div>
            <div class="er-row">TargetTable <small>nvarchar(200)</small></div>
            <div class="er-row">Script <small>nvarchar(max)</small></div>
            <div class="er-row">Parameter <small>nvarchar(max)</small></div>
            <div class="er-row">MaxRowLimit <small>int</small></div>
            <div class="er-row">FileType <small>nvarchar(50)</small></div>
            <div class="er-row">Active <small>bit</small></div>
            <div class="er-row">CreatedBy / CreatedOn / ModifiedBy / ModifiedOn / LastAction</div>
          </div>

          <div class="er-relation">
            <div class="er-line">1 : N</div>
          </div>

          <div class="er-table">
            <div class="er-header">MRG_PolicyFile</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> ColumnID <small>nvarchar(50)</small></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> PolicyID <small>nvarchar(50)</small></div>
            <div class="er-row">ColumnIndex <small>int</small></div>
            <div class="er-row">Header <small>nvarchar(200)</small></div>
            <div class="er-row">DataType <small>nvarchar(50)</small></div>
            <div class="er-row">Validation <small>nvarchar(500)</small></div>
            <div class="er-row">ColumnType <small>nvarchar(50)</small></div>
            <div class="er-row">AllowCreate / AllowUpdate <small>bit</small></div>
            <div class="er-row">TargetField <small>nvarchar(200)</small></div>
            <div class="er-row">TransformationRule <small>nvarchar(500)</small></div>
            <div class="er-row">LookupTable / LookupKeyField / LookupReturnField <small>nvarchar(200)</small></div>
            <div class="er-row">DefaultValue <small>nvarchar(500)</small></div>
            <div class="er-row">Active / CreatedBy / CreatedOn / ModifiedBy / ModifiedOn / LastAction</div>
          </div>

          <div class="er-relation" style="margin-top: 28px;">
            <div class="er-line">MRG_Policy 1 : N MRG_PolicyFileImport</div>
          </div>

          <div class="er-table">
            <div class="er-header">MRG_PolicyFileImport</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> ImportID <small>nvarchar(50)</small></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> PolicyID <small>nvarchar(50)</small></div>
            <div class="er-row">ImportOn <small>datetime</small></div>
            <div class="er-row">ImportBy <small>nvarchar(50)</small></div>
            <div class="er-row">ImportStatus <small>nvarchar(50)</small></div>
            <div class="er-row">ImportCount / ValidCount / ErrorCount <small>int</small></div>
            <div class="er-row">SuccessCount / FailedCount / SkippedCount <small>int</small></div>
            <div class="er-row">CreatedCount / UpdatedCount <small>int</small></div>
            <div class="er-row">StartedOn / CompletedOn / CommittedOn <small>datetime</small></div>
            <div class="er-row">CommittedBy <small>nvarchar(50)</small></div>
            <div class="er-row">ErrorMessage <small>nvarchar(max)</small></div>
            <div class="er-row">FileName <small>nvarchar(500)</small></div>
            <div class="er-row">FileSize <small>bigint</small></div>
            <div class="er-row">LicenseID <small>nvarchar(50)</small></div>
            <div class="er-row">Active / CreatedBy / CreatedOn / ModifiedBy / ModifiedOn / LastAction</div>
          </div>

          <div class="er-relation">
            <div class="er-line">1 : N</div>
          </div>

          <div class="er-table">
            <div class="er-header">MRG_PolicyFileImportRow</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> RowID <small>nvarchar(50)</small></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> ImportID <small>nvarchar(50)</small></div>
            <div class="er-row">RowSeq <small>int</small></div>
            <div class="er-row">RowStatus <small>nvarchar(50)</small></div>
            <div class="er-row">RowResult <small>nvarchar(50)</small></div>
            <div class="er-row">RowAction <small>nvarchar(50)</small></div>
            <div class="er-row">Remark <small>nvarchar(max)</small></div>
            <div class="er-row">MatchedID <small>nvarchar(50)</small></div>
            <div class="er-row">TargetRecordID <small>nvarchar(50)</small></div>
            <div class="er-row">ProcessedOn <small>datetime</small></div>
            <div class="er-row">Active / CreatedBy / CreatedOn / ModifiedBy / ModifiedOn / LastAction</div>
          </div>

          <div class="er-relation">
            <div class="er-line">1 : N</div>
          </div>

          <div class="er-table">
            <div class="er-header">MRG_PolicyFileImportRowData</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> ImportDataID <small>nvarchar(50)</small></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> RowID <small>nvarchar(50)</small></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> ColumnID <small>nvarchar(50) &rarr; MRG_PolicyFile</small></div>
            <div class="er-row">StringData <small>nvarchar(max)</small></div>
            <div class="er-row">DateData <small>datetime</small></div>
            <div class="er-row">NumberData <small>decimal(18,4)</small></div>
            <div class="er-row">BooleanData <small>bit</small></div>
            <div class="er-row">OriginalValue <small>nvarchar(max)</small></div>
            <div class="er-row">ResolvedValue <small>nvarchar(max)</small></div>
            <div class="er-row">ValidationStatus <small>nvarchar(50)</small></div>
            <div class="er-row">ValidationResult <small>nvarchar(50)</small></div>
            <div class="er-row">ValidationMessage <small>nvarchar(1000)</small></div>
            <div class="er-row">Active / CreatedBy / CreatedOn / ModifiedBy / ModifiedOn / LastAction</div>
          </div>

        </div>

        <h3>Status Enumerations</h3>
        <table>
          <thead><tr><th>Entity</th><th>Statuses</th></tr></thead>
          <tbody>
            <tr><td><strong>PolicyStatus</strong></td><td>Draft, Active, Inactive</td></tr>
            <tr><td><strong>ImportStatus</strong></td><td>Staged, Validating, Validated, Committing, Committed, PartialCommit, Failed, Cancelled</td></tr>
            <tr><td><strong>RowStatus</strong></td><td>Pending, Valid, Invalid, Duplicate, Created, Updated, Skipped, Failed</td></tr>
            <tr><td><strong>ColumnType</strong></td><td>Primary, Mandatory, Optional</td></tr>
            <tr><td><strong>DataType</strong></td><td>String, Number, Date, Boolean, Lookup</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Business Logic & Workflow -->
      <section class="card">
        <h2>Business Logic &amp; Workflow</h2>
        <p>The import uses a <strong>hybrid approach</strong>: C# handles validation/staging, stored procedures handle complex commit logic.</p>

        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-gear"></i> Define Policy<small>Columns, types, rules</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-cloud-upload"></i> Upload Excel<small>Parse &amp; stage data</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-shield-check"></i> Validate<small>Types, rules, lookups</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-eye"></i> Review<small>User approves/cancels</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-database-add"></i> Commit<small>SP or generic INSERT</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check-circle"></i> Track Results<small>Created / Updated / Failed</small></div>
          </div>
        </div>

        <h3>Import Processing Phases</h3>
        <ol>
          <li><strong>Phase 1 &mdash; Upload &amp; Parse (C#)</strong>: Parse Excel with ExcelDataReader, validate file format, load policy columns, validate headers.</li>
          <li><strong>Phase 2 &mdash; Validation &amp; Staging (C#)</strong>: Create import session (Staged), process each row/cell &mdash; validate data types, apply transformations, resolve lookups, check duplicates.</li>
          <li><strong>Phase 3 &mdash; User Review</strong>: User reviews validation results (ValidCount, ErrorCount) and decides to commit or cancel.</li>
          <li><strong>Phase 4 &mdash; Commit (C# or SP)</strong>: If <code>Policy.Script</code> is set, execute stored procedure; otherwise, use generic C# INSERT/UPDATE builder. Update row statuses and import counts.</li>
        </ol>

        <h3>Validation Engine</h3>
        <p>Each cell is validated against its column definition in order:</p>
        <ol>
          <li><strong>Data Type</strong> &mdash; Number, Date, Boolean parsing</li>
          <li><strong>Required Field</strong> &mdash; Non-empty check for Mandatory/Primary columns</li>
          <li><strong>Length</strong> &mdash; minLength, maxLength rules</li>
          <li><strong>Pattern</strong> &mdash; Regex validation</li>
          <li><strong>Transformation</strong> &mdash; Trim, uppercase, lowercase, date format</li>
          <li><strong>Lookup Resolution</strong> &mdash; Query reference table, store resolved FK</li>
        </ol>

        <h3>Duplicate Detection</h3>
        <p>Columns with <code>ColumnType = "Primary"</code> are used to check for existing records. If a match is found and <code>AllowUpdate = true</code>, the row updates the existing record. Otherwise it is skipped.</p>

        <h3>Script &amp; Parameter Usage</h3>
        <p>The <code>Script</code> field on MRG_Policy enables custom commit via stored procedure. The <code>Parameter</code> field supports runtime placeholders:</p>
        <table>
          <thead><tr><th>Placeholder</th><th>Replaced With</th></tr></thead>
          <tbody>
            <tr><td><code>&#123;ImportID&#125;</code></td><td>Current import session ID</td></tr>
            <tr><td><code>&#123;LicenseID&#125;</code></td><td>Current user's license ID</td></tr>
            <tr><td><code>&#123;UserID&#125;</code></td><td>Current user's ID</td></tr>
            <tr><td><code>&#123;PolicyID&#125;</code></td><td>Current policy ID</td></tr>
          </tbody>
        </table>
      </section>

      <!-- API Endpoints -->
      <section class="card">
        <h2>API Endpoints</h2>

        <h3>MrgPolicyApi Controller <code>/MrgPolicyApi</code></h3>
        <table>
          <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><strong>GET</strong></td><td><code>/MrgPolicyApi/GetAll?keyword=&amp;policyType=</code></td><td>List policies with filters</td></tr>
            <tr><td><strong>GET</strong></td><td><code>/MrgPolicyApi/GetByID/&#123;id&#125;</code></td><td>Get policy with columns</td></tr>
            <tr><td><strong>POST</strong></td><td><code>/MrgPolicyApi/Save</code></td><td>Create or update policy with columns</td></tr>
            <tr><td><strong>DELETE</strong></td><td><code>/MrgPolicyApi/Delete</code></td><td>Soft-delete policy</td></tr>
            <tr><td><strong>DELETE</strong></td><td><code>/MrgPolicyApi/DeletePolicyColumn</code></td><td>Remove individual column</td></tr>
            <tr><td><strong>GET</strong></td><td><code>/MrgPolicyApi/GetPolicyTypes</code></td><td>Return available policy types</td></tr>
          </tbody>
        </table>

        <h3>MrgImportApi Controller <code>/MrgImportApi</code></h3>
        <table>
          <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><strong>POST</strong></td><td><code>/MrgImportApi/UploadExcel</code></td><td>Upload Excel file (multipart, 50 MB limit)</td></tr>
            <tr><td><strong>GET</strong></td><td><code>/MrgImportApi/GetImportHistory?policyId=&amp;status=&amp;fromDate=&amp;toDate=&amp;page=&amp;pageSize=</code></td><td>Import history with pagination</td></tr>
            <tr><td><strong>GET</strong></td><td><code>/MrgImportApi/GetImportDetails/&#123;importId&#125;</code></td><td>Import details with row results</td></tr>
            <tr><td><strong>GET</strong></td><td><code>/MrgImportApi/GetImportRowData/&#123;rowId&#125;</code></td><td>Cell-level data for a specific row</td></tr>
            <tr><td><strong>POST</strong></td><td><code>/MrgImportApi/ReprocessFailedRows</code></td><td>Retry failed rows (stub)</td></tr>
            <tr><td><strong>GET</strong></td><td><code>/MrgImportApi/DownloadTemplate/&#123;policyId&#125;</code></td><td>Download Excel/CSV template (stub)</td></tr>
          </tbody>
        </table>
      </section>

      <!-- DTO Structures -->
      <section class="card">
        <h2>DTO Structures</h2>
        <p>Location: <code>SmartHR_API/DTO/Migration_Module/</code></p>

        <h3>MrgPolicyDTO.cs</h3>
        <pre><code>public class MrgPolicyDTO
&#123;
    public string PolicyId &#123; get; set; &#125;
    public string PolicyName &#123; get; set; &#125;
    public string Status &#123; get; set; &#125;
    public string LicenseId &#123; get; set; &#125;
    public string Description &#123; get; set; &#125;
    public string PolicyType &#123; get; set; &#125;
    public string Script &#123; get; set; &#125;
    public string Parameter &#123; get; set; &#125;
    public bool Active &#123; get; set; &#125;
    public DateTime CreatedOn &#123; get; set; &#125;
    public DateTime? ModifiedOn &#123; get; set; &#125;
    public int? ColumnCount &#123; get; set; &#125;

    public List&lt;MrgPolicyFileDTO&gt; PolicyColumns &#123; get; set; &#125;
    public DateTime LocalDateTimeForValidation &#123; get; set; &#125;
&#125;</code></pre>

        <h3>MrgPolicyFileDTO.cs</h3>
        <pre><code>public class MrgPolicyFileDTO
&#123;
    public string ColumnId &#123; get; set; &#125;
    public string PolicyId &#123; get; set; &#125;
    public int ColumnIndex &#123; get; set; &#125;
    public string Header &#123; get; set; &#125;
    public string DataType &#123; get; set; &#125;
    public string Validation &#123; get; set; &#125;
    public string ColumnType &#123; get; set; &#125;
    public string Description &#123; get; set; &#125;
    public int Priority &#123; get; set; &#125;
    public string Status &#123; get; set; &#125;
    public bool AllowCreate &#123; get; set; &#125;
    public bool AllowUpdate &#123; get; set; &#125;
    public string TargetField &#123; get; set; &#125;
    public string TransformationRule &#123; get; set; &#125;
    public string LookupTable &#123; get; set; &#125;
    public string LookupKeyField &#123; get; set; &#125;
    public string LookupValueField &#123; get; set; &#125;
    public string DefaultValue &#123; get; set; &#125;
    public DateTime LocalDateTimeForValidation &#123; get; set; &#125;
&#125;</code></pre>

        <h3>MrgImportRequestDTO.cs</h3>
        <pre><code>public class MrgImportRequestDTO
&#123;
    public string PolicyId &#123; get; set; &#125;
    public IFormFile File &#123; get; set; &#125;
    public string Remark &#123; get; set; &#125;
    public bool ValidateOnly &#123; get; set; &#125;
    public bool AllowPartialSuccess &#123; get; set; &#125;
    public DateTime LocalDateTimeForValidation &#123; get; set; &#125;
&#125;</code></pre>

        <h3>MrgImportResponseDTO.cs</h3>
        <pre><code>public class MrgImportResponseDTO
&#123;
    public string ImportId &#123; get; set; &#125;
    public string ImportStatus &#123; get; set; &#125;
    public int TotalRows &#123; get; set; &#125;
    public int SuccessCount &#123; get; set; &#125;
    public int FailedCount &#123; get; set; &#125;
    public int SkippedCount &#123; get; set; &#125;
    public int CreatedCount &#123; get; set; &#125;
    public int UpdatedCount &#123; get; set; &#125;
    public List&lt;MrgImportRowResultDTO&gt; RowResults &#123; get; set; &#125;
    public string Message &#123; get; set; &#125;
&#125;

public class MrgImportRowResultDTO
&#123;
    public int RowNumber &#123; get; set; &#125;
    public string RowResult &#123; get; set; &#125;
    public string RowAction &#123; get; set; &#125;
    public string Message &#123; get; set; &#125;
    public Dictionary&lt;string, string&gt; CellErrors &#123; get; set; &#125;
&#125;</code></pre>
      </section>

      <!-- Security & Permissions -->
      <section class="card">
        <h2>Security &amp; Permissions</h2>

        <h3>Program Codes</h3>
        <table>
          <thead><tr><th>Program Code</th><th>Program Name</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>PGM-MigrationPolicy</code></td><td>Migration Policy Management</td><td>Create, update, delete migration policies</td></tr>
            <tr><td><code>PGM-MigrationPolicy</code></td><td>Migration Import</td><td>Upload and process Excel imports</td></tr>
            <tr><td><code>PGM-MigrationPolicy</code></td><td>Migration History</td><td>View import history and results</td></tr>
          </tbody>
        </table>

        <h3>Permission Matrix</h3>
        <table>
          <thead><tr><th>Action</th><th>Required Permission</th></tr></thead>
          <tbody>
            <tr><td>View policies</td><td>Read</td></tr>
            <tr><td>Create policy</td><td>Create</td></tr>
            <tr><td>Update policy</td><td>Update</td></tr>
            <tr><td>Delete policy</td><td>Delete</td></tr>
            <tr><td>Upload Excel</td><td>Create</td></tr>
            <tr><td>View import history</td><td>Read</td></tr>
            <tr><td>View import details</td><td>Read</td></tr>
            <tr><td>Reprocess failed rows</td><td>Update</td></tr>
          </tbody>
        </table>

        <h3>Multi-Tenancy</h3>
        <p>All operations are filtered by <code>LicenseId</code>. Policies are created per license, imports are isolated by license, and users can only access data within their license.</p>
      </section>

      <!-- Implementation Status -->
      <section class="card">
        <h2>Implementation Status</h2>
        <p><strong>Current Phase:</strong> Backend Implementation Complete</p>
        <p><strong>Progress:</strong> 8 of 12 implementation steps completed (67%)</p>

        <table>
          <thead><tr><th>Layer</th><th>Status</th><th>Details</th></tr></thead>
          <tbody>
            <tr><td><strong>Database Schema</strong></td><td>Done</td><td>5 tables + 4 views + indexes + FKs</td></tr>
            <tr><td><strong>Entity Models</strong></td><td>Done</td><td>9 entity files with Fluent API config</td></tr>
            <tr><td><strong>DTOs</strong></td><td>Done</td><td>6 DTO files</td></tr>
            <tr><td><strong>Repository Controllers</strong></td><td>Done</td><td>MrgPolicyController + MrgImportController</td></tr>
            <tr><td><strong>API Controllers</strong></td><td>Done</td><td>12 endpoints across 2 controllers</td></tr>
            <tr><td><strong>Service Registration</strong></td><td>Done</td><td>DI configured in ServiceRegistration.cs</td></tr>
            <tr><td><strong>Database Execution</strong></td><td>Done</td><td>Tables and views created</td></tr>
            <tr><td><strong>Solution Build</strong></td><td>Done</td><td>0 errors (warnings only)</td></tr>
            <tr><td><strong>Security Setup</strong></td><td>Pending</td><td>Insert SYS_Program records, assign role permissions</td></tr>
            <tr><td><strong>API Testing</strong></td><td>Pending</td><td>Swagger / Postman testing</td></tr>
            <tr><td><strong>Frontend (Angular)</strong></td><td>Pending</td><td>Policy management, import UI, history UI</td></tr>
            <tr><td><strong>End-to-End Testing</strong></td><td>Pending</td><td>Full workflow testing</td></tr>
          </tbody>
        </table>

        <h3>Backend Stubs Remaining</h3>
        <ul>
          <li><code>ReprocessFailedRows</code> &mdash; retry logic (stub created)</li>
          <li><code>GenerateExcelTemplate</code> &mdash; Excel template generation (stub created)</li>
          <li>Duplicate detection query logic</li>
          <li>CommitImport endpoint with SP execution</li>
        </ul>

        <h3>NuGet Packages</h3>
        <ul>
          <li><code>ExcelDataReader</code> / <code>ExcelDataReader.DataSet</code> &mdash; Excel file parsing</li>
          <li><code>System.Text.Encoding.CodePages</code> &mdash; Encoding support</li>
          <li><code>Newtonsoft.Json</code> &mdash; JSON parsing for validation/transformation rules</li>
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

    /* ER Diagram */
    .er-diagram {
      display: flex; flex-direction: column; align-items: center; gap: 0; padding: 12px 0;
    }
    .er-table {
      border: 2px solid #d0d8ff; border-radius: 10px; overflow: hidden;
      min-width: 420px; max-width: 600px; width: 100%; margin: 0;
    }
    .er-header {
      background: #6c8cff; color: #fff; font-weight: 700; font-size: 14px;
      padding: 10px 14px; text-align: center;
    }
    .er-row {
      padding: 5px 14px; font-size: 13px; color: #444;
      border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 8px;
    }
    .er-row small { color: #999; margin-left: auto; font-size: 11px; }
    .er-row.pk { background: #fffbe6; }
    .er-row.fk { background: #f0f3ff; }
    .badge-pk {
      background: #f9a825; color: #fff; font-size: 10px; font-weight: 700;
      padding: 1px 6px; border-radius: 4px;
    }
    .badge-fk {
      background: #6c8cff; color: #fff; font-size: 10px; font-weight: 700;
      padding: 1px 6px; border-radius: 4px;
    }
    .er-relation {
      display: flex; align-items: center; justify-content: center; padding: 6px 0;
    }
    .er-line {
      font-size: 13px; font-weight: 600; color: #6c8cff;
      border-left: 2px dashed #6c8cff; padding: 6px 12px;
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
      .er-table { min-width: 100%; }
    }
  `]
})
export class DataMigrationComponent {}
