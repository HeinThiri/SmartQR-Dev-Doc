# Smart QR - API Documentation

**Version**: 1.0  
**API Base URL**: `https://localhost:5001/api`  
**Last Updated**: 2026-04-27

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Examples](#examples)

---

## Overview

The Smart QR API is a RESTful API built with ASP.NET Core 8.0. It provides endpoints for:

- User authentication and authorization
- QR code management
- Approval workflows
- Custom field management
- Email notifications
- Data migration
- Grid/Export operations

### API Base URL

```
Development: https://localhost:5001/api
Production: https://api.smartqr.com/api
```

### Swagger Documentation

Access interactive API documentation at:
```
https://localhost:5001/swagger
```

---

## Authentication

### JWT Token-Based Authentication

All API requests (except `/auth/login`) require a JWT bearer token in the `Authorization` header.

### Login Endpoint

**POST** `/api/auth/login`

**Request:**
```json
{
  "userName": "admin",
  "password": "P@ssw0rd123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "userId": "USR-001",
      "userName": "admin",
      "email": "admin@smartqr.com",
      "fullName": "System Administrator",
      "role": "Admin",
      "permissions": ["Read", "Write", "Delete"]
    }
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid username or password",
  "errorCode": "AUTH_001"
}
```

### Using the Token

Include the token in all subsequent requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Example with cURL

```bash
# Login
curl -X POST https://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "admin",
    "password": "P@ssw0rd123"
  }'

# Use token in subsequent requests
curl -X GET https://localhost:5001/api/qr/list \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Token Refresh

**POST** `/api/auth/refresh-token`

```json
{
  "token": "current_expired_token",
  "refreshToken": "refresh_token_from_login"
}
```

---

## API Endpoints

### User Management

#### Get Current User Profile

**GET** `/api/sys/user/profile`

**Authentication**: Required  
**Request Headers**: 
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "USR-001",
    "userName": "admin",
    "email": "admin@smartqr.com",
    "fullName": "System Administrator",
    "phoneNumber": "+95123456789",
    "role": "Admin",
    "department": "Management",
    "isActive": true,
    "lastLogin": "2026-04-27T10:30:00Z",
    "profilePicture": "https://cdn.smartqr.com/admin.jpg"
  }
}
```

#### List All Users

**GET** `/api/sys/user/list?pageSize=20&pageNumber=1&filter={filter}`

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pageSize | int | No | Default: 20 |
| pageNumber | int | No | Default: 1 |
| filter | string | No | Filter by userName, email, or role |
| sortBy | string | No | Field to sort by |
| sortOrder | string | No | asc or desc |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRecords": 50,
    "pageSize": 20,
    "pageNumber": 1,
    "items": [
      {
        "userId": "USR-001",
        "userName": "admin",
        "email": "admin@smartqr.com",
        "fullName": "System Administrator",
        "role": "Admin",
        "isActive": true,
        "createdOn": "2026-01-01T00:00:00Z"
      },
      {
        "userId": "USR-002",
        "userName": "manager",
        "email": "manager@smartqr.com",
        "fullName": "John Manager",
        "role": "QR Manager",
        "isActive": true,
        "createdOn": "2026-01-15T00:00:00Z"
      }
    ]
  }
}
```

#### Create New User

**POST** `/api/sys/user/create`

**Request Body:**
```json
{
  "userName": "newuser",
  "email": "newuser@smartqr.com",
  "password": "SecurePassword123!",
  "fullName": "New User",
  "phoneNumber": "+95123456789",
  "roleId": "ROLE-002",
  "departmentId": "DEPT-001",
  "isActive": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "USR-003",
    "userName": "newuser",
    "email": "newuser@smartqr.com"
  }
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "User already exists with this email",
  "errorCode": "USER_001"
}
```

#### Update User

**PUT** `/api/sys/user/{userId}`

**Request Body:**
```json
{
  "email": "newemail@smartqr.com",
  "fullName": "Updated Name",
  "phoneNumber": "+95987654321",
  "roleId": "ROLE-003",
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully"
}
```

#### Delete User

**DELETE** `/api/sys/user/{userId}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### QR Code Management

#### Create QR Code

**POST** `/api/qr/create`

