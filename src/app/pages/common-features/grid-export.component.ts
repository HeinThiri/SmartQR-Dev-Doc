import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-grid-export',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/common-features" class="back-link">
        <i class="bi bi-arrow-left"></i> Common Features
      </a>
      <h1>Common Grid Export (PDF + Excel)</h1>
      <p class="subtitle">Reusable export dialog that allows any listing page to export DxDataGrid data as PDF or Excel with configurable options.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>The common export feature provides a single <code>showExportDialog()</code> method in <code>SystematicCommon</code> that any component can call to present an export dialog to the user.</p>
        <h3>Capabilities</h3>
        <ul>
          <li><strong>Export Type</strong>: PDF or Excel</li>
          <li><strong>Paper Size</strong> (PDF only): A4 or Dynamic Width</li>
          <li><strong>Orientation</strong> (PDF only): Portrait or Landscape</li>
          <li><strong>Margins</strong> (PDF only): Configurable Left, Top, Right, Bottom margins (mm)</li>
          <li><strong>Signature Block</strong>: Optional multi-person signature section at end of report</li>
          <li><strong>Custom Footer</strong>: Optional HTML-formatted footer text</li>
        </ul>
        <h3>Source File</h3>
        <pre><code>SmartHR_UI/src/app/common/systematic.common.ts</code></pre>
      </section>

      <!-- Screenshots -->
      <section class="card">
        <h2>Screenshots</h2>
        <h3>Export Dialog</h3>
        <p>SweetAlert2 dialog with export type, paper size, orientation, and margin configuration:</p>
        <div class="screenshot-wrapper">
          <img src="assets/images/grid-export-dialog.png" alt="Export Data Dialog" />
        </div>
        <h3>PDF Output</h3>
        <p>Generated PDF with company header, blue column headers, data grid, and page footer:</p>
        <div class="screenshot-wrapper">
          <img src="assets/images/grid-export-pdf-output.png" alt="PDF Export Output" />
        </div>
      </section>

      <!-- Flow Diagram -->
      <section class="card">
        <h2>Flow Diagram</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-mouse"></i> User Clicks Export</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-code-slash"></i> showExportDialog()</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-window"></i> SweetAlert2 Dialog<small>Type/Size/Orientation/Margins</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-check2-circle"></i> Confirm</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-file-earmark-pdf"></i> PDF: jsPDF +<small>exportDataGrid</small></div>
            <div class="diagram-arrow">/</div>
            <div class="diagram-node node-action"><i class="bi bi-file-earmark-excel"></i> Excel: ExcelJS +<small>exportDataGrid</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-download"></i> File Downloaded</div>
          </div>
        </div>
      </section>

      <!-- Interfaces -->
      <section class="card">
        <h2>Interfaces</h2>
        <pre><code>export interface GridExportSignature &#123;
  label: string;    // e.g. "Prepared By"
  name?: string;    // e.g. "Min Thu Aung"
  title?: string;   // e.g. "Jr. HR Executive"
&#125;

export interface GridExportOptions &#123;
  gridInstance: any;                                     // DxDataGrid .instance
  reportTitle: string;                                   // e.g. "Salary Calculation (Feb 2026)"
  fileName: string;                                      // e.g. "Salary_Calculation_Feb_2026"
  excludeColumns?: string[];                             // Column names to exclude
  fixedColumnWidthMap?: &#123; [dataField: string]: number &#125;; // Override width for columns
  defaultColumnWidth?: number;                           // Default column width in mm (default: 18)
  marginLeft?: number;                                   // Left margin (default: 15)
  marginTop?: number;                                    // Top margin (default: 15)
  marginRight?: number;                                  // Right margin (default: 15)
  marginBottom?: number;                                 // Bottom margin (default: 10)
  signatureBlock?: GridExportSignature[];                // Signature block at end
  customFooterHtml?: string;                             // Custom footer with basic HTML
