import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-multi-product-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/common-features" class="back-link">
        <i class="bi bi-arrow-left"></i> Common Features
      </a>
      <h1>Multi-Product Branding</h1>
      <p class="subtitle">Support multiple product brands (Smart HR, Smart LMS, etc.) from a single codebase. Switch products at runtime — no rebuild required.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- How It Works -->
      <section class="card">
        <h2>How It Works</h2>
        <div class="flow">
          <div class="flow-step">
            <div class="flow-num">1</div>
            <div>
              <strong>assets/appsettings.json</strong>
              <p>Set <code>"projectName"</code> here (runtime, no rebuild)</p>
            </div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">2</div>
            <div>
              <strong>ConfigService.loadConfig()</strong>
              <p>Runs at app startup, merges into environment</p>
            </div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">3</div>
            <div>
              <strong>BrandingService.getBranding()</strong>
              <p>Reads <code>environment.projectName</code>, returns matching config</p>
            </div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">4</div>
            <div>
              <strong>BrandingConfigMap</strong>
              <p><code>smarthr</code> → SmartHRBrandingConfig &nbsp;|&nbsp; <code>smartlms</code> → SmartLMSBrandingConfig</p>
            </div>
          </div>
          <div class="flow-arrow"><i class="bi bi-arrow-down"></i></div>
          <div class="flow-step">
            <div class="flow-num">5</div>
            <div>
              <strong>Auth pages, layout, topbar</strong>
              <p>All consume <code>ProjectBranding</code> via BrandingService</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Switching Products -->
      <section class="card">
        <h2>Switching Products (No Rebuild)</h2>
        <p>Edit <code>SmartHR_UI/src/assets/appsettings.json</code>:</p>
        <pre><code>&#123;
  "baseApiUrl": "https://your-api-url.com",
  "baseAdminUrl": "https://your-app-url.com",
  "projectName": "smarthr"
&#125;</code></pre>
        <table>
          <thead><tr><th>Value</th><th>Product</th></tr></thead>
          <tbody>
            <tr><td><code>smarthr</code></td><td>Smart HR</td></tr>
            <tr><td><code>smartlms</code></td><td>Smart LMS</td></tr>
          </tbody>
        </table>
        <p>Save the file and <strong>refresh the browser</strong>. No build step needed.</p>
      </section>

      <!-- Adding a New Product Brand -->
      <section class="card">
        <h2>Adding a New Product Brand</h2>

        <h3>Step 1: Define branding config in branding.service.ts</h3>
        <pre><code>export const SmartNewProductBrandingConfig: ProjectBranding = &#123;
  projectName: 'Smart New Product',
  pageTitle: 'Smart New Product',
  logoPath: 'assets/images/SmartNewProductLogo.png',
  sidebarLogoPath: 'assets/icons/sidebar/SmartNewProductLogo.png',
  loginBgImagePath: '',
  promoTitle: 'New to Smart New Product?',
  promotionalTexts: [
    'Feature One Headline',
    'Feature Two Headline',
  ],
  postLoginRedirect: '/your-module/dashboard',
  onboardingRedirect: '/your-module/dashboard',
  registerImagePath: 'assets/images/your-register-image.png',
  loadingLogoPath: 'assets/images/your-loading-logo.svg',
  showSystemUsageBtn: false,
  faviconPath: 'assets/icons/your-favicon.png',
  sliderSlides: [
    &#123;
      title: 'Welcome to Smart New Product',
      description: 'Brief description of this slide.',
      imagePath: 'assets/images/your-slide-image.png',
    &#125;,
  ],
&#125;;</code></pre>

        <h3>Step 2: Register in BrandingConfigMap (one line)</h3>
        <pre><code>const BrandingConfigMap: Record&lt;string, ProjectBranding&gt; = &#123;
  smarthr:        SmartHRBrandingConfig,
  smartlms:       SmartLMSBrandingConfig,
  snewproduct:    SmartNewProductBrandingConfig,  // ← add here only
&#125;;</code></pre>

        <h3>Step 3: Set projectName in appsettings.json</h3>
        <pre><code>&#123; "projectName": "snewproduct" &#125;</code></pre>

        <h3>Step 4: Add assets</h3>
        <p>Add logo/image files to <code>SmartHR_UI/src/assets/</code>. No other code changes needed.</p>
      </section>

      <!-- ProjectBranding Interface -->
      <section class="card">
        <h2>ProjectBranding Interface</h2>
        <p>Defined in <code>SmartHR_UI/src/app/services/branding.service.ts</code>:</p>
        <pre><code>export interface SliderSlide &#123;
  title: string;       // heading shown above the slide image
  description: string; // subtitle text
  imagePath: string;   // asset path; empty = placeholder icon
