import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vimeo-integration',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/common-features" class="back-link">
        <i class="bi bi-arrow-left"></i> Common Features
      </a>
      <h1>Vimeo Video Upload Integration</h1>
      <p class="subtitle">TUS resumable upload to Vimeo with automatic folder organization, re-upload with old video deletion, and a reusable Angular upload component.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>Videos are uploaded to Vimeo via the <strong>TUS resumable upload protocol</strong>. The application stores the Vimeo video URL in the <code>LP_Video</code> table and uses embed links for playback.</p>
        <h3>Upload Flow Summary</h3>
        <ol>
          <li>User selects a video file</li>
          <li>Backend calls the Vimeo API to create an upload ticket and receives a <strong>TUS upload link</strong></li>
          <li>Frontend uploads the file <strong>directly to Vimeo</strong> using <code>tus-js-client</code></li>
          <li>On completion, video metadata is saved in <code>LP_Video</code></li>
          <li>Optionally, a custom thumbnail is set via a separate API call</li>
        </ol>
        <p>If the record already has an existing video (<code>oldVideoId</code>), the old video is <strong>automatically deleted</strong> from Vimeo before the new upload link is created.</p>
      </section>

      <!-- Database Diagram -->
      <section class="card">
        <h2>Database Diagram</h2>
        <div class="er-diagram">
          <div class="er-layer">
            <div class="er-label">Video Storage Tables</div>
            <div class="er-row">
              <div class="er-table er-primary">
                <div class="er-title"><i class="bi bi-table"></i> LP_Video</div>
                <div class="er-field"><span class="er-key">PK</span> RecordId <span class="er-type">nvarchar(50)</span></div>
                <div class="er-field"><span class="er-key">PK</span> RecordType <span class="er-type">nvarchar(50)</span></div>
                <div class="er-field">VideoLink <span class="er-type">nvarchar(500)</span></div>
                <div class="er-field">VideoId <span class="er-type">nvarchar(50)</span></div>
                <div class="er-field">Title <span class="er-type">nvarchar(200)</span></div>
                <div class="er-field">Size <span class="er-type">decimal</span></div>
                <div class="er-field">UploadOn <span class="er-type">datetime</span></div>
                <div class="er-field">LicenseId <span class="er-type">varchar(50)</span></div>
              </div>
              <div class="er-connector"><div class="er-line"></div> joins <div class="er-line"></div></div>
              <div class="er-table er-runtime">
                <div class="er-title"><i class="bi bi-table"></i> LP_CourseView</div>
                <div class="er-field">VideoLink</div>
                <div class="er-field">VideoTitle</div>
                <div class="er-field">VideoSize</div>
                <div class="er-field">VideoUploadOn</div>
              </div>
            </div>
            <div class="er-row" style="margin-top: 12px;">
              <div class="er-table er-small">
                <div class="er-title"><i class="bi bi-table"></i> LP_CourseChapterLesson</div>
                <div class="er-field">LessonUrl <span class="er-type">stores embed URL</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Upload Flow Diagram -->
      <section class="card">
        <h2>Upload Flow Diagram</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-film"></i> User Selects File</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-send"></i> POST<small>/CreateUploadLink</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-trash"></i> If oldVideoId<small>delete old video</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-cloud-arrow-up"></i> Backend Calls<small>Vimeo API</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-link-45deg"></i> TUS Upload Link<small>returned</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-upload"></i> Frontend Uploads<small>tus-js-client</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-floppy"></i> POST<small>/SaveVideo</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-database-check"></i> LP_Video Saved</div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-image"></i> (Optional) POST<small>/SetThumbnail</small></div>
          </div>
        </div>
      </section>

      <!-- Prerequisites -->
      <section class="card">
        <h2>Prerequisites</h2>
        <h3>1. Vimeo Account</h3>
        <p>A <strong>Vimeo Plus</strong> or <strong>Business</strong> account is required to use the upload API.</p>
        <h3>2. Developer App</h3>
        <p>Create a developer app at <code>developer.vimeo.com/apps</code>.</p>
        <h3>3. Access Token</h3>
        <p>Generate a personal access token with the following scopes:</p>
        <ul>
          <li><code>public</code></li>
          <li><code>private</code></li>
          <li><code>upload</code></li>
          <li><code>edit</code></li>
          <li><code>delete</code></li>
        </ul>
        <h3>4. appsettings.json Configuration</h3>
        <pre><code>&#123;
  "VimeoSettings": &#123;
    "AccessToken": "your_vimeo_access_token",
    "AllowedDomain": "*.yourdomain.com",
    "ParentFolderName": "LearningPortal"
  &#125;