&#125;</code></pre>
      </section>

      <!-- Methods -->
      <section class="card">
        <h2>Methods</h2>

        <h3>showExportDialog(options: GridExportOptions)</h3>
        <p>Displays a SweetAlert2 dialog (500px width) with:</p>
        <ol>
          <li><strong>Export Type</strong> — PDF / Excel</li>
          <li><strong>Paper Size</strong> — A4 (default) / Dynamic Width (PDF only)</li>
          <li><strong>Orientation</strong> — Portrait (default) / Landscape (PDF only)</li>
          <li><strong>Margins</strong> — Left, Top, Right, Bottom inputs (PDF only)</li>
        </ol>
        <p>On confirm, calls <code>generateGridPdf()</code> or <code>generateGridExcel()</code> based on user selection.</p>

        <h3>generateGridPdf(options, paperSize, orientation)</h3>
        <p>Generates a PDF using jsPDF + DevExtreme <code>exportDataGrid</code>.</p>
        <table>
          <thead><tr><th>Section</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><strong>Header</strong></td><td>Company name (bold 10pt) + Report title (bold 12pt, blue #2287EE) + horizontal line</td></tr>
            <tr><td><strong>Column Header</strong></td><td>Blue background (#2287EE) with white bold text</td></tr>
            <tr><td><strong>Body</strong></td><td>Grid data with 6pt font, cell padding (1.5mm top/bottom)</td></tr>
            <tr><td><strong>Signature Block</strong></td><td>Evenly spaced columns with label, dotted line, name, title</td></tr>
            <tr><td><strong>Page Footer</strong></td><td>"Powered by Smart HR" + print user/date + page numbers</td></tr>
          </tbody>
        </table>

        <h3>generateGridExcel(options)</h3>
        <p>Generates an Excel file using ExcelJS + DevExtreme <code>exportDataGrid</code>.</p>
        <table>
          <thead><tr><th>Row</th><th>Content</th></tr></thead>
          <tbody>
            <tr><td>Row 1</td><td>Company name (bold 12pt)</td></tr>
            <tr><td>Row 2</td><td>Report title (bold 14pt)</td></tr>
            <tr><td>Row 3</td><td>Separator line</td></tr>
            <tr><td>Row 4+</td><td>Grid data</td></tr>
            <tr><td>End</td><td>Signature block + custom footer + "Powered by Smart HR"</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Integration Guide -->
      <section class="card">
        <h2>How to Integrate</h2>

        <h3>Step 1: Add Imports</h3>
        <pre><code>import &#123;
  GridExportOptions,
  SystematicCommon,
&#125; from "src/app/common/systematic.common";
import &#123; DxDataGridComponent &#125; from "devextreme-angular";</code></pre>

        <h3>Step 2: Inject SystematicCommon</h3>
        <pre><code>constructor(
  private myCommon: SystematicCommon,
  // ... other services
) &#123;&#125;</code></pre>

        <h3>Step 3: Add ViewChild for the Grid</h3>
        <pre><code>&#64;ViewChild("myGrid", &#123; static: false &#125;) myGrid!: DxDataGridComponent;</code></pre>
        <p>HTML:</p>
        <pre><code>&lt;dx-data-grid #myGrid [dataSource]="dataSource" ...&gt;</code></pre>

        <h3>Step 4: Add the Export Method</h3>
        <h4>Minimal</h4>
        <pre><code>exportGrid(): void &#123;
  if (!this.myGrid?.instance) return;
  this.myCommon.showExportDialog(&#123;
    gridInstance: this.myGrid.instance,
    reportTitle: 'My Report Title',
    fileName: 'My_Report',
  &#125;);
&#125;</code></pre>

        <h4>With Column Widths & Excluded Columns</h4>
        <pre><code>exportGrid(): void &#123;
  if (!this.myGrid?.instance) return;
  this.myCommon.showExportDialog(&#123;
    gridInstance: this.myGrid.instance,
    reportTitle: 'My Report Title',
    fileName: 'My_Report',
    excludeColumns: ['actionColumn'],
    fixedColumnWidthMap: &#123; employeeName: 30 &#125;,
    defaultColumnWidth: 18,
  &#125;);
&#125;</code></pre>

        <h4>With Signature Block</h4>
        <pre><code>exportGrid(): void &#123;
  if (!this.myGrid?.instance) return;
  this.myCommon.showExportDialog(&#123;
    gridInstance: this.myGrid.instance,
    reportTitle: 'My Report Title',
    fileName: 'My_Report',
    signatureBlock: [
      &#123; label: 'Prepared By', name: 'John Doe', title: 'HR Executive' &#125;,
      &#123; label: 'Checked By', name: 'Jane Smith', title: 'HR Manager' &#125;,
      &#123; label: 'Approved By', name: 'Mr. Director', title: 'Managing Director' &#125;,
    ],
  &#125;);
&#125;</code></pre>

        <h4>Full Example (All Options)</h4>
        <pre><code>exportGrid(): void &#123;
  if (!this.myGrid?.instance) return;
  this.myCommon.showExportDialog(&#123;
    gridInstance: this.myGrid.instance,
    reportTitle: 'Salary Calculation (February 2026)',
    fileName: 'Salary_Calculation_Feb_2026',
    excludeColumns: ['Recalculate'],
    fixedColumnWidthMap: &#123; fullName: 30 &#125;,
    defaultColumnWidth: 18,
    signatureBlock: [
      &#123; label: 'Prepared By', name: 'Min Thu Aung', title: 'Jr. HR Executive' &#125;,
      &#123; label: 'Checked By', name: 'Aye Nwe Htun', title: 'Asst. HR Manager' &#125;,
      &#123; label: 'Acknowledged By', name: 'Lae War Phyu', title: 'Group HR Head' &#125;,
      &#123; label: 'Approved By', name: 'Mr. Cory', title: 'General Manager' &#125;,
    ],
    customFooterHtml: '&lt;b&gt;Note:&lt;/b&gt; This report is system-generated.&lt;br&gt;Report to HR within 7 working days.',
  &#125;);
&#125;</code></pre>

        <h3>Step 5: Add Export Button in HTML</h3>
        <h4>Toolbar Button</h4>
        <pre><code>&lt;dxi-item menuItemTemplate="menu-item"&gt;
  &lt;div *dxTemplate&gt;
    &lt;button type="button" class="btn btn-light"
      (click)="exportGrid()" title="Export"
      *ngIf="dataSource.length"&gt;
      &lt;i class="fas fa-file-export" style="color:#2287EE;"&gt;&lt;/i&gt;
    &lt;/button&gt;
  &lt;/div&gt;
&lt;/dxi-item&gt;</code></pre>

        <h4>Dropdown Item</h4>
        <pre><code>&lt;a class="dropdown-item" (click)="exportGrid()" *ngIf="dataSource.length"&gt;
  &lt;i class="fas fa-file-export" style="width:14px; color:#2287EE;"&gt;&lt;/i&gt;
  &lt;span&gt;Export&lt;/span&gt;
&lt;/a&gt;</code></pre>
      </section>

      <!-- Options Reference -->
      <section class="card">
        <h2>Options Reference</h2>
        <table>
          <thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>gridInstance</code></td><td>any</td><td>—</td><td><strong>Required.</strong> DxDataGrid instance</td></tr>
            <tr><td><code>reportTitle</code></td><td>string</td><td>—</td><td><strong>Required.</strong> Title in header</td></tr>
            <tr><td><code>fileName</code></td><td>string</td><td>—</td><td><strong>Required.</strong> File name (no extension)</td></tr>
            <tr><td><code>excludeColumns</code></td><td>string[]</td><td>[]</td><td>Columns to hide in export</td></tr>
            <tr><td><code>fixedColumnWidthMap</code></td><td>object</td><td>&#123;&#125;</td><td>Override widths &#123; dataField: mm &#125;</td></tr>
            <tr><td><code>defaultColumnWidth</code></td><td>number</td><td>18</td><td>Default column width in mm</td></tr>
            <tr><td><code>marginLeft</code></td><td>number</td><td>15</td><td>PDF left margin (mm)</td></tr>
            <tr><td><code>marginTop</code></td><td>number</td><td>15</td><td>PDF top margin (mm)</td></tr>
            <tr><td><code>marginRight</code></td><td>number</td><td>15</td><td>PDF right margin (mm)</td></tr>
            <tr><td><code>marginBottom</code></td><td>number</td><td>10</td><td>PDF bottom margin (mm)</td></tr>
            <tr><td><code>signatureBlock</code></td><td>GridExportSignature[]</td><td>—</td><td>Signature entries at end</td></tr>
            <tr><td><code>customFooterHtml</code></td><td>string</td><td>—</td><td>Footer with basic HTML</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Integration Checklist -->
      <section class="card">
        <h2>Integration Checklist</h2>
        <table>
          <thead><tr><th>#</th><th>Task</th><th>Required</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Import <code>GridExportOptions</code>, <code>SystematicCommon</code>, <code>DxDataGridComponent</code></td><td>Yes</td></tr>
            <tr><td>2</td><td>Inject <code>SystematicCommon</code> in constructor</td><td>Yes</td></tr>
            <tr><td>3</td><td>Add <code>&#64;ViewChild</code> for <code>DxDataGridComponent</code></td><td>Yes</td></tr>
            <tr><td>4</td><td>Add <code>#refName</code> to <code>&lt;dx-data-grid&gt;</code> in HTML</td><td>Yes</td></tr>
            <tr><td>5</td><td>Add <code>exportGrid()</code> method with <code>showExportDialog()</code></td><td>Yes</td></tr>
            <tr><td>6</td><td>Add Export button in HTML toolbar</td><td>Yes</td></tr>
            <tr><td>7</td><td>Add <code>signatureBlock</code> array</td><td>Optional</td></tr>
            <tr><td>8</td><td>Add <code>customFooterHtml</code> string</td><td>Optional</td></tr>
            <tr><td>9</td><td>Add <code>excludeColumns</code> for columns to hide</td><td>Optional</td></tr>
            <tr><td>10</td><td>Add <code>fixedColumnWidthMap</code> / <code>defaultColumnWidth</code></td><td>Optional</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Integrated Pages -->
      <section class="card">
        <h2>Integrated Pages</h2>
        <table>
          <thead><tr><th>Page</th><th>Component</th><th>Route</th></tr></thead>
          <tbody>
            <tr><td>Salary Calculation</td><td><code>SalaryCalculationComponent</code></td><td><code>/payroll-module/salary-calculation</code></td></tr>
            <tr><td>Employee Salary Setup</td><td><code>SalarySetupListComponent</code></td><td><code>/payroll-module/salary-setup-list</code></td></tr>
          </tbody>
        </table>
      </section>

      <!-- Dependencies -->
      <section class="card">
        <h2>Dependencies</h2>
        <ul>
          <li><code>jspdf</code> — PDF document generation</li>
          <li><code>devextreme/pdf_exporter</code> — Grid-to-PDF export</li>
          <li><code>exceljs</code> — Excel workbook generation</li>
          <li><code>devextreme/excel_exporter</code> — Grid-to-Excel export</li>
          <li><code>file-saver</code> — File download</li>
          <li><code>sweetalert2</code> — Export options dialog</li>
          <li><code>date-fns</code> — Date formatting in footer</li>
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

    .screenshot-wrapper {
      margin: 12px 0; border-radius: 10px; overflow: hidden;
      border: 1px solid #e0e4ec;
    }
    .screenshot-wrapper img {
      width: 100%; display: block;
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
export class GridExportComponent {}
