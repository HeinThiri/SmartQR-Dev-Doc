# Smart QR - Deployment & Operations Guide

**Version**: 1.0  
**Last Updated**: 2026-04-27  
**Purpose**: Complete guide for deployment, configuration, database migration, email setup, and system administration

---

## Table of Contents

1. [Environment Configuration](#environment-configuration)
2. [Database Migration & Setup](#database-migration--setup)
3. [Email Service Configuration](#email-service-configuration)
4. [Deployment Guide](#deployment-guide)
5. [System Administration](#system-administration)
6. [Production Checklist](#production-checklist)
7. [Troubleshooting & Recovery](#troubleshooting--recovery)

---

## Environment Configuration

### Overview

Smart QR supports three environments:
- **Development** (Local machine)
- **Staging** (Test/UAT environment)
- **Production** (Live environment)

### Configuration Files

#### 1. appsettings.json (Backend)

**Location**: `Smart_QR_API/appsettings.json`

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "constring": "Data Source=localhost;Initial Catalog=SmartQR_DB;Integrated Security=True;TrustServerCertificate=True",
    "HangfireConnection": "Server=localhost;Database=SmartQR_Hangfire;Integrated Security=True;TrustServerCertificate=True;"
  },
  "JwtAuth": {
    "Key": "your-very-long-secret-key-minimum-32-characters-required!",
    "Issuer": "smartqr.com",
    "Audience": "smartqr-users",
    "TokenLifeTime": 180
  },
  "Admin": {
    "EmailAddress": "admin@smartqr.com",
    "DefaultPassword": "P@ssw0rd123"
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
    "UseAwsSes": true,
    "SmtpSettings": {
      "Host": "smtp.gmail.com",
      "Port": 587,
      "EnableSSL": true,
      "UserName": "your-email@gmail.com",
      "Password": "your-app-password"
    }
  },
  "Hangfire": {
    "DashboardPath": "/hangfire",
    "IsEnabled": true,
    "WorkerCount": 4
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:4200",
      "https://yourdomain.com"
    ]
  },
  "Security": {
    "RequireHttpsRedirect": false,
    "MaxFailedLoginAttempts": 5,
    "LockoutDurationMinutes": 15
  },
  "FileUpload": {
    "MaxFileSize": 10485760,
    "AllowedExtensions": [".jpg", ".png", ".pdf", ".xlsx", ".docx"],
    "StoragePath": "/app/uploads"
  }
}
```

#### 2. Environment-Specific Configurations

**Development (appsettings.Development.json)**

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft": "Debug",
      "Microsoft.EntityFrameworkCore": "Debug"
    }
  },
  "Security": {
    "RequireHttpsRedirect": false
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:4200",
      "http://localhost:3000"
    ]
  }
}
```

**Staging (appsettings.Staging.json)**

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  },
  "ConnectionStrings": {
    "constring": "Server=staging-db-server;Database=SmartQR_Staging;User ID=sa;Password=StagingPassword123;",
    "HangfireConnection": "Server=staging-db-server;Database=SmartQR_Hangfire_Staging;User ID=sa;Password=StagingPassword123;"
  },
  "Security": {
    "RequireHttpsRedirect": true
  },
  "Cors": {
    "AllowedOrigins": [
      "https://staging.smartqr.com"
    ]
  }
}
```

**Production (appsettings.Production.json)**

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft": "Error"
    }
  },
  "ConnectionStrings": {
    "constring": "Server=prod-db-server;Database=SmartQR_Prod;User ID=sa;Password=ProdPassword123;Encrypt=true;TrustServerCertificate=false;",
    "HangfireConnection": "Server=prod-db-server;Database=SmartQR_Hangfire_Prod;User ID=sa;Password=ProdPassword123;Encrypt=true;"
  },
  "Security": {
    "RequireHttpsRedirect": true,
    "MaxFailedLoginAttempts": 3,
    "LockoutDurationMinutes": 30
  },
  "Cors": {
    "AllowedOrigins": [
      "https://smartqr.com",
      "https://www.smartqr.com"
    ]
  }
}
```

#### 3. Frontend Environment Configuration

**Location**: `Smart_QR_UI/src/environments/`

**environment.ts (Development)**

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api',
  apiTimeout: 30000,
  useHttps: false,
  enableLogging: true,
  features: {
    enableDebugPanel: true,
    enableMockData: false
  }
};
```

**environment.staging.ts**

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://api-staging.smartqr.com/api',
  apiTimeout: 30000,
  useHttps: true,
  enableLogging: true,
  features: {
    enableDebugPanel: true,
    enableMockData: false
  }
};
```

**environment.prod.ts (Production)**

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.smartqr.com/api',
  apiTimeout: 30000,
  useHttps: true,
  enableLogging: false,
  features: {
    enableDebugPanel: false,
    enableMockData: false
  }
};
```

### Environment Variables

Use environment variables for sensitive data:

**Development**

```bash
# .env or system environment variables
ASPNETCORE_ENVIRONMENT=Development
DB_SERVER=localhost
DB_NAME=SmartQR_DB
DB_USER=sa
DB_PASSWORD=YourPassword123
JWT_SECRET=your-development-secret-key-here
AWS_ACCESS_KEY=AKIA_DEV_KEY
AWS_SECRET_KEY=dev-secret-key
ADMIN_EMAIL=admin@localhost
```

**Production**

```bash
ASPNETCORE_ENVIRONMENT=Production
DB_SERVER=prod-db-server
DB_NAME=SmartQR_Prod
DB_USER=sa
DB_PASSWORD=${SECURE_VAULT_PASSWORD}
JWT_SECRET=${SECURE_VAULT_JWT_KEY}
AWS_ACCESS_KEY=${SECURE_VAULT_AWS_KEY}
AWS_SECRET_KEY=${SECURE_VAULT_AWS_SECRET}
ADMIN_EMAIL=admin@smartqr.com
ENABLE_HTTPS=true
HTTPS_PORT=443
```

### Configuration Management Best Practices

```
1. ✅ Store secrets in Azure Key Vault / AWS Secrets Manager
2. ✅ Use different credentials for each environment
3. ✅ Never commit sensitive data to Git
4. ✅ Rotate credentials regularly (monthly)
5. ✅ Use connection pooling for databases
6. ✅ Enable SSL/TLS for all connections
7. ✅ Use environment-specific configuration files
8. ✅ Document all required environment variables
```

---

## Database Migration & Setup

### Database Architecture

```
SmartQR_DB (Main Database)
├─ System Tables (SysUser, SysRole, SysMenu, etc.)
├─ Workflow Tables (APP_Workflow, APP_ApprovalRequest, etc.)
├─ Custom Fields Tables (CFD_Entity, CFD_EntityField, etc.)
├─ Email Tables (CrmEmailTemplate, CrmEmailQueue, etc.)
├─ QR Code Tables (QR_Master, QR_Analytics, etc.)
├─ Business Tables (Shop_Master, Product_Master, etc.)
└─ Audit Tables (various logging tables)