**Request Body:**
```json
{
  "qrName": "Mall QR 001",
  "qrType": "Mall",
  "domainId": "DOM-001",
  "status": "Active",
  "description": "Main shopping mall QR code",
  "qrContent": "https://example.com/qr/001",
  "customFields": {
    "mall_name": "Shopping Center A",
    "location": "Downtown"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "QR Code created successfully",
  "data": {
    "qrId": "QR-2026-001",
    "qrName": "Mall QR 001",
    "qrType": "Mall",
    "status": "Pending Approval",
    "shortUrl": "https://qr.smartqr.com/q001",
    "createdOn": "2026-04-27T10:30:00Z"
  }
}
```

#### List QR Codes

**GET** `/api/qr/list?pageSize=20&pageNumber=1`

**Query Parameters**:
```
pageSize (int): Records per page
pageNumber (int): Page number
filter (string): Search filter
status (string): Active, Draft, Archived
qrType (string): Mall, Menu, Voucher, Event
domainId (string): Filter by domain
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRecords": 127,
    "pageSize": 20,
    "pageNumber": 1,
    "items": [
      {
        "qrId": "QR-2026-001",
        "qrName": "Mall QR 001",
        "qrType": "Mall",
        "status": "Active",
        "domainId": "DOM-001",
        "shortUrl": "https://qr.smartqr.com/q001",
        "createdOn": "2026-01-15T00:00:00Z",
        "createdBy": "admin"
      }
    ]
  }
}
```

#### Get QR Code Details

**GET** `/api/qr/{qrId}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "qrId": "QR-2026-001",
    "qrName": "Mall QR 001",
    "qrType": "Mall",
    "domainId": "DOM-001",
    "status": "Active",
    "qrContent": "https://example.com/qr/001",
    "shortUrl": "https://qr.smartqr.com/q001",
    "description": "Main shopping mall",
    "views": 1250,
    "scans": 450,
    "createdOn": "2026-01-15T00:00:00Z",
    "createdBy": "admin",
    "customFields": {
      "mall_name": "Shopping Center A",
      "location": "Downtown"
    }
  }
}
```

#### Update QR Code

**PUT** `/api/qr/{qrId}`

**Request Body:**
```json
{
  "qrName": "Updated QR Name",
  "status": "Active",
  "description": "Updated description",
  "customFields": {
    "mall_name": "Updated Name"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "QR Code updated successfully"
}
```

#### Delete QR Code

**DELETE** `/api/qr/{qrId}`

**Response (200):**
```json
{
  "success": true,
  "message": "QR Code deleted successfully"
}
```

---

### Approval Workflow

#### Get Pending Approvals

**GET** `/api/approval/pending?pageSize=20`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRecords": 5,
    "items": [
      {
        "requestId": "APR-2026-001",
        "entityType": "QR",
        "entityId": "QR-2026-001",
        "entityName": "Mall QR 001",
        "requestedBy": "user@smartqr.com",
        "requestedOn": "2026-04-27T10:00:00Z",
        "currentStep": 1,
        "currentStepName": "QR Admin Review",
        "status": "Pending",
        "timeoutDays": 2,
        "description": "New QR code requires approval"
      }
    ]
  }
}
```

#### Get Approval Details

**GET** `/api/approval/{requestId}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "requestId": "APR-2026-001",
    "workflowId": "WF-QR-001",
    "entityType": "QR",
    "entityId": "QR-2026-001",
    "entityData": {
      "qrName": "Mall QR 001",
      "qrType": "Mall",
      "domain": "DOM-001"
    },
    "currentStep": 1,
    "totalSteps": 3,
    "status": "In Progress",
    "timeline": [
      {
        "step": 1,
        "stepName": "QR Admin Review",
        "status": "Completed",
        "approvedBy": "admin1@smartqr.com",
        "approvedOn": "2026-04-27T10:30:00Z",
        "action": "Approved",
        "comment": "Looks good"
      },
      {
        "step": 2,
        "stepName": "Manager Approval",
        "status": "Pending",
        "timeoutOn": "2026-04-29T10:00:00Z",
        "approvers": ["manager1@smartqr.com", "manager2@smartqr.com"]
      }
    ]
  }
}
```

#### Submit Approval Action

**POST** `/api/approval/submit-action`

**Request Body:**
```json
{
  "requestId": "APR-2026-001",
  "stepId": 1,
  "action": "Approved",
  "comments": "Configuration looks good. Approved for next step."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Approval action submitted successfully",
  "data": {
    "requestId": "APR-2026-001",
    "newStatus": "In Progress - Step 2",
    "nextApprovers": ["manager1@smartqr.com"]
  }
}
```

**Action Options:**
- `Approved` - Move to next step
- `Rejected` - Reject and notify requester
- `Revised` - Request changes
- `Escalated` - Escalate to higher authority

---

### Custom Fields

#### Get Custom Fields for Entity

**GET** `/api/sys/custom-field/entity/{entityId}`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "fieldId": "FIELD-001",
      "fieldName": "shop_category",
      "displayName": "Shop Category",
      "fieldType": "Dropdown",
      "isRequired": true,
      "displayOrder": 1,
      "helpText": "Select the category of your shop",
      "options": [
        { "value": "Retail", "label": "Retail" },
        { "value": "Food", "label": "Food & Beverage" },
        { "value": "Entertainment", "label": "Entertainment" }
      ]
    },
    {
      "fieldId": "FIELD-002",
      "fieldName": "operating_hours",
      "displayName": "Operating Hours",
      "fieldType": "Text",
      "isRequired": false,
      "displayOrder": 2,
      "helpText": "e.g., 9AM-9PM"
    }
  ]
}
```

