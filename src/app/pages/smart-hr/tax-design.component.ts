import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tax-design',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-hr" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart HR
      </a>
      <h1>Myanmar Income Tax System</h1>
      <p class="subtitle">Configuration-driven income tax calculation for Myanmar &mdash; progressive tax brackets, dynamic relief items, multi-company support, and Excel reporting.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- 1. Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>A comprehensive, configuration-driven income tax calculation system for Myanmar that handles progressive tax brackets, dynamic relief/deduction items, multi-company configurations, fiscal year flexibility, complete audit trail, and Excel-format reporting.</p>
        <h3>Core Design Principles</h3>
        <ul>
          <li><strong>Configuration-Driven</strong> &mdash; No hardcoded values; all tax rates, relief amounts, and rules live in database configuration tables.</li>
          <li><strong>Multi-Company Support</strong> &mdash; Each company (LicenseID) gets its own TaxConfigID with isolated rules and optional custom stored procedures.</li>
          <li><strong>Extensible</strong> &mdash; Add new relief items or tax brackets without code changes; just insert rows into HR_TaxConfigItem.</li>
          <li><strong>Audit-Ready</strong> &mdash; Complete tracking of CreatedBy, ModifiedBy, timestamps, and LastAction on every record.</li>
          <li><strong>Performance-Optimized</strong> &mdash; 90% storage reduction by eliminating redundant monthly detail records; on-demand detail reconstruction.</li>
          <li><strong>Dynamic Reporting</strong> &mdash; Report columns are generated from configuration items, adapting automatically to fiscal year and config changes.</li>
        </ul>
        <h3>Tax Calculation Formula</h3>
        <pre><code>Total Income    = (Monthly Salary x 12) + Bonuses + Other Income
