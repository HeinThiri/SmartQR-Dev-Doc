# Smart QR - Common Features Complete Guide

**Version**: 1.0  
**Last Updated**: 2026-04-27  
**Author**: Smart QR Team

---

## Table of Contents

1. [Overview](#overview)
2. [Home Page (Welcome)](#home-page-welcome)
3. [Advanced View](#advanced-view)
4. [Approval Workflow](#approval-workflow)
5. [Data Migration](#data-migration)
6. [Custom Field Dynamic Form](#custom-field-dynamic-form)
7. [Email Notification Service](#email-notification-service)
8. [Grid Export (PDF + Excel)](#grid-export-pdf--excel)
9. [Architecture Overview](#architecture-overview)
10. [Setup & Configuration](#setup--configuration)

---

## Overview

Smart QR implements **7 core common features** that are shared across Admin and Viewer modules. These features provide a solid foundation for enterprise QR code management with approval workflows, custom fields, email notifications, and comprehensive reporting.

### Features Summary

| Feature | Purpose | Key Technology |
|---------|---------|-----------------|
| **Home Page** | Developer landing experience | Angular Components |
| **Advanced View** | Grid state management with filtering | DevExtreme Grid |
| **Approval Workflow** | Multi-step approval engine | Workflow Tables + Email |
| **Data Migration** | Excel import with validation | ExcelJS + Validation |
| **Custom Fields** | Dynamic field system | CFD Framework |
| **Email Notification** | Centralized email service | AWS SES + Hangfire |
| **Grid Export** | PDF & Excel export | ExcelJS + jsPDF |

---

## Home Page (Welcome)

### Purpose

The Home Page is the **primary entry point** for users after login. It provides:
- Quick navigation to main modules
- Role-based start paths
- Domain and platform overview
- Available QR types at a glance

### Key Features

✅ **User Profile Display**
- Shows logged-in user info
- Current role and assigned domains
- Profile picture and contact info

✅ **Quick Navigation Tiles**
- Direct access to main modules
- Icons and descriptions
- Role-based visibility

✅ **Domain Overview**
- Available domains for user
- Domain-specific QR types
- Quick stats per domain

✅ **Platform Overview**
- System announcement/news
- Recent activities
- Quick start guides

### Implementation Details

**Frontend Components:**
```
Smart_QR_UI/src/app/pages/systematic/modules/common/
├── home/
│   ├── home.component.ts
│   ├── home.component.html
│   ├── home.component.scss
│   └── home.component.spec.ts
└── dashboard/
    ├── dashboard-widget.component.ts
    └── ...
```

**Backend Service:**
```
Smart_QR_API/APIs/System_Module/
├── SysUserApi.cs (Get user info)
├── SysDomainApi.cs (Get user domains)
└── SysMenuApi.cs (Get menu items)
```

### Database Tables

```sql
-- User Information
SysUser
├── UserID
├── UserName
├── Email
├── FullName
├── Role
└── Department

-- Domain Mapping
SysUserDomain
├── UserID
├── DomainID
├── AssignedDate
└── IsActive

-- QR Type Master
SysQRType
├── QRTypeID
├── QRTypeName
├── Description
└── Active
```

### Demo Scenario

#### Step 1: User Login
```
URL: http://localhost:4200/login
Input:
├── Username: manager@smartqr.com
└── Password: ••••••••

Backend Process:
├─ Validate credentials against SysUser
├─ Generate JWT token
└─ Return user info + assigned domains
```

#### Step 2: Home Page Loads
```
GET /api/sys/user/profile → Get current user info

Response JSON:
{
  "userId": "USR001",
  "userName": "manager",
  "email": "manager@smartqr.com",
  "fullName": "John Manager",
  "role": "QR Manager",
  "department": "Operations",
  "profilePicture": "https://...",
  "assignedDomains": [
    { "domainId": "DOM001", "domainName": "Shopping Mall A" },
    { "domainId": "DOM002", "domainName": "Shopping Mall B" }
  ]
}
```

#### Step 3: Dashboard Rendering
```
┌──────────────────────────────────────────────────────┐
│                    Smart QR Dashboard                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Welcome, John Manager! 👋                          │
│  Role: QR Manager | Department: Operations          │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  My Domains:                                        │
│  ┌──────────────┐    ┌──────────────┐              │
│  │ Shopping     │    │ Shopping     │              │
│  │ Mall A       │    │ Mall B       │              │
│  │ 45 QR Codes  │    │ 32 QR Codes  │              │
│  └──────────────┘    └──────────────┘              │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Quick Actions:                                     │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │ 📱 Create QR     │  │ 📊 View Reports  │        │
│  │ Code             │  │                  │        │
│  └──────────────────┘  └──────────────────┘        │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │ ✅ Approvals    │  │ 💳 Billing       │        │
│  │ (2 pending)     │  │                  │        │
│  └──────────────────┘  └──────────────────┘        │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Recent Activities:                                 │
│  • Mall QR 001 created by Admin (2 hours ago)      │
│  • Menu QR 005 activated (5 hours ago)             │
│  • Payment received: 5000 credits (yesterday)       │
│                                                      │
├──────────────────────────────────────────────────────┤
│  Available QR Types:                               │
│  • Mall QR (for mall mapping)                      │
│  • Menu QR (for restaurant menus)                  │
│  • Voucher QR (for promotional codes)              │
│  • Event QR (for event management)                 │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### API Endpoints

```typescript
// Get Current User Profile
GET /api/sys/user/profile
Response: UserProfileDto

// Get User's Assigned Domains
GET /api/sys/user/domains
Response: DomainDto[]

// Get Menu Items by Role
GET /api/sys/menu/get-by-role
Response: MenuItemDto[]

// Get Dashboard Statistics
GET /api/dashboard/statistics
Response: DashboardStatsDto
```

### Code Example - Component

```typescript
// home.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { DomainService } from '@app/services/domain.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: any;
  userDomains: any[] = [];
  dashboardStats: any;

  constructor(
    private userService: UserService,
    private domainService: DomainService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadDomains();
  }

  loadUserProfile(): void {
    this.userService.getCurrentProfile().subscribe(
      (data) => {
        this.currentUser = data;
      }
    );
  }

  loadDomains(): void {
    this.domainService.getUserDomains().subscribe(
      (data) => {
        this.userDomains = data;
      }
    );
  }
}
```

---

## Advanced View

### Purpose

Advanced View provides **reusable grid state management** for Admin lists with powerful filtering, sorting, grouping, and custom view persistence. Users can create and save multiple custom views with different column configurations and filter sets.

### Key Features

✅ **Dynamic Grid Filtering**
- Multi-column filtering with operators
- Text search, numeric comparison, date range
- AND/OR logic combinations
- Filter persistence

✅ **Sorting & Grouping**
- Multi-column sort
- Group by any field
- Nested grouping
- Custom sort order

✅ **Column Management**
- Show/hide columns
- Reorder columns
- Set column width
- Lock/freeze columns

✅ **Custom Views**
- Save grid configuration as named view
- Switch between saved views instantly
- Default view selection
- Share views across team

✅ **Smart Search**
- Global search across visible columns
- Advanced search with multiple criteria
- Saved search templates
- Quick filter chips

### Implementation Details

**Technology Stack:**
- **Grid Library**: DevExtreme Grid
- **State Storage**: Database (CfdEntityCustomView)
- **Custom Fields**: CFD Framework integration
- **Configuration**: SysCustomProgram

**Database Tables:**

```sql
-- Entity Definition
CfdEntity
├── EntityID (PK)
├── EntityName
├── EntityDisplayName
├── ModuleID
├── TableName
├── Active
└── CreatedOn

-- Custom View Configuration
CfdEntityCustomView
├── CustomViewID (PK)
├── EntityID (FK)
├── ViewName
├── ViewCode
├── UserID (FK)
├── GridConfig (JSON - Column settings)
├── FilterConfig (JSON - Filter settings)
├── SortConfig (JSON - Sort settings)
├── IsDefault
├── IsPublic
├── CreatedOn
└── ModifiedOn

-- Program/Module Definition
SysCustomProgram
├── CustomProgramID (PK)
├── ProgramName
├── ProgramCode
├── EntityID (FK)
├── ModuleID
├── DisplayOrder
└── Active

-- Field Mapping
SysCustomProgramField
├── ProgramFieldID (PK)
├── CustomProgramID (FK)
├── FieldName
├── DisplayName
├── FieldType
├── DisplayOrder
├── IsVisible
└── IsRequired
```

### Demo Scenario - QR Code List

#### Step 1: Initial Grid Display

```
URL: http://localhost:4200/admin/qr-management

GET /api/qr/list?pageSize=20&pageNumber=1
Response: Paginated QR List

┌──────────────────────────────────────────────────────┐
│        QR Code Management - Advanced View            │
├──────────────────────────────────────────────────────┤
│ [Create New] [Import] [Export] [View: Default ▼]    │
├──────────────────────────────────────────────────────┤
│                                                      │
│ QR Name  │ QR Type │ Status  │ Domain  │ Created    │
├──────────────────────────────────────────────────────┤
│ QR001    │ Mall    │ Active  │ Dom-A   │ 2026-01-15 │
│ QR002    │ Menu    │ Active  │ Dom-B   │ 2026-02-20 │
│ QR003    │ Voucher │ Draft   │ Dom-A   │ 2026-03-10 │
│ QR004    │ Event   │ Inactive│ Dom-C   │ 2026-04-05 │
│                                                      │
│ Showing 1-4 of 127 records        [< 1 2 3 ... >] │
└──────────────────────────────────────────────────────┘
```

#### Step 2: Apply Advanced Filter

**User Action**: Click "Add Filter"

```
Filter Configuration:
┌─────────────────────────────────────┐
│ Filter Rules:                       │
│                                     │
│ WHERE:                              │
│ ├─ QR Type = "Menu"                │
│ ├─ Status = "Active"               │
│ ├─ Created Date >= "2026-01-01"    │
│ └─ QR Name contains "QR00"         │
│                                     │
│ Logic: AND                          │
│ [Add Rule] [Clear] [Apply] [Save]  │
└─────────────────────────────────────┘
```

#### Step 3: Save Custom View

**User Action**: Click "Save View"

```
Save View Dialog:
┌─────────────────────────────────────┐
│ View Name: [Active Menu QRs]        │
│ View Code: [active_menu_qrs]        │
│ Set as Default: ☐                  │
│ Public (Share with Team): ☐        │
│                                     │
│ [Save] [Cancel]                    │
└─────────────────────────────────────┘

Saved Configuration in Database:
CfdEntityCustomView:
{
  "CustomViewID": "VIEW001",
  "ViewName": "Active Menu QRs",
  "EntityID": "ENT_QR",
  "GridConfig": {
    "columns": [
      { "dataField": "QRName", "visible": true, "width": 200 },
      { "dataField": "QRType", "visible": true, "width": 100 },
      { "dataField": "Status", "visible": true, "width": 100 },
      { "dataField": "Domain", "visible": false }
    ]
  },
  "FilterConfig": {
    "filters": [
      { "field": "QRType", "operator": "=", "value": "Menu" },
      { "field": "Status", "operator": "=", "value": "Active" },
      { "field": "CreatedDate", "operator": ">=", "value": "2026-01-01" }
    ],
    "logic": "AND"
  }
}
```

#### Step 4: Use Saved View

**User Action**: Select from View Dropdown

```
View Dropdown: [Default ▼]
├─ Default (Standard view)
├─ Active Menu QRs ← Selected
├─ Recently Created
├─ My Domains
└─ [Manage Views]

Result Grid (Filtered):
┌──────────────────────────────────────────────────────┐
│ Active Menu QRs - 2 Records Found                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│ QR Name  │ QR Type │ Status │ Created                │
├──────────────────────────────────────────────────────┤
│ QR002    │ Menu    │ Active │ 2026-02-20            │
│ QR005    │ Menu    │ Active │ 2026-02-25            │
│                                                      │
│ View Configuration:                                 │
│ Filter: QR Type = Menu, Status = Active            │
│ Sort: Created Date (Descending)                     │
│ Columns: QRName, QRType, Status, Created           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Step 5: Group by Field

**User Action**: Drag "QR Type" to Group Area

```
Grouped View:
┌──────────────────────────────────────────────────────┐
│ Grouped by: QR Type                                 │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ▶ Event (0 records)                                │
│                                                      │
│ ▼ Menu (2 records)                                 │
│   ├─ QR002 │ Menu │ Active  │ 2026-02-20           │
│   └─ QR005 │ Menu │ Active  │ 2026-02-25           │
│                                                      │
│ ▶ Voucher (1 record)                               │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### API Endpoints

```typescript
// Get Custom Views for Entity
GET /api/sys/custom-view/entity/{entityId}/views
Response: CustomViewDto[]

// Save Custom View
POST /api/sys/custom-view/save
Body: {
  viewName: string,
  entityId: string,
  gridConfig: object,
  filterConfig: object,
  isDefault: boolean
}
Response: CustomViewDto

// Get View Configuration
GET /api/sys/custom-view/{viewId}
Response: CustomViewDto

// Delete Custom View
DELETE /api/sys/custom-view/{viewId}
Response: { success: boolean }

// Apply Grid Filter
POST /api/qr/list/filtered
Body: FilterConfigDto
Response: PaginatedResult<QRDto>
```

### Code Example - Advanced View Component

```typescript
// advanced-view.component.ts
import { Component, OnInit } from '@angular/core';
import { CustomViewService } from '@app/services/custom-view.service';
import { QRService } from '@app/services/qr.service';

@Component({
  selector: 'app-advanced-view',
  templateUrl: './advanced-view.component.html',
  styleUrls: ['./advanced-view.component.scss']
})
export class AdvancedViewComponent implements OnInit {
  dataSource: any[] = [];
  customViews: any[] = [];
  currentView: any;
  filterConfig: any = { filters: [], logic: 'AND' };
  sortConfig: any = [];
  gridColumns: any[] = [];

  constructor(
    private customViewService: CustomViewService,
    private qrService: QRService
  ) {}

  ngOnInit(): void {
    this.loadCustomViews();
    this.loadData();
  }

  loadCustomViews(): void {
    this.customViewService.getViewsByEntity('ENT_QR').subscribe(
      (views) => {
        this.customViews = views;
        this.currentView = views.find(v => v.isDefault);
        if (this.currentView) {
          this.applyViewConfig(this.currentView);
        }
      }
    );
  }

  applyViewConfig(view: any): void {
    this.gridColumns = view.gridConfig.columns;
    this.filterConfig = view.filterConfig;
    this.sortConfig = view.sortConfig;
    this.loadData();
  }

  loadData(): void {
    this.qrService.getFiltered(this.filterConfig).subscribe(
      (data) => {
        this.dataSource = data;
      }
    );
  }

  saveCurrentView(viewName: string): void {
    const viewConfig = {
      viewName: viewName,
      entityId: 'ENT_QR',
      gridConfig: { columns: this.gridColumns },
      filterConfig: this.filterConfig,
      sortConfig: this.sortConfig
    };
    
    this.customViewService.saveView(viewConfig).subscribe(
      (savedView) => {
        this.customViews.push(savedView);
      }
    );
  }
}
```

---

## Approval Workflow

### Purpose

The **Approval Workflow Engine** provides a flexible, multi-step approval system for administrative governance. It supports sequential and parallel approvals, dynamic approver assignment, and comprehensive audit trails. Use cases include QR code approval, content moderation, configuration changes, and operational authorizations.

### Key Features

✅ **Workflow Configuration**
- Define multi-step workflows
- Sequential or parallel approval paths
- Conditional routing based on data
- Escalation rules

✅ **Dynamic Approver Assignment**
- Assign by role
- Assign by department
- Assign to specific users
- Assign by hierarchy level

✅ **Approval Actions**
- Approve (move to next step)
- Reject (with reason)
- Request revisions (with comments)
- Escalate (to higher authority)
- Defer (mark for later review)

✅ **Notifications & Alerts**
- Email to approvers
- In-app notifications
- Approval reminders
- Escalation alerts

✅ **Audit & Compliance**
- Complete audit trail
- Approval history with timestamps
- Comment tracking
- Compliance reporting

### Implementation Details

**Technology Stack:**
- **Workflow Engine**: Custom state machine
- **Storage**: SQL Server tables
- **Notifications**: Email + In-app
- **Audit**: Comprehensive logging

**Database Schema:**

```sql
-- Workflow Definition
APP_Workflow
├── WorkflowID (PK)
├── WorkflowName
├── WorkflowCode
├── EntityType (QR, Content, Config, etc.)
├── Status (Active, Inactive, Draft)
├── CreatedOn
├── ModifiedOn
└── Description

-- Workflow Steps
APP_WorkflowStep
├── StepID (PK)
├── WorkflowID (FK)
├── StepNo (1, 2, 3...)
├── StepName
├── StepType (Sequential/Parallel)
├── TimeoutDays
├── EscalationRule
└── CreatedOn

-- Approvers for Each Step
APP_WorkflowStepApprover
├── ApproverID (PK)
├── StepID (FK)
├── ApprovalType (Role/User/Department/Hierarchy)
├── ApprovalValue (RoleID/UserID/DepartmentID)
├── DisplayOrder
└── IsMandatory

-- Approval Requests
APP_ApprovalRequest
├── RequestID (PK)
├── WorkflowID (FK)
├── EntityType
├── EntityID
├── RequestedBy
├── RequestedOn
├── Status (Pending/Approved/Rejected/InProgress)
├── CurrentStep
├── Data (JSON - Request payload)
└── ReferenceNo

-- Approval History/Log
APP_ApprovalRequestLog
├── LogID (PK)
├── RequestID (FK)
├── StepID (FK)
├── ApproverId (FK)
├── Action (Approved/Rejected/Revised/Escalated)
├── Comments
├── ActionDate
├── Timestamp
└── IPAddress

-- Notification Log
APP_ApprovalNotification
├── NotificationID (PK)
├── RequestID (FK)
├── RecipientID
├── NotificationType (Email/InApp)
├── Status (Sent/Pending/Failed)
├── SentDate
└── ErrorMessage
```

### Demo Scenario - QR Code Approval Workflow

#### Configuration Setup

```
Admin Configuration → Workflows → New Workflow

Workflow: "QR Code Creation Approval"
├── Workflow Code: WF-QR-001
├── Entity Type: QR Code
├── Status: Active
│
├── Step 1: "QR Admin Review"
│   ├── Step No: 1
│   ├── Timeout: 2 days
│   ├── Approvers: Role = "QR Admin"
│   ├── Action Required: Approve/Reject
│   └── Escalation: Auto-escalate after 2 days
│
├── Step 2: "Manager Approval"
│   ├── Step No: 2
│   ├── Timeout: 3 days
│   ├── Approvers: Role = "QR Manager"
│   ├── Action Required: Final Approval
│   └── Escalation: Escalate to GM
│
└── Step 3: "Finance Check" (Parallel with Step 2)
    ├── Step No: 2
    ├── Type: Parallel
    ├── Approvers: User = "finance@smartqr.com"
    └── Action Required: Budget Verification
```

#### Workflow Execution - Real Time Demo

```
=== TIMELINE OF EVENTS ===

[T+0:00] User Creates New QR Code
┌──────────────────────────────────────────┐
│ POST /api/qr/create                      │
│                                          │
│ Request Data:                            │
│ {                                        │
│   "qrName": "Mall QR 2026-001",         │
│   "qrType": "Mall",                     │
│   "domain": "Shopping Mall A",           │
│   "status": "Pending Approval"           │
│ }                                        │
└──────────────────────────────────────────┘

SYSTEM ACTION:
  ├─ Create QR record (status: "Pending Approval")
  ├─ Create APP_ApprovalRequest
  │  └─ RequestID: APR-2026-001
  │  └─ Status: "Pending"
  │  └─ CurrentStep: 1
  ├─ Assign to Step 1 Approvers (QR Admin role)
  │  └─ Query all users with QR Admin role
  ├─ Send Email notifications
  └─ Create in-app notifications

Email Notification:
┌────────────────────────────────────────┐
│ To: admin1@smartqr.com, admin2@...     │
│ Subject: QR Code Approval Required     │
│                                        │
│ A new QR code requires your approval:  │
│ • QR Name: Mall QR 2026-001           │
│ • Type: Mall                           │
│ • Requested by: User (user@...)       │
│ • Created: 2026-04-27 10:30           │
│                                        │
│ [View & Approve] [Reject]             │
│ (Link to approval dashboard)           │
└────────────────────────────────────────┘

Database State:
APP_ApprovalRequest:
{
  RequestID: "APR-2026-001",
  WorkflowID: "WF-QR-001",
  EntityType: "QR",
  EntityID: "QR-2026-001",
  RequestedBy: "user@smartqr.com",
  Status: "Pending",
  CurrentStep: 1
}
```

```
[T+2:15] QR Admin Reviews & Approves
┌──────────────────────────────────────────┐
│ POST /api/approval/submit-action         │
│                                          │
│ Request Data:                            │
│ {                                        │
│   "requestId": "APR-2026-001",          │
│   "stepId": 1,                          │
│   "action": "Approved",                 │
│   "comments": "QR configuration looks   │
│                good. Approved.",        │
│   "approvedBy": "admin1@smartqr.com"   │
│ }                                        │
└──────────────────────────────────────────┘

SYSTEM ACTION:
  ├─ Create APP_ApprovalRequestLog entry
  │  └─ Action: "Approved"
  │  └─ TimeStamp: 2026-04-27 10:32
  │  └─ Approver: admin1
  ├─ Move to Step 2 (Manager Approval)
  ├─ Update APP_ApprovalRequest
  │  └─ CurrentStep: 2
  │  └─ Status: "In Progress"
  ├─ Send Email to Step 2 Approvers
  ├─ Create in-app notifications
  └─ Log audit entry

Approval Chain Visualization:
┌─────────────────────────────────────────┐
│ APR-2026-001: Mall QR 2026-001          │
├─────────────────────────────────────────┤
│ Step 1: QR Admin Review                 │
│   Status: ✅ COMPLETED                  │
│   Approver: admin1@smartqr.com          │
│   Action: Approved                      │
│   Date: 2026-04-27 10:32                │
│   Comment: "QR configuration looks good"│
│                                         │
│ Step 2: Manager Approval (CURRENT)      │
│   Status: ⏳ WAITING                    │
│   Approvers: manager1, manager2         │
│   Timeout: 3 days                       │
│   Required: Final Approval              │
│                                         │
│ Step 3: Finance Check                   │
│   Status: ⏳ PARALLEL WAITING           │
│   Approver: finance@smartqr.com         │
│   Timeout: 2 days                       │
│                                         │
│ Overall Status: In Progress             │
└─────────────────────────────────────────┘
```

```
[T+4:45] Manager Approves
┌──────────────────────────────────────────┐
│ Approval Dashboard Interface             │
├──────────────────────────────────────────┤
│                                          │
│ Pending Approvals: 3                    │
│ ┌────────────────────────────────────┐  │
│ │ Mall QR 2026-001                   │  │
│ │ Status: Awaiting Manager Approval  │  │
│ │ Created: 2026-04-27 10:30          │  │
│ │ Pending for: 2 hours 15 mins       │  │
│ │                                    │  │
│ │ [View Details] [Approve] [Reject]  │  │
│ └────────────────────────────────────┘  │
│                                          │
│ Manager Clicks [Approve]                │
│                                          │
│ Dialog: Final Approval                  │
│ ┌────────────────────────────────────┐  │
│ │ Action: Approve                    │  │
│ │ Comments: [____________]           │  │
│ │ Final Comments:                    │  │
│ │ [Looks good, ready to go live]    │  │
│ │                                    │  │
│ │ [Confirm] [Cancel]                │  │
│ └────────────────────────────────────┘  │
└──────────────────────────────────────────┘

SYSTEM ACTION (Both steps approved):
  ├─ Create approval log for Step 2 & 3
  ├─ Mark both steps as "Approved"
  ├─ Update QR status to "Active"
  ├─ Update APP_ApprovalRequest
  │  └─ Status: "Completed"
  ├─ Send completion notification
  ├─ Create success audit log
  └─ Move QR to live environment

Final Status:
┌─────────────────────────────────────────┐
│ APR-2026-001: APPROVAL COMPLETED ✅     │
├─────────────────────────────────────────┤
│ All Steps Approved                      │
│ ├─ Step 1: ✅ Approved (admin1)        │
│ ├─ Step 2: ✅ Approved (manager1)      │
│ ├─ Step 3: ✅ Approved (finance)       │
│                                         │
│ QR Status: Active                       │
│ Activated: 2026-04-27 10:45            │
│ Total Approval Time: 15 minutes         │
│                                         │
│ Audit Trail:                            │
│ [View Full Audit Log]                  │
└─────────────────────────────────────────┘
```

### Alternative Scenario - Rejection

```
[T+3:00] Manager Reviews & Rejects
┌──────────────────────────────────────────┐
│ Manager Clicks [Reject]                 │
│                                          │
│ Dialog: Rejection Reason                │
│ ┌────────────────────────────────────┐  │
│ │ Action: Reject                     │  │
│ │ Reason:                            │  │
│ │ [QR Code name doesn't follow      │  │
│ │  naming convention. Please fix and │  │
│ │  resubmit.]                        │  │
│ │                                    │  │
│ │ [Reject] [Cancel]                 │  │
│ └────────────────────────────────────┘  │
└──────────────────────────────────────────┘

SYSTEM ACTION:
  ├─ Create rejection log
  ├─ Update APP_ApprovalRequest
  │  └─ Status: "Rejected"
  ├─ Update QR status to "Rejected"
  ├─ Send rejection notification to requester
  └─ Clear pending approvals

Requester Receives Email:
┌────────────────────────────────────────┐
│ To: user@smartqr.com                   │
│ Subject: QR Code Approval - REJECTED   │
│                                        │
│ Your QR code approval was rejected:    │
│ • QR Name: Mall QR 2026-001           │
│ • Reason: "QR Code name doesn't       │
│           follow naming convention.    │
│           Please fix and resubmit."   │
│                                        │
│ You can revise and resubmit the QR    │
│ code for approval.                     │
│                                        │
│ [View Details]                         │
└────────────────────────────────────────┘

Status Tracking:
┌─────────────────────────────────────────┐
│ APR-2026-001: REJECTED                  │
├─────────────────────────────────────────┤
│ Step 1: ✅ Approved                     │
│ Step 2: ❌ REJECTED                     │
│   Rejected By: manager1@smartqr.com     │
│   Reason: "QR Code naming issue"       │
│   Date: 2026-04-27 12:00                │
│                                         │
│ QR Status: Rejected (needs revision)   │
│                                         │
│ User Action: [Revise & Resubmit]       │
└─────────────────────────────────────────┘
```

### API Endpoints

```typescript
// Get Pending Approvals for Current User
GET /api/approval/pending
Response: ApprovalRequestDto[]

// Get Approval Details
GET /api/approval/{requestId}
Response: ApprovalRequestDetailDto

// Submit Approval Action
POST /api/approval/submit-action
Body: {
  requestId: string,
  stepId: string,
  action: 'Approved' | 'Rejected' | 'Revised' | 'Escalated',
  comments: string,
  approvedBy: string
}
Response: { success: boolean, message: string }

// Get Approval History
GET /api/approval/{requestId}/history
Response: ApprovalLogDto[]

// Get Audit Trail
GET /api/approval/{requestId}/audit-trail
Response: AuditLogDto[]
```

---

## Data Migration

### Purpose

The **Data Migration** feature enables bulk import of master data (QR codes, shops, products) from Excel files with comprehensive validation, error reporting, and rollback capabilities. It supports column mapping, business rule validation, and duplicate detection.

### Key Features

✅ **Excel File Upload**
- Support for .xlsx files
- Multi-sheet processing
- Template-based import
- Preview before import

✅ **Column Mapping**
- Auto-detect headers
- Manual field mapping
- Required field validation
- Data type matching

✅ **Comprehensive Validation**
- Data type validation (text, number, date)
- Required field checks
- Duplicate detection
- Business rule validation
- Lookup resolution (foreign keys)
- Regex/custom validation

✅ **Error Reporting**
- Row-by-row error details
- Clear error messages
- Warning indicators
- Error export to Excel

✅ **Batch Processing**
- Import multiple records
- Transaction management
- Commit/rollback control
- Progress tracking

✅ **Audit Trail**
- Import history log
- Records imported/failed counts
- Timestamp tracking
- User tracking

### Implementation Details

**Technology Stack:**
- **Excel Parsing**: ExcelJS
- **Validation**: Custom framework
- **Processing**: Async/background jobs
- **Storage**: SQL Server with transactions

**Database Tables:**

```sql
-- Migration History
DAT_MigrationJob
├── MigrationJobID (PK)
├── MigrationName
├── FileName
├── EntityType
├── TotalRows
├── SuccessfulRows
├── FailedRows
├── Status (In Progress/Completed/Failed)
├── CreatedBy
├── CreatedOn
└── CompletedOn

-- Migration Details
DAT_MigrationDetail
├── DetailID (PK)
├── MigrationJobID (FK)
├── RowNumber
├── RecordData (JSON)
├── ValidationStatus (Valid/Invalid/Warning)
├── ErrorMessage
└── CreatedRecordID (FK)

-- Column Mapping
DAT_ImportMapping
├── MappingID (PK)
├── MappingName
├── EntityType
├── ExcelColumn
├── DatabaseField
├── FieldType
├── IsRequired
├── IsLookup
├── LookupTable
└── CreatedOn
```

### Demo Scenario - Import QR Codes

#### Step 1: Prepare Excel File

**File: qr_codes_batch_import.xlsx**

```
Excel Structure:
┌──────────────────────────────────────────────────┐
│  QR Name │ QR Type │ Domain │ Status │ Created  │
├──────────────────────────────────────────────────┤
│ QR-A001  │ Mall    │ DOM-01 │ Active │ 2026-01  │
│ QR-A002  │ Menu    │ DOM-01 │ Active │ 2026-02  │
│ QR-A003  │ Voucher │ DOM-02 │ Draft  │ 2026-03  │
│ INVALID  │         │ DOM-01 │ Active │ 2026-04  │ ← Missing QR Type
│ QR-A001  │ Mall    │ DOM-01 │ Active │ 2026-05  │ ← Duplicate
│ QR-B001  │ Event   │ INVALID│ Active │ 2026-06  │ ← Invalid Domain
└──────────────────────────────────────────────────┘
```

#### Step 2: Upload & Map Columns

**User Action: File Upload**

```
User Interface:
┌────────────────────────────────────────────────┐
│ Data Migration - Import QR Codes              │
├────────────────────────────────────────────────┤
│                                                │
│ [Upload File] qr_codes_batch_import.xlsx      │
│                                                │
│ File Preview:                                 │
│ Headers Detected:                             │
│ • QR Name                                     │
│ • QR Type                                     │
│ • Domain                                      │
│ • Status                                      │
│ • Created                                     │
│                                                │
│ [Next: Map Columns]                           │
└────────────────────────────────────────────────┘
```

**Column Mapping Interface**

```
┌────────────────────────────────────────────────┐
│ Column Mapping Configuration                   │
├────────────────────────────────────────────────┤
│                                                │
│ Excel Column → Database Field                 │
│ ┌─────────────────────────────────────────┐   │
│ │ QR Name → QRName ✓ (Required)          │   │
│ │ QR Type → QRType ✓ (Required)          │   │
│ │ Domain → DomainID (Lookup) ✓           │   │
│ │ Status → Status ✓                      │   │
│ │ Created → CreatedDate (Date)           │   │
│ └─────────────────────────────────────────┘   │
│                                                │
│ Validation Rules:                             │
│ ├─ QRName: Required, Min 3 chars             │
│ ├─ QRType: Required, Must exist              │
│ ├─ DomainID: Required, Lookup in Domain      │
│ ├─ Status: Optional, Enum validation         │
│ └─ CreatedDate: Optional, Valid date format  │
│                                                │
│ [Validate File] [Import]                     │
└────────────────────────────────────────────────┘
```

#### Step 3: Validate & Review Errors

**User Action: Click "Validate File"**

```
POST /api/migration/validate
Body: {
  "fileName": "qr_codes_batch_import.xlsx",
  "entityType": "QR",
  "mappingConfig": { ... }
}

Validation Results:
┌────────────────────────────────────────────────┐
│ Validation Complete - 6 Rows Processed        │
├────────────────────────────────────────────────┤
│                                                │
│ ✅ Row 1: VALID                              │
│    QR-A001 | Mall | DOM-01 | Active          │
│                                                │
│ ✅ Row 2: VALID                              │
│    QR-A002 | Menu | DOM-01 | Active          │
│                                                │
│ ✅ Row 3: VALID                              │
│    QR-A003 | Voucher | DOM-02 | Draft       │
│                                                │
│ ❌ Row 4: INVALID                            │
│    Error: "QR Type is required (missing)"    │
│    Data: INVALID | [empty] | DOM-01 | Active│
│                                                │
│ ⚠️  Row 5: WARNING                            │
│    Duplicate: QR-A001 already exists         │
│    Existing ID: QR-2026-001                  │
│    Suggestion: Skip or Update existing       │
│                                                │
│ ❌ Row 6: INVALID                            │
│    Error: "Domain 'INVALID' not found"       │
│    (Lookup failed in Domain table)            │
│    Data: QR-B001 | Event | INVALID | Active  │
│                                                │
├────────────────────────────────────────────────┤
│ Summary:                                       │
│ • Total Rows: 6                               │
│ • Valid: 3                                    │
│ • Invalid: 2                                  │
│ • Warnings: 1                                 │
│                                                │
│ Action for Invalid/Warning:                  │
│ ○ Skip These Rows                            │
│ ○ [Download Error Report] [Fix & Re-upload]  │
│                                                │
│ [Import 3 Valid Records] [Cancel]            │
└────────────────────────────────────────────────┘
```

**Error Report Export**

```
Error Report (Excel):
┌────────────────────────────────────────────────┐
│ Import Errors - qr_codes_batch_import.xlsx    │
├────────────────────────────────────────────────┤
│                                                │
│ Row │ Data │ Status │ Error Message           │
├────────────────────────────────────────────────┤
│ 4   │ INVALID,... │ INVALID │ "QR Type is   │
│     │             │         │  required"    │
│                                                │
│ 5   │ QR-A001,... │ WARNING │ "Duplicate: │
│     │             │         │  Already     │
│     │             │         │  exists"     │
│                                                │
│ 6   │ QR-B001,... │ INVALID │ "Domain      │
│     │             │         │  'INVALID'   │
│     │             │         │  not found"  │
│                                                │
└────────────────────────────────────────────────┘

Export as: error_report_2026-04-27.xlsx
User fixes Excel and re-uploads
```

#### Step 4: Import Valid Records

**User Action: Click "Import 3 Valid Records"**

```
POST /api/migration/import
Body: {
  "migrationName": "QR Bulk Import - 2026-04-27",
  "entityType": "QR",
  "validRows": [1, 2, 3]
}

Processing:
┌────────────────────────────────────────────────┐
│ Importing Records...                          │
├────────────────────────────────────────────────┤
│ ████████████████░░░░ 65%                      │
│ Processing Row 2 of 3                         │
│                                                │
│ Status: In Progress                           │
│ Elapsed: 2 seconds                            │
│ Estimated: 5 seconds remaining                │
└────────────────────────────────────────────────┘

Backend Processing:
BEGIN TRANSACTION
  ├─ Insert QR-A001 into QR_Master
  │  ├─ QRName: "QR-A001"
  │  ├─ QRType: "Mall"
  │  ├─ DomainID: "DOM-01"
  │  ├─ Status: "Active"
  │  ├─ CreatedDate: 2026-01-15
  │  └─ CreatedBy: "user@smartqr.com"
  │
  ├─ Insert QR-A002 into QR_Master
  │  └─ [Similar process]
  │
  ├─ Insert QR-A003 into QR_Master
  │  └─ [Similar process]
  │
  ├─ Update DAT_MigrationJob
  │  ├─ SuccessfulRows: 3
  │  ├─ Status: "Completed"
  │  └─ CompletedOn: GETDATE()
  │
  └─ COMMIT TRANSACTION

Success!
```

#### Step 5: View Import Results

```
┌────────────────────────────────────────────────┐
│ Import Complete ✅                            │
├────────────────────────────────────────────────┤
│                                                │
│ Migration Details:                            │
│ • Job ID: MIG-2026-04-27-001                 │
│ • File: qr_codes_batch_import.xlsx           │
│ • Entity: QR Codes                           │
│ • Total Rows: 6                              │
│ • Imported: 3 ✅                             │
│ • Failed: 2 ❌                               │
│ • Warnings: 1 ⚠️                             │
│ • Import Time: 5 seconds                     │
│ • Imported By: user@smartqr.com              │
│ • Date: 2026-04-27 15:30                     │
│                                                │
│ Imported Records:                             │
│ ✅ QR-A001 (ID: QR-2026-1001)               │
│ ✅ QR-A002 (ID: QR-2026-1002)               │
│ ✅ QR-A003 (ID: QR-2026-1003)               │
│                                                │
│ [View All Migrations] [Download Report]      │
└────────────────────────────────────────────────┘
```

**Audit Log Entry:**

```sql
DAT_MigrationJob:
{
  MigrationJobID: "MIG-2026-04-27-001",
  MigrationName: "QR Bulk Import - 2026-04-27",
  FileName: "qr_codes_batch_import.xlsx",
  EntityType: "QR",
  TotalRows: 6,
  SuccessfulRows: 3,
  FailedRows: 2,
  WarningRows: 1,
  Status: "Completed",
  CreatedBy: "user@smartqr.com",
  CreatedOn: "2026-04-27 15:30:00",
  CompletedOn: "2026-04-27 15:30:05"
}

DAT_MigrationDetail (3 entries for successful rows):
{
  DetailID: "DET-001",
  MigrationJobID: "MIG-2026-04-27-001",
  RowNumber: 1,
  RecordData: { "qrName": "QR-A001", "qrType": "Mall", ... },
  ValidationStatus: "Valid",
  ErrorMessage: NULL,
  CreatedRecordID: "QR-2026-1001"
}
```

### API Endpoints

```typescript
// Validate Import File
POST /api/migration/validate
Body: {
  fileName: string,
  entityType: string,
  mappingConfig: object
}
Response: ValidationResultDto

// Execute Import
POST /api/migration/import
Body: {
  migrationName: string,
  entityType: string,
  validRows: number[]
}
Response: { success: boolean, migrationJobId: string }

// Get Migration History
GET /api/migration/history?entityType=QR
Response: MigrationJobDto[]

// Get Migration Details
GET /api/migration/{migrationJobId}/details
Response: MigrationDetailDto[]

// Download Error Report
GET /api/migration/{migrationJobId}/error-report
Response: Excel file download
```

---

## Custom Field Dynamic Form

### Purpose

The **Custom Field Dynamic Form** framework enables administrators to extend entities (Shops, Products, QR Types) with custom fields without code changes. Fields are configured in the database, and forms are automatically generated with validation and auto-save functionality.

### Key Features

✅ **Field Types Supported**
- Text (single-line and multi-line)
- Number (integer and decimal)
- Date & DateTime
- Dropdown (single select)
- Checkbox (boolean)
- Radio buttons
- File attachment
- Custom types via plugins

✅ **Field Configuration**
- Field label and placeholder
- Help text and tooltips
- Required/optional validation
- Min/max length constraints
- Regex pattern validation
- Default values
- Visibility rules (by role)
- Display order

✅ **Validation Framework**
- Client-side validation
- Server-side validation
- Custom validators
- Error messages
- Field dependencies

✅ **Dynamic UI Generation**
- Auto-generate forms from config
- Responsive layout
- Group fields into sections
- Conditional field display
- Real-time validation feedback

✅ **Data Persistence**
- Auto-save functionality
- Audit trail
- Value history
- Multi-language support

### Implementation Details

**Technology Stack:**
- **Form Generation**: Angular Dynamic Forms
- **Validation**: Custom validators + Angular validators
- **Storage**: CFD Tables + generic value table
- **UI Components**: Bootstrap + NgBootstrap

**Database Schema:**

```sql
-- Entity Definition
CFD_Entity
├── EntityID (PK)
├── EntityName (e.g., "Shop", "Product", "QRType")
├── EntityDisplayName
├── ModuleID
├── TableName
├── IconClass
├── Description
├── Active
├── CreatedOn
└── ModifiedOn

-- Custom Field Definition
CFD_EntityField
├── FieldID (PK)
├── EntityID (FK)
├── FieldName (e.g., "shopCategory")
├── DisplayName (e.g., "Shop Category")
├── FieldType (Text/Number/Date/Dropdown/Checkbox)
├── DisplayOrder
├── IsRequired
├── IsVisible
├── DefaultValue
├── ValidationRule (JSON)
├── HelpText
├── Tooltip
├── VisibilityRule (JSON - by role)
├── CreatedOn
└── ModifiedOn

-- Field Options (for Dropdown/Radio)
CFD_FieldOption
├── OptionID (PK)
├── FieldID (FK)
├── OptionValue
├── OptionLabel
├── DisplayOrder
├── Active
└── CreatedOn

-- Custom Field Values (Audit)
CFD_EntityFieldValue
├── ValueID (PK)
├── EntityID (FK)
├── FieldID (FK)
├── RecordID (FK to main entity)
├── FieldValue
├── CreatedBy
├── CreatedOn
├── ModifiedBy
├── ModifiedOn
└── IsActive

-- Custom Field Audit/History
CFD_EntityFieldValueAudit
├── AuditID (PK)
├── ValueID (FK)
├── OldValue
├── NewValue
├── ChangedBy
├── ChangedOn
└── ChangeReason
```

### Demo Scenario - Shop Master Custom Fields

#### Configuration Setup

**Admin Interface: Custom Fields Configuration**

```
Navigate To: System Admin → Custom Fields → Entity List

Select Entity: "Shop Master"

Current Custom Fields:
┌─────────────────────────────────────┐
│ Custom Fields for Shop              │
├─────────────────────────────────────┤
│ 1. Shop Category (Dropdown)         │
│ 2. Operating Hours (Text)           │
│ 3. Manager Contact (Phone)          │
│ 4. Shop Area (Number)               │
│ 5. Established Date (Date)          │
│ 6. Is Premium (Checkbox)            │
│                                     │
│ [Add New Field] [Edit] [Delete]    │
└─────────────────────────────────────┘
```

**Add New Field - Configuration Dialog**

```
┌─────────────────────────────────────────────┐
│ Add New Custom Field                       │
├─────────────────────────────────────────────┤
│                                             │
│ Field Details:                              │
│ ┌────────────────────────────────────────┐ │
│ │ Display Name: [Shop Category]          │ │
│ │ Field Name: [shop_category] (auto)    │ │
│ │ Field Type: [Dropdown ▼]               │ │
│ │ Help Text: [Select the category...]   │ │
│ │ Required: ☑                            │ │
│ │ Display Order: [1]                    │ │
│ │                                        │ │
│ │ Visibility:                            │ │
│ │ ☑ Admin        ☑ Manager               │ │
│ │ ☑ Staff        ☑ Public User           │ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
│                                             │
│ Dropdown Options:                           │
│ ┌────────────────────────────────────────┐ │
│ │ 1. Retail          [Edit] [Delete]     │ │
│ │ 2. Food & Beverage [Edit] [Delete]    │ │
│ │ 3. Entertainment   [Edit] [Delete]     │ │
│ │ 4. Service         [Edit] [Delete]     │ │
│ │                                        │ │
│ │ [Add Option]                           │ │
│ └────────────────────────────────────────┘ │
│                                             │
│ Validation Rules:                           │
│ ┌────────────────────────────────────────┐ │
│ │ • Required: Yes                        │ │
│ │ • Allow Multiple: No                   │ │
│ │ • Default Value: [Retail]              │ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
│                                             │
│ [Save] [Cancel]                             │
└─────────────────────────────────────────────┘
```

**Configuration Stored in Database:**

```sql
CFD_EntityField:
{
  FieldID: "FIELD-SHOP-001",
  EntityID: "ENT-SHOP",
  FieldName: "shop_category",
  DisplayName: "Shop Category",
  FieldType: "Dropdown",
  DisplayOrder: 1,
  IsRequired: 1,
  IsVisible: 1,
  DefaultValue: "Retail",
  HelpText: "Select the category of your shop",
  Tooltip: "This helps us categorize your shop",
  VisibilityRule: {
    "roles": ["Admin", "Manager", "Staff", "PublicUser"],
    "showForAll": true
  },
  CreatedOn: "2026-04-27 10:00:00"
}

CFD_FieldOption:
[
  { OptionID: "OPT-1", FieldID: "FIELD-SHOP-001", OptionValue: "Retail", OptionLabel: "Retail", DisplayOrder: 1 },
  { OptionID: "OPT-2", FieldID: "FIELD-SHOP-001", OptionValue: "Food", OptionLabel: "Food & Beverage", DisplayOrder: 2 },
  { OptionID: "OPT-3", FieldID: "FIELD-SHOP-001", OptionValue: "Entertainment", OptionLabel: "Entertainment", DisplayOrder: 3 },
  { OptionID: "OPT-4", FieldID: "FIELD-SHOP-001", OptionValue: "Service", OptionLabel: "Service", DisplayOrder: 4 }
]
```

#### Using Custom Fields - Create New Shop

**User Interface: Create Shop Form**

```
URL: http://localhost:4200/admin/shops/new

┌──────────────────────────────────────────────┐
│          Create New Shop                     │
├──────────────────────────────────────────────┤
│                                              │
│ STANDARD FIELDS:                             │
│ ┌──────────────────────────────────────────┐│
│ │ Shop Name: *                             ││
│ │ [Enter shop name]                        ││
│ │                                          ││
│ │ Location: *                              ││
│ │ [Select Location ▼]                      ││
│ │                                          ││
│ │ Phone: *                                 ││
│ │ [+95 ________ ________]                 ││
│ └──────────────────────────────────────────┘│
│                                              │
│ CUSTOM FIELDS:                               │
│ ┌──────────────────────────────────────────┐│
│ │ Shop Category: * ⓘ                      ││
│ │ (Select the category of your shop)      ││
│ │ [Retail ▼]                              ││
│ │                                          ││
│ │ Operating Hours: *                      ││
│ │ [9:00 AM - 9:00 PM]                     ││
│ │                                          ││
│ │ Manager Contact: *                      ││
│ │ [+95 123456789]                         ││
│ │                                          ││
│ │ Shop Area (Sq. Ft): *                   ││
│ │ [5000]                                  ││
│ │                                          ││
│ │ Established Date:                        ││
│ │ [Select Date]                           ││
│ │                                          ││
│ │ Is Premium: ☐                           ││
│ │                                          ││
│ └──────────────────────────────────────────┘│
│                                              │
│ [Save] [Cancel]                              │
└──────────────────────────────────────────────┘
```

**Form Behavior - Real-time Validation:**

```
User Action: Select "Shop Category" = "Food & Beverage"

System Behavior:
├─ Validate field against CFD_EntityField config
├─ Check visibility rules (allowed for user role)
├─ Trigger dependent field updates (if configured)
├─ Show success feedback
└─ Enable save button

Input Field: "Operating Hours"
User Types: "10:00-22:00"

Validation:
├─ Check required: ✓ Not empty
├─ Check format: ✓ Valid time format
├─ Check regex: ✓ Matches pattern
├─ Show no error: ✓
└─ Real-time feedback: "Valid time format"

All Fields Filled:
┌──────────────────────────────────────────────┐
│ Form Validation Status: ✅ ALL VALID         │
│ Required Fields: 5/5 completed               │
│ Optional Fields: 2/2 completed               │
│                                              │
│ [Save] [Cancel] [Reset]                      │
└──────────────────────────────────────────────┘
```

**Save Form Data:**

```
POST /api/shop/create
Body: {
  "shopName": "Grand Plaza Retail",
  "location": "LOC-001",
  "phone": "+95123456789",
  "customFields": {
    "shop_category": "Food",
    "operating_hours": "9:00 AM - 9:00 PM",
    "manager_contact": "+95987654321",
    "shop_area": 5000,
    "established_date": "2020-01-15",
    "is_premium": true
  }
}

Backend Processing:
BEGIN TRANSACTION
  ├─ Validate all standard fields
  ├─ Validate all custom fields against CFD_EntityField
  │  ├─ shop_category: Dropdown validation
  │  ├─ operating_hours: Text length validation
  │  ├─ manager_contact: Phone format validation
  │  ├─ shop_area: Number range validation
  │  ├─ established_date: Date validation
  │  └─ is_premium: Boolean validation
  ├─ Insert into Shop table
  │  └─ ShopID: "SHOP-2026-001"
  ├─ Insert into CFD_EntityFieldValue (for each custom field)
  │  ├─ Insert shop_category value
  │  ├─ Insert operating_hours value
  │  ├─ Insert manager_contact value
  │  ├─ Insert shop_area value
  │  ├─ Insert established_date value
  │  └─ Insert is_premium value
  ├─ Create audit log entries
  └─ COMMIT TRANSACTION

Response:
{
  "success": true,
  "shopId": "SHOP-2026-001",
  "message": "Shop created successfully"
}
```

**Audit Trail Example:**

```sql
CFD_EntityFieldValue:
[
  {
    ValueID: "VAL-001",
    EntityID: "ENT-SHOP",
    FieldID: "FIELD-SHOP-001",
    RecordID: "SHOP-2026-001",
    FieldValue: "Food",
    CreatedBy: "user@smartqr.com",
    CreatedOn: "2026-04-27 15:45:00"
  },
  {
    ValueID: "VAL-002",
    EntityID: "ENT-SHOP",
    FieldID: "FIELD-SHOP-002",
    RecordID: "SHOP-2026-001",
    FieldValue: "9:00 AM - 9:00 PM",
    CreatedBy: "user@smartqr.com",
    CreatedOn: "2026-04-27 15:45:00"
  }
]

CFD_EntityFieldValueAudit:
{
  AuditID: "AUDIT-001",
  ValueID: "VAL-002",
  OldValue: NULL,
  NewValue: "9:00 AM - 9:00 PM",
  ChangedBy: "user@smartqr.com",
  ChangedOn: "2026-04-27 15:45:00",
  ChangeReason: "Initial Creation"
}
```

#### Edit & Update Custom Fields

```
User Edits Shop Later:
URL: http://localhost:4200/admin/shops/SHOP-2026-001/edit

Existing Values:
├─ Shop Category: Food
├─ Operating Hours: 9:00 AM - 9:00 PM
├─ Manager Contact: +95987654321
├─ Shop Area: 5000
├─ Established Date: 2020-01-15
└─ Is Premium: ☑

User Changes:
├─ Shop Category: Food → Service ← CHANGED
├─ Operating Hours: 9:00 AM - 9:00 PM → 10:00 AM - 10:00 PM ← CHANGED
└─ Other fields: No change

POST /api/shop/update/SHOP-2026-001
Body: Updated custom field values

Backend:
├─ Compare new vs old values
├─ Create audit entries for changed fields
│  ├─ shop_category: "Food" → "Service"
│  ├─ operating_hours: "9:00 AM - 9:00 PM" → "10:00 AM - 10:00 PM"
│  └─ ChangedOn: "2026-04-27 16:30:00"
├─ Update CFD_EntityFieldValue
└─ Create CFD_EntityFieldValueAudit entries

Audit Trail:
[Display Change History]
├─ April 27, 2026 - 3:45 PM - User Created
│  └─ Initial values set
├─ April 27, 2026 - 4:30 PM - User Updated
│  ├─ Shop Category: Food → Service
│  └─ Operating Hours: 9:00 AM - 9:00 PM → 10:00 AM - 10:00 PM
```

### API Endpoints

```typescript
// Get Custom Fields for Entity
GET /api/sys/custom-field/entity/{entityId}
Response: CustomFieldDto[]

// Create Form Schema
GET /api/sys/custom-field/entity/{entityId}/form-schema
Response: FormSchemaDto

// Save Custom Field Values
POST /api/sys/custom-field/save-values
Body: {
  recordId: string,
  entityId: string,
  fieldValues: { [fieldName]: value }
}
Response: { success: boolean }

// Get Custom Field Values
GET /api/sys/custom-field/record/{recordId}/values
Response: CustomFieldValueDto[]

// Get Field Value History
GET /api/sys/custom-field/field/{fieldId}/history?recordId=...
Response: CustomFieldValueAuditDto[]
```

---

## Email Notification Service

### Purpose

The **Email Notification Service** provides a centralized, configurable email system with template management, AWS SES integration, queue processing, and audit logging. It supports multiple notification types triggered by system events.

### Key Features

✅ **Email Templates**
- Configurable templates in database
- HTML-based template design
- Dynamic placeholder replacement
- Template versioning
- Multi-language support

✅ **Template Management**
- Admin UI for template creation/editing
- Template preview functionality
- Test email sending
- Template history and rollback

✅ **Email Queue**
- Async email processing
- Retry logic with exponential backoff
- Failed email tracking
- Batch processing

✅ **Provider Integration**
- AWS SES (primary)
- SMTP fallback
- Email rate limiting
- Bounce/complaint handling

✅ **Audit & Compliance**
- Complete email audit trail
- Bounce and complaint logs
- Delivery status tracking
- Compliance reporting

✅ **Trigger Integration**
- New user registration
- QR code creation
- Approval notifications
- System alerts
- Custom triggers

### Implementation Details

**Technology Stack:**
- **Email Provider**: AWS SES
- **Background Processing**: Hangfire
- **Template Engine**: Liquid/Handlebars
- **Queue**: Database + Hangfire

**Database Schema:**

```sql
-- Email Templates
CrmEmailTemplate
├── EmailTemplateID (PK)
├── EmailTemplateNo (e.g., "E-0020", "E-0021")
├── Title (Email subject)
├── Status (Active/Inactive/Draft)
├── EmailBody (HTML content with placeholders)
├── Remark
├── Active (1/0)
├── CreatedBy
├── CreatedOn
├── ModifiedBy
├── ModifiedOn
└── LastAction

-- Email Queue
CrmEmailQueue
├── QueueID (PK)
├── TemplateID (FK to CrmEmailTemplate)
├── RecipientEmail
├── RecipientName
├── Subject
├── EmailBody (rendered HTML)
├── PlaceholderData (JSON)
├── Status (Pending/Sent/Failed)
├── RetryCount
├── MaxRetry
├── NextRetryTime
├── ErrorMessage
├── CreatedOn
└── SentOn

-- Email Audit Log
CrmEmailLog
├── LogID (PK)
├── QueueID (FK)
├── TemplateNo
├── RecipientEmail
├── Subject
├── Status (Sent/Bounced/Complained/Failed)
├── MessageID (AWS SES)
├── SentTime
├── DeliveryTime
├── BounceType (if applicable)
├── BounceReason
├── CreatedOn
└── Remarks

-- System Configuration
SysConfig
├── ConfigID (PK)
├── DefaultEmailAddress (Admin email)
├── DefaultEmailClient (SMTP/SES)
├── DefaultEmailPassword
├── EmailFrom
├── EmailFromName
└── OtherSettings

-- AWS SES Configuration
(Stored in appsettings.json)
{
  "AWS": {
    "AccessKey": "...",
    "SecretKey": "...",
    "Region": "us-east-1"
  }
}
```

### Demo Scenario - Email Notification Flow

#### Available Email Templates

```
Template Library:
┌──────────────────────────────────────────┐
│ Email Templates - System Admin          │
├──────────────────────────────────────────┤
│                                          │
│ Template No │ Title │ Status │ Active  │
├──────────────────────────────────────────┤
│ E-0020      │ New User Registration     │
│             │ Notification              │
│             │ [Subject Template]        │ Active │ ✓
│                                          │
│ E-0021      │ QR Code Created           │
│             │ Notification              │ Active │ ✓
│                                          │
│ E-0022      │ Approval Notification     │ Active │ ✓
│                                          │
│ E-0023      │ Payment Received          │ Active │ ✓
│                                          │
│ [Add New] [Edit] [Preview] [Delete]    │
└──────────────────────────────────────────┘
```

#### Template 1: New User Registration (E-0020)

**Template Configuration:**

```sql
Template Record:
{
  EmailTemplateID: "TMPL-001",
  EmailTemplateNo: "E-0020",
  Title: "New User Registration - [username]",
  Status: "Active",
  EmailBody: "<html>...</html>" (see below),
  Active: 1,
  CreatedOn: "2025-10-21 00:00:00"
}
```

**HTML Template Content:**

```html
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: #1d62c4; color: white; padding: 20px; }
    .content { padding: 20px; background: #f9f9f9; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px; border: 1px solid #ddd; }
    .footer { font-size: 12px; color: #666; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New User Registration Notification</h2>
    </div>
    
    <div class="content">
      <p>Dear Administrator,</p>
      <p>A new user has been registered in the Smart QR system.</p>
      
      <h3>User Information:</h3>
      <table>
        <tr>
          <td><strong>User Name:</strong></td>
          <td>[username]</td>
        </tr>
        <tr>
          <td><strong>Email:</strong></td>
          <td>[useremail]</td>
        </tr>
        <tr>
          <td><strong>Phone:</strong></td>
          <td>[userphone]</td>
        </tr>
        <tr>
          <td><strong>User ID:</strong></td>
          <td>[userid]</td>
        </tr>
        <tr>
          <td><strong>Role:</strong></td>
          <td>[role]</td>
        </tr>
        <tr>
          <td><strong>License:</strong></td>
          <td>[license]</td>
        </tr>
        <tr>
          <td><strong>Registration Date:</strong></td>
          <td>[createddate]</td>
        </tr>
      </table>
      
      <p style="margin-top: 20px;">
        <a href="[webUiUrl]" 
           style="background-color: #1d62c4; color: white; 
                  padding: 10px 20px; text-decoration: none; 
                  border-radius: 5px;">
          View in Admin Dashboard
        </a>
      </p>
      
      <div class="footer">
        <p>© [copyrightYear] Smart QR System. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
```

**Placeholders:**
- `[username]` - New user's username
- `[useremail]` - New user's email address
- `[userphone]` - New user's phone number
- `[userid]` - System-assigned user ID
- `[role]` - User's assigned role
- `[license]` - User's license type
- `[createddate]` - Registration timestamp
- `[webUiUrl]` - Link to admin dashboard
- `[copyrightYear]` - Current year

#### Trigger Flow - New User Created

**User Action: Admin Creates New User**

```
Admin Interface:
┌────────────────────────────────────┐
│ Create New User                   │
├────────────────────────────────────┤
│ User Name: [john.doe]             │
│ Email: [john@example.com]         │
│ Phone: [+95123456789]             │
│ Role: [QR Manager ▼]              │
│ License: [Standard ▼]             │
│                                   │
│ [Create User]                     │
└────────────────────────────────────┘

POST /api/sys/user/create
Body: {
  userName: "john.doe",
  email: "john@example.com",
  phone: "+95123456789",
  role: "QR Manager",
  license: "Standard"
}
```

**Backend - Email Trigger Execution:**

```csharp
[Step 1] Create User in Database
└─ INSERT into SysUser
   └─ UserID: "USR-2026-001"

[Step 2] Trigger Email Notification
└─ Call EmailNotificationService.SendNewUserNotification(userId)
   ├─ Get admin email from appsettings.json
   │  └─ "Admin.EmailAddress" = "heinthiritun.sbs@gmail.com"
   ├─ Get email template (E-0020)
   │  └─ Query CrmEmailTemplate WHERE EmailTemplateNo = 'E-0020'
   │  └─ Returns HTML template with placeholders
   ├─ Prepare placeholder data
   │  └─ {
   │       username: "john.doe",
   │       useremail: "john@example.com",
   │       userphone: "+95123456789",
   │       userid: "USR-2026-001",
   │       role: "QR Manager",
   │       license: "Standard",
   │       createddate: "2026-04-27 10:30:00",
   │       webUiUrl: "http://localhost:4200",
   │       copyrightYear: "2026"
   │     }
   └─ Replace placeholders in template
      └─ [username] → john.doe
      └─ [useremail] → john@example.com
      └─ (all other replacements)

[Step 3] Queue Email for Sending
└─ INSERT into CrmEmailQueue
   └─ {
        QueueID: "Q-2026-001",
        TemplateID: "TMPL-001",
        RecipientEmail: "heinthiritun.sbs@gmail.com",
        Subject: "New User Registration - john.doe",
        EmailBody: "<html>... (rendered HTML) ...</html>",
        PlaceholderData: { JSON of all data },
        Status: "Pending",
        RetryCount: 0,
        MaxRetry: 3,
        CreatedOn: GETDATE()
      }

[Step 4] Hangfire Background Job Processes Queue
└─ Job: EmailQueueProcessor runs every 5 minutes
   ├─ SELECT * FROM CrmEmailQueue WHERE Status = 'Pending'
   ├─ For each pending email:
   │  ├─ Connect to AWS SES
   │  ├─ Send email
   │  ├─ Get MessageID from AWS
   │  ├─ UPDATE CrmEmailQueue SET Status = 'Sent'
   │  ├─ INSERT into CrmEmailLog
   │  └─ CommitTransaction
   └─ Mark as completed

[Step 5] AWS SES Delivers Email
└─ Email received at: heinthiritun.sbs@gmail.com
   ├─ Subject: "New User Registration - john.doe"
   ├─ From: noreply@smartqr.com
   ├─ Body: Rendered HTML with user details
   └─ Timestamp: 2026-04-27 10:30:05
```

**Email Received by Admin:**

```
From: noreply@smartqr.com
To: heinthiritun.sbs@gmail.com
Subject: New User Registration - john.doe
Date: April 27, 2026, 10:30 AM

┌─────────────────────────────────────────┐
│ New User Registration Notification      │
│                                         │
│ Dear Administrator,                     │
│                                         │
│ A new user has been registered in the  │
│ Smart QR system.                        │
│                                         │
│ User Information:                       │
│ User Name: john.doe                    │
│ Email: john@example.com                │
│ Phone: +95123456789                    │
│ User ID: USR-2026-001                  │
│ Role: QR Manager                       │
│ License: Standard                      │
│ Registration Date: 2026-04-27 10:30    │
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ View in Admin Dashboard              ││
│ └─────────────────────────────────────┘│
│                                         │
│ © 2026 Smart QR System. All rights     │
│ reserved.                              │
│                                         │
└─────────────────────────────────────────┘
```

**Audit Trail:**

```sql
CrmEmailLog Entry:
{
  LogID: "LOG-2026-001",
  QueueID: "Q-2026-001",
  TemplateNo: "E-0020",
  RecipientEmail: "heinthiritun.sbs@gmail.com",
  Subject: "New User Registration - john.doe",
  Status: "Sent",
  MessageID: "AWS-SES-MSG-12345",
  SentTime: "2026-04-27 10:30:05",
  DeliveryTime: "2026-04-27 10:30:10",
  CreatedOn: "2026-04-27 10:30:05"
}
```

#### Template 2: QR Code Created (E-0021)

```html
<html>
<head>...</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New QR Code Created Notification</h2>
    </div>
    
    <div class="content">
      <p>A new QR code has been created in the Smart QR system.</p>
      
      <h3>QR Code Information:</h3>
      <table>
        <tr>
          <td><strong>QR Code Name:</strong></td>
          <td>[qrname]</td>
        </tr>
        <tr>
          <td><strong>QR Type:</strong></td>
          <td>[qrtype]</td>
        </tr>
        <tr>
          <td><strong>QR Code ID:</strong></td>
          <td>[qrid]</td>
        </tr>
        <tr>
          <td><strong>Content Preview:</strong></td>
          <td>[qrcontent]</td>
        </tr>
        <tr>
          <td><strong>Short URL:</strong></td>
          <td>[shorturl]</td>
        </tr>
        <tr>
          <td><strong>Created Date:</strong></td>
          <td>[createddate]</td>
        </tr>
      </table>
      
      <h3>Creator Information:</h3>
      <table>
        <tr>
          <td><strong>Creator Name:</strong></td>
          <td>[username]</td>
        </tr>
        <tr>
          <td><strong>Creator Email:</strong></td>
          <td>[useremail]</td>
        </tr>
      </table>
      
      <p>
        <a href="[webUiUrl]">View in Admin Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
```

#### Email Template Management - Admin Interface

```
Admin Panel: Email Templates

Edit Template Dialog:
┌────────────────────────────────────────┐
│ Edit Email Template - E-0020           │
├────────────────────────────────────────┤
│ Template Name: [New User Registration] │
│ Template Code: [E-0020]                │
│ Status: [Active ▼]                     │
│                                        │
│ Subject: [New User Registration -      │
│           [username]]                  │
│                                        │
│ Email Body:                            │
│ ┌────────────────────────────────────┐│
│ │ <html>...</html>                   ││
│ │ [HTML Editor with preview]         ││
│ └────────────────────────────────────┘│
│                                        │
│ Available Placeholders:                │
│ [username], [useremail], [userid],    │
│ [role], [license], [createddate],     │
│ [webUiUrl], [copyrightYear]           │
│                                        │
│ Actions:                               │
│ [Send Test Email] [Preview] [Save]    │
│ [Cancel]                               │
└────────────────────────────────────────┘
```

### Configuration

**appsettings.json - Email Settings:**

```json
{
  "Admin": {
    "EmailAddress": "heinthiritun.sbs@gmail.com"
  },
  "AWS": {
    "AccessKey": "AKIA...",
    "SecretKey": "...",
    "Region": "us-east-1",
    "SES": {
      "From": "noreply@smartqr.com",
      "FromName": "Smart QR System"
    }
  },
  "Email": {
    "QueueProcessingInterval": "00:05:00",
    "MaxRetryCount": 3,
    "RetryDelayMinutes": 5,
    "IsEnabled": true,
    "UseAwsSes": true
  }
}
```

### API Endpoints

```typescript
// Get All Templates
GET /api/sys/email-template
Response: EmailTemplateDto[]

// Get Template by ID
GET /api/sys/email-template/{templateId}
Response: EmailTemplateDto

// Create Email Template
POST /api/sys/email-template
Body: EmailTemplateCreateDto
Response: EmailTemplateDto

// Update Email Template
PUT /api/sys/email-template/{templateId}
Body: EmailTemplateUpdateDto
Response: { success: boolean }

// Send Test Email
POST /api/sys/email-template/{templateId}/send-test
Body: { recipientEmail: string, placeholderData: object }
Response: { success: boolean, messageId: string }

// Get Email Queue Status
GET /api/sys/email/queue-status
Response: { pending: number, failed: number }

// Get Email Audit Log
GET /api/sys/email/audit-log?filter=...
Response: EmailAuditDto[]
```

---

## Grid Export (PDF + Excel)

### Purpose

The **Grid Export** feature enables users to export filtered, sorted grid data to professional PDF and Excel formats with customizable styling, headers, footers, and company branding.

### Key Features

✅ **Export Formats**
- **Excel (.xlsx)**: Full formatting, formulas, multiple sheets
- **PDF (A4)**: Print-ready, landscape/portrait options

✅ **Data Selection**
- Export all records or current page
- Export filtered data only
- Select specific columns
- Custom column order

✅ **Customization**
- Report title
- Include headers/footers
- Page numbering
- Company logo/branding
- Custom footer text

✅ **Styling**
- Column headers with formatting
- Data type-specific formatting
- Alternating row colors (Excel)
- Font customization

✅ **Performance**
- Efficient large dataset handling
- Streaming download
- Client-side generation option

### Implementation Details

**Technology Stack:**
- **Excel Generation**: ExcelJS (javascript library)
- **PDF Generation**: jsPDF + html2pdf
- **Export Trigger**: DevExtreme Grid toolbar button

**Export Process Flow:**

```
User Clicks [Export to Excel/PDF]
        ↓
Export Dialog Opens
├─ Column Selection
├─ Report Title
├─ Include Filters Info
└─ Export Format Selection
        ↓
User Confirms Export
        ↓
Fetch Grid Data
├─ Get current filter config
├─ Get current sort config
├─ Fetch all matching records
└─ Include selected columns only
        ↓
Format Data for Export
├─ Apply column formatting
├─ Add headers & footers
├─ Add branding
└─ Add metadata (date, user, etc.)
        ↓
Generate File
├─ Excel: Create workbook with styling
├─ PDF: Convert HTML to PDF
└─ Trigger browser download
```

### Demo Scenario - Export QR Code List

#### Step 1: Grid with Filters Applied

```
Current View: "Active Menu QRs"
┌──────────────────────────────────────────────┐
│ QR Management - Advanced View                │
├──────────────────────────────────────────────┤
│ [Create] [Import] [Export ▼] [View: Active..]│
├──────────────────────────────────────────────┤
│                                              │
│ Applied Filters:                             │
│ • QR Type = "Menu"                          │
│ • Status = "Active"                         │
│ • Created >= 2026-01-01                     │
│                                              │
│ QR Name  │ Type │ Status │ Domain │ Created│
├──────────────────────────────────────────────┤
│ QR-A001  │ Menu │ Active │ DOM-A  │ Jan 15│
│ QR-A005  │ Menu │ Active │ DOM-B  │ Feb 20│
│ QR-A010  │ Menu │ Active │ DOM-A  │ Mar 10│
│                                              │
│ Total: 3 records                            │
└──────────────────────────────────────────────┘
```

#### Step 2: Open Export Dialog

**User Action: Click Export → Export to Excel**

```
Export Options Dialog:
┌─────────────────────────────────────────────┐
│ Export Grid to Excel                       │
├─────────────────────────────────────────────┤
│                                             │
│ Report Configuration:                       │
│ ┌─────────────────────────────────────────┐│
│ │ Report Title:                           ││
│ │ [QR Code Management Report]             ││
│ │                                         ││
│ │ Include Information:                    ││
│ │ ☑ Column Headers                       ││
│ │ ☑ Applied Filters                      ││
│ │ ☑ Generated Date                       ││
│ │ ☑ Exported By (User)                   ││
│ │ ☑ Page Numbers                         ││
│ │                                         ││
│ │ Export Scope:                           ││
│ │ ○ Current Page Only                    ││
│ │ ◉ All Matching Records (3 records)     ││
│ │                                         ││
│ └─────────────────────────────────────────┘│
│                                             │
│ Column Selection:                           │
│ ┌─────────────────────────────────────────┐│
│ │ ☑ QR Name                              ││
│ │ ☑ QR Type                              ││
│ │ ☑ Status                               ││
│ │ ☑ Domain                               ││
│ │ ☑ Created Date                         ││
│ │ ☐ QR Code (Image)                      ││
│ │ ☐ Description                          ││
│ │                                         ││
│ │ [Move Up] [Move Down]                  ││
│ └─────────────────────────────────────────┘│
│                                             │
│ [Export to Excel] [Cancel]                 │
└─────────────────────────────────────────────┘
```

#### Step 3: Generate & Download Excel

```
Backend Process:

[1] Fetch Data
├─ Query: SELECT * FROM QRMaster
│  WHERE QRType = 'Menu' AND Status = 'Active'
│  AND CreatedDate >= '2026-01-01'
├─ Results: 3 records
└─ Execute with selected columns only

[2] Format Data
├─ Apply column headers
├─ Format dates to "YYYY-MM-DD"
├─ Format currency (if applicable)
└─ Format status badges

[3] Create Excel Workbook
├─ Create worksheet: "QR Codes"
├─ Add header row with styling
│  ├─ Background: #1d62c4
│  ├─ Font Color: White
│  ├─ Font Weight: Bold
│  └─ Font Size: 12
│
├─ Add data rows
│  ├─ Row 1: [QR-A001, Menu, Active, DOM-A, Jan 15]
│  ├─ Row 2: [QR-A005, Menu, Active, DOM-B, Feb 20]
│  ├─ Row 3: [QR-A010, Menu, Active, DOM-A, Mar 10]
│  └─ Alternating row colors: White, Light Gray
│
├─ Add summary row
│  ├─ Total Records: 3
│  ├─ Background: Light Blue
│  └─ Font Weight: Bold
│
├─ Add metadata sheet
│  ├─ Title: "QR Code Management Report"
│  ├─ Filters Applied: "QR Type = Menu, Status = Active, Created >= 2026-01-01"
│  ├─ Generated Date: 2026-04-27 15:45:00
│  ├─ Exported By: user@smartqr.com
│  ├─ Total Records: 3
│  └─ Copyright: "© 2026 Smart QR System"
│
└─ Set column widths
   ├─ QR Name: 200px
   ├─ QR Type: 100px
   ├─ Status: 100px
   ├─ Domain: 120px
   └─ Created Date: 150px

[4] Trigger Download
└─ File: QR_Report_2026-04-27_154500.xlsx
   Size: ~50KB
   Status: Ready for download
```

**Generated Excel File Preview:**

```
┌────────────────────────────────────────────────────┐
│ QR Code Management Report (Sheet 1)               │
├────────────────────────────────────────────────────┤
│                                                    │
│ Report Title: QR Code Management Report           │
│ Generated: 2026-04-27 15:45:00                    │
│ Exported By: John Manager (user@smartqr.com)      │
│                                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│ QR Name  │ QR Type │ Status │ Domain │ Created   │
├────────────────────────────────────────────────────┤
│ QR-A001  │ Menu    │ Active │ DOM-A  │ 2026-01-15│
│ QR-A005  │ Menu    │ Active │ DOM-B  │ 2026-02-20│
│ QR-A010  │ Menu    │ Active │ DOM-A  │ 2026-03-10│
├────────────────────────────────────────────────────┤
│ Total Records: 3                                   │
│                                                    │
│ Filters Applied:                                  │
│ • QR Type = Menu                                 │
│ • Status = Active                                │
│ • Created Date >= 2026-01-01                     │
│                                                    │
│ © 2026 Smart QR System. All rights reserved.     │
└────────────────────────────────────────────────────┘

Sheet 2: Metadata
├─ Title: "QR Code Management Report"
├─ Total Records: 3
├─ Filters: "Type=Menu, Status=Active, Created>=2026-01-01"
├─ Generated: 2026-04-27 15:45:00
└─ Exported By: user@smartqr.com
```

#### Step 4: Export to PDF

**User Action: Export to PDF**

```
Similar to Excel export, but generates PDF instead

PDF Output Options:
┌─────────────────────────────────────────────┐
│ Export Grid to PDF                         │
├─────────────────────────────────────────────┤
│                                             │
│ Page Setup:                                 │
│ ○ Portrait (A4)                           │
│ ◉ Landscape (A4)  ← Better for tables     │
│                                             │
│ Header:                                     │
│ [QR Code Management Report]                │
│                                             │
│ Footer:                                     │
│ [Page [X] of [Y] | © 2026 Smart QR]       │
│                                             │
│ [Export to PDF] [Cancel]                   │
└─────────────────────────────────────────────┘

Generated PDF:
┌──────────────────────────────────────────────┐
│                    LANDSCAPE A4               │
│                                              │
│ ╔════════════════════════════════════════╗  │
│ ║ QR Code Management Report              ║  │
│ ║ Generated: 2026-04-27 15:45            ║  │
│ ╚════════════════════════════════════════╝  │
│                                              │
│ QR Name  │ QR Type │ Status │ Domain │ Date│
├──────────────────────────────────────────────┤
│ QR-A001  │ Menu    │ Active │ DOM-A  │01-15│
│ QR-A005  │ Menu    │ Active │ DOM-B  │02-20│
│ QR-A010  │ Menu    │ Active │ DOM-A  │03-10│
│                                              │
│ Total Records: 3                            │
│ Report Date: 2026-04-27                     │
│ Exported By: John Manager                   │
│                                              │
│ ────────────────────────────────────────    │
│ Page 1 of 1       © 2026 Smart QR System    │
│ ────────────────────────────────────────    │
└──────────────────────────────────────────────┘
```

### Code Example - Export Service

```typescript
// export.service.ts
import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import * as jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportToExcel(
    data: any[],
    columns: string[],
    reportTitle: string,
    fileName: string
  ): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Add title
    worksheet.addRow([reportTitle]);
    worksheet.lastRow.font = { bold: true, size: 14 };

    // Add metadata
    worksheet.addRow([`Generated: ${new Date().toLocaleString()}`]);
    worksheet.addRow([`Exported By: ${this.getCurrentUser()}`]);
    worksheet.addRow([]); // Empty row

    // Add headers
    const headerRow = worksheet.addRow(columns);
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1d62c4' }
    };
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Add data rows
    data.forEach((row, index) => {
      const dataRow = worksheet.addRow(
        columns.map(col => row[col])
      );
      
      // Alternating row colors
      if (index % 2 === 0) {
        dataRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF0F0F0' }
        };
      }
    });

    // Set column widths
    worksheet.columns = columns.map(col => ({
      header: col,
      width: 20
    }));

    // Save file
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}_${new Date().getTime()}.xlsx`;
      link.click();
    });
  }

  exportToPDF(
    htmlContent: string,
    fileName: string
  ): void {
    const opt = {
      margin: 10,
      filename: `${fileName}_${new Date().getTime()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'l', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(htmlContent).save();
  }

  private getCurrentUser(): string {
    // Get from auth service
    return 'user@smartqr.com';
  }
}
```

### API Endpoints

```typescript
// Export Grid Data
POST /api/grid/export
Body: {
  entityType: string,
  filterConfig: object,
  columns: string[],
  format: 'excel' | 'pdf',
  reportTitle: string,
  includeFilters: boolean
}
Response: File (binary)

// Get Available Columns for Export
GET /api/grid/{entityType}/export-columns
Response: ColumnMetadataDto[]
```

---

## Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  Smart QR Admin UI (Angular)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │Home Page     │  │Advanced View  │  │Approval      │     │
│  │(Welcome)     │  │(Grid + Filter)│  │Workflow UI   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │Data Migration│  │Custom Fields │  │Export Grid   │     │
│  │(Excel Import)│  │(Dynamic Form)│  │(PDF + Excel) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                         ↓↓↓ HTTP REST API ↓↓↓
┌─────────────────────────────────────────────────────────────┐
│          ASP.NET Core 8 API (Smart_QR_API)                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │Auth Module   │  │User/Domain   │  │Menu Config   │     │
│  │(JWT)         │  │Management    │  │             │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │Approval      │  │Custom Fields │  │Email Service │     │
│  │Workflow      │  │Management    │  │             │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │QR Management │  │Grid/Export   │  │Data Migration│     │
│  │             │  │             │  │             │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Repository Pattern (IRepository<T>)               │   │
│  │  Unit of Work Pattern                              │   │
│  │  Dependency Injection Container                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                    ↓↓↓ Entity Framework Core ↓↓↓
┌─────────────────────────────────────────────────────────────┐
│              SQL Server Database                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  USER MANAGEMENT                                           │
│  ├─ SysUser, SysRole, SysMenu, SysUserDomain             │
│                                                             │
│  APPROVAL WORKFLOW                                         │
│  ├─ APP_Workflow, APP_WorkflowStep, APP_ApprovalRequest  │
│  └─ APP_ApprovalRequestLog, APP_ApprovalNotification     │
│                                                             │
│  CUSTOM FIELDS                                             │
│  ├─ CFD_Entity, CFD_EntityField, CFD_FieldOption        │
│  ├─ CFD_EntityFieldValue, CFD_EntityFieldValueAudit     │
│  └─ CfdEntityCustomView                                  │
│                                                             │
│  EMAIL SERVICE                                             │
│  ├─ CrmEmailTemplate, CrmEmailQueue, CrmEmailLog         │
│  └─ SysConfig                                            │
│                                                             │
│  QR CODE DATA                                              │
│  ├─ QR_Master, QR_Config, QR_Analytics                   │
│  └─ Shop_Master, Product_Master                          │
│                                                             │
│  DATA MIGRATION                                            │
│  ├─ DAT_MigrationJob, DAT_MigrationDetail                │
│  └─ DAT_ImportMapping                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                ↓↓↓ External Services Integration ↓↓↓
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  AWS SES (Email Sending)  │  Hangfire (Background Jobs)   │
│                           │                              │
│  SmartPay Gateway         │  File Storage Services        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram - Feature Interaction

```
USER INITIATES ACTION (e.g., "Create QR Code")
         ↓
    FRONTEND (Angular)
    ├─ Validate input (Custom Fields)
    ├─ Show loading spinner
    └─ Send POST request with data
         ↓
    API (ASP.NET Core)
    ├─ Authenticate (JWT token)
    ├─ Validate request
    ├─ Execute business logic
    ├─ Create database record
    ├─ Trigger Approval Workflow
    │  └─ Create APP_ApprovalRequest
    │  └─ Assign to approvers
    ├─ Queue Email Notifications
    │  └─ INSERT into CrmEmailQueue
    └─ Return response to frontend
         ↓
    BACKGROUND JOBS (Hangfire)
    ├─ Process Email Queue
    │  ├─ Get pending emails
    │  ├─ Render templates
    │  ├─ Send via AWS SES
    │  └─ Log results
    └─ Update workflow timeouts
         ↓
    EXTERNAL SERVICES
    ├─ AWS SES
    │  └─ Deliver email
    └─ Logs
         ↓
    FRONTEND RECEIVES RESPONSE
    ├─ Show success message
    ├─ Refresh grid
    ├─ Navigate to approval list
    └─ Display notifications
```

---

## Setup & Configuration

### Prerequisites

```
✓ .NET SDK 8.0 or later
✓ SQL Server 2019+ (Express or Standard)
✓ Node.js 16+ and npm
✓ Visual Studio 2022 or VS Code
✓ AWS SES Account (for email)
```

### Backend Setup

**1. Install Dependencies**

```bash
cd Smart_QR_API
dotnet restore
```

**2. Configure Database Connection**

Edit `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "constring": "Data Source=localhost;Initial Catalog=SmartQR_DB;Integrated Security=True;TrustServerCertificate=True",
    "HangfireConnection": "Server=localhost;Database=SmartQR_Hangfire;Integrated Security=True;TrustServerCertificate=True;"
  }
}
```

**3. Configure Email Service**

```json
{
  "Admin": {
    "EmailAddress": "your-admin-email@example.com"
  },
  "AWS": {
    "AccessKey": "YOUR_AWS_ACCESS_KEY",
    "SecretKey": "YOUR_AWS_SECRET_KEY",
    "Region": "us-east-1",
    "SES": {
      "From": "noreply@yourdomain.com",
      "FromName": "Smart QR System"
    }
  }
}
```

**4. Run Migrations**

```bash
dotnet ef database update
```

**5. Run API**

```bash
dotnet run
# API will start at: https://localhost:5001
```

### Frontend Setup

**1. Install Dependencies**

```bash
cd Smart_QR_UI
npm install
```

**2. Configure API URL**

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  baseApiUrl: 'https://localhost:5001/api',
  baseAdminUrl: 'http://localhost:4200'
};
```

**3. Start Dev Server**

```bash
npm start
# UI will start at: http://localhost:4200
```

### First Use Checklist

- [ ] Create default admin user
- [ ] Set admin email in appsettings.json
- [ ] Configure AWS SES credentials
- [ ] Create email templates in CrmEmailTemplate
- [ ] Define workflow configurations in APP_Workflow
- [ ] Configure custom fields for entities
- [ ] Test email notifications
- [ ] Verify approval workflow
- [ ] Test data migration with sample file
- [ ] Verify grid export functionality

---

## Conclusion

The Smart QR **Common Features** provide a robust, enterprise-grade foundation for QR code management with:

- **Flexible Workflows**: Multi-step approval with dynamic routing
- **Extensibility**: Custom fields without code changes
- **Automation**: Email notifications and background jobs
- **Usability**: Advanced grid filtering and exports
- **Data Management**: Bulk import with validation
- **Audit Trail**: Complete compliance logging

These features work seamlessly together to create a professional, scalable application.

---

**Last Updated**: 2026-04-27  
**Version**: 1.0  
**Maintained By**: Smart QR Development Team
