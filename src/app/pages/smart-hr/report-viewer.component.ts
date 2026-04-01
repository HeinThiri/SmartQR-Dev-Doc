import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-report-viewer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-hr" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart HR
      </a>
      <h1>DevExpress Report Viewer Integration</h1>
      <p class="subtitle">Frontend &amp; Backend Integration Guide &mdash; XtraReports, WebDocumentViewer, Angular component, authentication, parameter injection, and adding new reports.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>SmartHR uses the <strong>DevExpress Reporting</strong> stack (XtraReports + WebDocumentViewer) to render, export, and optionally design print-ready reports. Reports are defined as C# <code>XtraReport</code> classes on the server, surfaced through a custom <code>ReportStorageWebExtension</code>, and displayed in the browser using the <code>dx-report-viewer</code> Angular component.</p>
      </section>

      <!-- Architecture -->
      <section class="card">
        <h2>1. Architecture</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-browser-chrome"></i> dx-report-viewer<small>Angular Frontend</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-cloud"></i> AJAX<small>HTTP Requests</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-server"></i> /Report Controller<small>ASP.NET Core</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-pending"><i class="bi bi-key"></i> Bearer Token<small>ajaxSetup.beforeSend</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-funnel"></i> ParseUrl()<small>reportName + params</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-file-earmark-text"></i> ReportsFactory<small>XtraReport instance</small></div>
          </div>
        </div>
        <h3>Architecture Detail</h3>
        <pre><code>Angular (Frontend)                         ASP.NET Core (Backend)
------------------------------------       --------------------------------------------------
dx-report-viewer  &lt;--- AJAX --------&gt;   CustomWebDocumentViewerController  (route: /Report)
  reportUrl: "ReportName?param=value"      CustomReportStorageWebExtension.GetData(url)
  invokeAction: "Report"                     ParseUrl()  -&gt; reportName + parameters
  hostUrl: environment.baseApiUrl            GetAuthorizedUserFromToken()
  ajaxSetup.beforeSend -&gt; Bearer token       ReportsFactory.Reports[reportName]()
                                             ConfigureReportParameters(report, params)
dx-report-designer &lt;--- AJAX -------&gt;   CustomReportDesignerController  (route: /DXXRD)
  getDesignerModelAction: DXXRD/             GetDesignerModel()
  GetDesignerModel                       CustomQueryBuilderController</code></pre>
      </section>

      <!-- Backend Setup -->
      <section class="card">
        <h2>2. Backend Setup (Program.cs)</h2>
        <pre><code>// 1. Register DevExpress services
builder.Services.AddDevExpressControls();

// 2. Register custom report storage (scoped - one per request)
builder.Services.AddScoped&lt;ReportStorageWebExtension, CustomReportStorageWebExtension&gt;();