Total Relief    = Basic + Family + Insurance + Donations + SSB
Taxable Income  = Total Income - Total Relief
Tax             = Progressive calculation based on brackets
Monthly Deduct  = Annual Tax / 12</code></pre>
      </section>

      <!-- 2. Database Schema -->
      <section class="card">
        <h2>Database Schema</h2>

        <h3>Configuration Tables</h3>
        <div class="er-diagram">
          <div class="er-table">
            <div class="er-header">HR_TaxConfig</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> TaxConfigID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">LicenseID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">ConfigName <span class="type">nvarchar(100)</span></div>
            <div class="er-row">Procedure_ForYearlyGenerate <span class="type">nvarchar(100)</span></div>
            <div class="er-row">Status <span class="type">nvarchar(50)</span></div>
            <div class="er-row">Active <span class="type">bit</span></div>
            <div class="er-row">CreatedOn / CreatedBy <span class="type">datetime / nvarchar</span></div>
            <div class="er-row">ModifiedOn / ModifiedBy <span class="type">datetime / nvarchar</span></div>
          </div>
          <div class="er-relation">
            <span>1</span>
            <div class="er-line"></div>
            <span>N</span>
          </div>
          <div class="er-table">
            <div class="er-header">HR_TaxConfigItem</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> TaxConfigItemID <span class="type">nvarchar(50)</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> TaxConfigID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">ConfigType <span class="type">nvarchar(50)</span></div>
            <div class="er-row">Title <span class="type">nvarchar(100)</span></div>
            <div class="er-row">DataAmount <span class="type">decimal(18,0)</span></div>
            <div class="er-row">DataPercentage <span class="type">decimal(18,4)</span></div>
            <div class="er-row">ColumnSequence <span class="type">int</span></div>
            <div class="er-row">Active <span class="type">bit</span></div>
          </div>
        </div>

        <p><strong>ConfigType Values:</strong> <code>TaxRate</code> (bracket definitions), <code>Deduct</code> (relief/deduction items), <code>Setup</code> (system settings like fiscal year start month).</p>

        <h3>Staff Profile</h3>
        <div class="er-diagram">
          <div class="er-table">
            <div class="er-header">HR_TaxConfig</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> TaxConfigID <span class="type">nvarchar(50)</span></div>
          </div>
          <div class="er-relation">
            <span>1</span>
            <div class="er-line"></div>
            <span>N</span>
          </div>
          <div class="er-table">
            <div class="er-header">HR_TaxStaffProfile</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> StaffTaxItemID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">StaffID <span class="type">nvarchar(50)</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> TaxConfigID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">Value <span class="type">decimal(18,2)</span></div>
            <div class="er-row">Active <span class="type">bit</span></div>
            <div class="er-row">CreatedOn / CreatedBy <span class="type">datetime / nvarchar</span></div>
          </div>
        </div>

        <h3>Tax Calculation Tables</h3>
        <div class="er-diagram">
          <div class="er-table">
            <div class="er-header">HR_TaxStaffYear</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> TaxYearID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">StaffID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">Year <span class="type">int</span></div>
            <div class="er-row">YearStart / YearEnd <span class="type">date</span></div>
            <div class="er-row">TotalIncome <span class="type">decimal(18,0)</span></div>
            <div class="er-row">OtherIncome <span class="type">decimal(18,0)</span></div>
            <div class="er-row">TotalBonus <span class="type">decimal(18,0)</span></div>
            <div class="er-row">TotalDeduct <span class="type">decimal(18,0)</span></div>
            <div class="er-row">TaxableIncome <span class="type">decimal(18,0)</span></div>
            <div class="er-row">TotalTax <span class="type">decimal(18,0)</span></div>
            <div class="er-row">ParentCount / Spouse / ChildernCount <span class="type">int</span></div>
          </div>
          <div class="er-relation">
            <span>1</span>
            <div class="er-line"></div>
            <span>N</span>
          </div>
          <div class="er-table">
            <div class="er-header">HR_TaxStaffYearMonth</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> TaxMonthID <span class="type">nvarchar(50)</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> TaxYearID <span class="type">nvarchar(50)</span></div>
            <div class="er-row">TaxMonth <span class="type">date</span></div>
            <div class="er-row">BasicSalary <span class="type">decimal(18,0)</span></div>
            <div class="er-row">Deduct <span class="type">decimal(18,0)</span></div>
            <div class="er-row">ActualDeductInSalary <span class="type">decimal(18,0)</span></div>
          </div>
        </div>
        <p><strong>Note:</strong> Monthly detail table (HR_TaxStaffYearMonthDetail) was removed to optimize storage &mdash; details are reconstructed on demand.</p>
      </section>

      <!-- 3. Tax Brackets -->
      <section class="card">
        <h2>Tax Brackets</h2>
        <p>Myanmar progressive income tax brackets. Each bracket is stored as a <code>TaxRate</code> config item in HR_TaxConfigItem.</p>
        <table>
          <thead>
            <tr><th>Bracket</th><th>Taxable Income Range</th><th>Upper Limit (MMK)</th><th>Rate</th></tr>
          </thead>
          <tbody>
            <tr><td>0% Bracket</td><td>0 &ndash; 2,000,000</td><td>2,000,000</td><td>0%</td></tr>
            <tr><td>5% Bracket</td><td>2,000,001 &ndash; 10,000,000</td><td>10,000,000</td><td>5%</td></tr>
            <tr><td>10% Bracket</td><td>10,000,001 &ndash; 30,000,000</td><td>30,000,000</td><td>10%</td></tr>
            <tr><td>15% Bracket</td><td>30,000,001 &ndash; 50,000,000</td><td>50,000,000</td><td>15%</td></tr>
            <tr><td>20% Bracket</td><td>50,000,001 &ndash; 70,000,000</td><td>70,000,000</td><td>20%</td></tr>
            <tr><td>25% Bracket</td><td>Above 70,000,000</td><td>999,999,999,999</td><td>25%</td></tr>
          </tbody>
        </table>
        <h3>Sample Calculation</h3>
        <pre><code>Staff: Monthly Salary 700,000 MMK
Annual Salary   : 8,400,000
Bonus           : 1,000,000
Total Income    : 9,400,000
Total Relief    : 7,208,000
Taxable Income  : 2,192,000

