# Smart QR - Troubleshooting & FAQ

**Version**: 1.0  
**Last Updated**: 2026-04-27  
**Purpose**: Common issues, solutions, and frequently asked questions

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Database Issues](#database-issues)
3. [Authentication & Authorization](#authentication--authorization)
4. [API Issues](#api-issues)
5. [Email Service Issues](#email-service-issues)
6. [Workflow Issues](#workflow-issues)
7. [Custom Fields Issues](#custom-fields-issues)
8. [Data Migration Issues](#data-migration-issues)
9. [Performance Issues](#performance-issues)
10. [Frequently Asked Questions](#frequently-asked-questions)

---

## Installation Issues

### Issue: ".NET SDK not found"

**Error Message:**
```
'dotnet' is not recognized as an internal or external command
```

**Cause**: .NET SDK not installed or not in system PATH

**Solution**:

```bash
# 1. Check if .NET is installed
dotnet --version

# 2. If not installed, download from:
# https://dotnet.microsoft.com/download

# 3. After installation, verify
dotnet --version
# Should output: 8.0.x or higher

# 4. Restart your terminal/IDE
```

---

### Issue: "Node.js not found"

**Error Message:**
```
'npm' is not recognized as an internal or external command
```

**Cause**: Node.js not installed or PATH not updated

**Solution**:

```bash
# 1. Check if Node is installed
node --version
npm --version

# 2. If not installed, download from:
# https://nodejs.org/

# 3. Verify installation
node --version
# Should output: v16.x or higher

npm --version
# Should output: 8.x or higher

# 4. Restart terminal/IDE
```

---

### Issue: "Port already in use"

**Error Message**:
```
System.Net.Sockets.SocketException: Address already in use
```

**Cause**: Port 5001 or 4200 is already in use by another application

**Solution**:

**Option A: Find and kill the process**

```bash
# Windows - Find process on port 5001
netstat -ano | findstr :5001

# Kill the process
taskkill /PID <PID> /F

# Or for npm on port 4200
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

**Option B: Use different ports**

```bash
# Backend - change in Properties/launchSettings.json
"urls": "https://localhost:5002;http://localhost:5000"

# Frontend - change in angular.json
"serve": {
  "options": {
    "port": 4201
  }
}
```

---

### Issue: "npm install fails with permission denied"

**Error Message**:
```
npm ERR! permission denied, mkdir...
npm ERR! code EACCES
```

**Cause**: Node modules directory has permission issues

**Solution**:

```bash
# Option 1: Clear npm cache
npm cache clean --force

# Option 2: Delete node_modules and reinstall
rm -rf node_modules
npm install

# Option 3: Change npm permissions (Linux/Mac)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Option 4: Run as administrator (Windows)
# Right-click Command Prompt → Run as administrator
npm install
```

---

## Database Issues

### Issue: "Cannot connect to SQL Server"

**Error Message**:
```
System.Data.SqlClient.SqlException: Cannot open server 'localhost'
```

**Cause**: 
- SQL Server not running
- Wrong connection string
- SQL Server instance name incorrect

**Solution**:

```bash
# 1. Check if SQL Server is running
# Windows: Services → SQL Server (MSSQLSERVER) should be Running

# 2. Verify connection string in appsettings.json
{
  "ConnectionStrings": {
    "constring": "Data Source=localhost;Initial Catalog=SmartQR_DB;Integrated Security=True;TrustServerCertificate=True"
  }
}

# 3. Test connection with SQL Server Management Studio
# Connect to: localhost or .\SQLEXPRESS

# 4. For named instance, use correct name
"Data Source=COMPUTER_NAME\SQLEXPRESS;..."

# 5. If using SQL Server Express
"Data Source=.\SQLEXPRESS;..."

# 6. Test with sqlcmd
sqlcmd -S localhost -U sa -P YourPassword
```

---

### Issue: "Database already exists"

**Error Message**:
```
The CREATE DATABASE statement failed. The primary file must be 1 MB or greater to accommodate a copy of the model database and 1 MB of additional disk space for version store reserved space.
```

**Cause**: Database already exists or drive is full

**Solution**:

```bash
# 1. Drop existing database
sqlcmd -S localhost -U sa
> USE master;
> DROP DATABASE SmartQR_DB;
> GO

# 2. Then run migrations again
cd Smart_QR_API
dotnet ef database drop
dotnet ef database update

# 3. Check disk space
# Ensure you have at least 1GB free space
```

---

### Issue: "Migration history mismatch"

**Error Message**:
```
The model backing the 'SmartProjectContext' context has changed since the database was last created
```

**Cause**: Code-first models don't match database schema

**Solution**:

```bash
# 1. Create a new migration
dotnet ef migrations add FixMismatch

# 2. Update database
dotnet ef database update

# 3. Or reset everything (careful - loses data)
dotnet ef database drop
dotnet ef database update

# 4. If still failing, check pending migrations
dotnet ef migrations list

# 5. Rollback to previous migration
dotnet ef database update PreviousMigrationName
```

---

### Issue: "Database password incorrect"

**Error Message**:
```
Login failed for user 'sa'
```

**Cause**: Wrong database credentials in connection string

**Solution**:

```json
// Verify credentials in appsettings.json
{
  "ConnectionStrings": {
    "constring": "Data Source=localhost;Initial Catalog=SmartQR_DB;User ID=sa;Password=YourCorrectPassword;TrustServerCertificate=True"
  }
}

// Or use Windows authentication (recommended for development)
{
  "ConnectionStrings": {
    "constring": "Data Source=localhost;Initial Catalog=SmartQR_DB;Integrated Security=True;TrustServerCertificate=True"
  }
}
```

---

## Authentication & Authorization

### Issue: "Login fails with correct credentials"

**Error Message**:
```
{
  "success": false,
  "message": "Invalid username or password"
}
```

**Cause**:
- User doesn't exist
- Password incorrect
- Account locked
- Account inactive

**Solution**:

```sql
-- 1. Check if user exists
SELECT UserID, UserName, Email, IsActive, IsLocked 
FROM SysUser 
WHERE UserName = 'admin';

-- 2. Check if user is active
UPDATE SysUser 
SET IsActive = 1, IsLocked = 0, FailedAttempts = 0 
WHERE UserName = 'admin';

-- 3. Reset password (if forgotten)
-- Note: Password should be hashed with bcrypt in production
UPDATE SysUser 
SET Password = 'hashed_password_here' 
WHERE UserName = 'admin';

-- 4. Verify user has a role
SELECT u.UserName, r.RoleName 
FROM SysUser u
LEFT JOIN SysUserRole ur ON u.UserID = ur.UserID
LEFT JOIN SysRole r ON ur.RoleID = r.RoleID
WHERE u.UserName = 'admin';
```

---

### Issue: "401 Unauthorized on API calls"

**Error Message**:
```
{
  "message": "Authorization has been denied for this request."
}
```

**Cause**:
- Missing Authorization header
- Invalid or expired token
- Token not included in header

**Solution**:

```bash
# 1. Ensure token is in Authorization header
Authorization: Bearer <your_token_here>

# 2. Verify token format (should be JWT)
# JWT format: xxxxx.yyyyy.zzzzz (three parts with dots)

# 3. Check token expiration
# Tokens expire after configured time (default: 180 minutes)

# 4. Get new token
curl -X POST https://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "admin",
    "password": "P@ssw0rd123"
  }'

# 5. Use new token in header
curl -X GET https://localhost:5001/api/qr/list \
  -H "Authorization: Bearer NEW_TOKEN_HERE"
```

---

### Issue: "403 Forbidden - Insufficient permissions"

**Error Message**:
```
{
  "message": "You do not have permission to access this resource"
}
```

**Cause**: User's role doesn't have access to this feature

**Solution**:

```sql
-- 1. Check user's role
SELECT r.RoleName 
FROM SysUser u
JOIN SysUserRole ur ON u.UserID = ur.UserID
JOIN SysRole r ON ur.RoleID = r.RoleID
WHERE u.UserName = 'admin';

-- 2. Check role's menu permissions
SELECT m.MenuName, rm.CanCreate, rm.CanRead, rm.CanUpdate, rm.CanDelete
FROM SysRoleMenu rm
JOIN SysRole r ON rm.RoleID = r.RoleID
JOIN SysMenu m ON rm.MenuID = m.MenuID
WHERE r.RoleName = 'Admin'
ORDER BY m.DisplayOrder;

-- 3. Grant permission (admin only)
INSERT INTO SysRoleMenu (RoleMenuID, RoleID, MenuID, CanCreate, CanRead, CanUpdate, CanDelete)
VALUES (NEWID(), 'ROLE-001', 'MENU-QR', 1, 1, 1, 1);

-- 4. Or assign user to correct role
INSERT INTO SysUserRole (UserRoleID, UserID, RoleID, AssignedOn)
VALUES (NEWID(), 'USR-001', 'ROLE-ADMIN', GETDATE());
```

---

## API Issues

### Issue: "CORS error in browser"

**Error Message**:
```
Access to XMLHttpRequest at 'https://localhost:5001/api/...' from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Cause**: API CORS policy not configured for frontend URL

**Solution**:

```csharp
// In Smart_QR_API/Program.cs
var builder = WebApplicationBuilder.CreateBuilder(args);

// Add CORS before building
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins(
            "http://localhost:4200",      // Development
            "https://yourdomain.com"      // Production
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Use CORS before other middleware
app.UseCors("CorsPolicy");
app.UseRouting();
```

---

### Issue: "400 Bad Request - Validation failed"

**Error Message**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "qrName",
      "message": "QR Name is required"
    }
  ]
}
```

**Solution**:

```typescript
// Frontend - Ensure all required fields are present
{
  "qrName": "Valid QR Name",  // Required
  "qrType": "Mall",           // Required
  "domainId": "DOM-001"       // Required
}

// Backend - Check field validation in DTO
[Required(ErrorMessage = "QR Name is required")]
[StringLength(100, MinimumLength = 3)]
public string QRName { get; set; }
```

---

### Issue: "500 Internal Server Error"

**Error Message**:
```
Internal Server Error
```

**Cause**: Unhandled exception in backend

**Solution**:

```bash
# 1. Check backend console for detailed error
# Look for stack trace in terminal running dotnet run

# 2. Check application logs
# Location: Smart_QR_API/logs/ (if configured)

# 3. Check database connectivity
# Ensure SmartQR_DB and SmartQR_Hangfire exist

# 4. Check configuration
# Verify appsettings.json is valid JSON
# Verify all required settings are configured

# 5. Enable detailed error logging (Development only)
# In appsettings.json:
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft": "Debug"
    }
  }
}

# 6. Check event viewer (Windows)
# Windows → Event Viewer → Windows Logs → Application
```

---

## Email Service Issues

### Issue: "Email not sending"

**Error Message**:
```
Email failed to send
```

**Cause**:
- AWS SES not configured
- Invalid email credentials
- Recipient not verified in SES

**Solution**:

```json
// 1. Verify AWS credentials in appsettings.json
{
  "AWS": {
    "AccessKey": "AKIA...",      // Must be valid
    "SecretKey": "...",          // Must be valid
    "Region": "us-east-1"        // Must be correct
  }
}

// 2. Check admin email is configured
{
  "Admin": {
    "EmailAddress": "admin@smartqr.com"  // Must be valid
  }
}
```

```sql
-- 3. Check email queue for pending emails
SELECT * FROM CrmEmailQueue 
WHERE Status = 'Failed'
ORDER BY CreatedOn DESC;

-- 4. Check email log for errors
SELECT * FROM CrmEmailLog 
WHERE Status = 'Failed'
ORDER BY SentTime DESC;

-- 5. Resend failed emails
UPDATE CrmEmailQueue 
SET Status = 'Pending', RetryCount = 0 
WHERE Status = 'Failed' 
AND QueueID = 'Q-2026-001';
```

---

### Issue: "AWS SES credentials invalid"

**Error Message**:
```
The AWS Access Key Id you provided does not exist
```

**Solution**:

```bash
# 1. Verify AWS credentials
# Go to AWS Console → IAM → Users → Your User → Access Keys
# Copy the correct Access Key and Secret Key

# 2. Update appsettings.json
{
  "AWS": {
    "AccessKey": "AKIA1234567890ABCDEF",
    "SecretKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    "Region": "us-east-1"
  }
}

# 3. Verify user has SES permissions in IAM
# Policy: AmazonSESFullAccess (or custom policy)

# 4. Restart API
dotnet run
```

---

### Issue: "Email template not found"

**Error Message**:
```
Email template E-0020 not found
```

**Solution**:

```sql
-- 1. Check if template exists
SELECT * FROM CrmEmailTemplate 
WHERE EmailTemplateNo = 'E-0020';

-- 2. If missing, insert template
INSERT INTO CrmEmailTemplate (
    EmailTemplateID, EmailTemplateNo, Title, Status,
    EmailBody, Active, CreatedBy, CreatedOn
) VALUES (
    NEWID(), 'E-0020', 'New User Registration - [username]',
    'Active',
    '<html>...</html>',  -- HTML content here
    1, 'System', GETDATE()
);

-- 3. Verify template code exists
SELECT EmailTemplateNo, Title FROM CrmEmailTemplate;
```

---

## Workflow Issues

### Issue: "Approval request not created"

**Error Message**:
```
Workflow not found or inactive
```

**Cause**:
- Workflow not configured
- Workflow is inactive
- Wrong entity type

**Solution**:

```sql
-- 1. Check if workflow exists
SELECT * FROM APP_Workflow 
WHERE EntityType = 'QR' AND Status = 'Active';

-- 2. If missing, create workflow
INSERT INTO APP_Workflow (
    WorkflowID, WorkflowName, WorkflowCode, EntityType, Status, TotalSteps
) VALUES (
    'WF-QR-001', 'QR Code Approval', 'WF_QR_001', 'QR', 'Active', 3
);

-- 3. Create workflow steps
INSERT INTO APP_WorkflowStep (
    StepID, WorkflowID, StepNumber, StepName, StepType, TimeoutDays
) VALUES
    ('ST-001', 'WF-QR-001', 1, 'QR Admin Review', 'Sequential', 2),
    ('ST-002', 'WF-QR-001', 2, 'Manager Approval', 'Sequential', 3);

-- 4. Assign approvers
INSERT INTO APP_WorkflowStepApprover (
    ApproverID, StepID, ApprovalType, ApprovalValue, IsMandatory
) VALUES
    ('APP-001', 'ST-001', 'Role', 'ROLE-QR-ADMIN', 1),
    ('APP-002', 'ST-002', 'Role', 'ROLE-MANAGER', 1);
```

---

### Issue: "Approval notification not sent"

**Error Message**:
```
Approver not notified of pending approval
```

**Cause**:
- Email service not working
- Approver email not configured
- Workflow step approver not assigned

**Solution**:

```sql
-- 1. Check approval request was created
SELECT * FROM APP_ApprovalRequest 
WHERE RequestID = 'APR-2026-001';

-- 2. Check workflow step has approvers
SELECT * FROM APP_WorkflowStepApprover 
WHERE StepID = 'ST-001';

-- 3. Check email was queued
SELECT * FROM CrmEmailQueue 
WHERE RecipientEmail LIKE '%approver%'
ORDER BY CreatedOn DESC;

-- 4. Manually trigger notification
-- (Depends on implementation)
-- Call: EmailNotificationService.SendApprovalNotification(requestId)
```

---

### Issue: "Cannot approve - step has no approvers"

**Error Message**:
```
No approvers found for this step
```

**Solution**:

```sql
-- 1. Check if step has approvers
SELECT COUNT(*) as ApproverCount
FROM APP_WorkflowStepApprover 
WHERE StepID = 'ST-001';

-- 2. Add approvers if missing
INSERT INTO APP_WorkflowStepApprover (
    ApproverID, StepID, ApprovalType, ApprovalValue, 
    IsMandatory, NotifyEmail
) VALUES (
    NEWID(), 'ST-001', 'Role', 'ROLE-QR-ADMIN', 1,
    'qradmin@smartqr.com'
);

-- 3. Or assign specific user
INSERT INTO APP_WorkflowStepApprover (
    ApproverID, StepID, ApprovalType, ApprovalValue, 
    IsMandatory, NotifyEmail
) VALUES (
    NEWID(), 'ST-001', 'User', 'USR-001', 1,
    'admin@smartqr.com'
);
```

---

## Custom Fields Issues

### Issue: "Custom field not appearing in form"

**Error Message**:
```
Field defined but not showing in create/edit form
```

**Cause**:
- Field visibility set to 0
- Entity configuration missing
- Field type not supported

**Solution**:

```sql
-- 1. Check if field is visible
SELECT FieldID, DisplayName, IsVisible, DisplayOrder
FROM CFD_EntityField 
WHERE EntityID = 'ENT-SHOP'
ORDER BY DisplayOrder;

-- 2. Make field visible
UPDATE CFD_EntityField 
SET IsVisible = 1 
WHERE FieldID = 'FIELD-SHOP-001';

-- 3. Check field type is supported
-- Valid types: Text, Number, Date, DateTime, Dropdown, Checkbox, TextArea

-- 4. Check entity is configured
SELECT * FROM CFD_Entity 
WHERE EntityID = 'ENT-SHOP';
```

---

### Issue: "Dropdown options not showing"

**Error Message**:
```
Dropdown field appears but has no options
```

**Solution**:

```sql
-- 1. Check if options exist
SELECT * FROM CFD_FieldOption 
WHERE FieldID = 'FIELD-SHOP-001'
AND IsActive = 1;

-- 2. Add missing options
INSERT INTO CFD_FieldOption (
    OptionID, FieldID, OptionValue, OptionLabel, DisplayOrder, IsActive
) VALUES
    (NEWID(), 'FIELD-SHOP-001', 'Retail', 'Retail', 1, 1),
    (NEWID(), 'FIELD-SHOP-001', 'Food', 'Food & Beverage', 2, 1),
    (NEWID(), 'FIELD-SHOP-001', 'Entertainment', 'Entertainment', 3, 1);

-- 3. Verify options are active
SELECT * FROM CFD_FieldOption WHERE FieldID = 'FIELD-SHOP-001';
```

---

## Data Migration Issues

### Issue: "Excel import validation fails"

**Error Message**:
```
Validation failed: 3 errors found
```

**Cause**:
- Required fields missing
- Data type mismatch
- Lookup values not found

**Solution**:

```bash
# 1. Check validation errors
POST /api/migration/validate

# Response will show:
{
  "validRows": 3,
  "invalidRows": 2,
  "validationDetails": [
    {
      "rowNumber": 4,
      "status": "Invalid",
      "error": "Required field 'QR Type' is missing"
    }
  ]
}

# 2. Fix Excel file
# - Add missing required values
# - Ensure data types match (text, number, date)
# - Verify lookup values exist in database

# 3. Re-upload and validate
```

---

### Issue: "Import completes but no records created"

**Error Message**:
```
Import successful but 0 records were imported
```

**Cause**:
- All rows had validation errors
- Database transaction rolled back
- No valid rows selected for import

**Solution**:

```sql
-- 1. Check import job details
SELECT * FROM DAT_MigrationJob 
WHERE MigrationJobID = 'MIG-2026-04-27-001';

-- 2. Check which rows failed
SELECT * FROM DAT_MigrationDetail 
WHERE MigrationJobID = 'MIG-2026-04-27-001'
AND ValidationStatus != 'Valid';

-- 3. Fix issues in Excel file and re-import

-- 4. Manually insert if needed
INSERT INTO QR_Master (
    QRId, QRName, QRType, DomainID, Status, CreatedOn, CreatedBy
) VALUES
    (NEWID(), 'QR-001', 'Mall', 'DOM-001', 'Active', GETDATE(), 'admin');
```

---

## Performance Issues

### Issue: "API response slow"

**Error Message**:
```
Request takes more than 5 seconds to respond
```

**Cause**:
- Missing database indexes
- N+1 query problem
- Large result set

**Solution**:

```bash
# 1. Check database indexes
SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID('SysUser');

# 2. Create missing indexes
CREATE INDEX IX_SysUser_IsActive ON SysUser(IsActive);
CREATE INDEX IX_QRMaster_Status ON QR_Master(Status);

# 3. Check query execution plan
# In SSMS: Enable Include Actual Execution Plan (Ctrl+L)

# 4. Implement pagination
?pageSize=20&pageNumber=1

# 5. Use projection (select only needed columns)
SELECT UserID, UserName, Email FROM SysUser;  -- Good
SELECT * FROM SysUser;  -- Bad

# 6. Check for N+1 queries
# Use .Include() in Entity Framework to load related data
```

---

### Issue: "Website slow after 100+ users"

**Cause**: Not scalable architecture or resource constraints

**Solution**:

```csharp
// 1. Enable output caching
services.AddOutputCache();
app.UseOutputCache();

// 2. Implement database connection pooling
"ConnectionStrings": {
  "constring": "Data Source=...;Min Pool Size=10;Max Pool Size=100;"
}

// 3. Use async/await for I/O operations
public async Task<IActionResult> GetUsers()
{
    var users = await _userRepository.GetAllAsync();
    return Ok(users);
}

// 4. Implement API rate limiting
services.AddRateLimiter(options => 
{
    options.GlobalLimiter = new ConcurrencyLimiter(
        new ConcurrencyLimiterOptions { PermitLimit = 100 }
    );
});
```

---

### Issue: "High memory usage"

**Cause**:
- Memory leak
- Large object allocation
- Not disposing resources

**Solution**:

```csharp
// 1. Use using statements for IDisposable
using (var context = new SmartQRContext())
{
    // ...
}

// 2. Clear cache periodically
memoryCache.Clear();

// 3. Monitor memory with profiler
// Visual Studio → Debug → Windows → Diagnostic Tools

// 4. Limit query results
var users = await context.Users.Take(100).ToListAsync();

// 5. Use streaming for large exports
// Instead of loading all in memory
```

---

## Frequently Asked Questions

### Q1: How do I reset the admin password?

**A**: Use SQL Server Management Studio:

```sql
-- Connect to SmartQR_DB
-- Note: Password should be hashed in production!

UPDATE SysUser 
SET Password = 'P@ssw0rd123'  -- Set to new password
WHERE UserName = 'admin';
```

---

### Q2: How do I add a new role?

**A**: 

```sql
-- 1. Create role
INSERT INTO SysRole (RoleID, RoleName, RoleCode, IsActive)
VALUES ('ROLE-004', 'Content Manager', 'CONTENT_MGR', 1);

-- 2. Assign menus to role
INSERT INTO SysRoleMenu (RoleMenuID, RoleID, MenuID, CanRead, CanCreate, CanUpdate, CanDelete)
SELECT NEWID(), 'ROLE-004', MenuID, 1, 1, 1, 0
FROM SysMenu 
WHERE MenuCode IN ('MENU-CONTENT', 'MENU-REPORTS');

-- 3. Assign role to user
INSERT INTO SysUserRole (UserRoleID, UserID, RoleID, AssignedOn)
VALUES (NEWID(), 'USR-001', 'ROLE-004', GETDATE());
```

---

### Q3: How do I backup the database?

**A**:

```bash
# Using SQL Server Management Studio
# Right-click Database → Tasks → Back Up...

# Or via command line
sqlcmd -S localhost -U sa -Q "BACKUP DATABASE SmartQR_DB TO DISK = 'C:\Backups\SmartQR_DB.bak'"

# Or via PowerShell
Backup-SqlDatabase -ServerInstance "localhost" -Database "SmartQR_DB" -BackupFile "C:\Backups\SmartQR_DB.bak"
```

---

### Q4: How do I enable two-factor authentication?

**A**:

```sql
-- Enable 2FA for a user
UPDATE SysUser 
SET TwoFactorEnabled = 1 
WHERE UserID = 'USR-001';

-- Or implement custom 2FA logic:
-- 1. Store 2FA secret (TOTP algorithm)
-- 2. Verify code before allowing login
-- 3. Keep backup codes for recovery
```

---

### Q5: How do I export all QR codes to Excel?

**A**:

```bash
# API call
POST /api/grid/export-excel

Request:
{
  "entityType": "QR",
  "columns": ["qrId", "qrName", "qrType", "status", "createdOn"],
  "reportTitle": "All QR Codes"
}

# Or via UI
1. Go to QR Management
2. Click [Export to Excel]
3. Select columns
4. Click [Export]
```

---

### Q6: How do I change the admin email?

**A**:

```json
// In appsettings.json
{
  "Admin": {
    "EmailAddress": "newemail@smartqr.com"
  }
}

// Or in database
UPDATE SysConfig 
SET DefaultEmailAddress = 'newemail@smartqr.com' 
WHERE ConfigID = '1';

// Restart API for changes to take effect
```

---

### Q7: How do I debug API errors?

**A**:

```csharp
// Enable detailed logging in appsettings.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft": "Information",
      "Smart_QR_API": "Debug"
    }
  }
}

