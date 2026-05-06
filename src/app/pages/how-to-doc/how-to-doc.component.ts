import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-how-to-doc',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/welcome" class="back-link">
        <i class="bi bi-arrow-left"></i> Home
      </a>
      <h1><i class="bi bi-journal-code"></i> How to Doc?</h1>
      <p class="subtitle">Documentation standards and guidelines for developers contributing to this portal.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Table of Contents -->
      <section class="card toc-card">
        <h2>Table of Contents</h2>
        <ol class="toc">
          <li><a href="javascript:void(0)" (click)="scrollTo('overview')">Overview</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('project-structure')">Project Structure</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('create-static-page')">Creating a New Static Page</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('page-template')">Page Template Structure</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('add-route')">Adding Routes</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('add-sidebar')">Adding to Sidebar</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('domain-content')">Adding Domain Content (JSON)</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('diagrams')">Creating Diagrams (ER &amp; Flow)</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('style-guide')">Style Guide</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('code-blocks')">Code Block Conventions</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('naming')">Naming Conventions</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('doc-status')">Documentation Status</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('screenshots')">Adding Screenshots</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('checklist')">Pre-Publish Checklist</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('claude-vscode')">Using Claude in VS Code</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('floating-toc')">Floating Table of Contents</a></li>
          <li><a href="javascript:void(0)" (click)="scrollTo('integrate-new-project')">Integrate into Another Project</a></li>
        </ol>
      </section>

      <!-- 1. Overview -->
      <section class="card" id="overview">
        <h2>1. Overview</h2>
        <p>This developer documentation portal is a <strong>standalone Angular 21 app</strong> that serves as a static documentation site. There is <strong>no database</strong> — all content is either embedded in component templates or loaded from JSON files in <code>src/assets/content/</code>.</p>
        <div class="info-box">
          <i class="bi bi-info-circle"></i>
          <div>
            <strong>Key principles:</strong>
            <ul>
              <li>Keep it static — no backend API calls</li>
              <li>Use standalone components (no NgModules)</li>
              <li>Follow existing page patterns for consistency</li>
              <li>Use CSS-only diagrams (no external charting libraries)</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 2. Project Structure -->
      <section class="card" id="project-structure">
        <h2>2. Project Structure</h2>
        <pre><code>developer-docs/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/          # Auth guard
│   │   │   ├── models/          # TypeScript interfaces
│   │   │   └── services/        # AuthService, ContentService
│   │   ├── layout/
│   │   │   ├── layout.component.ts
│   │   │   ├── sidebar/         # Sidebar navigation
│   │   │   └── topbar/          # Top bar with search
│   │   ├── pages/
│   │   │   ├── domain/          # Domain list &amp; detail pages
│   │   │   ├── how-to-doc/      # This guide!
│   │   │   ├── login/           # Login page
│   │   │   ├── search/          # Search page
│   │   │   └── welcome/         # Welcome/home page
│   │   ├── shared/
│   │   │   └── floating-toolbar/ # Floating toolbar with search
│   │   ├── app.config.ts
│   │   └── app.routes.ts        # All route definitions
│   ├── assets/
│   │   └── content/
│   │       ├── users.json       # User credentials (SHA-256 hashed)
│   │       ├── domains.json     # Domain listing
│   │       ├── employee/        # Domain-specific JSON content
│   │       ├── attendance/
│   └── styles.scss              # Global styles
└── angular.json</code></pre>
      </section>

      <!-- 3. Creating a New Static Page -->
      <section class="card" id="create-static-page">
        <h2>3. Creating a New Static Page</h2>
        <p>Documentation pages are <strong>standalone Angular components</strong> with inline templates. Follow these steps:</p>

        <h3>Step 1: Create the component file</h3>
        <pre><code>src/app/pages/your-area/your-page.component.ts</code></pre>

        <h3>Step 2: Use this minimal template</h3>
        <pre><code>import &#123; Component &#125; from '&#64;angular/core';
import &#123; RouterModule &#125; from '&#64;angular/router';