Tax Calculation:
  0% on first 2,000,000    = 0
  5% on remaining 192,000  = 9,600
Total Annual Tax : 9,600 MMK
Monthly Deduction: 800 MMK</code></pre>
      </section>

      <!-- 4. Relief System -->
      <section class="card">
        <h2>Relief System</h2>
        <p>Relief items reduce taxable income. Each is stored as a <code>Deduct</code> config item. Staff-specific values come from HR_TaxStaffProfile (profile overrides config defaults).</p>
        <table>
          <thead>
            <tr><th>Relief Type</th><th>Rule</th><th>Default Amount (MMK)</th><th>Percentage</th><th>Notes</th></tr>
          </thead>
          <tbody>
            <tr><td><strong>Basic</strong></td><td>20% of total income</td><td>&mdash;</td><td>20%</td><td>Max 10,000,000 MMK</td></tr>
            <tr><td><strong>Parent</strong></td><td>Per parent count</td><td>1,000,000</td><td>&mdash;</td><td>Multiplied by parent count from profile</td></tr>
            <tr><td><strong>Spouse</strong></td><td>If married (0 or 1)</td><td>1,000,000</td><td>&mdash;</td><td>Binary: 0 = unmarried, 1 = married</td></tr>
            <tr><td><strong>Children</strong></td><td>Per child count</td><td>500,000</td><td>&mdash;</td><td>Multiplied by children count from profile</td></tr>
            <tr><td><strong>SSB</strong></td><td>2% of monthly salary</td><td>&mdash;</td><td>2%</td><td>Social Security Board contribution</td></tr>
            <tr><td><strong>Insurance</strong></td><td>Actual amount from profile</td><td>&mdash;</td><td>&mdash;</td><td>Staff-specific insurance premiums</td></tr>
            <tr><td><strong>Donation</strong></td><td>Actual amount from profile</td><td>&mdash;</td><td>&mdash;</td><td>Deductible donation amounts</td></tr>
          </tbody>
        </table>
        <h3>Priority Order</h3>
        <ol>
          <li><strong>Profile Value</strong> &mdash; Staff-specific value from HR_TaxStaffProfile</li>
          <li><strong>Config Default</strong> &mdash; Default from HR_TaxConfigItem</li>
          <li><strong>Calculated Value</strong> &mdash; Computed from percentage or formula</li>
        </ol>
      </section>

      <!-- 5. Stored Procedures -->
      <section class="card">
        <h2>Stored Procedures</h2>

        <h3>HR_Tax_GenerateYearlyTax</h3>
        <p>Main tax calculation procedure. Accepts <code>&#64;StaffID</code>, <code>&#64;Year</code>, and <code>&#64;RequestBy</code> parameters.</p>
        <h4>10-Step Flow</h4>
        <ol>
          <li><strong>Validate</strong> &mdash; Check parameters and &#64;RequestBy is provided</li>
          <li><strong>Get LicenseID</strong> &mdash; Retrieve staff company from HR_Staff</li>
          <li><strong>Find TaxConfigID</strong> &mdash; Locate applicable tax configuration</li>
          <li><strong>Custom Procedure Check</strong> &mdash; If Procedure_ForYearlyGenerate is set, route to custom SP</li>
          <li><strong>Load Profile</strong> &mdash; Get staff-specific values from HR_TaxStaffProfile</li>
          <li><strong>Calculate Income</strong> &mdash; Sum salary x 12 + bonuses + other income</li>
          <li><strong>Calculate Relief</strong> &mdash; Apply deductions based on config and profile</li>
          <li><strong>Apply Tax Brackets</strong> &mdash; Progressive calculation through each bracket</li>
          <li><strong>Save Year Record</strong> &mdash; Insert/update HR_TaxStaffYear with audit info</li>
          <li><strong>Generate Monthly</strong> &mdash; Create 12 monthly records in HR_TaxStaffYearMonth</li>
        </ol>
        <pre><code>EXEC HR_Tax_GenerateYearlyTax
    &#64;StaffID   = 'STAFF_001',
    &#64;Year      = 2025,
    &#64;RequestBy = 'admin';</code></pre>

        <h3>HR_Tax_GetYearlyReport_Final</h3>
        <p>Dynamic Excel-format report generator. All columns are generated from configuration &mdash; no hardcoded columns.</p>
        <h4>Dynamic Column Groups</h4>
        <ol>
          <li><strong>Staff Info</strong> &mdash; From Hr_StaffView (FullName, Department, Position, etc.)</li>
          <li><strong>Monthly Salaries</strong> &mdash; 12 columns based on fiscal year start month</li>
          <li><strong>Bonus Columns</strong> &mdash; From config items where Title LIKE '%bonus%'</li>
          <li><strong>Relief Columns</strong> &mdash; From config Deduct items</li>
          <li><strong>Tax Bracket Columns</strong> &mdash; From config TaxRate items</li>
          <li><strong>Monthly Deductions</strong> &mdash; 12 columns of calculated deductions</li>
        </ol>
        <pre><code>EXEC HR_Tax_GetYearlyReport_Final
    &#64;Year      = 2025,
    &#64;ConfigID  = 'MMTax',
    &#64;RequestBy = 'admin';</code></pre>

        <h3>GetTaxYearDetails Function</h3>
        <p>Table-valued function that reconstructs tax calculation details on demand without storing redundant data.</p>
        <pre><code>SELECT Title, AnnualAmount, Source, GeneratedBy, GeneratedOn