&#125;</code></pre>
      </section>

      <!-- API Endpoints -->
      <section class="card">
        <h2>API Endpoints</h2>
        <table>
          <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
          <tbody>
            <tr>
              <td><span class="method-post">POST</span></td>
              <td><code>/VimeoApi/CreateUploadLink</code></td>
              <td>Creates a TUS upload link. If <code>oldVideoId</code> is provided, the old video is auto-deleted from Vimeo first.</td>
            </tr>
            <tr>
              <td><span class="method-post">POST</span></td>
              <td><code>/VimeoApi/SaveVideo</code></td>
              <td>Saves video metadata (link, title, size) to <code>LP_Video</code> table.</td>
            </tr>
            <tr>
              <td><span class="method-post">POST</span></td>
              <td><code>/VimeoApi/SetThumbnail</code></td>
              <td>Sets a custom thumbnail image for the video. Accepts <code>multipart/form-data</code>.</td>
            </tr>
          </tbody>
        </table>

        <h3>CreateUploadLink &mdash; Request</h3>
        <pre><code>&#123;
  "fileName": "course_intro.mp4",
  "fileSize": 52428800,
  "title": "Course Introduction",
  "licenseId": "LIC001",
  "oldVideoId": "/videos/123456789"
&#125;</code></pre>

        <h3>CreateUploadLink &mdash; Response</h3>
        <pre><code>&#123;
  "uploadLink": "https://asia-files.tus.vimeo.com/uploads/...",
  "videoUri": "/videos/987654321",
  "videoLink": "https://player.vimeo.com/video/987654321"
&#125;</code></pre>

        <h3>SaveVideo &mdash; Request</h3>
        <pre><code>&#123;
  "recordId": "COURSE001",
  "recordType": "CoursePreview",
  "videoLink": "https://player.vimeo.com/video/987654321",
  "videoId": "/videos/987654321",
  "title": "Course Introduction",
  "size": 52428800,
  "licenseId": "LIC001"
&#125;</code></pre>

        <h3>SaveVideo &mdash; Response</h3>
        <pre><code>&#123;
  "success": true,
  "message": "Video saved successfully"
&#125;</code></pre>
      </section>

      <!-- C# DTOs -->
      <section class="card">
        <h2>C# DTOs</h2>

        <h3>VimeoUploadRequestDTO</h3>
        <pre><code>public class VimeoUploadRequestDTO
&#123;
    public string FileName &#123; get; set; &#125;
    public long FileSize &#123; get; set; &#125;
    public string Title &#123; get; set; &#125;
    public string LicenseId &#123; get; set; &#125;
    public string? OldVideoId &#123; get; set; &#125;
&#125;</code></pre>

        <h3>VimeoUploadLinkDTO</h3>
        <pre><code>public class VimeoUploadLinkDTO
&#123;
    public string UploadLink &#123; get; set; &#125;
    public string VideoUri &#123; get; set; &#125;
    public string VideoLink &#123; get; set; &#125;
&#125;</code></pre>

        <h3>VimeoSaveVideoDTO</h3>
        <pre><code>public class VimeoSaveVideoDTO
&#123;
    public string RecordId &#123; get; set; &#125;
    public string RecordType &#123; get; set; &#125;
    public string VideoLink &#123; get; set; &#125;
    public string VideoId &#123; get; set; &#125;
    public string Title &#123; get; set; &#125;
    public decimal Size &#123; get; set; &#125;
    public string LicenseId &#123; get; set; &#125;