&#64;Component(&#123;
  selector: 'app-your-feature',
  standalone: true,
  imports: [RouterModule],
  template: \`
    &lt;div class="page"&gt;
      &lt;a routerLink="/welcome" class="back-link"&gt;
        &lt;i class="bi bi-arrow-left"&gt;&lt;/i&gt; Home
      &lt;/a&gt;
      &lt;h1&gt;Your Feature Title&lt;/h1&gt;
      &lt;p class="subtitle"&gt;Brief description of the feature.&lt;/p&gt;

      &lt;section class="card"&gt;
        &lt;h2&gt;Overview&lt;/h2&gt;
        &lt;p&gt;Content here...&lt;/p&gt;
      &lt;/section&gt;

      &lt;!-- Add more cards as needed --&gt;
    &lt;/div&gt;
  \`,
  styles: [\`
    /* Copy standard styles from any existing feature page */
  \`]
&#125;)
export class YourFeatureComponent &#123;&#125;</code></pre>
        <div class="warning-box">
          <i class="bi bi-exclamation-triangle"></i>
          <div>
            <strong>Important:</strong> Always copy the full standard styles block from an existing page (e.g., <code>grid-export.component.ts</code>) to maintain visual consistency.
          </div>
        </div>
      </section>

      <!-- 4. Page Template Structure -->
      <section class="card" id="page-template">
        <h2>4. Page Template Structure</h2>
        <p>Every documentation page should follow this consistent structure:</p>

        <div class="structure-diagram">
          <div class="struct-item struct-back"><i class="bi bi-arrow-left"></i> Back Link</div>
          <div class="struct-item struct-title"><i class="bi bi-type-h1"></i> Page Title (h1)</div>
          <div class="struct-item struct-subtitle"><i class="bi bi-text-paragraph"></i> Subtitle / Description</div>
          <div class="struct-item struct-card">
            <i class="bi bi-card-heading"></i> Card: Overview
            <small>What the feature does, key capabilities</small>
          </div>
          <div class="struct-item struct-card">
            <i class="bi bi-diagram-3"></i> Card: Database Diagram (if applicable)
            <small>CSS-based ER diagram showing tables &amp; relationships</small>
          </div>
          <div class="struct-item struct-card">
            <i class="bi bi-arrow-right-circle"></i> Card: Flow Diagram (if applicable)
            <small>CSS-based workflow or process diagram</small>
          </div>
          <div class="struct-item struct-card">
            <i class="bi bi-braces"></i> Card: Interfaces / Data Models
            <small>TypeScript interfaces, data structures</small>
          </div>
          <div class="struct-item struct-card">
            <i class="bi bi-gear"></i> Card: Methods / API
            <small>Key methods, parameters, return types</small>
          </div>
          <div class="struct-item struct-card">
            <i class="bi bi-puzzle"></i> Card: How to Integrate
            <small>Step-by-step integration guide with code examples</small>
          </div>
          <div class="struct-item struct-card">
            <i class="bi bi-check2-square"></i> Card: Integration Checklist
            <small>Table with required/optional tasks</small>
          </div>
        </div>
        <p><em>Not all sections are required — include what's relevant to the feature.</em></p>
      </section>

      <!-- 5. Adding Routes -->
      <section class="card" id="add-route">
        <h2>5. Adding Routes</h2>
        <p>All routes are defined in <code>src/app/app.routes.ts</code>. Add your new page inside the <code>LayoutComponent</code> children array (so it's behind auth guard).</p>

        <h3>For a standalone page (like this guide):</h3>
        <pre><code>// Add route at the same level as 'welcome', 'search', etc.
&#123; path: 'how-to-doc', component: HowToDocComponent &#125;,</code></pre>
      </section>

      <!-- 6. Adding to Sidebar -->
      <section class="card" id="add-sidebar">
        <h2>6. Adding to Sidebar</h2>
        <p>The sidebar is in <code>src/app/layout/sidebar/sidebar.component.ts</code>. Add a navigation link in the <code>&lt;nav&gt;</code> section.</p>

        <pre><code>&lt;a routerLink="/your-route" routerLinkActive="active" class="nav-item"&gt;
  &lt;i class="bi bi-icon-name"&gt;&lt;/i&gt;
  &lt;span *ngIf="!collapsed"&gt;Link Label&lt;/span&gt;
&lt;/a&gt;</code></pre>

        <p>Use <a href="https://icons.getbootstrap.com/" target="_blank">Bootstrap Icons</a> for the icon. Common choices:</p>
        <table>
          <thead><tr><th>Icon</th><th>Class</th><th>Use for</th></tr></thead>
          <tbody>
            <tr><td><i class="bi bi-house"></i></td><td><code>bi-house</code></td><td>Home / Landing</td></tr>
            <tr><td><i class="bi bi-grid"></i></td><td><code>bi-grid</code></td><td>Listings / Domains</td></tr>
            <tr><td><i class="bi bi-search"></i></td><td><code>bi-search</code></td><td>Search</td></tr>
            <tr><td><i class="bi bi-journal-code"></i></td><td><code>bi-journal-code</code></td><td>Documentation Guide</td></tr>
            <tr><td><i class="bi bi-file-earmark-text"></i></td><td><code>bi-file-earmark-text</code></td><td>Documents / Files</td></tr>
            <tr><td><i class="bi bi-gear"></i></td><td><code>bi-gear</code></td><td>Settings / Config</td></tr>
          </tbody>
        </table>
      </section>

      <!-- 8. Domain Content (JSON) -->
      <section class="card" id="domain-content">
        <h2>8. Adding Domain Content (JSON)</h2>
        <p>Domain pages (Employee, Attendance, etc.) load content from JSON files. To add a new domain:</p>

        <h3>Step 1: Create the content folder</h3>
        <pre><code>src/assets/content/your-domain/
├── features.json        # Feature list
├── api-reference.json   # API endpoints
└── qa.json              # Q&amp;A items</code></pre>

        <h3>Step 2: features.json structure</h3>
        <pre><code>[
  &#123;
    "id": "feature-1",
    "title": "Feature Name",
    "description": "What this feature does.",
    "details": "Detailed markdown content here..."
  &#125;
]</code></pre>

        <h3>Step 3: api-reference.json structure</h3>
        <pre><code>[
  &#123;
    "method": "GET",
    "endpoint": "/api/your-domain/list",
    "description": "Get all items",
    "parameters": [
      &#123; "name": "pageSize", "type": "number", "description": "Items per page" &#125;
    ],
    "response": "&#123; data: [], total: number &#125;"
  &#125;
]</code></pre>

        <h3>Step 4: qa.json structure</h3>
        <pre><code>[
  &#123;
    "question": "How do I enable this feature?",
    "answer": "Navigate to Settings &gt; Features and toggle it on."
  &#125;
]</code></pre>

        <h3>Step 5: Register in domains.json</h3>
        <pre><code>// src/assets/content/domains.json
&#123;
  "slug": "your-domain",
  "name": "Your Domain",
  "description": "Description of this domain",
  "icon": "bi-icon-name"
&#125;</code></pre>

        <div class="warning-box">
          <i class="bi bi-exclamation-triangle"></i>
          <div><strong>Important:</strong> After adding new files to <code>assets/</code>, you must <strong>restart the dev server</strong> (<code>ng serve</code>) for the files to be served.</div>
        </div>
      </section>

      <!-- 9. Diagrams -->
      <section class="card" id="diagrams">
        <h2>9. Creating Diagrams (ER &amp; Flow)</h2>
        <p>We use <strong>pure CSS</strong> for all diagrams — no external charting libraries. This keeps the bundle small and pages fast.</p>

        <h3>ER Diagram Pattern</h3>
        <p>Use for showing database table relationships:</p>
        <pre><code>&lt;div class="er-diagram"&gt;
  &lt;div class="er-table"&gt;
    &lt;div class="er-header"&gt;TableName&lt;/div&gt;
    &lt;div class="er-row pk"&gt;
      &lt;span class="badge-pk"&gt;PK&lt;/span&gt; Id &lt;span class="type"&gt;int&lt;/span&gt;
    &lt;/div&gt;
    &lt;div class="er-row fk"&gt;
      &lt;span class="badge-fk"&gt;FK&lt;/span&gt; ParentId &lt;span class="type"&gt;int&lt;/span&gt;
    &lt;/div&gt;
    &lt;div class="er-row"&gt;
      Name &lt;span class="type"&gt;nvarchar(200)&lt;/span&gt;
    &lt;/div&gt;
    &lt;div class="er-row"&gt;
      IsActive &lt;span class="type"&gt;bit&lt;/span&gt;
    &lt;/div&gt;
  &lt;/div&gt;

  &lt;!-- Relationship arrow --&gt;
  &lt;div class="er-relation"&gt;
    &lt;span&gt;1&lt;/span&gt;
    &lt;div class="er-line"&gt;&lt;/div&gt;
    &lt;span&gt;N&lt;/span&gt;
  &lt;/div&gt;

  &lt;!-- Another table... --&gt;
&lt;/div&gt;</code></pre>

        <h3>ER Diagram CSS Classes</h3>
        <table>
          <thead><tr><th>Class</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>.er-diagram</code></td><td>Flex container for all tables</td></tr>
            <tr><td><code>.er-table</code></td><td>Individual table box</td></tr>
            <tr><td><code>.er-header</code></td><td>Table name header (dark blue bg)</td></tr>
            <tr><td><code>.er-row</code></td><td>Column row</td></tr>
            <tr><td><code>.er-row.pk</code></td><td>Primary key row (light blue bg)</td></tr>
            <tr><td><code>.er-row.fk</code></td><td>Foreign key row (light purple bg)</td></tr>
            <tr><td><code>.badge-pk</code></td><td>PK badge (gold)</td></tr>
            <tr><td><code>.badge-fk</code></td><td>FK badge (purple)</td></tr>
            <tr><td><code>.type</code></td><td>Data type label (right-aligned, grey)</td></tr>
            <tr><td><code>.er-relation</code></td><td>Relationship connector with cardinality</td></tr>
          </tbody>
        </table>

        <h3>Flow Diagram Pattern</h3>
        <p>Use for showing processes, workflows, and data flows:</p>
        <pre><code>&lt;div class="diagram"&gt;
  &lt;div class="diagram-row"&gt;
    &lt;div class="diagram-node node-start"&gt;
      &lt;i class="bi bi-play-circle"&gt;&lt;/i&gt; Start
    &lt;/div&gt;
    &lt;div class="diagram-arrow"&gt;
      &lt;i class="bi bi-arrow-right"&gt;&lt;/i&gt;
    &lt;/div&gt;
    &lt;div class="diagram-node node-action"&gt;
      &lt;i class="bi bi-gear"&gt;&lt;/i&gt; Process Step
    &lt;/div&gt;
    &lt;div class="diagram-arrow"&gt;
      &lt;i class="bi bi-arrow-right"&gt;&lt;/i&gt;
    &lt;/div&gt;
    &lt;div class="diagram-node node-success"&gt;
      &lt;i class="bi bi-check-circle"&gt;&lt;/i&gt; Done
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>

        <h3>Flow Diagram Node Colors</h3>
        <table>
          <thead><tr><th>Class</th><th>Color</th><th>Use for</th></tr></thead>
          <tbody>
            <tr><td><code>.node-start</code></td><td style="background:#e8ecf1;padding:2px 8px;border-radius:4px;">#e8ecf1 grey</td><td>Starting point, user actions</td></tr>
            <tr><td><code>.node-action</code></td><td style="background:#6c8cff;color:#fff;padding:2px 8px;border-radius:4px;">#6c8cff blue</td><td>Processing steps, method calls</td></tr>
            <tr><td><code>.node-pending</code></td><td style="background:#f9a825;color:#fff;padding:2px 8px;border-radius:4px;">#f9a825 amber</td><td>Waiting states, dialogs, modals</td></tr>
            <tr><td><code>.node-step</code></td><td style="background:#f0f3ff;padding:2px 8px;border-radius:4px;border:2px solid #d0d8ff;">#f0f3ff outlined</td><td>Intermediate steps, decisions</td></tr>
            <tr><td><code>.node-success</code></td><td style="background:#43a047;color:#fff;padding:2px 8px;border-radius:4px;">#43a047 green</td><td>Success / completion</td></tr>
            <tr><td><code>.node-danger</code></td><td style="background:#e53935;color:#fff;padding:2px 8px;border-radius:4px;">#e53935 red</td><td>Error / failure / rejection</td></tr>
          </tbody>
        </table>

        <p>Use <code>.diagram-down</code> with <code>bi-arrow-down</code> to connect rows vertically.</p>
      </section>

      <!-- 10. Style Guide -->
      <section class="card" id="style-guide">
        <h2>10. Style Guide</h2>

        <h3>Colors</h3>
        <table>
          <thead><tr><th>Color</th><th>Hex</th><th>Usage</th></tr></thead>
          <tbody>
            <tr><td><span class="color-swatch" style="background:#1a1f36;"></span></td><td><code>#1a1f36</code></td><td>Sidebar background, headings, code blocks</td></tr>
            <tr><td><span class="color-swatch" style="background:#2d3561;"></span></td><td><code>#2d3561</code></td><td>Floating toolbar background</td></tr>
            <tr><td><span class="color-swatch" style="background:#6c8cff;"></span></td><td><code>#6c8cff</code></td><td>Active links, accent color, action nodes</td></tr>
            <tr><td><span class="color-swatch" style="background:#4a6cf7;"></span></td><td><code>#4a6cf7</code></td><td>Inline code text color</td></tr>
            <tr><td><span class="color-swatch" style="background:#f0f3ff;"></span></td><td><code>#f0f3ff</code></td><td>Inline code background, light accents</td></tr>
            <tr><td><span class="color-swatch" style="background:#43a047;"></span></td><td><code>#43a047</code></td><td>Success states, badges</td></tr>
            <tr><td><span class="color-swatch" style="background:#e53935;"></span></td><td><code>#e53935</code></td><td>Error / danger states</td></tr>
            <tr><td><span class="color-swatch" style="background:#f9a825;"></span></td><td><code>#f9a825</code></td><td>Warning / pending states</td></tr>
          </tbody>
        </table>

        <h3>Typography</h3>
        <table>
          <thead><tr><th>Element</th><th>Size</th><th>Weight</th></tr></thead>
          <tbody>
            <tr><td>Page title (h1)</td><td>28px</td><td>700</td></tr>
            <tr><td>Card heading (h2)</td><td>20px</td><td>700</td></tr>
            <tr><td>Section heading (h3)</td><td>16px</td><td>600</td></tr>
            <tr><td>Sub heading (h4)</td><td>14px</td><td>600</td></tr>
            <tr><td>Body text</td><td>14px</td><td>400</td></tr>
            <tr><td>Code (inline)</td><td>13px</td><td>—</td></tr>
            <tr><td>Code (block)</td><td>13px</td><td>—</td></tr>
            <tr><td>Table text</td><td>13px</td><td>—</td></tr>
          </tbody>
        </table>

        <h3>Card Component</h3>
        <p>All content sections use the <code>.card</code> class:</p>
        <ul>
          <li>Background: <code>#fff</code></li>
          <li>Border radius: <code>14px</code></li>
          <li>Padding: <code>28px 32px</code></li>
          <li>Shadow: <code>0 1px 4px rgba(0,0,0,0.06)</code></li>
          <li>Margin bottom: <code>16px</code></li>
        </ul>
      </section>

      <!-- 11. Code Block Conventions -->
      <section class="card" id="code-blocks">
        <h2>11. Code Block Conventions</h2>
        <p>Use <code>&lt;pre&gt;&lt;code&gt;</code> blocks for all code samples:</p>

        <h3>HTML Encoding</h3>
        <p>Since we use inline templates, HTML special characters must be encoded:</p>
        <table>
          <thead><tr><th>Character</th><th>Encoded</th></tr></thead>
          <tbody>
            <tr><td><code>&#123;</code></td><td><code>&amp;#123;</code></td></tr>
            <tr><td><code>&#125;</code></td><td><code>&amp;#125;</code></td></tr>
            <tr><td><code>&lt;</code></td><td><code>&amp;lt;</code></td></tr>
            <tr><td><code>&gt;</code></td><td><code>&amp;gt;</code></td></tr>
            <tr><td><code>&#64;</code></td><td><code>&amp;#64;</code></td></tr>
          </tbody>
        </table>

        <h3>Code Block Styling</h3>
        <ul>
          <li>Background: <code>#1a1f36</code> (dark)</li>
          <li>Text color: <code>#e0e6ff</code> (light blue-white)</li>
          <li>Border radius: <code>10px</code></li>
          <li>Padding: <code>18px 22px</code></li>
          <li>Font size: <code>13px</code></li>
        </ul>

        <h3>Inline Code</h3>
        <ul>
          <li>Background: <code>#f0f3ff</code></li>
          <li>Text color: <code>#4a6cf7</code></li>
          <li>Padding: <code>2px 7px</code></li>
          <li>Border radius: <code>4px</code></li>
        </ul>
      </section>

      <!-- 12. Naming Conventions -->
      <section class="card" id="naming">
        <h2>12. Naming Conventions</h2>
        <table>
          <thead><tr><th>Item</th><th>Convention</th><th>Example</th></tr></thead>
          <tbody>
            <tr><td>Component file</td><td>kebab-case</td><td><code>grid-export.component.ts</code></td></tr>
            <tr><td>Component class</td><td>PascalCase</td><td><code>GridExportComponent</code></td></tr>
            <tr><td>Component selector</td><td>app- prefix + kebab</td><td><code>app-grid-export</code></td></tr>
            <tr><td>Route path</td><td>kebab-case</td><td><code>your-area/your-page</code></td></tr>
            <tr><td>Asset folder</td><td>kebab-case</td><td><code>assets/content/employee/</code></td></tr>
            <tr><td>JSON file</td><td>kebab-case</td><td><code>features.json</code>, <code>api-reference.json</code></td></tr>
          </tbody>
        </table>
      </section>

      <!-- 13. Documentation Status -->
      <section class="card" id="doc-status">
        <h2>13. Documentation Status</h2>
        <p>Every documentation page must include a <strong>status badge</strong> in the header area, right after the subtitle. This helps track the documentation lifecycle.</p>

        <h3>Status Values</h3>
        <table>
          <thead><tr><th>Status</th><th>Badge</th><th>When to Use</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Completed</strong></td>
              <td><span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;padding:2px 10px;border-radius:20px;background:#e8f5e9;color:#43a047;"><i class="bi bi-check-circle-fill"></i> Completed</span></td>
              <td>Documentation is fully written and reviewed</td>
            </tr>
            <tr>
              <td><strong>In Progress</strong></td>
              <td><span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;padding:2px 10px;border-radius:20px;background:#fff3e0;color:#e65100;"><i class="bi bi-arrow-repeat"></i> In Progress</span></td>
              <td>Documentation is being written or updated</td>
            </tr>
            <tr>
              <td><strong>Planning</strong></td>
              <td><span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;padding:2px 10px;border-radius:20px;background:#f0f3ff;color:#6c8cff;"><i class="bi bi-lightbulb"></i> Planning</span></td>
              <td>Page is a placeholder, content is planned but not yet started</td>
            </tr>
            <tr>
              <td><strong>Cancelled</strong></td>
              <td><span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;padding:2px 10px;border-radius:20px;background:#ffebee;color:#c62828;"><i class="bi bi-x-circle"></i> Cancelled</span></td>
              <td>Documentation was abandoned or the feature was removed</td>
            </tr>
          </tbody>
        </table>

        <h3>HTML Code</h3>
        <pre><code>&lt;!-- Completed --&gt;
&lt;div class="doc-status"&gt;
  &lt;i class="bi bi-check-circle-fill"&gt;&lt;/i&gt; Completed
&lt;/div&gt;

&lt;!-- In Progress --&gt;
&lt;div class="doc-status" style="background:#fff3e0;color:#e65100;"&gt;
  &lt;i class="bi bi-arrow-repeat"&gt;&lt;/i&gt; In Progress
&lt;/div&gt;

&lt;!-- Planning --&gt;
&lt;div class="doc-status" style="background:#f0f3ff;color:#6c8cff;"&gt;
  &lt;i class="bi bi-lightbulb"&gt;&lt;/i&gt; Planning
&lt;/div&gt;

&lt;!-- Cancelled --&gt;
&lt;div class="doc-status" style="background:#ffebee;color:#c62828;"&gt;
  &lt;i class="bi bi-x-circle"&gt;&lt;/i&gt; Cancelled
&lt;/div&gt;</code></pre>

        <h3>CSS</h3>
        <pre><code>.doc-status &#123;
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; font-weight: 600; padding: 4px 14px;
  border-radius: 20px; margin-bottom: 24px;
  background: #e8f5e9; color: #43a047;
&#125;</code></pre>

        <h3>Placement</h3>
        <p>Add the badge <strong>after the subtitle</strong> and <strong>before the first card section</strong>:</p>
        <pre><code>&lt;h1&gt;Feature Title&lt;/h1&gt;
&lt;p class="subtitle"&gt;Brief description.&lt;/p&gt;
&lt;div class="doc-status"&gt;&lt;i class="bi bi-check-circle-fill"&gt;&lt;/i&gt; Completed&lt;/div&gt;

&lt;section class="card"&gt;
  &lt;h2&gt;Overview&lt;/h2&gt;
  ...
&lt;/section&gt;</code></pre>
      </section>

      <!-- 14. Adding Screenshots -->
      <section class="card" id="screenshots">
        <h2>14. Adding Screenshots</h2>
        <p>Screenshots help developers understand the UI quickly. Store images in <code>src/assets/images/</code> and reference them in the component template.</p>

        <h3>Step 1: Save Images</h3>
        <p>Save your screenshots as <code>.png</code> files in:</p>
        <pre><code>developer-docs/src/assets/images/
├── grid-export-dialog.png
├── grid-export-pdf-output.png
└── your-feature-screenshot.png</code></pre>

        <h3>Step 2: Add to Template</h3>
        <pre><code>&lt;section class="card"&gt;
  &lt;h2&gt;Screenshots&lt;/h2&gt;
  &lt;h3&gt;Dialog View&lt;/h3&gt;
  &lt;p&gt;Description of what the screenshot shows.&lt;/p&gt;
  &lt;div class="screenshot-wrapper"&gt;
    &lt;img src="assets/images/your-screenshot.png"
         alt="Description" /&gt;
  &lt;/div&gt;
&lt;/section&gt;</code></pre>

        <h3>Step 3: Add CSS</h3>
        <pre><code>.screenshot-wrapper &#123;
  margin: 12px 0; border-radius: 10px; overflow: hidden;
  border: 1px solid #e0e4ec;
&#125;
.screenshot-wrapper img &#123;
  width: 100%; display: block;
&#125;</code></pre>

        <div class="warning-box">
          <i class="bi bi-exclamation-triangle"></i>
          <div>
            <strong>Important:</strong> After adding new images to <code>assets/</code>, you must <strong>restart the dev server</strong> for them to be served.
          </div>
        </div>

        <h3>Naming Convention</h3>
        <table>
          <thead><tr><th>Format</th><th>Example</th></tr></thead>
          <tbody>
            <tr><td><code>&#123;feature&#125;-&#123;description&#125;.png</code></td><td><code>grid-export-dialog.png</code></td></tr>
            <tr><td><code>&#123;feature&#125;-&#123;description&#125;.png</code></td><td><code>grid-export-pdf-output.png</code></td></tr>
            <tr><td><code>&#123;feature&#125;-&#123;description&#125;.png</code></td><td><code>approval-workflow-config.png</code></td></tr>
          </tbody>
        </table>
      </section>

      <!-- 15. Pre-Publish Checklist -->
      <section class="card" id="checklist">
        <h2>15. Pre-Publish Checklist</h2>
        <table>
          <thead><tr><th>#</th><th>Task</th><th>Required</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Component created in correct folder</td><td>Yes</td></tr>
            <tr><td>2</td><td>Route added to <code>app.routes.ts</code></td><td>Yes</td></tr>
            <tr><td>3</td><td>Back link points to correct parent page</td><td>Yes</td></tr>
            <tr><td>4</td><td>Page has title (h1) and subtitle</td><td>Yes</td></tr>
            <tr><td>5</td><td>Content organized in <code>.card</code> sections</td><td>Yes</td></tr>
            <tr><td>6</td><td>Standard styles copied from existing page</td><td>Yes</td></tr>
            <tr><td>7</td><td>Added to relevant index/listing page (if applicable)</td><td>Conditional</td></tr>
            <tr><td>8</td><td>Added to sidebar (if applicable)</td><td>Optional</td></tr>
            <tr><td>9</td><td>ER diagram added (if database tables exist)</td><td>Recommended</td></tr>
            <tr><td>10</td><td>Flow diagram added (if workflow exists)</td><td>Recommended</td></tr>
            <tr><td>11</td><td>Code examples use proper HTML encoding</td><td>Yes</td></tr>
            <tr><td>12</td><td>Dev server restarted (if new asset files added)</td><td>Conditional</td></tr>
            <tr><td>13</td><td>Build passes: <code>ng build</code></td><td>Yes</td></tr>
          </tbody>
        </table>
      </section>

      <!-- 14. Floating Table of Contents -->
      <section class="card" id="floating-toc">
        <h2>14. Floating Table of Contents</h2>
        <p>Every documentation page automatically gets a <strong>floating TOC bar</strong> positioned above the floating toolbar (bottom-right). It scans all <code>&lt;h2&gt;</code> headings inside <code>.card</code> sections and displays them as clickable navigation pills.</p>

        <h3>How It Works</h3>
        <ul>
          <li>The TOC component (<code>FloatingTocComponent</code>) is placed in the global <code>LayoutComponent</code> — it appears on <strong>every authenticated page</strong></li>
          <li>On each route change, it scans for <code>.card h2</code> elements in the <code>.content-area</code></li>
          <li>Each card section gets an auto-generated <code>id</code> attribute (or uses existing ones)</li>
          <li>An <code>IntersectionObserver</code> watches each section and highlights the currently visible one</li>
          <li>Clicking a TOC item smoothly scrolls to that section</li>
          <li>The TOC only shows when there are <strong>2 or more sections</strong> on the page</li>
          <li>Users can collapse/expand the TOC with the toggle button</li>
        </ul>

        <h3>No Extra Work Needed</h3>
        <div class="info-box">
          <i class="bi bi-info-circle"></i>
          <div>
            The floating TOC is <strong>fully automatic</strong>. As long as your page uses <code>.card</code> sections with <code>&lt;h2&gt;</code> headings (the standard pattern), the TOC will pick them up — no additional code or configuration required.
          </div>
        </div>

        <h3>Source File</h3>
        <pre><code>src/app/shared/floating-toc/floating-toc.component.ts</code></pre>
      </section>

      <!-- 15. Using Claude in VS Code -->
      <section class="card" id="claude-vscode">
        <h2>15. Using Claude in VS Code</h2>
        <p>We use <strong>Claude Code (VS Code Extension)</strong> as our primary tool to create, maintain, and upgrade documentation pages in this portal. This ensures consistent quality and faster iteration.</p>

        <div class="info-box">
          <i class="bi bi-info-circle"></i>
          <div>
            <strong>Why Claude?</strong>
            <ul>
              <li>Generates complete Angular standalone components with inline templates &amp; styles</li>
              <li>Maintains consistent structure across all doc pages</li>
              <li>Creates CSS-based ER &amp; flow diagrams from markdown specs</li>
              <li>Handles HTML encoding (<code>&amp;#123;</code>, <code>&amp;lt;</code>, etc.) automatically</li>
              <li>Updates routes, sidebar, and listing pages in one session</li>
            </ul>
          </div>
        </div>

        <h3>Setup</h3>
        <ol>
          <li>Install <strong>Claude Code</strong> extension in VS Code</li>
          <li>Open the <code>developer-docs/</code> folder as your workspace (or the parent Smart HR Product folder)</li>
          <li>Open Claude Code panel (<code>Ctrl+Shift+P</code> &rarr; "Claude Code")</li>
        </ol>

        <h3>Workflow: Create a New Doc Page</h3>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-file-earmark-text"></i> Prepare Source<small>.md file or spec</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-robot"></i> Prompt Claude<small>in VS Code</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-code-slash"></i> Review Code<small>component + route</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-eye"></i> Preview<small>ng serve --port 4300</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-pencil"></i> Refine<small>ask Claude to adjust</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check-circle"></i> Commit<small>git push</small></div>
          </div>
        </div>

        <h3>Prompt Templates</h3>
        <p>Use these proven prompts when asking Claude to generate documentation pages:</p>

        <h4>Create a new doc page</h4>
        <pre><code>Write a full documentation page for [Topic] as a static
Angular standalone component at:
src/app/pages/your-area/[page-name].component.ts

Follow the existing page patterns in this repository:
- Back link to /welcome
- Overview section with capabilities
- Diagrams (CSS-based) if needed
- Interfaces / Data models
- Integration guide with code examples

Source content: [paste your .md file or describe the topic]

Also:
- Add route in app.routes.ts
- Add a sidebar link if it should be discoverable
- Use HTML encoding for curly braces and angle brackets</code></pre>

        <h4>Add diagrams to an existing page</h4>
        <pre><code>In [component-name].component.ts, add:
1. A CSS-based ER diagram showing these tables:
   - TableA (PK: Id, columns: Name, Status, FK: ParentId)
   - TableB (PK: Id, columns: Value, CreatedDate)
   - Relationship: TableA 1:N TableB via ParentId

2. A flow diagram showing this workflow:
   [Step 1] -> [Step 2] -> [Decision] -> [Success/Failure]

Use the same .er-diagram and .diagram CSS classes
from the existing pages.</code></pre>

        <h4>Update or extend an existing page</h4>
        <pre><code>In [component-name].component.ts, add a new section
after [existing section name]:
- Section title: "[New Section]"
- Content: [describe what to add]
- Include a code example showing [specific usage]
Keep the same card/.card styling pattern.</code></pre>

        <h3>Best Practices with Claude</h3>
        <table>
          <thead><tr><th>Do</th><th>Don't</th></tr></thead>
          <tbody>
            <tr>
              <td><i class="bi bi-check-circle" style="color:#43a047"></i> Open an existing page for reference before prompting</td>
              <td><i class="bi bi-x-circle" style="color:#e53935"></i> Ask Claude without showing the existing pattern</td>
            </tr>
            <tr>
              <td><i class="bi bi-check-circle" style="color:#43a047"></i> Provide source .md file or feature spec</td>
              <td><i class="bi bi-x-circle" style="color:#e53935"></i> Give vague descriptions with no source material</td>
            </tr>
            <tr>
              <td><i class="bi bi-check-circle" style="color:#43a047"></i> Ask Claude to update routes + sidebar + listing together</td>
              <td><i class="bi bi-x-circle" style="color:#e53935"></i> Only create the component and forget wiring</td>
            </tr>
            <tr>
              <td><i class="bi bi-check-circle" style="color:#43a047"></i> Review generated HTML encoding for correctness</td>
              <td><i class="bi bi-x-circle" style="color:#e53935"></i> Blindly accept without checking the output</td>
            </tr>
            <tr>
              <td><i class="bi bi-check-circle" style="color:#43a047"></i> Ask Claude to build and verify (<code>ng build</code>)</td>
              <td><i class="bi bi-x-circle" style="color:#e53935"></i> Skip build verification before committing</td>
            </tr>
            <tr>
              <td><i class="bi bi-check-circle" style="color:#43a047"></i> Iterate — ask to adjust colors, layout, content</td>
              <td><i class="bi bi-x-circle" style="color:#e53935"></i> Expect perfect output on the first prompt</td>
            </tr>
          </tbody>
        </table>

        <h3>Source Files Location</h3>
        <p>Feature specification documents (markdown) are stored in the main project:</p>
        <pre><code>Smart HR Product/
├── Documentation/
│   ├── Feature-Guides/              # Feature .md files
│   │   ├── Common-Grid-Export-Feature.md
│   │   ├── Approval-Workflow-Integration-Guide.md
│   │   ├── Custom-Field-Integration-Guide.md
│   │   ├── Log-Note-Integration-Guide.md
│   │   └── ...
│   └── Configuration-Encryption/    # Config docs
└── developer-docs/                  # This portal (Angular app)</code></pre>

        <div class="info-box">
          <i class="bi bi-lightbulb"></i>
          <div>
            <strong>Tip:</strong> When you have a new <code>.md</code> feature guide, simply open it in VS Code and tell Claude:
            <em>"Write full documentation on our portal for this feature"</em> — Claude will read the file, generate the component, add routes, and wire everything up.
          </div>
        </div>

        <h3>Maintaining &amp; Upgrading Docs</h3>
        <p>To keep documentation up-to-date as the product evolves:</p>
        <ol>
          <li><strong>Feature change?</strong> — Open the doc page component, tell Claude what changed, and ask it to update the relevant sections</li>
          <li><strong>New API endpoints?</strong> — Update the domain's <code>api-reference.json</code> or ask Claude to add API sections to the static page</li>
          <li><strong>New common feature?</strong> — Provide the .md spec and ask Claude to create the full page + wiring</li>
          <li><strong>Style update?</strong> — Ask Claude to update the global styles in <code>styles.scss</code> and all affected components</li>
          <li><strong>Bulk updates?</strong> — Claude can iterate through multiple files in one session</li>
        </ol>

        <h3>Example Session</h3>
        <pre><code># In VS Code with Claude Code extension open:

You: "I have a new feature doc at
Documentation/Feature-Guides/My-New-Feature.md
Write full documentation on our portal."

Claude: Creates component, adds route, updates listing,
        adds to sidebar if needed, runs ng build to verify.

You: "Add a database ER diagram for these tables..."

Claude: Adds CSS-based ER diagram section to the page.

You: "The flow diagram needs one more step after approval."

Claude: Updates the flow diagram with the new step.

You: "Looks good. Push the code."

Claude: Commits and pushes all changes.</code></pre>
      </section>

      <!-- Integrate into Another Project -->
      <section class="card" id="integrate-new-project">
        <h2>Integrate into Another Project</h2>
        <p>This documentation portal is a <strong>reusable standalone Angular app</strong> that can be copied and customized for any project. Follow these steps to integrate it into a new project.</p>

        <h3>Step 1: Copy the Portal</h3>
        <p>Copy the entire <code>developer-docs/</code> folder to your new project root:</p>
        <pre><code>YourProject/
├── YourProject_API/
├── YourProject_UI/
└── developer-docs/        &lt;-- copy here</code></pre>

        <h3>Step 2: Install Dependencies</h3>
        <pre><code>cd developer-docs
npm install</code></pre>

        <h3>Step 3: Clean Existing Content</h3>
        <p>Remove all Smart HR-specific documentation pages and content. Here's what to clean:</p>

        <h4>A. Delete feature page components</h4>
        <pre><code># Delete all Smart HR Design pages
rm -rf src/app/pages/smart-hr/

# Delete all PenTest pages
rm -rf src/app/pages/pentest/

# Delete Smart HR Case page
rm -rf src/app/pages/smart-hr-case/

# Delete all asset content
rm -rf src/assets/content/pentest/
rm -rf src/assets/content/employee/
rm -rf src/assets/content/attendance/
rm -rf src/assets/images/*</code></pre>

        <h4>B. Clean the routes file</h4>
        <p>Open <code>src/app/app.routes.ts</code> and remove all Smart HR-specific imports and routes. Keep only the skeleton:</p>
        <pre><code>import &#123; Routes &#125; from '&#64;angular/router';
import &#123; authGuard &#125; from './core/guards/auth.guard';
import &#123; LayoutComponent &#125; from './layout/layout.component';
import &#123; LoginComponent &#125; from './pages/login/login.component';
import &#123; WelcomeComponent &#125; from './pages/welcome/welcome.component';
import &#123; HowToDocComponent &#125; from './pages/how-to-doc/how-to-doc.component';

export const routes: Routes = [
  &#123; path: 'login', component: LoginComponent &#125;,
  &#123;
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      &#123; path: '', redirectTo: 'welcome', pathMatch: 'full' &#125;,
      &#123; path: 'welcome', component: WelcomeComponent &#125;,
      &#123; path: 'how-to-doc', component: HowToDocComponent &#125;,
    ]
  &#125;,
  &#123; path: '**', redirectTo: 'welcome' &#125;
];</code></pre>

        <h4>C. Clean the sidebar</h4>
        <p>Open <code>src/app/layout/sidebar/sidebar.component.ts</code> and keep only:</p>
        <pre><code>&lt;nav class="sidebar-nav"&gt;
  &lt;a routerLink="/welcome" routerLinkActive="active" class="nav-item"&gt;
    &lt;i class="bi bi-house"&gt;&lt;/i&gt;
    &lt;span *ngIf="!collapsed"&gt;Home&lt;/span&gt;
  &lt;/a&gt;
  &lt;a routerLink="/how-to-doc" routerLinkActive="active" class="nav-item"&gt;
    &lt;i class="bi bi-journal-code"&gt;&lt;/i&gt;
    &lt;span *ngIf="!collapsed"&gt;How to Doc?&lt;/span&gt;
  &lt;/a&gt;
&lt;/nav&gt;</code></pre>

        <h4>D. Clean the Welcome page</h4>
        <p>Open <code>src/app/pages/welcome/welcome.component.ts</code> and update the project name, description, and stats to match your new project.</p>

        <h3>Step 4: Rebrand</h3>
        <p>Update branding to match your project:</p>
        <table>
          <thead><tr><th>File</th><th>What to Change</th></tr></thead>
          <tbody>
            <tr><td><code>sidebar.component.ts</code></td><td>Change "Smart HR" and "DevDocs" in logo-text to your project name</td></tr>
            <tr><td><code>welcome.component.ts</code></td><td>Update hero title, description, and stats cards</td></tr>
            <tr><td><code>index.html</code></td><td>Update <code>&lt;title&gt;</code> tag</td></tr>
            <tr><td><code>users.json</code></td><td>Update or keep default credentials (admin/admin123)</td></tr>
          </tbody>
        </table>

        <h3>Step 5: Add Your Menus</h3>
        <p>Add sidebar menu items for your project's documentation sections. Common patterns:</p>
        <pre><code>&lt;!-- In sidebar.component.ts nav section --&gt;
&lt;a routerLink="/your-design" routerLinkActive="active" class="nav-item"&gt;
  &lt;i class="bi bi-briefcase"&gt;&lt;/i&gt;
  &lt;span *ngIf="!collapsed"&gt;Your Project Design&lt;/span&gt;
&lt;/a&gt;
&lt;a routerLink="/your-case" routerLinkActive="active" class="nav-item"&gt;
  &lt;i class="bi bi-bug"&gt;&lt;/i&gt;
  &lt;span *ngIf="!collapsed"&gt;Your Project Case&lt;/span&gt;
&lt;/a&gt;</code></pre>

        <h3>Step 6: Start Adding Docs</h3>
        <p>Use Claude in VS Code to generate documentation pages from your .md files:</p>
        <pre><code>You: "Write full documentation on our portal for this feature"
Claude: Creates component, adds route, updates listing, runs ng build.</code></pre>

        <h3>Step 7: Verify &amp; Run</h3>
        <pre><code>cd developer-docs
ng build           # Check for errors
ng serve --port 4300   # Start dev server
# Open http://localhost:4300</code></pre>

        <div class="info-box">
          <i class="bi bi-lightbulb"></i>
          <div>
            <strong>Tip:</strong> The portal is fully self-contained with no external API dependencies. Just copy, clean, rebrand, and start adding your project's documentation.
          </div>
        </div>

        <h3>What You Keep (Reusable)</h3>
        <table>
          <thead><tr><th>Component</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>login/</code></td><td>SHA-256 auth with users.json</td></tr>
            <tr><td><code>layout/</code></td><td>Sidebar + topbar + content area</td></tr>
            <tr><td><code>floating-toolbar/</code></td><td>Back, Home, in-page search</td></tr>
            <tr><td><code>floating-toc/</code></td><td>Auto-generated section navigation</td></tr>
            <tr><td><code>welcome/</code></td><td>Home page (customizable)</td></tr>
            <tr><td><code>how-to-doc/</code></td><td>This guide</td></tr>
            <tr><td><code>auth.guard.ts</code></td><td>Route protection</td></tr>
            <tr><td><code>auth.service.ts</code></td><td>Login/logout with SHA-256</td></tr>
            <tr><td><code>styles.scss</code></td><td>Global styles + search highlights</td></tr>
            <tr><td><code>app.config.ts</code></td><td>Router with scroll-to-top</td></tr>
          </tbody>
        </table>

        <h3>What You Delete (Project-Specific)</h3>
        <table>
          <thead><tr><th>Folder</th><th>Content</th></tr></thead>
          <tbody>
            <tr><td><code>pages/smart-hr/</code></td><td>All Smart HR Design pages</td></tr>
            <tr><td><code>pages/smart-hr-case/</code></td><td>Smart HR Case listing</td></tr>
            <tr><td><code>pages/pentest/</code></td><td>All PenTest bug pages</td></tr>
            <tr><td><code>pages/domain/</code></td><td>Domain list/detail (unused)</td></tr>
            <tr><td><code>pages/search/</code></td><td>Search page (unused)</td></tr>
            <tr><td><code>assets/content/</code></td><td>All JSON &amp; markdown content</td></tr>
            <tr><td><code>assets/images/</code></td><td>All screenshots</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Quick Reference Card -->
      <section class="card">
        <h2>Quick Reference</h2>
        <table>
          <thead><tr><th>Action</th><th>Command / Location</th></tr></thead>
          <tbody>
            <tr><td>Start dev server</td><td><code>ng serve --port 4300</code></td></tr>
            <tr><td>Build for production</td><td><code>ng build</code></td></tr>
            <tr><td>Routes file</td><td><code>src/app/app.routes.ts</code></td></tr>
            <tr><td>Sidebar</td><td><code>src/app/layout/sidebar/sidebar.component.ts</code></td></tr>
            <tr><td>Global styles</td><td><code>src/styles.scss</code></td></tr>
            <tr><td>Static content</td><td><code>src/assets/content/</code></td></tr>
            <tr><td>Auth credentials</td><td><code>src/assets/content/users.json</code></td></tr>
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
    .page {margin: 0 auto; }
    .back-link {
      font-size: 13px; color: #6c8cff; text-decoration: none;
      display: inline-flex; align-items: center; gap: 4px; margin-bottom: 12px;
    }
    .back-link:hover { text-decoration: underline; }
    h1 { font-size: 28px; font-weight: 700; color: #1a1f36; margin: 0 0 8px; }
    h1 i { margin-right: 8px; color: #6c8cff; }
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
    .card em { color: #888; }

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

    /* Table of Contents */
    .toc-card { background: #f8f9fc; }
    .toc { padding-left: 22px; }
    .toc li { margin-bottom: 6px; }
    .toc a { color: #6c8cff; text-decoration: none; font-size: 14px; }
    .toc a:hover { text-decoration: underline; }

    /* Info & Warning boxes */
    .info-box, .warning-box {
      display: flex; gap: 12px; padding: 16px 18px;
      border-radius: 10px; margin: 12px 0; font-size: 14px;
    }
    .info-box {
      background: #f0f3ff; border-left: 4px solid #6c8cff;
    }
    .info-box > i { color: #6c8cff; font-size: 18px; margin-top: 2px; }
    .info-box ul { margin: 6px 0 0; padding-left: 18px; }
    .warning-box {
      background: #fff8e1; border-left: 4px solid #f9a825;
    }
    .warning-box > i { color: #f9a825; font-size: 18px; margin-top: 2px; }

    /* Color swatches */
    .color-swatch {
      display: inline-block; width: 20px; height: 20px;
      border-radius: 4px; vertical-align: middle;
      border: 1px solid rgba(0,0,0,0.1);
    }

    /* Structure diagram */
    .structure-diagram {
      display: flex; flex-direction: column; gap: 6px;
      padding: 12px 0;
    }
    .struct-item {
      padding: 12px 18px; border-radius: 10px;
      font-size: 14px; font-weight: 500;
      display: flex; align-items: center; gap: 10px;
    }
    .struct-item small {
      font-weight: 400; color: rgba(0,0,0,0.5); font-size: 12px;
      margin-left: auto;
    }
    .struct-item i { font-size: 16px; min-width: 20px; }
    .struct-back { background: #f0f3ff; color: #6c8cff; }
    .struct-title { background: #1a1f36; color: #fff; }
    .struct-subtitle { background: #e8ecf1; color: #666; }
    .struct-card {
      background: #fff; color: #1a1f36;
      border: 2px solid #e0e4ec; margin-left: 20px;
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
export class HowToDocComponent {
  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