FROM GetTaxYearDetails('STAFF_001', 2025);</code></pre>
      </section>

      <!-- 6. Calculation Flow -->
      <section class="card">
        <h2>Calculation Flow</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-shield-check"></i> Validate<small>Params + RequestBy</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-gear"></i> Get Config<small>TaxConfigID + LicenseID</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-person-badge"></i> Load Profile<small>HR_TaxStaffProfile</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-cash-stack"></i> Calculate Income<small>Salary + Bonus + Other</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-dash-circle"></i> Calculate Relief<small>Basic + Family + SSB</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-bar-chart-steps"></i> Apply Tax Brackets<small>Progressive 0-25%</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-floppy"></i> Save Year<small>HR_TaxStaffYear</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-calendar3"></i> Generate Monthly<small>12 monthly records</small></div>
          </div>
        </div>
      </section>

      <!-- 7. Configuration Guide -->
      <section class="card">
        <h2>Configuration Guide</h2>

        <h3>Step 1: Create Tax Configuration</h3>
        <pre><code>INSERT INTO HR_TaxConfig (TaxConfigID, LicenseID, ConfigName, Status, Active)
VALUES ('MMTax', 'COMPANY_001', 'Myanmar Tax 2025', 'Active', 1);</code></pre>

        <h3>Step 2: Add Tax Brackets</h3>
        <pre><code>INSERT INTO HR_TaxConfigItem
  (TaxConfigItemID, TaxConfigID, ConfigType, Title, DataAmount, DataPercentage)
VALUES
  ('RATE_0',  'MMTax', 'TaxRate', '0% Bracket',  2000000, 0),
  ('RATE_5',  'MMTax', 'TaxRate', '5% Bracket',  10000000, 5),
  ('RATE_10', 'MMTax', 'TaxRate', '10% Bracket', 30000000, 10),
  ('RATE_15', 'MMTax', 'TaxRate', '15% Bracket', 50000000, 15),
  ('RATE_20', 'MMTax', 'TaxRate', '20% Bracket', 70000000, 20),
  ('RATE_25', 'MMTax', 'TaxRate', '25% Bracket', 999999999999, 25);</code></pre>

        <h3>Step 3: Add Relief Items</h3>
        <pre><code>INSERT INTO HR_TaxConfigItem
  (TaxConfigItemID, TaxConfigID, ConfigType, Title, DataAmount, DataPercentage, ColumnSequence)