// 3. Configure reporting pipeline
builder.Services.ConfigureReportingServices(configurator =&gt;
&#123;
    if (env.IsDevelopment()) configurator.UseDevelopmentMode();

    configurator.ConfigureReportDesigner(c =&gt;
        c.RegisterDataSourceWizardConfigFileConnectionStringsProvider());

    configurator.ConfigureWebDocumentViewer(c =&gt;
        c.UseCachedReportSourceBuilder()); // required for async/drill-down
&#125;);

// 4. Activate DevExpress middleware
app.UseDevExpressControls();</code></pre>
      </section>

      <!-- Backend Controllers -->
      <section class="card">
        <h2>3. Backend Controllers (ReportingControllers.cs)</h2>
        <p>Three controllers are registered, all excluded from Swagger (<code>[ApiExplorerSettings(IgnoreApi = true)]</code>):</p>
        <table>
          <thead><tr><th>Controller</th><th>Route</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>CustomWebDocumentViewerController</code></td><td><code>/Report</code></td><td>Handles all viewer AJAX calls (render, export, search). Extends DevExpress <code>WebDocumentViewerController</code>.</td></tr>
            <tr><td><code>CustomReportDesignerController</code></td><td><code>/DXXRD</code></td><td>Handles Report Designer AJAX calls. Exposes <code>POST /DXXRD/GetDesignerModel</code>.</td></tr>
            <tr><td><code>CustomQueryBuilderController</code></td><td>(default)</td><td>Handles Query Builder AJAX calls for the designer.</td></tr>
          </tbody>
        </table>
        <p>The <code>invokeAction</code> value on the frontend (<code>"Report"</code>) maps directly to the <code>/Report</code> route of <code>CustomWebDocumentViewerController</code>.</p>
      </section>

      <!-- Report Storage -->
      <section class="card">
        <h2>4. Report Storage (CustomReportStorageWebExtension.cs)</h2>
        <p>This is the central integration point. It extends <code>DevExpress.XtraReports.Web.Extensions.ReportStorageWebExtension</code> and is called automatically by the viewer when it needs to load a report.</p>

        <h3>GetData(url) &mdash; Main Entry Point</h3>
        <p>Called by the viewer with the full <code>reportUrl</code> string from the Angular component.</p>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-link-45deg"></i> reportUrl<small>SSBReport?searchDate=...</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-scissors"></i> ParseUrl()<small>name + params</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-pending"><i class="bi bi-person-badge"></i> GetAuthorizedUser<small>Token / Cookie / URL</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-building"></i> GetLicenseInfo<small>SysLicenseView</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-gear"></i> ReportsFactory<small>Instantiate report</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-sliders"></i> ConfigureParams<small>Inject values</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-file-binary"></i> GetReportLayout<small>byte[] XML</small></div>
          </div>
        </div>

        <h3>Authentication Strategy</h3>
        <p>Because the DevExpress viewer uses its own AJAX pipeline (not Angular's <code>HttpClient</code>), the JWT token must be passed separately. Two mechanisms are used in parallel:</p>
        <ol>
          <li><strong>URL parameters</strong> &mdash; <code>licenseId</code> and <code>userId</code> are appended to the <code>reportUrl</code> string by the Angular component (read from <code>localStorage</code>). The backend reads these in <code>GetAuthorizedUserFromToken()</code>.</li>
          <li><strong>ajaxSetup.beforeSend</strong> &mdash; The Angular component injects the <code>Authorization: Bearer &lt;token&gt;</code> header into every DevExpress AJAX request. The backend reads this as a fallback.</li>
        </ol>
        <h4>Authentication Priority</h4>
        <table>
          <thead><tr><th>Priority</th><th>Source</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>URL query params</td><td><code>licenseId</code> + <code>userId</code> from reportUrl</td></tr>
            <tr><td>2</td><td>HTTP-only cookie</td><td><code>authToken</code> cookie</td></tr>
            <tr><td>3</td><td>Authorization header</td><td>Bearer token</td></tr>
            <tr><td>4</td><td>ITokenManager</td><td>Fallback service</td></tr>
          </tbody>
        </table>

        <h3>ReportsFactory &mdash; Report Registry</h3>
        <p>All available <code>.repx</code>-backed reports are registered in a static dictionary:</p>
        <pre><code>public static Dictionary&lt;string, Func&lt;XtraReport&gt;&gt; Reports = new()
&#123;
    ["EmployeeListReport"]          = () =&gt; new EmployeeReport(),
    ["EmployeeDetailReport"]        = () =&gt; new EmployeeDetailReport(),
    ["SSBReport"]                   = () =&gt; new SSBReport(),
    ["SSBSummaryReport"]            = () =&gt; new SSBSummaryReport(),
    ["SalarySummaryReport"]         = () =&gt; new SalarySummaryReport(),  // dynamic
    ["TaxCertificateReport"]        = () =&gt; new TaxCertificateReport(),
    ["RecommendationLetterReport"]  = () =&gt; new RecommendationLetterReport(),
    ["WaNga16_Report"]              = () =&gt; new WaNga16_Report(),
&#125;;</code></pre>

        <h3>ConfigureReportParameters() &mdash; Parameter Injection</h3>
        <p>Common parameters injected into every report:</p>
        <table>
          <thead><tr><th>Parameter</th><th>Source</th></tr></thead>
          <tbody>
            <tr><td><code>company_logo_url</code></td><td><code>SysAttachment</code> (referenceType = "companyProfile", sector = "gallery") + <code>SysConfig.WebApiUrl</code></td></tr>
            <tr><td><code>company_name</code></td><td><code>SysLicense.CompanyName</code></td></tr>
            <tr><td><code>company_phone</code></td><td><code>SysLicense.ContactNo</code></td></tr>
            <tr><td><code>company_mail</code></td><td><code>SysLicense.ContactEmail</code></td></tr>
            <tr><td><code>company_address</code></td><td><code>SysCompanyAddress.Address</code></td></tr>
            <tr><td><code>theme_color</code></td><td><code>SysLicense.ThemeColor</code> lightened by 70%</td></tr>
            <tr><td><code>license_id</code></td><td>From resolved user</td></tr>
            <tr><td><code>print_by</code></td><td><code>SysUser.UserName</code></td></tr>
            <tr><td><code>print_on</code></td><td><code>DateTime.Now</code></td></tr>
          </tbody>
        </table>
      </section>

      <!-- Frontend Integration -->
      <section class="card">
        <h2>5. Frontend Integration</h2>
        <h3>Angular Module Requirements</h3>
        <pre><code>// In the feature module (e.g., payroll-module.module.ts)
import &#123; DxReportViewerModule &#125; from 'devexpress-reporting-angular';

&#64;NgModule(&#123;
  imports: [DxReportViewerModule, ...]
&#125;)</code></pre>

        <h3>Standard Viewer Component Pattern</h3>
        <h4>TypeScript</h4>
        <pre><code>export class MyReportViewerComponent implements OnInit &#123;
  &#64;Input() reportUrl: string;
  invokeAction = 'Report';                        // maps to /Report backend route
  hostUrl = environment.baseApiUrl + '/';

  constructor(private activatedRoute: ActivatedRoute,
              private storageService: SystematicCommon) &#123;&#125;

  ngOnInit(): void &#123;
    const token = this.storageService.getActiveToken();
    const licenseId = localStorage.getItem('reportLicenseId');
    const userId    = localStorage.getItem('reportUserId');

    this.activatedRoute.queryParams.subscribe(params =&gt; &#123;
      this.reportUrl = 'MyReport?param=' + params['param']
        + '&amp;licenseId=' + licenseId
        + '&amp;userId=' + userId;
    &#125;);

    // Inject Bearer token into all DevExpress AJAX calls
    ajaxSetup.ajaxSettings = &#123;
      beforeSend: (xhr) =&gt; &#123;
        if (xhr instanceof XMLHttpRequest) xhr.withCredentials = true;
        if (token) xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      &#125;
    &#125;;
  &#125;
&#125;</code></pre>

        <h4>HTML Template</h4>
        <pre><code>&lt;dx-report-viewer [reportUrl]="reportUrl" height="85vh" cssClass="myViewer" zoom="100"&gt;
  &lt;dxrv-request-options [invokeAction]="invokeAction" [host]="hostUrl"&gt;
  &lt;/dxrv-request-options&gt;
  &lt;dxrv-tabpanel-settings width="300" position="Left"&gt;&lt;/dxrv-tabpanel-settings&gt;
  &lt;dxrv-export-settings [useSameTab]="false" [useAsynchronousExport]="false"&gt;
  &lt;/dxrv-export-settings&gt;
  &lt;dxrv-search-settings [useAsyncSearch]="false"&gt;&lt;/dxrv-search-settings&gt;
&lt;/dx-report-viewer&gt;</code></pre>

        <h3>reportUrl Format</h3>
        <pre><code>&#123;ReportName&#125;?&#123;param1&#125;=&#123;value1&#125;&amp;&#123;param2&#125;=&#123;value2&#125;&amp;licenseId=&#123;licenseId&#125;&amp;userId=&#123;userId&#125;</code></pre>

        <h4>Examples</h4>
        <table>
          <thead><tr><th>Report</th><th>reportUrl</th></tr></thead>
          <tbody>
            <tr><td>Employee Detail</td><td><code>EmployeeDetailReport?staffID=xxx&amp;licenseId=yyy&amp;userId=zzz</code></td></tr>
            <tr><td>SSB Report</td><td><code>SSBReport?searchDate=2024-01-01&amp;orgGroupId=xxx&amp;licenseId=yyy&amp;userId=zzz</code></td></tr>
            <tr><td>Tax Certificate</td><td><code>TaxCertificateReport?year=2024&amp;staffId=xxx&amp;licenseId=yyy&amp;userId=zzz</code></td></tr>
            <tr><td>WaNga16</td><td><code>WaNga16_Report?year=2024&amp;orgGroupId=xxx&amp;licenseId=yyy&amp;userId=zzz</code></td></tr>
            <tr><td>Employee List</td><td><code>EmployeeListReport?search_date=2024-01-01&amp;licenseId=yyy&amp;userId=zzz</code></td></tr>
          </tbody>
        </table>

        <h3>localStorage Auth Keys</h3>
        <p>The parent page sets these before opening the report viewer:</p>
        <table>
          <thead><tr><th>Key</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td><code>reportLicenseId</code></td><td>Current user's license ID</td></tr>
            <tr><td><code>reportUserId</code></td><td>Current user's user ID</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Report Parameters Reference -->
      <section class="card">
        <h2>6. Report Parameters Reference</h2>

        <h3>EmployeeListReport</h3>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>company_logo_url</code></td><td>string</td><td>Full URL to company logo</td></tr>
            <tr><td><code>current_date</code></td><td>DateTime</td><td>Today's date</td></tr>
            <tr><td><code>search_date</code></td><td>string</td><td>Filter date</td></tr>
            <tr><td><code>company_address</code></td><td>string</td><td>Company address</td></tr>
            <tr><td><code>license_id</code></td><td>string</td><td>License ID</td></tr>
          </tbody>
        </table>

        <h3>EmployeeDetailReport</h3>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>staff_id</code></td><td>string</td><td>Target employee's StaffID</td></tr>
            <tr><td><code>license_id</code></td><td>string</td><td>License ID</td></tr>
            <tr><td><code>logo_url</code></td><td>string</td><td>Full URL to company logo</td></tr>
            <tr><td><code>company_name</code></td><td>string</td><td>Company name</td></tr>
            <tr><td><code>company_phone</code></td><td>string</td><td>Company phone</td></tr>
            <tr><td><code>company_mail</code></td><td>string</td><td>Company email</td></tr>
            <tr><td><code>theme_color</code></td><td>string</td><td>Hex color (lightened 70%)</td></tr>
            <tr><td><code>company_address</code></td><td>string</td><td>Company address</td></tr>
            <tr><td><code>print_by</code></td><td>string</td><td>Username of the person printing</td></tr>
            <tr><td><code>print_on</code></td><td>DateTime</td><td>Print timestamp</td></tr>
          </tbody>
        </table>

        <h3>SSBReport</h3>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>search_date</code></td><td>DateTime</td><td>First day of the selected month</td></tr>
            <tr><td><code>license_id</code></td><td>string</td><td>License ID</td></tr>
            <tr><td><code>org_group_id</code></td><td>string</td><td>Org group filter</td></tr>
            <tr><td><code>print_by</code></td><td>string</td><td>Username</td></tr>
            <tr><td><code>print_on</code></td><td>DateTime</td><td>Print timestamp</td></tr>
          </tbody>
        </table>

        <h3>SSBSummaryReport</h3>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>search_date</code></td><td>DateTime</td><td>First day of the selected month</td></tr>
            <tr><td><code>license_id</code></td><td>string</td><td>License ID</td></tr>
            <tr><td><code>request_id</code></td><td>string</td><td>Current user ID</td></tr>
            <tr><td><code>print_by</code></td><td>string</td><td>Username</td></tr>
            <tr><td><code>print_on</code></td><td>DateTime</td><td>Print timestamp</td></tr>
          </tbody>
        </table>

        <h3>TaxCertificateReport</h3>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>year</code></td><td>int</td><td>Tax year</td></tr>
            <tr><td><code>staff_id</code></td><td>string</td><td>Target employee's StaffID</td></tr>
            <tr><td><code>user_id</code></td><td>string</td><td>Current user ID</td></tr>
            <tr><td><code>print_by</code></td><td>string</td><td>Username</td></tr>
            <tr><td><code>print_on</code></td><td>DateTime</td><td>Print timestamp</td></tr>
          </tbody>
        </table>

        <h3>WaNga16_Report</h3>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>year</code></td><td>int</td><td>Tax year</td></tr>
            <tr><td><code>org_group_id</code></td><td>string</td><td>Org group filter</td></tr>
            <tr><td><code>user_id</code></td><td>string</td><td>Current user ID</td></tr>
            <tr><td><code>print_by</code></td><td>string</td><td>Username</td></tr>
            <tr><td><code>print_on</code></td><td>DateTime</td><td>Print timestamp</td></tr>
          </tbody>
        </table>

        <h3>RecommendationLetterReport</h3>
        <table>
          <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>letter_id</code></td><td>string</td><td>Letter record ID</td></tr>
            <tr><td><code>license_id</code></td><td>string</td><td>License ID</td></tr>
            <tr><td><code>print_on</code></td><td>DateTime</td><td>Print timestamp</td></tr>
          </tbody>
        </table>

        <h3>SalarySummaryReport (Dynamic)</h3>
        <p>Built entirely in code &mdash; no <code>.repx</code> file. Parameters are resolved in <code>BuildSalarySummaryReport()</code>:</p>
        <table>
          <thead><tr><th>Input</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>searchDate</code></td><td>Month to summarize</td></tr>
            <tr><td><code>licenseId</code></td><td>License ID (from URL params)</td></tr>
          </tbody>
        </table>
        <p>The report auto-detects <code>HR_SalaryExtraItemType</code> columns (filtered by <code>IsShowinPayList = 1</code>) and pivots salary amounts per department into an A3 landscape layout.</p>
      </section>

      <!-- Adding a New Report -->
      <section class="card">
        <h2>7. Adding a New Report &mdash; Step-by-Step</h2>

        <h3>Backend</h3>
        <p><strong>1. Create the report class</strong> in <code>SmartHR_API/APIs/Reporting/</code>:</p>
        <pre><code>// MyNewReport.cs (hand-coded or Visual Studio designer)
public class MyNewReport : XtraReport
&#123;
    public MyNewReport() &#123; InitializeComponent(); &#125;
&#125;
// MyNewReport.Designer.cs (generated or hand-coded layout)</code></pre>

        <p><strong>2. Register in ReportsFactory</strong> inside <code>CustomReportStorageWebExtension.cs</code>:</p>
        <pre><code>["MyNewReport"] = () =&gt; new MyNewReport(),</code></pre>

        <p><strong>3. Add parameter configuration</strong> in <code>ConfigureReportParameters()</code>:</p>
        <pre><code>else if (reportName == "MyNewReport")
&#123;
    report.Parameters["my_param"].Value = parameters["myParam"];
    report.Parameters["license_id"].Value = currentLicenseId;
    report.Parameters["print_by"].Value = userName;
    report.Parameters["print_on"].Value = DateTime.Now;
&#125;</code></pre>

        <h3>Frontend</h3>
        <p><strong>1. Create a report viewer component</strong> (or reuse <code>SsbReportViewerComponent</code> as a template):</p>
        <pre><code>ng generate component pages/systematic/modules/my-module/my-report-viewer</code></pre>

        <p><strong>2. Build the reportUrl</strong> in <code>ngOnInit</code>:</p>
        <pre><code>const licenseId = localStorage.getItem('reportLicenseId');
const userId    = localStorage.getItem('reportUserId');
this.reportUrl = 'MyNewReport?myParam=' + params['myParam']
  + '&amp;licenseId=' + licenseId
  + '&amp;userId=' + userId;</code></pre>

        <p><strong>3. Configure ajaxSetup</strong> to inject the Bearer token (copy from existing viewer components).</p>

        <p><strong>4. Add dx-report-viewer</strong> to the template with <code>[invokeAction]="'Report'"</code> and <code>[host]="hostUrl"</code>.</p>

        <p><strong>5. Before navigating</strong> to the report route, set localStorage auth keys:</p>
        <pre><code>localStorage.setItem('reportLicenseId', this.myCommon.getLicenseId());
localStorage.setItem('reportUserId', this.myCommon.getUserId());
this.router.navigate(['/my-module/my-report'], &#123; queryParams: &#123; myParam: value &#125; &#125;);</code></pre>
      </section>

      <!-- Report Designer -->
      <section class="card">
        <h2>8. Report Designer (Admin/Dev Use)</h2>
        <p>The <code>ReportDesignerComponent</code> provides a full visual report designer UI. It is intended for internal developer use only.</p>
        <table>
          <thead><tr><th>Setting</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td><code>getDesignerModelAction</code></td><td><code>DXXRD/GetDesignerModel</code></td></tr>
            <tr><td><code>hostUrl</code></td><td><code>http://localhost:5100/</code> (hardcoded, dev only)</td></tr>
            <tr><td>Default report</td><td><code>TestReport</code></td></tr>
          </tbody>
        </table>
        <p>The designer hides the "New Report" and "Open Report" toolbar actions by default (<code>CustomizeMenuActions</code>). Saved reports are written to the <code>Reports/</code> directory on the server as <code>.resx</code> files.</p>
      </section>

      <!-- Key Files Summary -->
      <section class="card">
        <h2>9. Key Files Summary</h2>
        <table>
          <thead><tr><th>File</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>SmartHR_API/Services/CustomReportStorageWebExtension.cs</code></td><td>Core: report loading, auth resolution, parameter injection, dynamic report builder</td></tr>
            <tr><td><code>SmartHR_API/APIs/Reporting/ReportingControllers.cs</code></td><td>Three DevExpress MVC controllers (Viewer, Designer, QueryBuilder)</td></tr>
            <tr><td><code>SmartHR_API/APIs/Reporting/*.cs</code></td><td>Individual XtraReport class definitions</td></tr>
            <tr><td><code>SmartHR_API/Program.cs</code></td><td>Service registration and middleware setup</td></tr>
            <tr><td><code>SmartHR_UI/.../bi-module/report-viewer/</code></td><td>Generic BI module report viewer</td></tr>
            <tr><td><code>SmartHR_UI/.../bi-module/report-designer/</code></td><td>Report designer component</td></tr>
            <tr><td><code>SmartHR_UI/.../employee-module/.../employee-detail-report/</code></td><td>Employee detail report viewer</td></tr>
            <tr><td><code>SmartHR_UI/.../payroll-module/.../ssb-report-viewer/</code></td><td>SSB report viewer</td></tr>
            <tr><td><code>SmartHR_UI/.../payroll-module/.../ssb-summary-report-viewer/</code></td><td>SSB summary report viewer</td></tr>
            <tr><td><code>SmartHR_UI/.../payroll-module/.../salary-summary-report-viewer/</code></td><td>Salary summary report viewer</td></tr>
            <tr><td><code>SmartHR_UI/.../payroll-module/.../tax-certificate-report-viewer/</code></td><td>Tax certificate report viewer</td></tr>
            <tr><td><code>SmartHR_UI/.../payroll-module/.../wanga16-report/</code></td><td>WaNga16 report viewer</td></tr>
            <tr><td><code>SmartHR_UI/.../employee-module/.../recommendation-letter-report-viewer/</code></td><td>Recommendation letter report viewer</td></tr>
            <tr><td><code>SmartHR_API/Reports/</code></td><td>Saved .repx / .resx report layout files</td></tr>
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
export class ReportViewerComponent {}
