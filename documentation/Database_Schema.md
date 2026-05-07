# Smart QR - Database Schema Reference

**Version**: 1.0  
**Last Updated**: 2026-04-27  
**Database**: SQL Server 2019+

---

## Table of Contents

1. [Overview](#overview)
2. [Core Tables](#core-tables)
3. [User & Security](#user--security)
4. [Approval Workflow](#approval-workflow)
5. [Custom Fields](#custom-fields)
6. [Email Service](#email-service)
7. [Data Migration](#data-migration)
8. [QR Code Management](#qr-code-management)
9. [Relationships](#relationships)
10. [Indexes & Performance](#indexes--performance)

---

## Overview

Smart QR database consists of **50+ tables** organized into functional groups:

| Group | Purpose | Tables |
|-------|---------|--------|
| **System** | Core configuration & settings | 10 tables |
| **User Management** | Users, roles, permissions | 8 tables |
| **Workflow** | Approval workflows | 6 tables |
| **Custom Fields** | Dynamic field framework | 6 tables |
| **Email** | Email templates & queue | 4 tables |
| **QR Codes** | QR code data | 8 tables |
| **Billing** | Credit & payments | 6 tables |
| **Audit** | Logging & audit trails | 5 tables |

---

## Core Tables

### SysConfig

**Purpose**: System configuration settings

```sql
CREATE TABLE SysConfig (
    ConfigID NVARCHAR(50) PRIMARY KEY,
    DefaultEmailAddress NVARCHAR(200),
    DefaultEmailClient NVARCHAR(200),
    DefaultEmailPassword NVARCHAR(200),
    WebUIURL NVARCHAR(200),
    WebAPIURL NVARCHAR(200),
    OtpExpiredMinute INT,
    LicenseKey NVARCHAR(500),
    CompanyName NVARCHAR(200),
    CompanyLogo NVARCHAR(500),
    Timezone NVARCHAR(50),
    DateFormat NVARCHAR(50),
    CurrencyCode NVARCHAR(5),
    IsProductionMode BIT DEFAULT 0,
    CreatedOn DATETIME DEFAULT GETDATE(),
    ModifiedOn DATETIME,
    ModifiedBy NVARCHAR(50)
);
```

**Key Columns**:
- `ConfigID`: Unique configuration record ID (usually "1")
- `DefaultEmailAddress`: Primary admin email
- `WebUIURL`: Frontend application URL
- `WebAPIURL`: Backend API URL

**Example Query**:
```sql
SELECT ConfigID, DefaultEmailAddress, WebUIURL 
FROM SysConfig;
```

---

### SysModule

**Purpose**: Module/Feature definitions

```sql
CREATE TABLE SysModule (
    ModuleID NVARCHAR(50) PRIMARY KEY,
    ModuleName NVARCHAR(100) NOT NULL,
    ModuleCode NVARCHAR(50) UNIQUE,
    Description NVARCHAR(500),
    IconClass NVARCHAR(100),
    DisplayOrder INT,
    ParentModuleID NVARCHAR(50),
    IsActive BIT DEFAULT 1,
    CreatedOn DATETIME DEFAULT GETDATE(),
    CreatedBy NVARCHAR(50)
);
```

**Sample Data**:
```
ModuleID | ModuleName | ParentModuleID | IsActive
---------|------------|----------------|----------
MOD-SYS  | System     | NULL           | 1
MOD-USR  | User Mgmt  | MOD-SYS        | 1
MOD-WF   | Workflow   | MOD-SYS        | 1
MOD-QR   | QR Codes   | NULL           | 1
```

---

## User & Security

### SysUser

**Purpose**: User accounts

```sql
CREATE TABLE SysUser (
    UserID NVARCHAR(50) PRIMARY KEY,
    UserName NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    FullName NVARCHAR(100),
    PhoneNumber NVARCHAR(20),
    Password NVARCHAR(500), -- Hashed bcrypt
    PasswordSalt NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    IsLocked BIT DEFAULT 0,
    LastLogin DATETIME,
    FailedAttempts INT DEFAULT 0,
    LockedUntil DATETIME,
    Department NVARCHAR(100),
    ProfilePicture NVARCHAR(500),
    PreferredLanguage NVARCHAR(10) DEFAULT 'en',
    TwoFactorEnabled BIT DEFAULT 0,
    CreatedOn DATETIME DEFAULT GETDATE(),
    CreatedBy NVARCHAR(50),
    ModifiedOn DATETIME,
    ModifiedBy NVARCHAR(50)
);

-- Indexes
CREATE UNIQUE INDEX IX_SysUser_UserName ON SysUser(UserName);
CREATE UNIQUE INDEX IX_SysUser_Email ON SysUser(Email);
CREATE INDEX IX_SysUser_IsActive ON SysUser(IsActive);
```

**Key Columns**:
- `UserID`: Unique user identifier
- `UserName`: Login username
- `Email`: Email address
- `IsActive`: Account status
- `Password`: Bcrypt hashed password
- `TwoFactorEnabled`: 2FA status

**Example Query**:
```sql
SELECT UserID, UserName, Email, IsActive 
FROM SysUser 
WHERE IsActive = 1 
ORDER BY CreatedOn DESC;
```

---

### SysRole

**Purpose**: Role definitions

```sql
CREATE TABLE SysRole (
    RoleID NVARCHAR(50) PRIMARY KEY,
    RoleName NVARCHAR(100) NOT NULL,
    RoleCode NVARCHAR(50) UNIQUE,
    Description NVARCHAR(500),
    DisplayOrder INT,
    IsSystem BIT DEFAULT 0, -- System roles can't be deleted
    IsActive BIT DEFAULT 1,
    CreatedOn DATETIME DEFAULT GETDATE(),
    CreatedBy NVARCHAR(50)
);
```

**Sample Roles**:
```
RoleID    | RoleName    | RoleCode
----------|-------------|----------
ROLE-001  | Admin       | ADMIN
ROLE-002  | QR Manager  | QR_MANAGER
ROLE-003  | Staff       | STAFF
ROLE-004  | Viewer      | VIEWER
```

---

### SysUserRole

**Purpose**: User-to-Role mapping

```sql
CREATE TABLE SysUserRole (
    UserRoleID NVARCHAR(50) PRIMARY KEY,
    UserID NVARCHAR(50) NOT NULL,
    RoleID NVARCHAR(50) NOT NULL,
    AssignedOn DATETIME DEFAULT GETDATE(),
    AssignedBy NVARCHAR(50),
    ExpiresOn DATETIME, -- Optional role expiration
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (UserID) REFERENCES SysUser(UserID) ON DELETE CASCADE,
    FOREIGN KEY (RoleID) REFERENCES SysRole(RoleID),
    UNIQUE(UserID, RoleID) -- One role per user pair
);
```

**Example Query**:
```sql
SELECT u.UserName, r.RoleName, ur.AssignedOn
FROM SysUserRole ur
JOIN SysUser u ON ur.UserID = u.UserID
JOIN SysRole r ON ur.RoleID = r.RoleID
WHERE u.UserID = 'USR-001';
```

---

### SysMenu

**Purpose**: Menu items for UI navigation

```sql
CREATE TABLE SysMenu (
    MenuID NVARCHAR(50) PRIMARY KEY,
    MenuName NVARCHAR(100) NOT NULL,
    MenuCode NVARCHAR(50),
    MenuURL NVARCHAR(200),
    IconClass NVARCHAR(100),
    DisplayOrder INT,
    ParentMenuID NVARCHAR(50), -- For submenus
    IsVisible BIT DEFAULT 1,
    RequiredModule NVARCHAR(50),
    CreatedOn DATETIME DEFAULT GETDATE()
);
```

---

### SysRoleMenu

**Purpose**: Role-to-Menu access control

```sql
CREATE TABLE SysRoleMenu (
    RoleMenuID NVARCHAR(50) PRIMARY KEY,
    RoleID NVARCHAR(50) NOT NULL,
    MenuID NVARCHAR(50) NOT NULL,
    CanCreate BIT DEFAULT 0,
    CanRead BIT DEFAULT 1,
    CanUpdate BIT DEFAULT 0,
    CanDelete BIT DEFAULT 0,
    FOREIGN KEY (RoleID) REFERENCES SysRole(RoleID),
    FOREIGN KEY (MenuID) REFERENCES SysMenu(MenuID),
    UNIQUE(RoleID, MenuID)
);
```

**Example Query**:
```sql
-- Get menus for a role
SELECT m.MenuName, m.MenuURL, rm.CanCreate, rm.CanUpdate, rm.CanDelete
FROM SysRoleMenu rm
JOIN SysMenu m ON rm.MenuID = m.MenuID
WHERE rm.RoleID = 'ROLE-002'
AND m.IsVisible = 1
ORDER BY m.DisplayOrder;
```

---

## Approval Workflow

### APP_Workflow

**Purpose**: Workflow definitions

```sql
CREATE TABLE APP_Workflow (
    WorkflowID NVARCHAR(50) PRIMARY KEY,
    WorkflowName NVARCHAR(200) NOT NULL,
    WorkflowCode NVARCHAR(50) UNIQUE,
    Description NVARCHAR(500),
    EntityType NVARCHAR(50), -- QR, Content, Config, etc.
    Status NVARCHAR(50), -- Draft, Active, Inactive
    TotalSteps INT,
    IsDefault BIT DEFAULT 0,
    CreatedOn DATETIME DEFAULT GETDATE(),
    CreatedBy NVARCHAR(50),
    ModifiedOn DATETIME,
    ModifiedBy NVARCHAR(50)
);
```

**Sample Workflow**:
```
WorkflowID | WorkflowName       | EntityType | Status
-----------|-------------------|------------|--------
WF-QR-001  | QR Code Approval   | QR         | Active
WF-QR-002  | Content Moderation | Content    | Active
WF-CFG-001 | Config Change      | Config     | Draft
```

---

### APP_WorkflowStep

**Purpose**: Workflow step definitions

```sql
CREATE TABLE APP_WorkflowStep (
    StepID NVARCHAR(50) PRIMARY KEY,
    WorkflowID NVARCHAR(50) NOT NULL,
    StepNumber INT NOT NULL, -- 1, 2, 3...
    StepName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(500),
    StepType NVARCHAR(50), -- Sequential, Parallel
    TimeoutDays INT DEFAULT 0, -- 0 = no timeout
    EscalationRule NVARCHAR(50), -- None, Auto-escalate
    CanDelegate BIT DEFAULT 1,
    CreatedOn DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (WorkflowID) REFERENCES APP_Workflow(WorkflowID) ON DELETE CASCADE,
    UNIQUE(WorkflowID, StepNumber)
);
```

**Example Query**:
```sql
-- Get workflow steps
SELECT s.StepNumber, s.StepName, s.StepType, s.TimeoutDays
FROM APP_WorkflowStep s
WHERE s.WorkflowID = 'WF-QR-001'
ORDER BY s.StepNumber;
```

---

### APP_WorkflowStepApprover

**Purpose**: Approvers for each workflow step

```sql
CREATE TABLE APP_WorkflowStepApprover (
    ApproverID NVARCHAR(50) PRIMARY KEY,
    StepID NVARCHAR(50) NOT NULL,
    ApprovalType NVARCHAR(50), -- Role, User, Department, Hierarchy
    ApprovalValue NVARCHAR(100), -- RoleID, UserID, DeptID, etc.
    DisplayOrder INT,
    IsMandatory BIT DEFAULT 1,
    NotifyEmail NVARCHAR(200),
    CreatedOn DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (StepID) REFERENCES APP_WorkflowStep(StepID) ON DELETE CASCADE
);
```

---

### APP_ApprovalRequest

**Purpose**: Individual approval requests

```sql
CREATE TABLE APP_ApprovalRequest (
    RequestID NVARCHAR(50) PRIMARY KEY,
    WorkflowID NVARCHAR(50) NOT NULL,
    EntityType NVARCHAR(50),
    EntityID NVARCHAR(50),
    EntityData NVARCHAR(MAX), -- JSON payload
    ReferenceNumber NVARCHAR(100),
    RequestedBy NVARCHAR(50) NOT NULL,
    RequestedOn DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(50), -- Pending, In Progress, Approved, Rejected
    CurrentStep INT,
    CurrentApprovalCount INT DEFAULT 0,
    TotalApprovals INT,
    RejectionReason NVARCHAR(500),
    RejectedOn DATETIME,
    RejectedBy NVARCHAR(50),
    CompletedOn DATETIME,
    Priority NVARCHAR(50) DEFAULT 'Normal',
    CreatedOn DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (WorkflowID) REFERENCES APP_Workflow(WorkflowID)
);

CREATE INDEX IX_APPApprovalRequest_Status ON APP_ApprovalRequest(Status);
CREATE INDEX IX_APPApprovalRequest_CurrentStep ON APP_ApprovalRequest(CurrentStep);
```

**Example Query**:
```sql
-- Get pending approvals for current user's role
SELECT RequestID, EntityType, EntityID, Status, RequestedOn
FROM APP_ApprovalRequest
WHERE Status = 'Pending'
AND CurrentStep IN (
    SELECT s.StepNumber
    FROM APP_WorkflowStep s
    WHERE s.WorkflowID = (
        SELECT a.WorkflowID FROM APP_ApprovalRequest a WHERE a.RequestID = APP_ApprovalRequest.RequestID
    )
)
ORDER BY RequestedOn DESC;
```

---

### APP_ApprovalRequestLog

**Purpose**: Approval history and audit trail

```sql
CREATE TABLE APP_ApprovalRequestLog (
    LogID NVARCHAR(50) PRIMARY KEY,
    RequestID NVARCHAR(50) NOT NULL,
    StepID NVARCHAR(50),
    ApproverId NVARCHAR(50),
    Action NVARCHAR(50), -- Approved, Rejected, Revised, Escalated, Delegated
    Comments NVARCHAR(MAX),
    ActionDate DATETIME DEFAULT GETDATE(),
    IPAddress NVARCHAR(50),
    UserAgent NVARCHAR(500),
    FOREIGN KEY (RequestID) REFERENCES APP_ApprovalRequest(RequestID) ON DELETE CASCADE
);
```

---

## Custom Fields

### CFD_Entity

**Purpose**: Entity definitions for custom fields

```sql
CREATE TABLE CFD_Entity (
    EntityID NVARCHAR(50) PRIMARY KEY,
    EntityName NVARCHAR(100) NOT NULL UNIQUE, -- Shop, Product, QRType
    EntityDisplayName NVARCHAR(100),
    TableName NVARCHAR(100), -- Underlying database table
    IconClass NVARCHAR(100),
    Description NVARCHAR(500),
    ModuleID NVARCHAR(50),
    IsActive BIT DEFAULT 1,
    CreatedOn DATETIME DEFAULT GETDATE(),
    CreatedBy NVARCHAR(50)
);
```

**Sample Data**:
```
EntityID    | EntityName | TableName | IsActive
------------|------------|-----------|----------
ENT-SHOP    | Shop       | Shop_     | 1
ENT-PRODUCT | Product    | Product_  | 1
ENT-DOMAIN  | Domain     | Domain_   | 1
```

---

### CFD_EntityField

**Purpose**: Custom field definitions

```sql
CREATE TABLE CFD_EntityField (
    FieldID NVARCHAR(50) PRIMARY KEY,
    EntityID NVARCHAR(50) NOT NULL,
    FieldName NVARCHAR(100) NOT NULL, -- shop_category
    DisplayName NVARCHAR(100), -- Shop Category
    FieldType NVARCHAR(50), -- Text, Number, Date, Dropdown, Checkbox
    DisplayOrder INT,
    IsRequired BIT DEFAULT 0,
    IsVisible BIT DEFAULT 1,
    DefaultValue NVARCHAR(500),
    ValidationRule NVARCHAR(MAX), -- JSON: {min: 5, max: 100, pattern: "^[A-Z]"}
    HelpText NVARCHAR(500),
    Tooltip NVARCHAR(500),
    FieldLength INT,
    DecimalPlaces INT,
    VisibilityRule NVARCHAR(MAX), -- JSON: {roles: [1,2,3]}
    CreatedOn DATETIME DEFAULT GETDATE(),
    ModifiedOn DATETIME,
    FOREIGN KEY (EntityID) REFERENCES CFD_Entity(EntityID) ON DELETE CASCADE,
    UNIQUE(EntityID, FieldName)
);
```

**Example Dropdown Field**:
```sql
INSERT INTO CFD_EntityField (
    FieldID, EntityID, FieldName, DisplayName, FieldType,
    DisplayOrder, IsRequired, DefaultValue
) VALUES (
    'FIELD-SHOP-CAT', 'ENT-SHOP', 'shop_category', 'Shop Category',
    'Dropdown', 1, 1, 'Retail'
);
```

---

### CFD_FieldOption

**Purpose**: Options for dropdown/radio fields

```sql
CREATE TABLE CFD_FieldOption (
    OptionID NVARCHAR(50) PRIMARY KEY,
    FieldID NVARCHAR(50) NOT NULL,
    OptionValue NVARCHAR(100), -- Internal value
    OptionLabel NVARCHAR(200), -- Display label
    DisplayOrder INT,
    IsActive BIT DEFAULT 1,
    CreatedOn DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (FieldID) REFERENCES CFD_EntityField(FieldID) ON DELETE CASCADE
);
```

---

### CFD_EntityFieldValue

**Purpose**: Custom field values for records

```sql
CREATE TABLE CFD_EntityFieldValue (
    ValueID NVARCHAR(50) PRIMARY KEY,
    EntityID NVARCHAR(50) NOT NULL,
    FieldID NVARCHAR(50) NOT NULL,
    RecordID NVARCHAR(50) NOT NULL, -- FK to main table
    FieldValue NVARCHAR(MAX),
    CreatedBy NVARCHAR(50),
    CreatedOn DATETIME DEFAULT GETDATE(),
    ModifiedBy NVARCHAR(50),
    ModifiedOn DATETIME,
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (EntityID) REFERENCES CFD_Entity(EntityID),
    FOREIGN KEY (FieldID) REFERENCES CFD_EntityField(FieldID),
    UNIQUE(RecordID, FieldID)
);
```

**Example Query**:
```sql
-- Get all custom field values for a shop
SELECT f.DisplayName, v.FieldValue
FROM CFD_EntityFieldValue v
JOIN CFD_EntityField f ON v.FieldID = f.FieldID
WHERE v.RecordID = 'SHOP-2026-001'
AND f.EntityID = 'ENT-SHOP';
```

---

### CFD_EntityFieldValueAudit

**Purpose**: Audit trail for custom field changes

```sql
CREATE TABLE CFD_EntityFieldValueAudit (
    AuditID NVARCHAR(50) PRIMARY KEY,
    ValueID NVARCHAR(50) NOT NULL,
    FieldID NVARCHAR(50) NOT NULL,
    RecordID NVARCHAR(50) NOT NULL,
    OldValue NVARCHAR(MAX),
    NewValue NVARCHAR(MAX),
    ChangedBy NVARCHAR(50),
    ChangedOn DATETIME DEFAULT GETDATE(),
    ChangeReason NVARCHAR(500),
    FOREIGN KEY (ValueID) REFERENCES CFD_EntityFieldValue(ValueID) ON DELETE CASCADE
);
```

---

### CfdEntityCustomView

**Purpose**: Saved grid view configurations

```sql
CREATE TABLE CfdEntityCustomView (
    CustomViewID NVARCHAR(50) PRIMARY KEY,
    EntityID NVARCHAR(50) NOT NULL,
    ViewName NVARCHAR(200) NOT NULL,
    ViewCode NVARCHAR(100),
    UserID NVARCHAR(50) NOT NULL,
    GridConfig NVARCHAR(MAX), -- JSON: columns, widths, visibility
    FilterConfig NVARCHAR(MAX), -- JSON: filter rules
    SortConfig NVARCHAR(MAX), -- JSON: sort order
    IsDefault BIT DEFAULT 0,
    IsPublic BIT DEFAULT 0, -- Share with team
    CreatedOn DATETIME DEFAULT GETDATE(),
    ModifiedOn DATETIME,
    FOREIGN KEY (EntityID) REFERENCES CFD_Entity(EntityID),
    FOREIGN KEY (UserID) REFERENCES SysUser(UserID)
);
```

---

## Email Service

### CrmEmailTemplate

**Purpose**: Email template definitions

```sql
CREATE TABLE CrmEmailTemplate (
    EmailTemplateID NVARCHAR(50) PRIMARY KEY,
    EmailTemplateNo NVARCHAR(50) UNIQUE, -- E-0020, E-0021
    Title NVARCHAR(200), -- Email subject
    Status NVARCHAR(50), -- Draft, Active, Inactive
    EmailBody NVARCHAR(MAX), -- HTML content with placeholders
    Remark NVARCHAR(500),
    Active BIT DEFAULT 1,
    CreatedBy NVARCHAR(50),
    CreatedOn DATETIME DEFAULT GETDATE(),
    ModifiedBy NVARCHAR(50),
    ModifiedOn DATETIME,
    LastAction NVARCHAR(50)
);

CREATE UNIQUE INDEX IX_CrmEmailTemplate_TemplateNo ON CrmEmailTemplate(EmailTemplateNo);
```

**Sample Templates**:
```
EmailTemplateNo | Title
---------------|-----------------------
E-0020          | New User Registration
E-0021          | QR Code Created
E-0022          | Approval Notification
E-0023          | Payment Received
```

---

### CrmEmailQueue

**Purpose**: Email queue for async processing

```sql
CREATE TABLE CrmEmailQueue (
    QueueID NVARCHAR(50) PRIMARY KEY,
    TemplateID NVARCHAR(50),
    RecipientEmail NVARCHAR(200) NOT NULL,
    RecipientName NVARCHAR(200),
    Subject NVARCHAR(500),
    EmailBody NVARCHAR(MAX), -- Rendered HTML
    PlaceholderData NVARCHAR(MAX), -- JSON
    Status NVARCHAR(50), -- Pending, Sent, Failed
    RetryCount INT DEFAULT 0,
    MaxRetry INT DEFAULT 3,
    NextRetryTime DATETIME,
    ErrorMessage NVARCHAR(MAX),
    CreatedOn DATETIME DEFAULT GETDATE(),
    SentOn DATETIME,
    FOREIGN KEY (TemplateID) REFERENCES CrmEmailTemplate(EmailTemplateID)
);

CREATE INDEX IX_CrmEmailQueue_Status ON CrmEmailQueue(Status);
CREATE INDEX IX_CrmEmailQueue_NextRetryTime ON CrmEmailQueue(NextRetryTime) WHERE Status = 'Failed';
```

---

### CrmEmailLog

**Purpose**: Complete email audit trail

```sql
CREATE TABLE CrmEmailLog (
    LogID NVARCHAR(50) PRIMARY KEY,
    QueueID NVARCHAR(50),
    TemplateNo NVARCHAR(50),
    RecipientEmail NVARCHAR(200),
    Subject NVARCHAR(500),
    Status NVARCHAR(50), -- Sent, Bounced, Complained, Failed
    MessageID NVARCHAR(100), -- AWS SES MessageId
    SentTime DATETIME,
    DeliveryTime DATETIME,
    BounceType NVARCHAR(50), -- Permanent, Transient
    BounceReason NVARCHAR(500),
    ComplaintType NVARCHAR(50),
    CreatedOn DATETIME DEFAULT GETDATE(),
    Remarks NVARCHAR(500),
    FOREIGN KEY (QueueID) REFERENCES CrmEmailQueue(QueueID)
);

CREATE INDEX IX_CrmEmailLog_Status ON CrmEmailLog(Status);
CREATE INDEX IX_CrmEmailLog_SentTime ON CrmEmailLog(SentTime);
```

---

## Data Migration

### DAT_MigrationJob

**Purpose**: Migration job history

```sql
CREATE TABLE DAT_MigrationJob (
    MigrationJobID NVARCHAR(50) PRIMARY KEY,
    MigrationName NVARCHAR(200),
    FileName NVARCHAR(500),
    EntityType NVARCHAR(100),
    TotalRows INT,
    SuccessfulRows INT DEFAULT 0,
    FailedRows INT DEFAULT 0,
    WarningRows INT DEFAULT 0,
    Status NVARCHAR(50), -- In Progress, Completed, Failed
    CreatedBy NVARCHAR(50),
    CreatedOn DATETIME DEFAULT GETDATE(),
    CompletedOn DATETIME
);
```

---

### DAT_MigrationDetail

**Purpose**: Details for each imported row

```sql
CREATE TABLE DAT_MigrationDetail (
    DetailID NVARCHAR(50) PRIMARY KEY,
    MigrationJobID NVARCHAR(50) NOT NULL,
    RowNumber INT,
    RecordData NVARCHAR(MAX), -- JSON
    ValidationStatus NVARCHAR(50), -- Valid, Invalid, Warning
    ErrorMessage NVARCHAR(MAX),
    CreatedRecordID NVARCHAR(50),
    CreatedOn DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MigrationJobID) REFERENCES DAT_MigrationJob(MigrationJobID) ON DELETE CASCADE
);
```

---

## QR Code Management

### QR_Master

**Purpose**: QR code records

```sql
CREATE TABLE QR_Master (
    QRId NVARCHAR(50) PRIMARY KEY,
    QRName NVARCHAR(200) NOT NULL,
    QRType NVARCHAR(50), -- Mall, Menu, Voucher, Event
    DomainID NVARCHAR(50),
    Status NVARCHAR(50), -- Active, Draft, Archived, Pending Approval
    QRContent NVARCHAR(MAX), -- URL or data
    QRImage NVARCHAR(500), -- Path to QR image
    ShortUrl NVARCHAR(200) UNIQUE,
    Description NVARCHAR(500),
    Views INT DEFAULT 0,
    Scans INT DEFAULT 0,
    CreatedOn DATETIME DEFAULT GETDATE(),
    CreatedBy NVARCHAR(50),
    ModifiedOn DATETIME,
    ModifiedBy NVARCHAR(50),
    ApprovedOn DATETIME,
    ApprovedBy NVARCHAR(50)
);

CREATE INDEX IX_QRMaster_Status ON QR_Master(Status);
CREATE INDEX IX_QRMaster_QRType ON QR_Master(QRType);
CREATE INDEX IX_QRMaster_DomainID ON QR_Master(DomainID);
```

---

## Relationships

### Entity Relationship Diagram (ERD)

```
User Management:
├─ SysUser ──────┐
│                ├──→ SysUserRole ──→ SysRole
│                │                      │
│                └──→ SysRoleMenu ──→ SysMenu
│
Approval Workflow:
├─ APP_Workflow
│  └─→ APP_WorkflowStep
│     └─→ APP_WorkflowStepApprover
│
├─ APP_ApprovalRequest
│  └─→ APP_ApprovalRequestLog
│
Custom Fields:
├─ CFD_Entity
│  └─→ CFD_EntityField
│     ├─→ CFD_FieldOption
│     └─→ CFD_EntityFieldValue
│        └─→ CFD_EntityFieldValueAudit
│
Email:
├─ CrmEmailTemplate
│  ├─→ CrmEmailQueue
│  └─→ CrmEmailLog
│
QR Codes:
├─ QR_Master
│  └─→ QR_Analytics
```

---

## Indexes & Performance

### Critical Indexes

```sql
-- User lookup
CREATE UNIQUE INDEX IX_SysUser_UserName ON SysUser(UserName);
CREATE UNIQUE INDEX IX_SysUser_Email ON SysUser(Email);
CREATE INDEX IX_SysUser_IsActive ON SysUser(IsActive);

-- Approval workflow
CREATE INDEX IX_ApprovalRequest_Status ON APP_ApprovalRequest(Status);
CREATE INDEX IX_ApprovalRequest_CurrentStep ON APP_ApprovalRequest(CurrentStep);
CREATE INDEX IX_ApprovalRequest_RequestedOn ON APP_ApprovalRequest(RequestedOn DESC);

-- Custom fields
CREATE INDEX IX_EntityFieldValue_RecordID ON CFD_EntityFieldValue(RecordID);
CREATE INDEX IX_EntityFieldValue_FieldID ON CFD_EntityFieldValue(FieldID);

-- Email queue
CREATE INDEX IX_EmailQueue_Status ON CrmEmailQueue(Status);
CREATE INDEX IX_EmailQueue_NextRetryTime ON CrmEmailQueue(NextRetryTime) 
    WHERE Status = 'Failed';

-- QR codes
CREATE INDEX IX_QRMaster_Status ON QR_Master(Status);
CREATE INDEX IX_QRMaster_QRType ON QR_Master(QRType);
CREATE INDEX IX_QRMaster_DomainID ON QR_Master(DomainID);
CREATE INDEX IX_QRMaster_CreatedOn ON QR_Master(CreatedOn DESC);
```

### Query Performance Tips

```sql
-- GOOD: Use indexed columns
SELECT * FROM SysUser WHERE UserName = 'admin';
SELECT * FROM QR_Master WHERE Status = 'Active' AND QRType = 'Menu';

-- BAD: Functions on indexed columns prevent index use
SELECT * FROM SysUser WHERE LOWER(UserName) = 'admin';
SELECT * FROM QR_Master WHERE YEAR(CreatedOn) = 2026;

-- GOOD: Pagination with indexed order
SELECT TOP 20 * FROM QR_Master 
WHERE Status = 'Active'
ORDER BY CreatedOn DESC;

-- BAD: Full table scan
SELECT * FROM QR_Master WHERE QRContent LIKE '%example%';
```

---

## Common Queries

### Get User with All Roles and Permissions

```sql
SELECT 
    u.UserID, u.UserName, u.Email,
    r.RoleID, r.RoleName,
    m.MenuID, m.MenuName,
    rm.CanCreate, rm.CanRead, rm.CanUpdate, rm.CanDelete
FROM SysUser u
LEFT JOIN SysUserRole ur ON u.UserID = ur.UserID AND ur.IsActive = 1
LEFT JOIN SysRole r ON ur.RoleID = r.RoleID
LEFT JOIN SysRoleMenu rm ON r.RoleID = rm.RoleID
LEFT JOIN SysMenu m ON rm.MenuID = m.MenuID
WHERE u.UserID = 'USR-001'
ORDER BY m.DisplayOrder;
```

### Get Pending Approvals Count

```sql
SELECT 
    s.StepName,
    COUNT(DISTINCT ar.RequestID) as PendingCount
FROM APP_ApprovalRequest ar
JOIN APP_WorkflowStep s ON ar.CurrentStep = s.StepNumber
WHERE ar.Status = 'Pending'
GROUP BY s.StepName
ORDER BY PendingCount DESC;
```

### Get Custom Field Values with Audit History

```sql
SELECT 
    cfv.RecordID,
    cef.DisplayName,
    cfv.FieldValue as CurrentValue,
    cfva.OldValue,
    cfva.NewValue,
    cfva.ChangedBy,
    cfva.ChangedOn
FROM CFD_EntityFieldValue cfv
LEFT JOIN CFD_EntityFieldValueAudit cfva ON cfv.ValueID = cfva.ValueID
JOIN CFD_EntityField cef ON cfv.FieldID = cef.FieldID
WHERE cfv.RecordID = 'SHOP-2026-001'
ORDER BY cfva.ChangedOn DESC;
```

### QR Code Analytics

```sql
SELECT 
    QRId, QRName, QRType,
    Views, Scans,
    CASE 
        WHEN Views = 0 THEN 0
        ELSE CAST((Scans * 100.0) / Views AS DECIMAL(5, 2))
    END as ScanRate,
    CreatedOn, CreatedBy
FROM QR_Master
WHERE Status = 'Active'
ORDER BY Views DESC;
```

---

## Database Maintenance

### Backup Strategy

```sql
-- Full backup
BACKUP DATABASE SmartQR_DB 
TO DISK = 'C:\Backups\SmartQR_DB_FULL.bak'
WITH INIT, NAME = 'SmartQR_DB_Full_Backup';

-- Transaction log backup
BACKUP LOG SmartQR_DB 
TO DISK = 'C:\Backups\SmartQR_DB_LOG.bak';
```

### Index Maintenance

```sql
-- Rebuild fragmented indexes
ALTER INDEX ALL ON SysUser REBUILD;

-- Update statistics
UPDATE STATISTICS SysUser;

-- Check index fragmentation
SELECT 
    OBJECT_NAME(ips.object_id) as TableName,
    i.name as IndexName,
    ips.avg_fragmentation_in_percent
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ips
JOIN sys.indexes i ON ips.object_id = i.object_id 
    AND ips.index_id = i.index_id
WHERE ips.avg_fragmentation_in_percent > 10;
```

---

**Database Schema Reference**  
**Last Updated**: 2026-04-27  
**Version**: 1.0