#### Get Form Schema

**GET** `/api/sys/custom-field/entity/{entityId}/form-schema`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "entityId": "ENT-SHOP",
    "entityName": "Shop",
    "standardFields": [
      {
        "fieldName": "shopName",
        "displayName": "Shop Name",
        "fieldType": "Text",
        "isRequired": true,
        "validation": { "minLength": 3, "maxLength": 100 }
      }
    ],
    "customFields": [
      {
        "fieldId": "FIELD-001",
        "fieldName": "shop_category",
        "displayName": "Shop Category",
        "fieldType": "Dropdown",
        "isRequired": true,
        "options": [...]
      }
    ]
  }
}
```

#### Save Custom Field Values

**POST** `/api/sys/custom-field/save-values`

**Request Body:**
```json
{
  "recordId": "SHOP-2026-001",
  "entityId": "ENT-SHOP",
  "fieldValues": {
    "shop_category": "Retail",
    "operating_hours": "9:00 AM - 9:00 PM",
    "manager_contact": "+95123456789"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Custom field values saved successfully"
}
```

#### Get Custom Field Values

**GET** `/api/sys/custom-field/record/{recordId}/values`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "fieldId": "FIELD-001",
      "fieldName": "shop_category",
      "displayName": "Shop Category",
      "fieldValue": "Retail"
    },
    {
      "fieldId": "FIELD-002",
      "fieldName": "operating_hours",
      "displayName": "Operating Hours",
      "fieldValue": "9:00 AM - 9:00 PM"
    }
  ]
}
```

---

### Email Service

#### Get Email Templates

**GET** `/api/sys/email-template`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "templateId": "TMPL-001",
      "templateCode": "E-0020",
      "title": "New User Registration - [username]",
      "status": "Active",
      "isActive": true,
      "createdOn": "2025-10-21T00:00:00Z"
    },
    {
      "templateId": "TMPL-002",
      "templateCode": "E-0021",
      "title": "QR Code Created - [qrname]",
      "status": "Active",
      "isActive": true,
      "createdOn": "2025-10-21T00:00:00Z"
    }
  ]
}
```

#### Get Template Details

**GET** `/api/sys/email-template/{templateId}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "templateId": "TMPL-001",
    "templateCode": "E-0020",
    "title": "New User Registration - [username]",
    "emailBody": "<html>...</html>",
    "placeholders": [
      "[username]",
      "[email]",
      "[role]",
      "[createddate]"
    ],
    "status": "Active",
    "isActive": true
  }
}
```

#### Create Email Template

**POST** `/api/sys/email-template`

**Request Body:**
```json
{
  "templateCode": "E-0025",
  "title": "Custom Email - [name]",
  "emailBody": "<html><body><p>Hello [name],</p><p>Custom content here.</p></body></html>",
  "status": "Active"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Template created successfully",
  "data": {
    "templateId": "TMPL-005",
    "templateCode": "E-0025"
  }
}
```

#### Send Test Email

**POST** `/api/sys/email-template/{templateId}/send-test`

**Request Body:**
```json
{
  "recipientEmail": "test@example.com",
  "placeholderData": {
    "username": "John Doe",
    "email": "john@example.com",
    "role": "QR Manager",
    "createddate": "2026-04-27"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Test email sent successfully",
  "data": {
    "messageId": "AWS-SES-MSG-12345"
  }
}
```

---

### Data Migration

#### Validate Import File

**POST** `/api/migration/validate`

**Request Body:**
```json
{
  "fileName": "qr_codes.xlsx",
  "entityType": "QR",
  "mappingConfig": {
    "qrName": { "excelColumn": "QR Name", "required": true },
    "qrType": { "excelColumn": "QR Type", "required": true },
    "domainId": { "excelColumn": "Domain", "required": true, "isLookup": true }
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRows": 6,
    "validRows": 3,
    "invalidRows": 2,
    "warningRows": 1,
    "validationDetails": [
      {
        "rowNumber": 1,
        "status": "Valid",
        "data": { "qrName": "QR-001", "qrType": "Mall" }
      },
      {
        "rowNumber": 4,
        "status": "Invalid",
        "error": "Required field 'QR Type' is missing"
      },
      {
        "rowNumber": 5,
        "status": "Warning",
        "message": "Duplicate record: QR-001 already exists"
      }
    ]
  }
}
```

#### Execute Import

**POST** `/api/migration/import`

**Request Body:**
```json
{
  "migrationName": "QR Bulk Import - 2026-04-27",
  "entityType": "QR",
  "validRows": [1, 2, 3]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Import completed successfully",
  "data": {
    "migrationJobId": "MIG-2026-04-27-001",
    "totalImported": 3,
    "totalFailed": 0,
    "importedRecords": [
      { "rowNumber": 1, "recordId": "QR-2026-001" },
      { "rowNumber": 2, "recordId": "QR-2026-002" },
      { "rowNumber": 3, "recordId": "QR-2026-003" }
    ]
  }
}
```

#### Get Migration History

**GET** `/api/migration/history?entityType=QR&pageSize=20`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRecords": 5,
    "items": [
      {
        "migrationJobId": "MIG-2026-04-27-001",
        "migrationName": "QR Bulk Import",
        "entityType": "QR",
        "fileName": "qr_codes.xlsx",
        "totalRows": 6,
        "successfulRows": 3,
        "failedRows": 2,
        "status": "Completed",
        "createdBy": "admin",
        "createdOn": "2026-04-27T15:30:00Z"
      }
    ]
  }
}
```

---

### Grid & Export

#### Export Grid Data to Excel

**POST** `/api/grid/export-excel`

**Request Body:**
```json
{
  "entityType": "QR",
  "filterConfig": {
    "filters": [
      { "field": "qrType", "operator": "=", "value": "Menu" },
      { "field": "status", "operator": "=", "value": "Active" }
    ]
  },
  "columns": ["qrName", "qrType", "status", "domainId", "createdOn"],
  "reportTitle": "QR Code Management Report",
  "includeFilters": true
}
```

**Response (200):**
- File type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- File name: `qr_report_2026-04-27_154500.xlsx`

#### Export Grid Data to PDF

**POST** `/api/grid/export-pdf`

**Request Body:**
```json
{
  "entityType": "QR",
  "filterConfig": { ... },
  "columns": ["qrName", "qrType", "status"],
  "reportTitle": "QR Code Report",
  "orientation": "landscape"
}
```

**Response (200):**
- File type: `application/pdf`
- File name: `qr_report_2026-04-27_154500.pdf`

---

## Data Models

### User DTO

```json
{
  "userId": "string (50 chars max)",
  "userName": "string (required)",
  "email": "string (email format)",
  "fullName": "string",
  "phoneNumber": "string",
  "roleId": "string",
  "role": "string",
  "departmentId": "string",
  "isActive": "boolean",
  "lastLogin": "datetime",
  "createdOn": "datetime",
  "createdBy": "string"
}
```

### QR Code DTO

```json
{
  "qrId": "string",
  "qrName": "string (required)",
  "qrType": "string (required)",
  "domainId": "string (required)",
  "status": "string (Active, Draft, Archived)",
  "qrContent": "string",
  "shortUrl": "string",
  "description": "string",
  "views": "int",
  "scans": "int",
  "customFields": "object",
  "createdOn": "datetime",
  "createdBy": "string"
}
```

### Approval Request DTO

```json
{
  "requestId": "string",
  "workflowId": "string",
  "entityType": "string",
  "entityId": "string",
  "entityName": "string",
  "requestedBy": "string",
  "requestedOn": "datetime",
  "status": "string (Pending, In Progress, Approved, Rejected)",
  "currentStep": "int",
  "totalSteps": "int",
  "timeline": "ApprovalLog[]"
}
```

---

## Error Handling

### Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errorCode": "ERROR_CODE",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error"
    }
  ]
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_001` | 401 | Invalid credentials |
| `AUTH_002` | 401 | Token expired |
| `AUTH_003` | 403 | Insufficient permissions |
| `VALIDATION_001` | 400 | Required field missing |
| `VALIDATION_002` | 400 | Invalid field format |
| `NOT_FOUND_001` | 404 | Record not found |
| `NOT_FOUND_002` | 404 | User not found |
| `CONFLICT_001` | 409 | Record already exists |
| `SERVER_ERROR` | 500 | Internal server error |

### Example Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errorCode": "VALIDATION_001",
  "errors": [
    {
      "field": "qrName",
      "message": "QR Name is required"
    },
    {
      "field": "qrType",
      "message": "QR Type must be one of: Mall, Menu, Voucher, Event"
    }
  ]
}
```

