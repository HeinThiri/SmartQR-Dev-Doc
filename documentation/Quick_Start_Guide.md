# Smart QR - Quick Start Guide

**Version**: 1.0  
**Last Updated**: 2026-04-27  
**Target Audience**: New Developers & System Administrators

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [5-Minute Setup](#5-minute-setup)
3. [First Steps](#first-steps)
4. [Common Tasks](#common-tasks)
5. [Troubleshooting](#troubleshooting)
6. [Next Steps](#next-steps)

---

## Prerequisites

Before you start, ensure you have:

### Required Software

```
✓ .NET SDK 8.0 or later
  Download: https://dotnet.microsoft.com/download

✓ SQL Server 2019+ (Express or Standard Edition)
  Download: https://www.microsoft.com/en-us/sql-server/sql-server-express

✓ Node.js 16+ and npm
  Download: https://nodejs.org/

✓ Git
  Download: https://git-scm.com/

✓ Visual Studio Code or Visual Studio 2022
  Download: https://code.visualstudio.com/ or https://visualstudio.microsoft.com/
```

### Verify Installation

```bash
# Check .NET version
dotnet --version
# Should output: 8.0.x or higher

# Check Node.js version
node --version
# Should output: v16.x or higher

npm --version
# Should output: 8.x or higher

# Check Git
git --version
# Should output: git version x.x.x
```

---

## 5-Minute Setup

### Step 1: Clone/Download Project (1 minute)

```bash
# Clone the repository
git clone <repository-url>
cd Smart_QR

# Or if you have a ZIP file:
# Extract to: C:\Projects\Smart_QR
```

### Step 2: Setup Database (2 minutes)

**Option A: Using SQL Server Management Studio (SSMS)**

```sql
-- Open SQL Server Management Studio
-- Connect to your SQL Server instance
-- New Query → Execute:

CREATE DATABASE SmartQR_DB;
CREATE DATABASE SmartQR_Hangfire;

-- Verify
SELECT name FROM sys.databases WHERE name LIKE 'SmartQR%';
-- Should return 2 rows
```

**Option B: Using Command Line**

```bash
# Navigate to Smart_QR_API folder
cd Smart_QR_API

# Update database with Entity Framework
dotnet ef database update

# This creates:
# ✓ SmartQR_DB (main database)
# ✓ SmartQR_Hangfire (job queue database)
```

### Step 3: Configure Application (1 minute)

**Edit `Smart_QR_API/appsettings.json`:**

```json
{
  "ConnectionStrings": {
    "constring": "Data Source=localhost;Initial Catalog=SmartQR_DB;Integrated Security=True;TrustServerCertificate=True",
    "HangfireConnection": "Server=localhost;Database=SmartQR_Hangfire;Integrated Security=True;TrustServerCertificate=True;"
  },
  "JwtAuth": {
    "Key": "your-very-long-secret-key-minimum-32-characters-required!",
    "Issuer": "smartqr.com",
    "TokenLifeTime": 180
  },
  "Admin": {
    "EmailAddress": "admin@smartqr.com"
  },
  "AWS": {
    "AccessKey": "YOUR_AWS_ACCESS_KEY",
    "SecretKey": "YOUR_AWS_SECRET_KEY",
    "Region": "us-east-1"
  }
}
```

### Step 4: Run Backend API (1 minute)

```bash
cd Smart_QR_API

# Restore dependencies
dotnet restore

# Run the API
dotnet run

# Expected output:
# info: Microsoft.Hosting.Lifetime[14]
#       Now listening on: https://localhost:5001
# info: Microsoft.Hosting.Lifetime[0]
#       Application started. Press Ctrl+C to exit.
```

**API is ready at**: `https://localhost:5001`

### Step 5: Run Frontend UI (1 minute)

**In a new terminal:**

```bash
cd Smart_QR_UI

# Install dependencies
npm install

# Start development server
npm start

# Expected output:
# ✔ browser application bundle generated successfully
# ✔ Compiled successfully.
# Application bundle generated in 15.23 seconds.
```

**UI is ready at**: `http://localhost:4200`

---

## First Steps

### Step 1: Access the Application

Open your browser and navigate to:

```
http://localhost:4200
```

You should see the Smart QR login page.

### Step 2: Create Default Admin User

**Option A: Using Database (Quick)**

Open SQL Server Management Studio and run:

```sql
-- Use SmartQR_DB
USE SmartQR_DB;

-- Insert default admin user
INSERT INTO SysUser (UserID, UserName, Email, FullName, Password, IsActive, CreatedOn, CreatedBy)
VALUES (
  'USR-ADMIN-001',
  'admin',
  'admin@smartqr.com',
  'System Administrator',
  'P@ssw0rd123', -- This should be hashed in production!
  1,
  GETDATE(),
  'SYSTEM'
);

-- Assign Admin Role
INSERT INTO SysUserRole (UserID, RoleID, AssignedOn)
VALUES ('USR-ADMIN-001', 'ROLE-ADMIN', GETDATE());

-- Verify
SELECT UserID, UserName, Email FROM SysUser WHERE UserName = 'admin';
```

**Option B: Using API (Recommended)**

```bash
curl -X POST https://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "admin",
    "email": "admin@smartqr.com",
    "password": "P@ssw0rd123",
    "fullName": "System Administrator"
  }'
```

### Step 3: Login to Dashboard

```
URL: http://localhost:4200
Username: admin
Password: P@ssw0rd123
```

**Expected Result**:
- ✅ Redirected to Home/Dashboard
- ✅ See welcome message with admin info
- ✅ Menu items visible on sidebar

### Step 4: Verify All Features Work

#### Test 1: Create a Domain
```
1. Click: Admin → System Config → Domains
2. Click: [Add New Domain]
3. Fill: Domain Name = "Test Domain A"
4. Click: [Save]
Expected: ✅ Domain created successfully
```

#### Test 2: Create a User
```
1. Click: Admin → User Management
2. Click: [Add New User]
3. Fill: Username = "testuser", Email = "test@smartqr.com", Role = "QR Manager"
4. Click: [Save]
Expected: ✅ User created + Email sent to admin
```

#### Test 3: Test Email Service
```
1. Check admin email (heinthiritun.sbs@gmail.com)
2. Look for "New User Registration" email
Expected: ✅ Email received with user details
```

#### Test 4: Advanced Grid View
```
1. Click: Admin → User Management
2. Click: [Add Filter]
3. Filter: Role = "QR Manager"
4. Click: [Save View] → "QR Managers Only"
Expected: ✅ View saved and applied
```

#### Test 5: Export Data
```
1. Click: User Management grid
2. Click: [Export to Excel]
3. Select columns and [Export]
Expected: ✅ Excel file downloaded
```

---

## Common Tasks

### Task 1: Start Development

**Terminal 1 - Backend:**
```bash
cd Smart_QR_API
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd Smart_QR_UI
npm start
```

**Check both are running:**
- Backend: `https://localhost:5001/swagger` (API documentation)
- Frontend: `http://localhost:4200` (Application)

### Task 2: View API Documentation

Open in browser:
```
https://localhost:5001/swagger
```

You'll see:
- All available API endpoints
- Request/response schemas
- Try-it-out feature to test endpoints
- Authentication setup

### Task 3: View Database

**Using SQL Server Management Studio:**

```
Server: localhost
Database: SmartQR_DB
Tables: 50+

Key tables:
├─ SysUser (Users)
├─ SysRole (Roles)
├─ APP_Workflow (Approvals)
├─ CFD_Entity (Custom Fields)
├─ CrmEmailTemplate (Email Templates)
└─ QR_Master (QR Codes)
```

### Task 4: Add Custom Field to Shop

```
1. Go to: Admin → Custom Fields
2. Select Entity: "Shop"
3. Click: [Add Field]
4. Fill in:
   - Field Name: shop_category
   - Field Type: Dropdown
   - Options: Retail, Food, Entertainment
5. Click: [Save]

Result:
- New field appears in Shop create/edit form
- Field stored in CFD_EntityField table
- Values stored in CFD_EntityFieldValue
```

### Task 5: Create Approval Workflow

```
1. Go to: Admin → Workflows
2. Click: [Add Workflow]
3. Fill:
   - Name: "QR Code Approval"
   - Entity Type: "QR Code"
4. Add Step 1:
   - Name: "QR Admin Review"
   - Approvers: Role = "QR Admin"
5. Add Step 2:
   - Name: "Manager Approval"
   - Approvers: Role = "QR Manager"
6. Click: [Save & Activate]

Result:
- Workflow created and active
- When new QR created, triggers this workflow
```

### Task 6: Setup Email Templates

```
1. Go to: Admin → Email Templates
2. Click: [Add Template]
3. Fill:
   - Template Code: E-0025
   - Title: "Custom Email"
   - Body: (HTML with placeholders like [username], [email])
4. Click: [Save]

Test:
5. Click: [Send Test Email]
6. Enter recipient email
7. Check inbox for email

Result:
- ✅ Email received with rendered template
```

### Task 7: Import Data via Excel

**Prepare Excel File:**
```
File: qr_codes.xlsx

Headers:
├─ QR Name
├─ QR Type (Mall, Menu, Voucher, etc.)
├─ Domain
├─ Status (Active, Draft)
└─ Description

Rows:
├─ Row 1: QR-A001, Mall, Domain A, Active, ...
├─ Row 2: QR-A002, Menu, Domain A, Active, ...
└─ Row 3: ...
```

**Import:**
```
1. Go to: Admin → Data Migration
2. Click: [Upload Excel]
3. Select: qr_codes.xlsx
4. Map columns if needed
5. Click: [Validate]
6. Review errors/warnings
7. Click: [Import]

Result:
- ✅ Valid records imported
- ❌ Invalid records skipped
- ⚠️  Warnings noted
```

---

## Troubleshooting

### Issue 1: "Database connection failed"

**Error Message:**
```
System.Data.SqlClient.SqlException: Cannot open server requested database
```

**Solution:**

```bash
# 1. Check SQL Server is running
# 2. Verify connection string in appsettings.json
# 3. Run migrations again
cd Smart_QR_API
dotnet ef database update

# 4. If still failing, create manually:
# Open SQL Server Management Studio
# New Query:
USE master;
CREATE DATABASE SmartQR_DB;
CREATE DATABASE SmartQR_Hangfire;
```

### Issue 2: "CORS error" in browser

**Error Message:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**

```csharp
// In Smart_QR_API/Program.cs
// Add CORS configuration:
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:4200")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

app.UseCors("CorsPolicy");
```

### Issue 3: "JWT token expired"

**Error Message:**
```
401 Unauthorized: The token has expired
```

**Solution:**

```
1. Clear browser cache (Ctrl+Shift+Delete)
2. Logout and login again
3. Or increase token lifetime in appsettings.json:
   "JwtAuth": {
     "TokenLifeTime": 360  // 6 hours instead of 3
   }
```

### Issue 4: "Email not sending"

**Check:**

```sql
-- 1. Check admin email is configured
SELECT * FROM SysConfig WHERE ConfigID = '1';

-- 2. Check CrmEmailQueue for pending emails
SELECT * FROM CrmEmailQueue WHERE Status = 'Pending';

-- 3. Check CrmEmailLog for failures
SELECT TOP 10 * FROM CrmEmailLog ORDER BY CreatedOn DESC;
```

**Fix:**

```json
// Verify AWS credentials in appsettings.json
"AWS": {
  "AccessKey": "AKIA...",  // Must be valid
  "SecretKey": "...",      // Must be valid
  "Region": "us-east-1"    // Must be correct
}
```

### Issue 5: "npm start fails"

**Error Message:**
```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed
```

**Solution:**

```bash
# 1. Increase Node memory
set NODE_OPTIONS=--max_old_space_size=4096
npm start

# 2. Or clear node_modules and reinstall
rm -rf node_modules
npm install
npm start
```

---

## Next Steps

### For Developers

1. **Explore Code Structure**
   ```bash
   # Backend
   Smart_QR_API/
   ├─ APIs/          (Controllers)
   ├─ DBModels/      (Entity models)
   ├─ Infrastructure/ (Services, Repositories)
   └─ Shared/        (DTOs, Enums)
   
   # Frontend
   Smart_QR_UI/src/app/
   ├─ pages/         (Components)
   ├─ services/      (API services)
   ├─ core/          (Guards, Interceptors)
   └─ shared/        (Common components)
   ```

2. **Read Documentation**
   - [Common Features Guide](./Common_Features_Guide.md)
   - [API Documentation](./API_Documentation.md)
   - [Database Schema](./Database_Schema.md)

3. **Start Coding**
   - Create a new module in `APIs/`
   - Create Angular component in `pages/`
   - Write tests for both

### For Administrators

1. **Configure System**
   - Set up admin users
   - Configure email templates
   - Define workflows
   - Setup custom fields

2. **Monitor Operations**
   - Check email queue status
   - Review approval requests
   - View audit logs
   - Monitor system performance

3. **Manage Data**
   - Import master data
   - Setup QR code templates
   - Configure billing/credits
   - Manage user access

### For DevOps

1. **Deployment**
   - Configure CI/CD pipeline
   - Setup Docker containers (optional)
   - Configure IIS/Apache
   - Setup SSL certificates

2. **Monitoring**
   - Setup application logging
   - Configure error tracking
   - Setup performance monitoring
   - Create backup strategy

3. **Security**
   - Configure firewall
   - Setup VPN (if needed)
   - Enable SSL/TLS
   - Regular security audits

---

## Quick Reference Commands

### Backend

```bash
# Navigate to backend
cd Smart_QR_API

# Restore packages
dotnet restore

# Build project
dotnet build

# Run locally
dotnet run

# Run tests
dotnet test

# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Rollback migration
dotnet ef database update PreviousMigrationName

# Drop database
dotnet ef database drop

# Publish for production
dotnet publish -c Release -o ./publish
```

### Frontend

```bash
# Navigate to frontend
cd Smart_QR_UI

# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Generate component
ng g component modules/your-module/component-name

# Generate service
ng g service services/service-name
```

### Database

```bash
# Using sqlcmd (Command Line)
sqlcmd -S localhost -U sa -P YourPassword

# Or use SSMS (GUI)
# Start → SQL Server Management Studio
# Connect to: localhost or .\SQLEXPRESS
```

---

## Important Credentials

| Item | Value | Location |
|------|-------|----------|
| Default Admin Username | `admin` | appsettings.json |
| Default Admin Email | `admin@smartqr.com` | appsettings.json |
| API URL (Dev) | `https://localhost:5001` | environment.ts |
| UI URL (Dev) | `http://localhost:4200` | Browser |
| Database | `SmartQR_DB` | SQL Server |
| JWT Secret | Set in appsettings.json | appsettings.json |

⚠️ **Important**: Change all default credentials in production!

---

## Getting Help

### Resources

1. **Documentation Files**
   - Common_Features_Guide.md - Features overview
   - API_Documentation.md - API reference
   - Database_Schema.md - Database design
   - Troubleshooting_FAQ.md - Common issues

2. **Online Resources**
   - [ASP.NET Core Docs](https://docs.microsoft.com/en-us/aspnet/core/)
   - [Angular Docs](https://angular.io/docs)
   - [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
   - [SQL Server Docs](https://docs.microsoft.com/en-us/sql/sql-server/)

3. **Getting Support**
   - Check Troubleshooting_FAQ.md first
   - Review error logs in appsettings.json
   - Check database tables for data issues
   - Review browser console for frontend errors

---

## Checklist: First Day Setup

- [ ] Clone/download project
- [ ] Install prerequisites (SDK, SQL Server, Node.js)
- [ ] Create databases (SmartQR_DB, SmartQR_Hangfire)
- [ ] Configure appsettings.json
- [ ] Run database migrations
- [ ] Start backend API (dotnet run)
- [ ] Start frontend UI (npm start)
- [ ] Create default admin user
- [ ] Login to dashboard
- [ ] Run feature verification tests
- [ ] Read Common Features Guide
- [ ] Bookmark API documentation
- [ ] Join team on communication platform
- [ ] Schedule knowledge transfer session

---

## Checklist: First Week Setup

- [ ] Complete code structure walk-through
- [ ] Setup IDE with extensions
- [ ] Configure Git and commit workflow
- [ ] Learn deployment process
- [ ] Create first feature branch
- [ ] Make first code contribution
- [ ] Submit pull request and get reviewed
- [ ] Attend architecture discussion
- [ ] Setup monitoring/logging
- [ ] Configure local debugging
- [ ] Create development environment runbook
- [ ] Complete security training
- [ ] Get database admin access (if needed)
- [ ] Schedule 1-on-1 with tech lead

---

**Version**: 1.0  
**Last Updated**: 2026-04-27  
**Next Review**: 2026-06-01