// Or use browser developer tools
// Press F12 → Network tab
// Check request/response details

// Or add breakpoints in Visual Studio
// Set breakpoint and press F5 to debug
```

---

### Q8: How do I increase the API token lifetime?

**A**:

```json
// In appsettings.json
{
  "JwtAuth": {
    "Key": "your-secret-key",
    "Issuer": "smartqr.com",
    "TokenLifeTime": 360  // Changed from 180 to 360 minutes
  }
}

// Restart API for changes to take effect
```

---

### Q9: How do I configure email with Gmail SMTP?

**A**:

```json
{
  "Email": {
    "Provider": "SMTP",
    "SmtpSettings": {
      "Host": "smtp.gmail.com",
      "Port": 587,
      "EnableSSL": true,
      "UserName": "your-email@gmail.com",
      "Password": "your-app-password"
    }
  }
}

// Note: Use Gmail app password, not regular password
// Enable 2FA on Gmail and generate app-specific password
```

---

### Q10: How do I setup continuous deployment?

**A**:

```yaml
# Example GitHub Actions workflow
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: '8.0.x'
      
      - name: Build
        run: |
          cd Smart_QR_API
          dotnet build
          dotnet publish -c Release -o ./publish
      
      - name: Deploy
        run: |
          # Copy files to server
          # Run migrations
          # Restart IIS app pool
```

---

## Still Need Help?

If you can't find the answer here:

1. **Check API Documentation**: API_Documentation.md
2. **Check Database Schema**: Database_Schema.md
3. **Check Event Viewer** (Windows): Applications logs
4. **Check API logs**: Check terminal running `dotnet run`
5. **Contact Support**: Include error message, logs, and steps to reproduce

---

**Troubleshooting & FAQ**  
**Last Updated**: 2026-04-27  
**Version**: 1.0