SmartQR_Hangfire (Background Jobs Database)
├─ Job Queue
├─ Job History
├─ Counter
└─ State
```

### Initial Database Setup

#### Step 1: Create Databases

```sql
-- Connect to SQL Server master database
USE master;

-- Create main database
CREATE DATABASE SmartQR_DB
  CONTAINMENT = NONE
  ON PRIMARY (
    NAME = N'SmartQR_DB',
    FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\SmartQR_DB.mdf',
    SIZE = 100MB,
    MAXSIZE = 10GB,
    FILEGROWTH = 10MB
  );

-- Create Hangfire database
CREATE DATABASE SmartQR_Hangfire
  CONTAINMENT = NONE
  ON PRIMARY (
    NAME = N'SmartQR_Hangfire',
    FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.MSSQLSERVER\MSSQL\DATA\SmartQR_Hangfire.mdf',
    SIZE = 50MB,
    MAXSIZE = 5GB,
    FILEGROWTH = 5MB
  );

-- Set compatibility level
ALTER DATABASE SmartQR_DB SET COMPATIBILITY_LEVEL = 150;
ALTER DATABASE SmartQR_Hangfire SET COMPATIBILITY_LEVEL = 150;

-- Enable automatic backups
ALTER DATABASE SmartQR_DB SET RECOVERY FULL;
ALTER DATABASE SmartQR_Hangfire SET RECOVERY FULL;

-- Verify creation
SELECT name, state_desc FROM sys.databases 
WHERE name LIKE 'SmartQR%';
```

#### Step 2: Create Database User

```sql
USE master;

-- Create login
CREATE LOGIN smartqr_user WITH PASSWORD = 'SecurePassword123!@#';

-- Create user in SmartQR_DB
USE SmartQR_DB;
CREATE USER smartqr_user FOR LOGIN smartqr_user;

-- Grant permissions
ALTER ROLE db_owner ADD MEMBER smartqr_user;

-- Create user in Hangfire database
USE SmartQR_Hangfire;
CREATE USER smartqr_user FOR LOGIN smartqr_user;
ALTER ROLE db_owner ADD MEMBER smartqr_user;

-- Verify permissions
EXECUTE sp_helprolemember 'db_owner';
```

#### Step 3: Run Entity Framework Migrations

```bash
# Navigate to API directory
cd Smart_QR_API

# Verify migration status
dotnet ef migrations list

# Apply all pending migrations
dotnet ef database update