VALUES
  ('BASIC',     'MMTax', 'Deduct', 'Basic',    0, 20, 1),
  ('PARENT',    'MMTax', 'Deduct', 'Parent',   1000000, 0, 2),
  ('SPOUSE',    'MMTax', 'Deduct', 'Spouse',   1000000, 0, 3),
  ('CHILDREN',  'MMTax', 'Deduct', 'Childern', 500000, 0, 4),
  ('SSB',       'MMTax', 'Deduct', 'SSB',      0, 2, 5),
  ('INSURANCE', 'MMTax', 'Deduct', 'Insurance', 0, 0, 6),
  ('DONATION',  'MMTax', 'Deduct', 'Donation',  0, 0, 7);</code></pre>

        <h3>Step 4: Add Bonus Types</h3>
        <pre><code>INSERT INTO HR_TaxConfigItem
  (TaxConfigItemID, TaxConfigID, ConfigType, Title, ColumnSequence)
VALUES
  ('BONUS',    'MMTax', 'Deduct', 'Bonus', 1),
  ('HARDSHIP', 'MMTax', 'Deduct', 'Hardship Bonus', 2),
  ('SPECIAL',  'MMTax', 'Deduct', 'Special Bonus', 3);</code></pre>

        <h3>Step 5: Set Fiscal Year</h3>
        <pre><code>INSERT INTO HR_TaxConfigItem
  (TaxConfigItemID, TaxConfigID, ConfigType, Title, DataAmount)
VALUES ('FISCAL_START', 'MMTax', 'Setup', 'StartMonth', 4);  -- April = 4</code></pre>

        <h3>Step 6: Staff Profile</h3>
        <pre><code>INSERT INTO HR_TaxStaffProfile
  (StaffTaxItemID, StaffID, TaxConfigID, Value, Active)
VALUES
  ('PROF_001', 'STAFF_001', 'BONUS',     1000000, 1),   -- Bonus amount
  ('PROF_002', 'STAFF_001', 'PARENT',    2, 1),          -- 2 parents
  ('PROF_003', 'STAFF_001', 'CHILDREN',  3, 1),          -- 3 children
  ('PROF_004', 'STAFF_001', 'INSURANCE', 660000, 1);     -- Insurance premium</code></pre>
      </section>

      <!-- 8. Implementation Steps -->
      <section class="card">
        <h2>Implementation Steps</h2>

        <h3>1. Database Setup</h3>
        <ol>
          <li>Create tables in order: Config &rarr; Profile &rarr; Calculation tables</li>
          <li>Add foreign key constraints</li>
          <li>Create indexes on StaffID, Year, TaxConfigID</li>
          <li>Create Hr_StaffView if not exists</li>
        </ol>

        <h3>2. Configuration</h3>
        <ol>
          <li>Insert tax configuration for each company</li>
          <li>Add tax brackets (must cover full range from 0 to max)</li>
          <li>Add relief items with proper ColumnSequence for report ordering</li>
          <li>Set fiscal year start month via Setup config type</li>
        </ol>

        <h3>3. Initial Data Load</h3>
        <ol>
          <li>Import staff profiles if migrating from existing system</li>
          <li>Set family counts (Parent, Spouse, Children) for existing staff</li>
          <li>Configure special allowances (Insurance, Donations)</li>
        </ol>

        <h3>4. Testing</h3>
        <ol>
          <li>Calculate single staff and verify against manual calculation</li>
          <li>Generate yearly report and validate all columns</li>
          <li>Test multi-company configurations in isolation</li>
        </ol>

        <h3>5. Deployment</h3>
        <ol>
          <li>Deploy stored procedures and tables to production</li>
          <li>Grant execute permissions to HR roles</li>
          <li>Configure scheduled jobs if needed</li>
          <li>Train HR staff on report generation</li>
        </ol>
      </section>

      <!-- 9. Testing Guidelines -->
      <section class="card">
        <h2>Testing Guidelines</h2>

        <h3>Basic Calculation Test</h3>
        <pre><code>-- Test with minimum salary (under 2M threshold, should be 0% tax)
