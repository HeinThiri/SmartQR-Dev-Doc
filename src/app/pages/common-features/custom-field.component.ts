import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-custom-field',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/common-features" class="back-link">
        <i class="bi bi-arrow-left"></i> Common Features
      </a>
      <h1>Custom Field Dynamic Form</h1>
      <p class="subtitle">Reusable Angular component for adding customizable fields to any entity, grouped by sessions, with validation and auto-save.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>The Custom Field component allows administrators to define additional fields for any entity without code changes. Fields are organized into sessions (groups) and rendered dynamically at runtime.</p>
        <ul>
          <li><strong>Session-based grouping</strong> &mdash; fields are organized under collapsible sessions for clean layout</li>
          <li><strong>Multiple field types</strong> &mdash; text, number, date, textarea, select, checkbox, radio, and switch</li>
          <li><strong>Required validation</strong> &mdash; per-field required flag with visual indicators</li>
          <li><strong>Auto-save</strong> &mdash; parent component controls when to trigger save via <code>saveFormData()</code></li>
          <li><strong>Responsive layout</strong> &mdash; configurable column class for flexible grid placement</li>
        </ul>
      </section>

      <!-- DB Diagram -->
      <section class="card">
        <h2>Database Diagram</h2>
        <div class="er-diagram">
          <div class="er-layer">
            <div class="er-label">Entity & Sessions</div>
            <div class="er-row">
              <div class="er-table er-primary">
                <div class="er-title"><i class="bi bi-table"></i> CFD_Entity</div>
                <div class="er-field"><span class="er-key">PK</span> EntityId</div>
                <div class="er-field">EntityName</div>
              </div>
              <div class="er-connector"><div class="er-line"></div> 1:N <div class="er-line"></div></div>
              <div class="er-table er-primary">
                <div class="er-title"><i class="bi bi-table"></i> CFD_EntitySession</div>
                <div class="er-field"><span class="er-key">PK</span> SessionId</div>
                <div class="er-field"><span class="er-fk">FK</span> EntityId</div>
                <div class="er-field">SessionTitle</div>
                <div class="er-field">Sequence</div>
              </div>
            </div>
          </div>
          <div class="er-layer">
            <div class="er-label">Fields & Values</div>
            <div class="er-row">
              <div class="er-table er-primary">
                <div class="er-title"><i class="bi bi-table"></i> CFD_EntityField</div>
                <div class="er-field"><span class="er-key">PK</span> FieldId</div>
                <div class="er-field"><span class="er-fk">FK</span> SessionId</div>
                <div class="er-field">FieldName</div>
                <div class="er-field">EditorType</div>
                <div class="er-field">DataType</div>
                <div class="er-field">IsRequired</div>
              </div>
              <div class="er-connector"><div class="er-line"></div> 1:N <div class="er-line"></div></div>
              <div class="er-table er-runtime">
                <div class="er-title"><i class="bi bi-table"></i> CFD_EntityFieldValue</div>
                <div class="er-field"><span class="er-key">PK</span> ValueId</div>
                <div class="er-field"><span class="er-fk">FK</span> FieldId</div>
                <div class="er-field">RefDataID</div>
                <div class="er-field">Value</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Flow Diagram -->
      <section class="card">
        <h2>Flow Diagram</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-ui-radios-grid"></i> Entity Form Opens</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-database"></i> Load Form JSON<small>SP</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-layout-text-sidebar"></i> Render Fields<small>by Session</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-pencil-square"></i> User Fills</div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-check2-circle"></i> Validate</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-save"></i> Parent Save</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-database"></i> Save Custom Fields<small>SP</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check-lg"></i> Done</div>
          </div>
        </div>
      </section>

      <!-- Field Types -->
      <section class="card">
        <h2>Field Types</h2>
        <table>
          <thead><tr><th>Type</th><th>DevExtreme Widget</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>Text</td><td><code>dxTextBox</code></td><td>Single-line text input</td></tr>
            <tr><td>Number</td><td><code>dxNumberBox</code></td><td>Numeric input with min/max support</td></tr>
            <tr><td>Date</td><td><code>dxDateBox</code></td><td>Date picker with configurable format</td></tr>
            <tr><td>Text Area</td><td><code>dxTextArea</code></td><td>Multi-line text input</td></tr>
            <tr><td>Select</td><td><code>dxSelectBox</code></td><td>Dropdown with predefined options</td></tr>
            <tr><td>Checkbox</td><td><code>dxCheckBox</code></td><td>Boolean toggle (true/false)</td></tr>
            <tr><td>Radio</td><td><code>dxRadioGroup</code></td><td>Single selection from multiple options</td></tr>
            <tr><td>Switch</td><td><code>dxSwitch</code></td><td>On/off toggle with label</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Integration Steps -->
      <section class="card">
        <h2>Integration Steps</h2>

        <h3>Step 1: Import the Component</h3>
        <pre><code>import &#123; CustomFieldDynamicFormComponent &#125; from 'src/app/common/custom-field-dynamic-form/custom-field-dynamic-form.component';</code></pre>

        <h3>Step 2: Add ViewChild Reference</h3>
        <pre><code>&#64;ViewChild('customFieldForm') customFieldForm: CustomFieldDynamicFormComponent;</code></pre>

        <h3>Step 3: Add HTML Template</h3>
        <pre><code>&lt;app-custom-field-dynamic-form
  #customFieldForm
  [entityID]="entityID"
  [refDataID]="selectedRecord?.id"
  [disabled]="isReadOnly"
  [columnClass]="'col-md-6'"
  (onFormReady)="onCustomFieldReady($event)"
  (onValidationChange)="onCustomFieldValidation($event)"&gt;