# Or target a specific migration
dotnet ef database update AddUserTable

# Verify successful migration
dotnet ef migrations has-pending-model-changes
```

**Output:**

```
info: Microsoft.EntityFrameworkCore.Infrastructure[10403]
      Entity Framework Core 8.0.0 initialized 'SmartQRContext' using provider 'Microsoft.EntityFrameworkCore.SqlServer' with options: None
info: Microsoft.EntityFrameworkCore.Database.Command[20101]
      Executed DbCommand (45ms) [Parameters=[], CommandType='Text']
      SELECT 1
info: Microsoft.EntityFrameworkCore.Migrations[20403]
      20260427100000_InitialCreate
      20260427110000_AddCustomFields
      20260427120000_AddApprovalWorkflow
Done. 3 migrations applied successfully.
```

### Migration Management

#### Creating a New Migration

```bash
# Create migration with description
dotnet ef migrations add AddNewFeature -o Migrations -v

# Review migration file before applying
cat Migrations/20260427_AddNewFeature.cs

# Apply migration
dotnet ef database update
```

#### Rollback Migration

```bash
# Rollback to previous migration
dotnet ef database update PreviousMigrationName

# Or remove last migration
dotnet ef migrations remove

# Then update database
dotnet ef database update
```

#### Advanced Migration Scenarios

**Scenario 1: Add Column with Default Value**

```csharp
// In Migration file
protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.AddColumn<string>(
        name: "NewColumn",
        table: "Users",
        type: "nvarchar(100)",
        nullable: true,
        defaultValue: "DefaultValue");
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.DropColumn(
        name: "NewColumn",
        table: "Users");
}
```

**Scenario 2: Rename Table**

```csharp
protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.RenameTable(
        name: "OldTableName",
        newName: "NewTableName");
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.RenameTable(
        name: "NewTableName",
        newName: "OldTableName");
}
```

**Scenario 3: Create Index**

```csharp
protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.CreateIndex(
        name: "IX_Users_Email",
        table: "Users",
        column: "Email",
        unique: true);
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.DropIndex(
        name: "IX_Users_Email",
        table: "Users");
}
```

### Database Backup & Recovery

#### Backup Strategy

**Full Backup (Daily)**

```sql
-- Full backup
BACKUP DATABASE SmartQR_DB 
TO DISK = 'C:\Backups\SmartQR_DB_FULL_' + 
    FORMAT(GETDATE(), 'yyyyMMdd_HHmmss') + '.bak'
WITH INIT, NAME = 'SmartQR_DB_Full_Backup',
     DESCRIPTION = 'Full backup of SmartQR_DB',
     STATS = 10;

-- Transaction log backup (every 15 minutes)
BACKUP LOG SmartQR_DB 
TO DISK = 'C:\Backups\SmartQR_DB_LOG_' + 
    FORMAT(GETDATE(), 'yyyyMMdd_HHmmss') + '.trn'
WITH INIT, NAME = 'SmartQR_DB_Log_Backup',
     STATS = 5;
```

**Automated Backup Script**

```powershell
# backup-database.ps1
param(
    [string]$SQLServer = "localhost",
    [string]$Database = "SmartQR_DB",
    [string]$BackupPath = "C:\Backups"
)

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "$BackupPath\${Database}_FULL_${timestamp}.bak"

# Create backup directory if not exists
if (-not (Test-Path $BackupPath)) {
    New-Item -ItemType Directory -Path $BackupPath | Out-Null
}

# Perform backup
$backupQuery = @"
BACKUP DATABASE [$Database] 
TO DISK = N'$backupFile'
WITH NAME = 'Full Backup of $Database', 
     COMPRESSION, 
     STATS = 10;
"@

Invoke-SqlCmd -ServerInstance $SQLServer -Query $backupQuery

# Verify backup
if (Test-Path $backupFile) {
    Write-Host "Backup completed successfully: $backupFile" -ForegroundColor Green
    
    # Clean old backups (keep last 30 days)
    Get-ChildItem -Path $BackupPath -Filter "${Database}_*.bak" | 
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | 
        Remove-Item -Force
} else {
    Write-Host "Backup failed!" -ForegroundColor Red
}
```

**Schedule Backup**

```powershell
# Schedule backup to run daily at 2 AM
$taskName = "SmartQR_Database_Backup"
$scriptPath = "C:\Scripts\backup-database.ps1"
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -File $scriptPath"
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger
```

#### Restore from Backup

```sql
-- List backup files
RESTORE FILELISTONLY 
FROM DISK = 'C:\Backups\SmartQR_DB_FULL_20260427_020000.bak';

-- Restore database
USE master;
ALTER DATABASE SmartQR_DB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