&#125;

export interface ProjectBranding &#123;
  projectName: string;         // display name e.g. "Smart HR"
  pageTitle: string;           // browser tab title
  logoPath: string;            // logo on auth pages
  sidebarLogoPath: string;     // logo in sidebar header
  loginBgImagePath: string;    // decorative bg SVG on login (empty = none)
  promoTitle: string;          // "New to Smart HR?" panel heading
  promotionalTexts: string[];  // typewriter rotating texts
  postLoginRedirect: string;   // route after login (showLoginInfo = false)
  onboardingRedirect: string;  // route after login (showLoginInfo = true)
  sliderSlides: SliderSlide[]; // left-panel slider on login page
  registerImagePath: string;   // promo image on register page
  loadingLogoPath: string;     // full-page loading screen icon
  showSystemUsageBtn: boolean; // show credit balance btn in topbar
  faviconPath: string;         // browser tab favicon
&#125;</code></pre>
      </section>

      <!-- Files Modified -->
      <section class="card">
        <h2>Files Modified</h2>
        <table>
          <thead><tr><th>File</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>assets/appsettings.json</code></td><td>Runtime product selection (<code>projectName</code>)</td></tr>
            <tr><td><code>environments/environment.ts</code></td><td>Fallback default for <code>projectName</code></td></tr>
            <tr><td><code>environments/environment.prod.ts</code></td><td>Fallback default for <code>projectName</code></td></tr>
            <tr><td><code>services/branding.service.ts</code></td><td>Interface + all branding configs + service</td></tr>
            <tr><td><code>app.component.ts</code></td><td>Sets browser tab title and favicon on startup</td></tr>
            <tr><td><code>layouts/footer/</code></td><td>Dynamic product name in footer</td></tr>
            <tr><td><code>layouts/custom-sidebars/</code></td><td>Dynamic sidebar logo and post-login link</td></tr>
            <tr><td><code>layouts/horizontaltopbar/</code></td><td>Conditional system usage button</td></tr>
            <tr><td><code>shared/ui/full-page-loading/</code></td><td>Dynamic loading screen logo</td></tr>
            <tr><td><code>auth/login-v2/</code></td><td>Dynamic logo, bg image, promo, redirect</td></tr>
            <tr><td><code>auth/login-slider/</code></td><td>Generic data-driven slider</td></tr>
            <tr><td><code>auth/forget-password/</code></td><td>Dynamic logo</td></tr>
            <tr><td><code>auth/register/</code></td><td>Dynamic logo, promo title, register image</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Notes -->
      <section class="card">
        <h2>Notes</h2>
        <ul>
          <li>If <code>projectName</code> is missing or unrecognised, the app defaults to <code>SmartHRBrandingConfig</code>.</li>
          <li>Slide images with an empty <code>imagePath</code> show a placeholder icon automatically.</li>
          <li><code>BrandingService</code> is <code>providedIn: 'root'</code> and resolves once at startup — no runtime overhead.</li>
          <li>Adding a new brand requires <strong>only</strong> a new config object + one line in <code>BrandingConfigMap</code>. No template changes needed.</li>
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
    .card p { font-size: 14px; line-height: 1.7; color: #444; margin: 0 0 12px; }
    .card ul { padding-left: 22px; margin: 0 0 12px; font-size: 14px; color: #444; }
    .card li { margin-bottom: 6px; line-height: 1.6; }

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

    /* Flow diagram */
    .flow { display: flex; flex-direction: column; align-items: flex-start; gap: 0; }
    .flow-step {
      display: flex; align-items: flex-start; gap: 14px;
      background: #f8f9ff; border-radius: 10px; padding: 14px 18px; width: 100%;
    }
    .flow-num {
      width: 28px; height: 28px; flex-shrink: 0;
      background: #6c8cff; color: #fff; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px;
    }
    .flow-step strong { font-size: 14px; display: block; margin-bottom: 2px; }
    .flow-step p { margin: 0; font-size: 13px; color: #666; }
    .flow-arrow { padding: 4px 0 4px 12px; color: #6c8cff; font-size: 16px; }
  `]
})
export class MultiProductBrandingComponent {}