&#125;</code></pre>
      </section>

      <!-- Folder Organization -->
      <section class="card">
        <h2>Folder Organization</h2>
        <p>Uploaded videos are organized in Vimeo folders using the following structure:</p>
        <pre><code>LearningPortal/
  &#123;licenseId&#125;/
    uploaded video</code></pre>
        <p>The <code>GetOrCreateFolderAsync</code> method handles folder creation:</p>
        <ul>
          <li>Checks if the parent folder (<code>LearningPortal</code>) exists; creates it if not</li>
          <li>Checks if the license-specific subfolder exists; creates it if not</li>
          <li>Returns the folder URI for the upload request</li>
        </ul>
      </section>

      <!-- File Structure -->
      <section class="card">
        <h2>File Structure</h2>
        <h3>Backend</h3>
        <table>
          <thead><tr><th>File</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>VimeoApi.cs</code></td><td>Service class with Vimeo API integration logic (create link, save video, delete, thumbnail, folder management)</td></tr>
            <tr><td><code>VimeoController.cs</code></td><td>API controller exposing CreateUploadLink, SaveVideo, SetThumbnail endpoints</td></tr>
            <tr><td><code>ServiceRegistration.cs</code></td><td>Registers VimeoApi service and binds VimeoSettings configuration</td></tr>
            <tr><td><code>appsettings.json</code></td><td>Contains VimeoSettings section (AccessToken, AllowedDomain, ParentFolderName)</td></tr>
          </tbody>
        </table>
        <h3>Frontend</h3>
        <table>
          <thead><tr><th>File</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>vimeo.service.ts</code></td><td>Angular service wrapping API calls (createUploadLink, saveVideo, setThumbnail)</td></tr>
            <tr><td><code>vimeo-upload.component.ts</code></td><td>Reusable upload component logic (file selection, TUS upload, progress tracking)</td></tr>
            <tr><td><code>vimeo-upload.component.html</code></td><td>Upload UI template (file input, progress bar, status display)</td></tr>
            <tr><td><code>vimeo-upload.component.scss</code></td><td>Component styles</td></tr>
            <tr><td><code>ui.module.ts</code></td><td>Module declaring and exporting the vimeo-upload component</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Reusable Component -->
      <section class="card">
        <h2>Reusable Component</h2>
        <p>The <code>&lt;app-vimeo-upload&gt;</code> component provides a drop-in video upload widget with progress tracking and re-upload support.</p>

        <h3>Inputs</h3>
        <table>
          <thead><tr><th>Input</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>videoUrl</code></td><td>string</td><td>''</td><td>Current video URL (shows preview if set)</td></tr>
            <tr><td><code>label</code></td><td>string</td><td>'Upload Video'</td><td>Label text for the upload area</td></tr>
            <tr><td><code>disabled</code></td><td>boolean</td><td>false</td><td>Disables the upload control</td></tr>
            <tr><td><code>recordId</code></td><td>string</td><td>—</td><td>Record identifier for LP_Video</td></tr>
            <tr><td><code>recordType</code></td><td>string</td><td>—</td><td>Record type for LP_Video</td></tr>
            <tr><td><code>videoName</code></td><td>string</td><td>''</td><td>Display name for the current video</td></tr>
            <tr><td><code>thumbnailFile</code></td><td>File</td><td>null</td><td>Optional thumbnail image file</td></tr>
            <tr><td><code>initialTitle</code></td><td>string</td><td>''</td><td>Default title for the video on Vimeo</td></tr>
          </tbody>
        </table>

        <h3>Outputs</h3>
        <table>
          <thead><tr><th>Output</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>videoUploaded</code></td><td>EventEmitter</td><td>Emits the saved video metadata when upload and save complete</td></tr>
          </tbody>
        </table>

        <h3>Component States</h3>
        <table>
          <thead><tr><th>State</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><strong>idle</strong></td><td>No upload in progress. Shows file picker or current video preview.</td></tr>
            <tr><td><strong>uploading</strong></td><td>TUS upload in progress. Shows progress bar with percentage.</td></tr>
            <tr><td><strong>done</strong></td><td>Upload and save complete. Shows success message with video link.</td></tr>
            <tr><td><strong>error</strong></td><td>Upload failed. Shows error message with retry option.</td></tr>
          </tbody>
        </table>

        <h3>Re-upload Behavior</h3>
        <p>When a user re-uploads a video for a record that already has one, the component automatically passes the existing <code>videoId</code> as <code>oldVideoId</code> in the <code>CreateUploadLink</code> request. The backend deletes the old video from Vimeo before creating the new upload link.</p>
      </section>

      <!-- Integration Examples -->
      <section class="card">
        <h2>Integration Examples</h2>

        <h3>Course Preview Video</h3>
        <h4>HTML</h4>
        <pre><code>&lt;app-vimeo-upload
  [videoUrl]="course.previewVideoUrl"
  [recordId]="course.courseId"
  recordType="CoursePreview"
  [initialTitle]="course.courseName + ' - Preview'"
  [disabled]="!isEditing"
  (videoUploaded)="onPreviewVideoUploaded($event)"&gt;
&lt;/app-vimeo-upload&gt;</code></pre>

        <h4>TypeScript</h4>
        <pre><code>onPreviewVideoUploaded(video: any): void &#123;
  this.course.previewVideoUrl = video.videoLink;
  this.course.previewVideoName = video.title;
  // Save course to persist the video reference
  this.saveCourse();