EXEC HR_Tax_GenerateYearlyTax
    &#64;StaffID   = 'TEST_001',
    &#64;Year      = 2025,
    &#64;RequestBy = 'tester';</code></pre>

        <h3>Progressive Tax Test</h3>
        <pre><code>-- Test with high salary (e.g., 3,000,000/month)
-- Expected: Tax calculated across multiple brackets
-- Verify each bracket calculation separately</code></pre>

        <h3>Profile Override Test</h3>
        <pre><code>-- 1. Add profile values for a staff member
-- 2. Run calculation
-- 3. Verify profile values are used instead of defaults</code></pre>

        <h3>Report Generation Test</h3>
        <pre><code>-- Generate report for multiple staff
EXEC HR_Tax_GetYearlyReport_Final &#64;Year = 2025;
-- Verify: all columns present, monthly columns match fiscal year, totals correct</code></pre>

        <h3>Validation Query</h3>
        <pre><code>SELECT
    StaffID,
    TotalIncome,
    TotalDeduct,
    TaxableIncome,
    TotalTax,
    CASE
        WHEN TaxableIncome &lt;= 2000000 THEN 0
        WHEN TaxableIncome &lt;= 10000000 THEN (TaxableIncome - 2000000) * 0.05
        -- ... additional brackets
    END AS ExpectedTax
FROM HR_TaxStaffYear
WHERE Year = 2025;</code></pre>
      </section>

      <!-- 10. Maintenance Guide -->
      <section class="card">
        <h2>Maintenance Guide</h2>

        <h3>Update Tax Rates</h3>
        <pre><code>UPDATE HR_TaxConfigItem
SET DataPercentage = 6   -- Change 5% bracket to 6%
WHERE TaxConfigID = 'MMTax' AND Title = '5% Bracket';</code></pre>

        <h3>Add New Relief Type</h3>
        <pre><code>-- Add medical allowance (automatically appears in reports)
INSERT INTO HR_TaxConfigItem
  (TaxConfigItemID, TaxConfigID, ConfigType, Title, DataAmount, ColumnSequence)
VALUES ('MEDICAL', 'MMTax', 'Deduct', 'Medical', 500000, 10);</code></pre>

        <h3>Recalculate Tax</h3>
        <pre><code>-- After config or profile changes, recalculate for a staff member
EXEC HR_Tax_GenerateYearlyTax
    &#64;StaffID   = 'STAFF_001',
    &#64;Year      = 2025,
    &#64;RequestBy = 'admin';</code></pre>

        <h3>Change Fiscal Year Start</h3>
        <pre><code>UPDATE HR_TaxConfigItem
SET DataAmount = 1   -- Change to January start
WHERE TaxConfigID = 'MMTax'
  AND ConfigType = 'Setup'
  AND Title = 'StartMonth';</code></pre>

        <h3>Troubleshooting</h3>
        <table>
          <thead><tr><th>Issue</th><th>Solution</th></tr></thead>
          <tbody>
            <tr><td>String truncation error</td><td>Check ID generation; ensure IDs are under 50 characters</td></tr>
            <tr><td>Missing columns in report</td><td>Verify ColumnSequence is set for config items</td></tr>
            <tr><td>Wrong tax calculation</td><td>Check profile values; verify bracket ranges are complete (no gaps)</td></tr>
            <tr><td>Config not found (E002)</td><td>Verify TaxConfigID exists and Active = 1</td></tr>
            <tr><td>Staff not found (E005)</td><td>Verify StaffID exists in HR_Staff table</td></tr>
          </tbody>
        </table>
      </section>

      <!-- 11. Doc Log -->
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
    .diagram-arrow { color: #bbb; font-size: 18px; }
    .diagram-down { text-align: center; color: #bbb; font-size: 20px; padding: 6px 0; }
    @media (max-width: 768px) {
      .diagram-row { flex-direction: column; gap: 0; }
      .diagram-arrow { transform: rotate(90deg); }
    }
  `]
})
export class TaxDesignComponent {}