RESTORE DATABASE SmartQR_DB 
FROM DISK = 'C:\Backups\SmartQR_DB_FULL_20260427_020000.bak'
WITH REPLACE, RECOVERY;

ALTER DATABASE SmartQR_DB SET MULTI_USER;

-- Verify restore
SELECT name, state_desc FROM sys.databases WHERE name = 'SmartQR_DB';
```

---

## Email Service Configuration

### AWS SES Setup

#### Step 1: Create AWS Account & Access Keys

```
1. Go to AWS Console (https://aws.amazon.com)
2. Create account or login
3. Navigate to IAM → Users → Add User
4. Enable "Programmatic access"
5. Attach policy: AmazonSESFullAccess
6. Save Access Key & Secret Key
```

#### Step 2: Verify Email Addresses

```
1. Go to SES Console → Email Addresses
2. Click "Verify a New Email Address"
3. Enter email: admin@smartqr.com
4. Check email inbox for verification link
5. Click verification link
6. Status should change to "Verified"
```

#### Step 3: Request Production Access

```
SES Account Status:
├─ Development Mode: Can send only to verified emails
├─ Production Mode: Can send to any email
└─ Request: Go to SES Console → Sending Limits → Request
           Increase, fill form, wait for approval (24-48 hours)
```

#### Step 4: Configure in appsettings.json

```json
{
  "AWS": {
    "AccessKey": "AKIAIOSFODNN7EXAMPLE",
    "SecretKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    "Region": "us-east-1",
    "SES": {
      "From": "noreply@smartqr.com",
      "FromName": "Smart QR System",
      "ReplyToAddress": "support@smartqr.com",
      "ConfigurationSet": "smartqr-config-set"
    }
  }
}
```

### Alternative: SMTP Configuration

If using Gmail or other SMTP provider:

```json
{
  "Email": {
    "Provider": "SMTP",
    "SmtpSettings": {
      "Host": "smtp.gmail.com",
      "Port": 587,
      "EnableSSL": true,
      "UserName": "your-email@gmail.com",
      "Password": "your-app-specific-password",
      "SenderName": "Smart QR System",
      "SenderEmail": "noreply@smartqr.com"
    }
  }
}
```

**For Gmail:**
1. Enable 2-Factor Authentication
2. Generate App-Specific Password
3. Use that password in configuration

### Email Template Management

#### Create System Email Templates

```sql
-- Template 1: New User Registration
INSERT INTO CrmEmailTemplate (
    EmailTemplateID, EmailTemplateNo, Title, Status,
    EmailBody, Active, CreatedBy, CreatedOn
) VALUES (
    NEWID(), 'E-0020', 'New User Registration - [username]',
    'Active',
    '<html>
    <body style="font-family: Arial; color: #333;">
      <h2>Welcome to Smart QR!</h2>
      <p>Hello [username],</p>
      <p>Your account has been created in the Smart QR system.</p>
      <table style="border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Username:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">[username]</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">[useremail]</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Role:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">[role]</td>
        </tr>
      </table>
      <p style="margin-top: 20px;">
        <a href="[webUiUrl]" style="background: #1d62c4; color: white; padding: 10px 20px; text-decoration: none;">
          Login to Dashboard
        </a>
      </p>
      <p style="color: #999; font-size: 12px;">© 2026 Smart QR System</p>
    </body>
    </html>',
    1, 'System', GETDATE()
);

-- Template 2: QR Code Created
INSERT INTO CrmEmailTemplate (
    EmailTemplateID, EmailTemplateNo, Title, Status,
    EmailBody, Active, CreatedBy, CreatedOn
) VALUES (
    NEWID(), 'E-0021', 'QR Code Created - [qrname]',
    'Active',
    '<html>
    <body style="font-family: Arial; color: #333;">
      <h2>New QR Code Created</h2>
      <p>A new QR code has been created:</p>
      <table style="border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">[qrname]</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Type:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">[qrtype]</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Short URL:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">[shorturl]</td>
        </tr>
      </table>
      <p><a href="[webUiUrl]">View Details</a></p>
      <p style="color: #999; font-size: 12px;">© 2026 Smart QR System</p>
    </body>
    </html>',
    1, 'System', GETDATE()
);

-- Verify templates
SELECT EmailTemplateNo, Title, Active 
FROM CrmEmailTemplate 
WHERE EmailTemplateNo IN ('E-0020', 'E-0021');
```

#### Test Email Sending

```csharp
// In API - Create test endpoint (Development only)
[HttpPost("test-email")]
public async Task<IActionResult> SendTestEmail()
{
    var templateNo = "E-0020";
    var placeholders = new Dictionary<string, string>
    {
        { "username", "testuser" },
        { "useremail", "test@example.com" },
        { "role", "Admin" },
        { "webUiUrl", "https://localhost:4200" }
    };

    var result = await _emailService.SendEmailAsync(
        recipientEmail: "admin@smartqr.com",
        templateNo: templateNo,
        placeholders: placeholders
    );

    return Ok(new { success = result, message = "Test email queued" });
}
```

### Monitor Email Queue

```sql
-- Check email queue status
SELECT 
    Status,
    COUNT(*) as Count,
    MIN(CreatedOn) as OldestEmail,
    MAX(CreatedOn) as NewestEmail
FROM CrmEmailQueue
GROUP BY Status;

-- Get failed emails
SELECT TOP 20 
    QueueID, RecipientEmail, Subject, 
    ErrorMessage, RetryCount, CreatedOn
FROM CrmEmailQueue
WHERE Status = 'Failed'
ORDER BY CreatedOn DESC;

-- Resend failed emails
UPDATE CrmEmailQueue
SET Status = 'Pending', RetryCount = 0, ErrorMessage = NULL
WHERE Status = 'Failed' AND QueueID IN ('Q-ID-1', 'Q-ID-2');

-- Check email log
SELECT TOP 20 
    RecipientEmail, Subject, Status, 
    SentTime, BounceType, BounceReason
FROM CrmEmailLog
WHERE CreatedOn >= DATEADD(DAY, -7, GETDATE())
ORDER BY CreatedOn DESC;
```

---

## Deployment Guide

### Development Deployment

**Local Machine**

```bash
# 1. Clone repository
git clone <repo-url>
cd Smart_QR

# 2. Restore backend
cd Smart_QR_API
dotnet restore

# 3. Configure appsettings.json
# Edit connection strings, JWT key, etc.

# 4. Run migrations
dotnet ef database update

# 5. Run API
dotnet run

# 6. In new terminal, run frontend
cd ../Smart_QR_UI
npm install
npm start

# Access application
# UI: http://localhost:4200
# API: https://localhost:5001
# Swagger: https://localhost:5001/swagger
```

### Staging Deployment

**Server Setup**

```bash
# 1. SSH into staging server
ssh user@staging-server.com

# 2. Install prerequisites
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0 nodejs npm git

# 3. Clone repository
git clone <repo-url>
cd Smart_QR

# 4. Build backend
cd Smart_QR_API
dotnet restore
dotnet build -c Release

# 5. Configure environment
cp appsettings.json appsettings.Staging.json
# Edit Staging config with staging database, etc.

# 6. Run migrations
dotnet ef database update --project . --context SmartQRContext

# 7. Publish
dotnet publish -c Release -o ./publish

# 8. Build frontend
cd ../Smart_QR_UI
npm install
npm run build:staging

# 9. Setup IIS/Nginx
# (See web server configuration below)
```

### Production Deployment

**Automated Deployment Script**

```bash
#!/bin/bash
# deploy-prod.sh

set -e

REPO_URL="https://github.com/yourorg/Smart_QR.git"
DEPLOY_DIR="/opt/smartqr"
BACKUP_DIR="/opt/backups"

echo "Starting production deployment..."

# 1. Create backup
mkdir -p $BACKUP_DIR
cp -r $DEPLOY_DIR $BACKUP_DIR/smartqr_$(date +%Y%m%d_%H%M%S)

# 2. Pull latest code
cd $DEPLOY_DIR
git fetch origin
git checkout main
git pull origin main

# 3. Build backend
cd Smart_QR_API
dotnet restore
dotnet build -c Release --no-restore
dotnet publish -c Release -o /var/www/smartqr-api

# 4. Run migrations
dotnet ef database update

# 5. Build frontend
cd ../Smart_QR_UI
npm install --production
npm run build:prod
cp -r dist/* /var/www/smartqr-ui/

# 6. Restart services
sudo systemctl restart smartqr-api
sudo systemctl restart smartqr-ui
sudo systemctl restart nginx

echo "Deployment completed successfully"
```

**Run Deployment**

```bash
# Make script executable
chmod +x deploy-prod.sh

# Run deployment (with proper permissions)
sudo ./deploy-prod.sh

# Monitor deployment
tail -f /var/log/smartqr-api.log
```

### Web Server Configuration

#### IIS Configuration

**Create IIS Application Pool**

```powershell
# Create application pool
$appPoolName = "SmartQR-API"
New-WebAppPool -Name $appPoolName
Set-ItemProperty IIS:\AppPools\$appPoolName -Name processModel.identityType -Value SpecificUser
Set-ItemProperty IIS:\AppPools\$appPoolName -Name processModel.userName -Value "smartqr-user"
Set-ItemProperty IIS:\AppPools\$appPoolName -Name processModel.password -Value "SecurePassword123"

# Set recycle settings
Set-ItemProperty IIS:\AppPools\$appPoolName -Name recycling.periodicRestart.time -Value 0
```

**Create IIS Website**

```powershell
# Create website
New-Website -Name "SmartQR-API" `
    -PhysicalPath "C:\inetpub\smartqr-api" `
    -ApplicationPool $appPoolName `
    -Port 443 `
    -Protocol https `
    -HostHeader "api.smartqr.com" `
    -SslFlags Sni

# Add SSL certificate (assuming cert already installed)
Get-WebBinding -Name "SmartQR-API" | 
    Remove-WebBinding

New-WebBinding -Name "SmartQR-API" `
    -Protocol https `
    -Port 443 `
    -HostHeader "api.smartqr.com" `
    -SslFlags Sni `
    -CertificateThumbprint "CERT_THUMBPRINT"
```

**Create web.config**

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <aspNetCore processPath="dotnet" arguments=".\Smart_QR_API.dll" stdoutLogEnabled="false" stdoutLogFile=".\logs\stdout" />
      <rewrite>
        <rules>
          <rule name="HTTP to HTTPS Redirect" stopProcessing="true">
            <match url="(.*)" />
            <conditions>
              <add input="{HTTPS}" pattern="^OFF$" />
            </conditions>
            <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" />
          </rule>
          <rule name="Angular Routes" stopProcessing="true">
            <match url="^api" negate="true" />
            <match url="^((?!\.{1,2}(?:\/|$)).)*\.{0,1}[^.]*$" />
            <conditions logicalGrouping="MatchAll">
              <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
              <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            </conditions>
            <action type="Rewrite" url="/" />
          </rule>
        </rules>
      </rewrite>
      <staticContent>
        <mimeMap fileExtension=".woff" mimeType="font/woff" />
        <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
      </staticContent>
    </system.webServer>
  </location>
</configuration>
```

#### Nginx Configuration

**Create Nginx Site Config**

```nginx
# /etc/nginx/sites-available/smartqr-api

upstream smartqr_backend {
    server localhost:5001;
}

server {
    listen 80;
    server_name api.smartqr.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.smartqr.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/api.smartqr.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.smartqr.com/privkey.pem;
    
    # SSL best practices
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Proxy settings
    location / {
        proxy_pass http://smartqr_backend;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript application/xml;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}

# Frontend configuration
server {
    listen 80;
    listen 443 ssl http2;
    server_name smartqr.com www.smartqr.com;

    ssl_certificate /etc/letsencrypt/live/smartqr.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/smartqr.com/privkey.pem;

    root /var/www/smartqr-ui;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable Nginx Site**

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/smartqr-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## System Administration

### User Management

#### Create Admin User (Initial Setup)

```sql
-- Create default admin user
DECLARE @AdminID NVARCHAR(50) = 'USR-ADMIN-001';
DECLARE @AdminRole NVARCHAR(50) = 'ROLE-ADMIN';

-- Insert user
INSERT INTO SysUser (
    UserID, UserName, Email, FullName, Password,
    IsActive, CreatedOn, CreatedBy, Department
) VALUES (
    @AdminID, 'admin', 'admin@smartqr.com', 'System Administrator',
    'hashed_password_bcrypt', 1, GETDATE(), 'SYSTEM', 'IT'
);

-- Ensure Admin role exists
IF NOT EXISTS (SELECT 1 FROM SysRole WHERE RoleID = @AdminRole)
BEGIN
    INSERT INTO SysRole (RoleID, RoleName, RoleCode, IsSystem, IsActive)
    VALUES (@AdminRole, 'Administrator', 'ADMIN', 1, 1);
END

-- Assign role to user
INSERT INTO SysUserRole (UserRoleID, UserID, RoleID, AssignedOn, AssignedBy)
VALUES (NEWID(), @AdminID, @AdminRole, GETDATE(), 'SYSTEM');

SELECT 'Admin user created successfully' as Result;
```

#### Create Additional Admin Users (Post-Setup)

```powershell
# Script: create-admin-user.ps1

param(
    [Parameter(Mandatory=$true)]
    [string]$UserName,
    
    [Parameter(Mandatory=$true)]
    [string]$Email,
    
    [Parameter(Mandatory=$true)]
    [string]$FullName,
    
    [string]$Role = "Admin"
)

# Call API endpoint
$uri = "https://localhost:5001/api/sys/user/create"
$body = @{
    userName = $UserName
    email = $Email
    fullName = $FullName
    roleId = "ROLE-$Role"
    isActive = $true
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri $uri -Method Post -Body $body -ContentType "application/json"

if ($response.success) {
    Write-Host "Admin user '$UserName' created successfully" -ForegroundColor Green
} else {
    Write-Host "Failed to create user: $($response.message)" -ForegroundColor Red
}
```

**Usage**

```powershell
.\create-admin-user.ps1 -UserName "john.admin" `
    -Email "john.admin@smartqr.com" `
    -FullName "John Admin" `
    -Role "Admin"
```

### System Configuration

#### Configure System Settings

```sql
-- Update system configuration
UPDATE SysConfig SET
    DefaultEmailAddress = 'admin@smartqr.com',
    WebUIURL = 'https://smartqr.com',
    WebAPIURL = 'https://api.smartqr.com',
    CompanyName = 'Smart QR Inc.',
    Timezone = 'UTC',
    DateFormat = 'yyyy-MM-dd',
    CurrencyCode = 'USD'
WHERE ConfigID = '1';

-- Verify configuration
SELECT ConfigID, DefaultEmailAddress, WebUIURL, WebAPIURL
FROM SysConfig;
```

#### Setup Approval Workflows

```sql
-- Create QR Code Approval Workflow
DECLARE @WorkflowID NVARCHAR(50) = NEWID();
DECLARE @Step1ID NVARCHAR(50) = NEWID();
DECLARE @Step2ID NVARCHAR(50) = NEWID();

-- Insert workflow
INSERT INTO APP_Workflow (
    WorkflowID, WorkflowName, WorkflowCode, EntityType,
    Status, TotalSteps, CreatedOn, CreatedBy
) VALUES (
    @WorkflowID, 'QR Code Approval', 'WF_QR_APPROVAL',
    'QR', 'Active', 2, GETDATE(), 'SYSTEM'
);

-- Insert steps
INSERT INTO APP_WorkflowStep (
    StepID, WorkflowID, StepNumber, StepName,
    StepType, TimeoutDays, CreatedOn
) VALUES
    (@Step1ID, @WorkflowID, 1, 'QR Admin Review',
     'Sequential', 2, GETDATE()),
    (@Step2ID, @WorkflowID, 2, 'Manager Approval',
     'Sequential', 3, GETDATE());

-- Insert approvers
INSERT INTO APP_WorkflowStepApprover (
    ApproverID, StepID, ApprovalType, ApprovalValue, IsMandatory
) VALUES
    (NEWID(), @Step1ID, 'Role', 'ROLE-QR-ADMIN', 1),
    (NEWID(), @Step2ID, 'Role', 'ROLE-MANAGER', 1);

SELECT 'Workflow created successfully' as Result;
```

#### Setup Custom Fields

```sql
-- Create Shop entity custom fields
DECLARE @EntityID NVARCHAR(50) = 'ENT-SHOP';
DECLARE @Field1ID NVARCHAR(50) = NEWID();

-- Ensure entity exists
INSERT INTO CFD_Entity (EntityID, EntityName, TableName, Active, CreatedOn)
SELECT @EntityID, 'Shop', 'Shop_Master', 1, GETDATE()
WHERE NOT EXISTS (SELECT 1 FROM CFD_Entity WHERE EntityID = @EntityID);

-- Add Shop Category field
INSERT INTO CFD_EntityField (
    FieldID, EntityID, FieldName, DisplayName, FieldType,
    DisplayOrder, IsRequired, IsVisible, DefaultValue, CreatedOn
) VALUES (
    @Field1ID, @EntityID, 'shop_category', 'Shop Category',
    'Dropdown', 1, 1, 1, 'Retail', GETDATE()
);

-- Add dropdown options
INSERT INTO CFD_FieldOption (OptionID, FieldID, OptionValue, OptionLabel, DisplayOrder, IsActive)
VALUES
    (NEWID(), @Field1ID, 'Retail', 'Retail', 1, 1),
    (NEWID(), @Field1ID, 'Food', 'Food & Beverage', 2, 1),
    (NEWID(), @Field1ID, 'Entertainment', 'Entertainment', 3, 1),
    (NEWID(), @Field1ID, 'Service', 'Service', 4, 1);

SELECT 'Custom fields created successfully' as Result;
```

### Monitoring & Maintenance

#### System Health Check

```sql
-- Database health check
SELECT
    'Database Space' as CheckName,
    SUM(size * 8 / 1024) as SizeMB,
    SUM(FILEPROPERTY(name, 'SpaceUsed') * 8 / 1024) as UsedMB,
    SUM((size - FILEPROPERTY(name, 'SpaceUsed')) * 8 / 1024) as FreeMB
FROM sys.database_files;

-- Check active connections
SELECT COUNT(*) as ActiveConnections
FROM sys.dm_exec_sessions
WHERE database_id = DB_ID();

-- Check for blocking
SELECT * FROM sys.dm_exec_requests
WHERE status = 'suspended' AND blocking_session_id != 0;

-- Check failed jobs
SELECT job_id, step_name, run_date, run_time, run_duration, run_status
FROM msdb.dbo.sysjobhistory
WHERE run_status != 0
ORDER BY run_date DESC, run_time DESC;
```

#### Performance Monitoring

```sql
-- Top 10 slowest queries
SELECT TOP 10
    creation_time, last_execution_time,
    (total_elapsed_time / 1000000) as TotalSeconds,
    execution_count,
    (total_elapsed_time / execution_count / 1000000) as AvgSeconds,
    query_hash,
    SUBSTRING(st.text, 1, 100) as QueryText
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) st
ORDER BY total_elapsed_time DESC;

-- Index fragmentation
SELECT
    OBJECT_NAME(ips.object_id) as TableName,
    i.name as IndexName,
    ips.avg_fragmentation_in_percent as FragmentationPercent,
    ips.page_count as PageCount
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ips
JOIN sys.indexes i ON ips.object_id = i.object_id
    AND ips.index_id = i.index_id
WHERE ips.avg_fragmentation_in_percent > 10
ORDER BY ips.avg_fragmentation_in_percent DESC;
```

---

## Production Checklist

### Pre-Deployment Verification

- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] Code review completed and approved
- [ ] Security scan completed
- [ ] Database migrations tested
- [ ] API documentation updated
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Backup strategy verified
- [ ] Monitoring tools configured

### Deployment Execution

- [ ] Backup production database
- [ ] Backup application files
- [ ] Deploy API application
- [ ] Deploy UI application
- [ ] Run database migrations
- [ ] Verify API health endpoint
- [ ] Verify UI accessibility
- [ ] Test critical user flows
- [ ] Monitor error logs
- [ ] Verify email functionality

### Post-Deployment Verification

- [ ] All services running
- [ ] Database integrity verified
- [ ] Email notifications working
- [ ] File uploads working
- [ ] Authentication functional
- [ ] Approval workflows functional
- [ ] Reports generating correctly
- [ ] No error logs
- [ ] Performance metrics normal
- [ ] Backups completed successfully

---

## Troubleshooting & Recovery

### Common Issues

#### Database Connection Fails

**Symptoms:**
```
System.Data.SqlClient.SqlException: Cannot open server 'localhost'
```

**Solution:**

```powershell
# 1. Verify SQL Server is running
Get-Service MSSQLSERVER | Start-Service

# 2. Test connection
$connectionString = "Server=localhost;Database=master;Integrated Security=true;"
$connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
$connection.Open()
$connection.Close()
Write-Host "Connection successful"

# 3. Check firewall
netsh advfirewall firewall show rule name="SQL Server" direction=in
```

#### API Not Starting

**Symptoms:**
```
Unhandled exception in program
System.InvalidOperationException: Unable to configure TLS 1.2 or higher
```

**Solution:**

```powershell
# Check .NET installation
dotnet --version

# Repair .NET
dotnet --list-runtimes

# Rebuild and run
cd Smart_QR_API
dotnet clean
dotnet restore
dotnet run
```

#### Email Not Sending

**Verification Steps:**

```sql
-- Check queue
SELECT TOP 5 QueueID, RecipientEmail, Status, CreatedOn
FROM CrmEmailQueue ORDER BY CreatedOn DESC;

-- Check logs
SELECT TOP 5 LogID, RecipientEmail, Status, SentTime, ErrorMessage
FROM CrmEmailLog ORDER BY CreatedOn DESC;

-- Check template
SELECT * FROM CrmEmailTemplate
WHERE EmailTemplateNo = 'E-0020';
```

**AWS SES Verification:**

```powershell
# Verify credentials
$accessKey = "YOUR_ACCESS_KEY"
$secretKey = "YOUR_SECRET_KEY"

# Test with AWS CLI
aws ses send-email `
    --from noreply@smartqr.com `
    --to admin@smartqr.com `
    --subject "Test Email" `
    --text "This is a test"
```

### Disaster Recovery

#### Complete Database Restore

```sql
-- From backup file
RESTORE DATABASE SmartQR_DB 
FROM DISK = '\\backup-server\backups\SmartQR_DB_FULL_20260427.bak'
WITH REPLACE, RECOVERY, STATS = 10;

-- Verify restore
SELECT name, state_desc FROM sys.databases WHERE name = 'SmartQR_DB';
```

#### Rollback to Previous Version

```bash
# 1. Stop services
sudo systemctl stop smartqr-api smartqr-ui

# 2. Restore from backup
cp -r /opt/backups/smartqr_20260426_120000/* /opt/smartqr/

# 3. Restore database (if needed)
# Run SQL restore script

# 4. Restart services
sudo systemctl start smartqr-api smartqr-ui

# 5. Verify
curl https://api.smartqr.com/health
```

---

**Deployment & Operations Guide**  
**Version**: 1.0  
**Last Updated**: 2026-04-27