&#125;</code></pre>

        <h3>Lesson Video</h3>
        <h4>HTML</h4>
        <pre><code>&lt;app-vimeo-upload
  [videoUrl]="lesson.lessonUrl"
  [recordId]="lesson.lessonId"
  recordType="Lesson"
  [videoName]="lesson.videoName"
  [initialTitle]="lesson.lessonTitle"
  [thumbnailFile]="lesson.thumbnailFile"
  (videoUploaded)="onLessonVideoUploaded($event)"&gt;
&lt;/app-vimeo-upload&gt;</code></pre>

        <h4>TypeScript</h4>
        <pre><code>onLessonVideoUploaded(video: any): void &#123;
  this.lesson.lessonUrl = video.videoLink;
  this.lesson.videoName = video.title;
  this.lesson.videoSize = video.size;
  // Refresh lesson data
  this.loadLesson();
&#125;</code></pre>
      </section>

      <!-- Security Notes -->
      <section class="card">
        <h2>Security Notes</h2>
        <ul>
          <li><strong>Token is backend-only</strong> &mdash; The Vimeo access token is never exposed to the frontend. All API calls that require the token go through the backend.</li>
          <li><strong>JWT authentication</strong> &mdash; All VimeoController endpoints require a valid JWT token. Unauthenticated requests are rejected.</li>
          <li><strong>TUS direct upload</strong> &mdash; The frontend uploads directly to Vimeo's TUS endpoint, so video file data does not pass through the application server.</li>
          <li><strong>Videos set to view:disable</strong> &mdash; Uploaded videos have their privacy set to <code>view:disable</code> so they are only accessible via embed on the allowed domain.</li>
          <li><strong>Required scopes</strong> &mdash; The access token must have <code>public</code>, <code>private</code>, <code>upload</code>, <code>edit</code>, and <code>delete</code> scopes. Do not grant broader permissions than necessary.</li>
        </ul>
      </section>

      <!-- Troubleshooting -->
      <section class="card">
        <h2>Troubleshooting</h2>
        <table>
          <thead><tr><th>Error</th><th>Cause</th><th>Fix</th></tr></thead>
          <tbody>
            <tr>
              <td><code>403 Forbidden</code> on CreateUploadLink</td>
              <td>Access token missing or invalid</td>
              <td>Verify <code>VimeoSettings:AccessToken</code> in appsettings.json and ensure it has <code>upload</code> scope</td>
            </tr>
            <tr>
              <td><code>429 Too Many Requests</code></td>
              <td>Vimeo API rate limit exceeded</td>
              <td>Implement retry with exponential backoff or reduce upload frequency</td>
            </tr>
            <tr>
              <td>TUS upload stalls or fails</td>
              <td>Network interruption during upload</td>
              <td>tus-js-client auto-resumes; check browser console for retry logs. Ensure chunk size is reasonable.</td>
            </tr>
            <tr>
              <td>Video not playable after upload</td>
              <td>Vimeo is still transcoding</td>
              <td>Videos take time to transcode. Check Vimeo dashboard for status. Playback is available after transcoding completes.</td>
            </tr>
            <tr>
              <td>Embed blocked on domain</td>
              <td><code>AllowedDomain</code> mismatch</td>
              <td>Update <code>VimeoSettings:AllowedDomain</code> to match the domain where videos are embedded</td>
            </tr>
            <tr>
              <td>Old video not deleted on re-upload</td>
              <td><code>oldVideoId</code> not passed or invalid</td>
              <td>Ensure the component passes the existing <code>videoId</code> when re-uploading. Check backend logs for delete API errors.</td>
            </tr>
            <tr>
              <td>Thumbnail not updating</td>
              <td>Image format or size issue</td>
              <td>Vimeo accepts JPG/PNG thumbnails. Ensure the file is under 10MB and is a valid image format.</td>
            </tr>
            <tr>
              <td>Folder not created in Vimeo</td>
              <td>Token lacks <code>edit</code> scope</td>
              <td>Ensure the access token has the <code>edit</code> scope for folder creation operations</td>
            </tr>
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

    .method-post {
      background: #fff3e0; color: #e65100; padding: 2px 8px;
      border-radius: 4px; font-size: 12px; font-weight: 700;
    }
    .method-get {
      background: #e8f5e9; color: #2e7d32; padding: 2px 8px;
      border-radius: 4px; font-size: 12px; font-weight: 700;
    }

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
    .er-type {
      color: #999; font-size: 11px; margin-left: 4px;
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
export class VimeoIntegrationComponent {}
