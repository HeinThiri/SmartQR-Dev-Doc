import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-learning-module',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-hr" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart HR
      </a>
      <h1>Learning Module - Course Management</h1>
      <p class="subtitle">Course Management feature enabling administrators to create, manage, and organize training courses with chapters and lessons.</p>
      <div class="doc-status"><i class="bi bi-check-circle-fill"></i> Completed</div>

      <!-- Overview -->
      <section class="card">
        <h2>Overview</h2>
        <p>The Course Management feature is part of the Learning Module, enabling administrators to create, manage, and organize training courses with chapters and lessons.</p>
        <h3>URL &amp; Program Code</h3>
        <ul>
          <li><strong>UI URL</strong>: <code>learning-module/courses</code></li>
          <li><strong>Program Code</strong>: <code>PGM-Course</code></li>
        </ul>
      </section>

      <!-- Database Tables -->
      <section class="card">
        <h2>Database Tables</h2>
        <table>
          <thead><tr><th>Table</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>LP_Course</code></td><td>Table</td><td>Main course records with identity column <code>courseId</code></td></tr>
            <tr><td><code>LP_CourseView</code></td><td>View</td><td>Course list with <code>createdByCode</code> and <code>modifiedByCode</code> from SysUser joins</td></tr>
            <tr><td><code>LP_CourseChapter</code></td><td>Table</td><td>Course chapters with <code>chapterId</code> identity, linked to <code>courseId</code></td></tr>
            <tr><td><code>LP_CourseChapterLesson</code></td><td>Table</td><td>Lessons within chapters with <code>lessonId</code> identity, linked to <code>chapterId</code></td></tr>
            <tr><td><code>LP_CourseChapterLessonView</code></td><td>View</td><td>Lesson list with user code joins</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Course Data Model -->
      <section class="card">
        <h2>Course Data Model</h2>
        <div class="er-diagram">
          <div class="er-table">
            <div class="er-header">Course</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> courseId (int, identity)</div>
            <div class="er-row">courseTitle, category, level, language, status</div>
            <div class="er-row">teacherId, tags, duration, totalLessons</div>
            <div class="er-row">price, originalPrice, currency</div>
            <div class="er-row">coverImageUrl, previewVideoUrl</div>
            <div class="er-row">whatYouLearn, description</div>
            <div class="er-row">audit fields (createdBy, createdOn, modifiedBy, modifiedOn, active)</div>
          </div>
          <div class="er-relation">
            <div class="er-line">1 &mdash;&mdash; *</div>
          </div>
          <div class="er-table">
            <div class="er-header">CourseChapter</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> chapterId (int, identity)</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> courseId</div>
            <div class="er-row">title, chapterOrder, description</div>
          </div>
          <div class="er-relation">
            <div class="er-line">1 &mdash;&mdash; *</div>
          </div>
          <div class="er-table">
            <div class="er-header">CourseChapterLesson</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> lessonId (int, identity)</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> chapterId</div>
            <div class="er-row">title, lessonType, lessonUrl</div>
            <div class="er-row">articleContent, duration, lessonOrder</div>
            <div class="er-row">isFreePreview, active</div>
          </div>
        </div>
      </section>

      <!-- Backend Architecture -->
      <section class="card">
        <h2>Backend Architecture</h2>
        <h3>Files</h3>
        <table>
          <thead><tr><th>File</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>SmartHR_API/DBModels/SmartHRPro/LpCourse.cs</code></td><td>EF Core model for LP_Course</td></tr>
            <tr><td><code>SmartHR_API/DBModels/SmartHRPro/LpCourseView.cs</code></td><td>EF Core model for LP_CourseView</td></tr>
            <tr><td><code>SmartHR_API/DBModels/SmartHRPro/LpCourseChapter.cs</code></td><td>EF Core model for LP_CourseChapter</td></tr>
            <tr><td><code>SmartHR_API/DBModels/SmartHRPro/LpCourseChapterLesson.cs</code></td><td>EF Core model for LP_CourseChapterLesson</td></tr>
            <tr><td><code>SmartHR_API/DBModels/SmartHRPro/LpCourseChapterLessonView.cs</code></td><td>EF Core model for LP_CourseChapterLessonView</td></tr>
            <tr><td><code>SmartHR_API/DTO/Learning_Module/CourseDTO.cs</code></td><td>DTOs: CourseDTO, CourseChapterDTO, CourseChapterLessonDTO</td></tr>
            <tr><td><code>SmartHR_API/Infrastructure/Repository/Learning_Module/CourseController.cs</code></td><td>Repository with ICourseController interface</td></tr>
            <tr><td><code>SmartHR_API/APIs/Learning_Module/CourseApi.cs</code></td><td>Thin API controller</td></tr>
          </tbody>
        </table>
      </section>

      <!-- API Endpoints -->
      <section class="card">
        <h2>API Endpoints</h2>
        <table>
          <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>GET</td><td><code>/api/CourseApi/GetAll?keyword=</code></td><td>List courses (filtered by LicenseId, Active, keyword)</td></tr>
            <tr><td>GET</td><td><code>/api/CourseApi/GetDetail?id=</code></td><td>Get course with chapters and lessons</td></tr>
            <tr><td>POST</td><td><code>/api/CourseApi/Save</code></td><td>Create or update course (with nested chapters/lessons)</td></tr>
            <tr><td>DELETE</td><td><code>/api/CourseApi/Delete?id=</code></td><td>Soft delete course (cascades to lessons)</td></tr>
          </tbody>
        </table>
      </section>

      <!-- Key Business Logic -->
      <section class="card">
        <h2>Key Business Logic</h2>
        <ul>
          <li><strong>Multi-tenancy</strong>: Courses are filtered by <code>LicenseId</code> from JWT token</li>
          <li><strong>Soft deletes</strong>: Uses <code>Active</code> boolean flag (not physical deletes)</li>
          <li><strong>Duplicate check</strong>: Course title uniqueness is enforced per license</li>
          <li><strong>Nested CRUD</strong>: Save operation handles chapter/lesson create, update, and delete within a single transaction</li>
          <li><strong>Permission</strong>: Uses <code>ProgramCodes.permission_Course</code> (<code>PGM-Course</code>)</li>
        </ul>
      </section>

      <!-- Frontend Architecture -->
      <section class="card">
        <h2>Frontend Architecture</h2>
        <h3>Files</h3>
        <table>
          <thead><tr><th>File</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>SmartHR_UI/src/app/services/learning-module/course.service.ts</code></td><td>Angular HTTP service</td></tr>
            <tr><td><code>SmartHR_UI/src/app/dto/learning/course-dto.ts</code></td><td>TypeScript DTOs</td></tr>
            <tr><td><code>courses/course-list/</code></td><td>List component (ts, html, scss)</td></tr>
            <tr><td><code>courses/course-detail/</code></td><td>Detail component (ts, html, scss)</td></tr>
          </tbody>
        </table>

        <h3>Module &amp; Routing</h3>
        <table>
          <thead><tr><th>File</th><th>Change</th></tr></thead>
          <tbody>
            <tr><td><code>learning.module.ts</code></td><td>Declares CourseListComponent, CourseDetailComponent; imports DevExtreme, TabsModule, KeyboardShortcutsModule</td></tr>
            <tr><td><code>learning-routing.module.ts</code></td><td>Route: <code>&#123; path: 'courses', component: CourseListComponent &#125;</code></td></tr>
            <tr><td><code>pages-routing.module.ts</code></td><td>Route: <code>&#123; path: 'learning-module', loadChildren: ... LearningModule &#125;</code></td></tr>
          </tbody>
        </table>
      </section>

      <!-- UI Features -->
      <section class="card">
        <h2>UI Features</h2>
        <ul>
          <li><strong>List View</strong>: DxDataGrid with search, column chooser, grouping, Excel export, status badges</li>
          <li><strong>Detail View</strong>: Reactive form with course info fields, nested chapter/lesson management (add/remove), status dropdown, save/delete with confirmation</li>
          <li><strong>Tab System</strong>: Uses <code>DataTabListService</code> for multi-tab detail views (same as penalty module)</li>
          <li><strong>Keyboard Shortcuts</strong>: Ctrl+S (save), Ctrl+F (refresh), Ctrl+D (add new), Ctrl+B/Esc (back to list)</li>
          <li><strong>Empty State</strong>: Shows when no courses exist with "Add Course" button</li>
        </ul>
      </section>

      <!-- Registration -->
      <section class="card">
        <h2>Registration</h2>
        <table>
          <thead><tr><th>File</th><th>Registration</th></tr></thead>
          <tbody>
            <tr><td><code>ServiceRegistration.cs</code></td><td><code>services.AddTransient&lt;ICourseController, CourseController&gt;()</code></td></tr>
            <tr><td><code>ProgramCodes.cs</code></td><td><code>public const string permission_Course = "PGM-Course"</code></td></tr>
            <tr><td><code>SmartHRContext.cs</code></td><td>DbSet properties and entity configurations for all LP tables/views</td></tr>
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
export class LearningModuleComponent {}