&lt;/app-custom-field-dynamic-form&gt;</code></pre>

        <h3>Step 4: Handle Events</h3>
        <pre><code>onCustomFieldReady(hasFields: boolean): void &#123;
  this.showCustomFieldSection = hasFields;
&#125;

onCustomFieldValidation(isValid: boolean): void &#123;
  this.isCustomFieldValid = isValid;
&#125;</code></pre>

        <h3>Step 5: Validate Before Save</h3>
        <pre><code>save(): void &#123;
  // Check custom field validation before saving
  if (this.customFieldForm &amp;&amp; !this.customFieldForm.validateForm()) &#123;
    this.toastr.warning('Please fill in all required custom fields.');
    return;
  &#125;

  // Proceed with main entity save...
  this.saveMainEntity();
&#125;</code></pre>

        <h3>Step 6: Call saveFormData After Main Save</h3>
        <pre><code>saveMainEntity(): void &#123;
  this.api.post('/MyEntity/Save', this.formData).subscribe(result =&gt; &#123;
    if (result.isSuccess) &#123;
      // Save custom field values after main entity is saved
      if (this.customFieldForm) &#123;
        this.customFieldForm.saveFormData(result.data.id);
      &#125;
      this.toastr.success('Saved successfully.');
    &#125;
  &#125;);
&#125;</code></pre>
      </section>

      <!-- Component Parameters -->
      <section class="card">
        <h2>Component Parameters</h2>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>entityID</code></td><td>number</td><td>Yes</td><td>The custom field entity ID (from <code>CFD_Entity</code> table)</td></tr>
            <tr><td><code>refDataID</code></td><td>number</td><td>Yes (edit)</td><td>Primary key of the record being edited; pass <code>0</code> for new records</td></tr>
            <tr><td><code>disabled</code></td><td>boolean</td><td>No</td><td>Disables all fields when <code>true</code> (default: <code>false</code>)</td></tr>
            <tr><td><code>columnClass</code></td><td>string</td><td>No</td><td>CSS column class for layout (default: <code>'col-md-6'</code>)</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Database Tables -->
      <section class="card">
        <h2>Database Tables</h2>
        <table>
          <thead><tr><th>Table</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>CFD_Entity</code></td><td>Defines which entities support custom fields (e.g. Employee, Leave Request)</td></tr>
            <tr><td><code>CFD_EntitySession</code></td><td>Groups fields into named sessions/sections within an entity</td></tr>
            <tr><td><code>CFD_EntityField</code></td><td>Individual field definitions (type, label, required, options, order)</td></tr>
            <tr><td><code>CFD_EntityFieldValue</code></td><td>Stores the actual values entered by users, linked to the source record</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Data Flow -->
      <section class="card">
        <h2>Data Flow</h2>

        <h3>Loading (Read)</h3>
        <ol>
          <li>Component initializes with <code>entityID</code> and <code>refDataID</code></li>
          <li>Calls API to fetch field definitions and existing values</li>
          <li>API executes stored procedure to return sessions, fields, and values</li>
          <li>Component renders dynamic form grouped by sessions</li>
        </ol>

        <h3>Saving (Write)</h3>
        <ol>
          <li>Parent calls <code>validateForm()</code> to check required fields</li>
          <li>Parent saves main entity first, obtains the record ID</li>
          <li>Parent calls <code>saveFormData(recordId)</code> on the custom field component</li>
          <li>Component posts all field values to the API</li>
          <li>API executes stored procedure to upsert values into <code>CFD_EntityFieldValue</code></li>
        </ol>
      </section>

      <!-- Admin Setup -->
      <section class="card">
        <h2>Admin Setup</h2>

        <h3>Step 1: Define Entity</h3>
        <p>Create a record in <code>CFD_Entity</code> for the target entity (e.g. Employee Profile). This gives you an <code>entityID</code> to use in the component.</p>

        <h3>Step 2: Create Sessions</h3>
        <p>Add session records in <code>CFD_EntitySession</code> to group related fields (e.g. "Personal Info", "Emergency Contact"). Sessions are displayed as collapsible sections.</p>

        <h3>Step 3: Define Fields</h3>
        <p>Add field records in <code>CFD_EntityField</code> with the appropriate type, label, required flag, display order, and options (for select/radio types).</p>
      </section>

      <!-- Backend Files -->
      <section class="card">
        <h2>Backend Files</h2>
        <table>
          <thead><tr><th>File</th><th>Path</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>CustomFieldController.cs</code></td><td><code>SmartHR_API/Controllers/</code></td><td>API endpoints for field definitions and values</td></tr>
            <tr><td><code>CFD_Entity.cs</code></td><td><code>SmartHR_API/Models/</code></td><td>Entity model for custom field entities</td></tr>
            <tr><td><code>CFD_EntitySession.cs</code></td><td><code>SmartHR_API/Models/</code></td><td>Entity model for field sessions</td></tr>
            <tr><td><code>CFD_EntityField.cs</code></td><td><code>SmartHR_API/Models/</code></td><td>Entity model for field definitions</td></tr>
            <tr><td><code>CFD_EntityFieldValue.cs</code></td><td><code>SmartHR_API/Models/</code></td><td>Entity model for stored field values</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Troubleshooting -->
      <section class="card">
        <h2>Troubleshooting</h2>
        <table>
          <thead><tr><th>Issue</th><th>Cause</th><th>Solution</th></tr></thead>
          <tbody>
            <tr><td>Custom fields not showing</td><td>Incorrect <code>entityID</code> or no fields defined</td><td>Verify the <code>entityID</code> matches <code>CFD_Entity</code> and fields exist in <code>CFD_EntityField</code></td></tr>
            <tr><td>Save not working</td><td><code>saveFormData()</code> not called or called before main save</td><td>Ensure <code>saveFormData(recordId)</code> is called after the main entity is saved successfully</td></tr>
            <tr><td>Validation not working</td><td><code>validateForm()</code> not called before save</td><td>Call <code>validateForm()</code> before proceeding with the main save logic</td></tr>
            <tr><td>All fields same value</td><td><code>refDataID</code> not updating on record change</td><td>Ensure <code>refDataID</code> is bound to the currently selected record's ID and updates on selection change</td></tr>
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
    .warning {
      background: #fff8e1; border: 1px solid #ffe082; border-radius: 8px;
      padding: 12px 16px; margin: 0 0 14px; display: flex; align-items: flex-start;
      gap: 10px; font-size: 14px; color: #7a6100;
    }
    .warning i { font-size: 18px; color: #f9a825; flex-shrink: 0; margin-top: 1px; }
    .info {
      background: #e3f2fd; border: 1px solid #90caf9; border-radius: 8px;
      padding: 12px 16px; margin: 0 0 14px; font-size: 14px; color: #0d47a1;
      display: flex; align-items: flex-start; gap: 10px;
    }
    .info i { font-size: 18px; color: #1565c0; flex-shrink: 0; margin-top: 1px; }

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
      .er-row { flex-direction: column; }
      .diagram-row { flex-direction: column; gap: 0; }
      .diagram-arrow { transform: rotate(90deg); }
    }
  `]
})
export class CustomFieldComponent {}