---

## Rate Limiting

API calls are rate-limited to prevent abuse:

### Rate Limits

- **Standard Users**: 100 requests/minute
- **Admin Users**: 500 requests/minute
- **API Keys**: 1000 requests/minute

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1619510400
```

### When Limit Exceeded

**Response (429 Too Many Requests):**

```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later.",
  "errorCode": "RATE_LIMIT_001",
  "retryAfter": 60
}
```

---

## Examples

### Complete Workflow - Create QR Code with Approval

#### Step 1: Login

```bash
curl -X POST https://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "user@smartqr.com",
    "password": "Password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc..."
  }
}
```

#### Step 2: Create QR Code

```bash
curl -X POST https://localhost:5001/api/qr/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "qrName": "Mall QR 2026-001",
    "qrType": "Mall",
    "domainId": "DOM-001",
    "status": "Active",
    "description": "Main shopping mall"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qrId": "QR-2026-001",
    "status": "Pending Approval"
  }
}
```

#### Step 3: Check Pending Approvals

```bash
curl -X GET "https://localhost:5001/api/approval/pending" \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "requestId": "APR-2026-001",
        "entityName": "Mall QR 2026-001",
        "status": "Pending"
      }
    ]
  }
}
```

#### Step 4: Approve QR Code

```bash
curl -X POST https://localhost:5001/api/approval/submit-action \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "requestId": "APR-2026-001",
    "stepId": 1,
    "action": "Approved",
    "comments": "Looks good. Approved."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "QR Code approved successfully"
}
```

### Export QR Code List

```bash
curl -X POST https://localhost:5001/api/grid/export-excel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "entityType": "QR",
    "columns": ["qrName", "qrType", "status"],
    "reportTitle": "QR Code Report",
    "includeFilters": true
  }' \
  --output qr_report.xlsx
```

---

## Pagination

### Query Parameters

```
pageSize (int): Records per page (default: 20, max: 100)
pageNumber (int): Page number (default: 1)
```

### Response Structure

```json
{
  "success": true,
  "data": {
    "totalRecords": 150,
    "pageSize": 20,
    "pageNumber": 1,
    "totalPages": 8,
    "items": [...]
  }
}
```

### Example

```bash
# Get page 2 with 50 records per page
curl -X GET "https://localhost:5001/api/qr/list?pageSize=50&pageNumber=2" \
  -H "Authorization: Bearer {token}"
```

---

## Filtering

### Filter Operators

```
= (equals)
!= (not equals)
> (greater than)
>= (greater than or equal)
< (less than)
<= (less than or equal)
contains (contains string)
startswith (starts with)
endswith (ends with)
in (in list)
```

### Filter Example

```json
{
  "filters": [
    { "field": "qrType", "operator": "=", "value": "Menu" },
    { "field": "status", "operator": "=", "value": "Active" },
    { "field": "qrName", "operator": "contains", "value": "QR" }
  ],
  "logic": "AND"
}
```

---

**API Documentation**  
**Last Updated**: 2026-04-27  
**Version**: 1.0
