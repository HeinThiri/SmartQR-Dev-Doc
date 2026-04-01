import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-smart-pay-integration',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="page">
      <a routerLink="/smart-hr" class="back-link">
        <i class="bi bi-arrow-left"></i> Smart HR
      </a>
      <h1>Smart Pay Integration</h1>
      <p class="subtitle">Design plan for integrating Smart HR credit purchase system with SmartPay (SPGA) payment gateway &mdash; online credit top-up via KBZ Pay, Wave Money, and CB Pay.</p>
      <div class="doc-status" style="background:#fff3e0;color:#e65100;"><i class="bi bi-arrow-repeat"></i> In Progress</div>

      <!-- 1. Overview -->
      <section class="card">
        <h2>1. Overview</h2>
        <h3>Current State</h3>
        <p>Credit top-up currently relies on <strong>manual bank transfer</strong> combined with <strong>coupon codes</strong>. Admin generates coupons, sends them to license owners, and license owners redeem them to add credits. This process is manual, slow, and error-prone.</p>

        <h3>Goal</h3>
        <p>Integrate <strong>SmartPay (SPGA)</strong> payment gateway so license owners can <strong>purchase credits online</strong> directly from Smart HR using mobile payment providers.</p>

        <h3>High-Level Flow</h3>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-cart"></i> Smart HR UI<small>Buy Credits</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-cloud-arrow-up"></i> Smart HR API<small>Create Payment</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-credit-card"></i> SmartPay API<small>POST /payments/request</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-link-45deg"></i> Returns paymentUrl<small>Redirect User</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-phone"></i> SmartPay UI<small>Customer Pays</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check-circle"></i> Payment Confirmed<small>KBZ / Wave / CB</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-bell"></i> SmartPay Webhook<small>POST to Smart HR</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-plus-circle"></i> Credits Updated<small>AicLicenseCredit</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-start"><i class="bi bi-arrow-return-left"></i> Notify UI<small>Show Success</small></div>
          </div>
        </div>

        <h3>Supported Payment Providers</h3>
        <table>
          <thead><tr><th>Provider</th><th>Code</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>KBZ Pay</td><td><code>KBZ_PAY</code></td><td><span class="status-badge status-active">Phase 1</span></td></tr>
            <tr><td>Wave Money</td><td><code>WAVE_PAY</code></td><td><span class="status-badge status-active">Phase 1</span></td></tr>
            <tr><td>CB Pay</td><td><code>CB_PAY</code></td><td><span class="status-badge status-active">Phase 1</span></td></tr>
            <tr><td>Visa / Mastercard</td><td><code>CARD</code></td><td><span class="status-badge status-pending">Future</span></td></tr>
          </tbody>
        </table>
      </section>

      <!-- 2. Integration Architecture -->
      <section class="card">
        <h2>2. Integration Architecture</h2>
        <p>Full end-to-end flow showing all system interactions between Smart HR, SmartPay API, payment providers, and webhook callbacks.</p>

        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-person"></i> User<small>Buy Credits Page</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-server"></i> Smart HR API<small>PayPaymentApi</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-cloud"></i> SmartPay API<small>POST /payments/request</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-database"></i> Save PayPaymentRequest<small>Status: CREATED</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-left"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-link-45deg"></i> Receive paymentUrl<small>+ paymentRequestId</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-left"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-receipt"></i> SmartPay Creates<small>Payment Request</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-box-arrow-up-right"></i> Redirect User<small>to paymentUrl</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-credit-card-2-front"></i> SmartPay Payment UI<small>pay.smarticwork.com</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-phone"></i> Customer Selects<small>KBZ / Wave / CB Pay</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-qr-code-scan"></i> Scan QR / Pay<small>In Mobile App</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check2-all"></i> Provider Confirms<small>Payment Success</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-bell"></i> SmartPay Webhook<small>POST to callbackUrl</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-shield-check"></i> Verify HMAC<small>Signature Check</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-plus-circle"></i> Add Credits<small>SP: CRD_CouponAddedByPayment</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check-circle"></i> Payment Complete<small>User Notified</small></div>
          </div>
        </div>

        <h3>SmartPay Environment URLs</h3>
        <table>
          <thead><tr><th>Environment</th><th>Base URL</th></tr></thead>
          <tbody>
            <tr><td>UAT API</td><td><code>https://api-uat.spga.smarticwork.com/api/v1</code></td></tr>
            <tr><td>Production API</td><td><code>https://api.spga.smarticwork.com/api/v1</code></td></tr>
            <tr><td>Payment UI</td><td><code>https://pay.smarticwork.com/gateway?token=xxxx</code></td></tr>
            <tr><td>SignalR Hub</td><td><code>wss://api.spga.smarticwork.com/hubs/payment-status</code></td></tr>
          </tbody>
        </table>
      </section>

      <!-- 3. Database Schema -->
      <section class="card">
        <h2>3. Database Schema &mdash; New Tables</h2>
        <p>Two new tables to track payment requests and webhook callbacks in Smart HR database.</p>

        <h3>PayPaymentRequest</h3>
        <div class="er-diagram">
          <div class="er-table er-table-wide">
            <div class="er-header">PayPaymentRequest</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> PaymentRequestId <span class="type">nvarchar(50)</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> LicenseId <span class="type">nvarchar(50)</span></div>
            <div class="er-row">MerchantOrderNo <span class="type">nvarchar(50)</span></div>
            <div class="er-row">IdempotencyKey <span class="type">nvarchar(100)</span></div>
            <div class="er-row">CreditCount <span class="type">int</span></div>
            <div class="er-row">Amount <span class="type">decimal</span></div>
            <div class="er-row">Currency <span class="type">nvarchar(3)</span></div>
            <div class="er-row">Status <span class="type">nvarchar(20)</span></div>
            <div class="er-row">SpgaPaymentRequestId <span class="type">nvarchar(100)</span></div>
            <div class="er-row">PaymentUrl <span class="type">nvarchar(500)</span></div>
            <div class="er-row">ReturnUrl <span class="type">nvarchar(500)</span></div>
            <div class="er-row">ExpiresAt <span class="type">datetime</span></div>
            <div class="er-row">PaidAt <span class="type">datetime</span></div>
            <div class="er-row">ProviderCode <span class="type">nvarchar(20)</span></div>
            <div class="er-row">Description <span class="type">nvarchar(200)</span></div>
            <div class="er-row">CustomerRef <span class="type">nvarchar(100)</span></div>
            <div class="er-row">Metadata <span class="type">nvarchar(MAX)</span></div>
            <div class="er-row">Active <span class="type">bit</span></div>
            <div class="er-row">CreatedBy / CreatedOn <span class="type">nvarchar / datetime</span></div>
            <div class="er-row">ModifiedBy / ModifiedOn <span class="type">nvarchar / datetime</span></div>
            <div class="er-row">LastAction <span class="type">nvarchar(20)</span></div>
          </div>
        </div>

        <h3>PayPaymentCallback</h3>
        <div class="er-diagram">
          <div class="er-table er-table-wide">
            <div class="er-header">PayPaymentCallback</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> CallbackId <span class="type">nvarchar(50)</span></div>
            <div class="er-row fk"><span class="badge-fk">FK</span> PaymentRequestId <span class="type">nvarchar(50)</span></div>
            <div class="er-row">SpgaTransactionId <span class="type">nvarchar(100)</span></div>
            <div class="er-row">Status <span class="type">nvarchar(20)</span></div>
            <div class="er-row">ProviderCode <span class="type">nvarchar(20)</span></div>
            <div class="er-row">PaidAt <span class="type">datetime</span></div>
            <div class="er-row">Amount <span class="type">decimal</span></div>
            <div class="er-row">RawPayload <span class="type">nvarchar(MAX)</span></div>
            <div class="er-row">SignatureValid <span class="type">bit</span></div>
            <div class="er-row">ProcessedOn <span class="type">datetime</span></div>
            <div class="er-row">Active <span class="type">bit</span></div>
            <div class="er-row">CreatedOn <span class="type">datetime</span></div>
          </div>
        </div>

        <h3>Table Relationships</h3>
        <div class="er-diagram">
          <div class="er-table">
            <div class="er-header">SysLicense</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> LicenseId</div>
            <div class="er-row">CompanyName</div>
            <div class="er-row">LicenseNo</div>
          </div>
          <div class="er-relation">
            <span>1</span>
            <div class="er-line"></div>
            <span>N</span>
          </div>
          <div class="er-table">
            <div class="er-header">PayPaymentRequest</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> PaymentRequestId</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> LicenseId</div>
            <div class="er-row">Status</div>
          </div>
          <div class="er-relation">
            <span>1</span>
            <div class="er-line"></div>
            <span>N</span>
          </div>
          <div class="er-table">
            <div class="er-header">PayPaymentCallback</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> CallbackId</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> PaymentRequestId</div>
            <div class="er-row">Status</div>
          </div>
        </div>

        <div class="er-diagram" style="margin-top: 16px;">
          <div class="er-table">
            <div class="er-header">PayPaymentRequest</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> PaymentRequestId</div>
            <div class="er-row">Status = PAID</div>
          </div>
          <div class="er-relation">
            <span>1</span>
            <div class="er-line"></div>
            <span>1</span>
          </div>
          <div class="er-table">
            <div class="er-header">CrdCreditUnitAdd</div>
            <div class="er-row pk"><span class="badge-pk">PK</span> CreditAddId</div>
            <div class="er-row">RefType = PAYMENT</div>
            <div class="er-row fk"><span class="badge-fk">FK</span> RefTypeId = PaymentRequestId</div>
          </div>
        </div>
      </section>

      <!-- 4. Smart HR API - New Endpoints -->
      <section class="card">
        <h2>4. Smart HR API &mdash; New Endpoints</h2>
        <p>New <code>PayPaymentApi</code> controller for handling payment operations.</p>

        <table>
          <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
          <tbody>
            <tr>
              <td><span class="method-post">POST</span></td>
              <td><code>/PayPaymentApi/CreatePaymentRequest</code></td>
              <td>Create payment request for credit purchase. Validates license, calculates amount (creditCount x creditPrice), calls SmartPay POST /payments/request, saves PayPaymentRequest, returns paymentUrl to frontend.</td>
            </tr>
            <tr>
              <td><span class="method-get">GET</span></td>
              <td><code>/PayPaymentApi/GetPaymentStatus/&#123;id&#125;</code></td>
              <td>Check payment status. Calls SmartPay GET /payments/request/&#123;id&#125; for real-time status and updates local record.</td>
            </tr>
            <tr>
              <td><span class="method-post">POST</span></td>
              <td><code>/PayPaymentApi/WebhookCallback</code></td>
              <td>Receive webhook from SmartPay. Verify HMAC signature, find payment request by SpgaPaymentRequestId, update status, if PAID call stored procedure <code>CRD_CouponAddedByPayment</code> to add credits to CrdCreditUnitAdd.</td>
            </tr>
            <tr>
              <td><span class="method-get">GET</span></td>
              <td><code>/PayPaymentApi/GetPaymentHistory</code></td>
              <td>Get all payment requests for the current license. Returns list with status, amount, date, provider info.</td>
            </tr>
            <tr>
              <td><span class="method-post">POST</span></td>
              <td><code>/PayPaymentApi/CancelPayment/&#123;id&#125;</code></td>
              <td>Cancel an unpaid payment request. Only works for CREATED or PENDING status.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 5. SmartPay API Integration Details -->
      <section class="card">
        <h2>5. SmartPay API Integration Details</h2>

        <h3>Authentication &mdash; JWT Bearer Token</h3>
        <p>Smart HR uses JWT Bearer token authentication with SmartPay. First call <code>POST /auth/token</code> with API key + secret to get a JWT, then include it on all subsequent requests. Token is cached until expiry.</p>
        <table>
          <thead><tr><th>Step</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><strong>1. Get Token</strong></td><td><code>POST /api/v1/auth/token</code> with &#123; apiKey, apiSecret &#125;</td></tr>
            <tr><td><strong>2. Use Token</strong></td><td><code>Authorization: Bearer &#123;accessToken&#125;</code> on all payment API calls</td></tr>
            <tr><td><strong>3. Cache</strong></td><td>Token cached in <code>SmartPayService</code> until 1 min before expiry</td></tr>
          </tbody>
        </table>

        <h4>String-to-Sign Format</h4>
        <p><code>StringToSign = HTTP_METHOD + "\n" + URL_PATH + "\n" + TIMESTAMP + "\n" + SHA256(requestBody)</code></p>
        <p>Then compute: <code>Signature = HMAC-SHA256(apiSecret, StringToSign)</code></p>

        <h3>POST /auth/token</h3>
        <p>Obtain JWT token using API credentials.</p>
        <table>
          <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>apiKey</code></td><td>string</td><td>SmartPay API key</td></tr>
            <tr><td><code>apiSecret</code></td><td>string</td><td>SmartPay API secret</td></tr>
          </tbody>
        </table>

        <h3>POST /payments/request &mdash; Create Payment Request</h3>
        <h4>Request Body</h4>
        <table>
          <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>merchantOrderNo</code></td><td>string</td><td>Yes</td><td>Unique order number from Smart HR</td></tr>
            <tr><td><code>amount</code></td><td>decimal</td><td>Yes</td><td>Total amount in MMK</td></tr>
            <tr><td><code>currency</code></td><td>string</td><td>Yes</td><td>Currency code (MMK)</td></tr>
            <tr><td><code>description</code></td><td>string</td><td>No</td><td>Payment description</td></tr>
            <tr><td><code>customerRef</code></td><td>string</td><td>No</td><td>Customer reference (license ID)</td></tr>
            <tr><td><code>returnUrl</code></td><td>string</td><td>Yes</td><td>URL to redirect after payment</td></tr>
            <tr><td><code>callbackUrl</code></td><td>string</td><td>Yes</td><td>Webhook URL for payment notifications</td></tr>
            <tr><td><code>idempotencyKey</code></td><td>string</td><td>Yes</td><td>Unique key to prevent duplicate requests</td></tr>
            <tr><td><code>metadata</code></td><td>object</td><td>No</td><td>Custom key-value pairs (creditCount, licenseId)</td></tr>
            <tr><td><code>expiresInMinutes</code></td><td>int</td><td>No</td><td>Payment expiration (default: 30)</td></tr>
          </tbody>
        </table>

        <h4>Response</h4>
        <table>
          <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>paymentRequestId</code></td><td>string</td><td>SmartPay unique ID for this payment</td></tr>
            <tr><td><code>paymentUrl</code></td><td>string</td><td>URL to redirect customer for payment</td></tr>
            <tr><td><code>status</code></td><td>string</td><td>Initial status (CREATED)</td></tr>
            <tr><td><code>expiresAt</code></td><td>datetime</td><td>When the payment request expires</td></tr>
            <tr><td><code>merchantOrderNo</code></td><td>string</td><td>Echo of merchant order number</td></tr>
          </tbody>
        </table>

        <h3>POST /payments/initiate &mdash; Customer Selects Provider</h3>
        <p>Called when customer selects a payment provider on SmartPay UI (handled by SmartPay frontend, not Smart HR).</p>
        <table>
          <thead><tr><th>Provider Code</th><th>Provider Name</th></tr></thead>
          <tbody>
            <tr><td><code>KBZ_PAY</code></td><td>KBZ Pay</td></tr>
            <tr><td><code>WAVE_PAY</code></td><td>Wave Money</td></tr>
            <tr><td><code>CB_PAY</code></td><td>CB Pay</td></tr>
          </tbody>
        </table>

        <h3>Webhook Payload (POST to Smart HR callbackUrl)</h3>
        <table>
          <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>paymentRequestId</code></td><td>string</td><td>SmartPay payment request ID</td></tr>
            <tr><td><code>transactionId</code></td><td>string</td><td>SmartPay transaction ID</td></tr>
            <tr><td><code>merchantOrderNo</code></td><td>string</td><td>Smart HR order number</td></tr>
            <tr><td><code>status</code></td><td>string</td><td>PAID / FAILED / EXPIRED / CANCELLED</td></tr>
            <tr><td><code>providerCode</code></td><td>string</td><td>KBZ_PAY / WAVE_PAY / CB_PAY</td></tr>
            <tr><td><code>amount</code></td><td>decimal</td><td>Payment amount</td></tr>
            <tr><td><code>currency</code></td><td>string</td><td>MMK</td></tr>
            <tr><td><code>paidAt</code></td><td>datetime</td><td>Timestamp of payment (null if not paid)</td></tr>
            <tr><td><code>metadata</code></td><td>object</td><td>Custom metadata from original request</td></tr>
          </tbody>
        </table>
        <p><strong>Webhook signature verification:</strong> SmartPay signs webhook payloads using the shared webhook secret. Smart HR must verify the <code>X-Signature</code> header before processing.</p>

        <h3>Webhook Retry Schedule</h3>
        <table>
          <thead><tr><th>Attempt</th><th>Delay</th></tr></thead>
          <tbody>
            <tr><td>1st retry</td><td>1 minute</td></tr>
            <tr><td>2nd retry</td><td>5 minutes</td></tr>
            <tr><td>3rd retry</td><td>15 minutes</td></tr>
            <tr><td>4th retry</td><td>1 hour</td></tr>
            <tr><td>5th retry</td><td>4 hours</td></tr>
          </tbody>
        </table>

        <h3>SignalR Real-Time Updates (Optional)</h3>
        <p>SmartPay provides a SignalR hub at <code>wss://api.spga.smarticwork.com/hubs/payment-status</code> for real-time payment status updates. Smart HR can subscribe to this hub on the payment return page to show live status without polling.</p>
      </section>

      <!-- 6. Payment Status Lifecycle -->
      <section class="card">
        <h2>6. Payment Status Lifecycle</h2>

        <h3>PaymentRequest Status</h3>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-plus-circle"></i> CREATED<small>Request Created</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-hourglass-split"></i> PENDING<small>Awaiting Payment</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-check-circle"></i> PAID<small>Payment Received</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-danger"><i class="bi bi-x-circle"></i> FAILED<small>Payment Failed</small></div>
            <div class="diagram-node node-pending" style="background:#e65100;"><i class="bi bi-clock-history"></i> EXPIRED<small>Timed Out (30m)</small></div>
            <div class="diagram-node node-danger"><i class="bi bi-dash-circle"></i> CANCELLED<small>User Cancelled</small></div>
          </div>
        </div>

        <h3>PaymentTransaction Status</h3>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-step"><i class="bi bi-play-circle"></i> INITIATED<small>Provider Selected</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-qr-code"></i> QR_GENERATED<small>QR Code Ready</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-hourglass-split"></i> PENDING<small>Awaiting Scan</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-success"><i class="bi bi-check-circle"></i> PAID<small>Success</small></div>
            <div class="diagram-node node-danger"><i class="bi bi-x-circle"></i> FAILED<small>Failed</small></div>
            <div class="diagram-node node-pending" style="background:#e65100;"><i class="bi bi-clock-history"></i> EXPIRED<small>Timed Out</small></div>
            <div class="diagram-node node-danger"><i class="bi bi-dash-circle"></i> CANCELLED<small>Cancelled</small></div>
            <div class="diagram-node node-action"><i class="bi bi-arrow-counterclockwise"></i> REFUNDED<small>Refunded</small></div>
          </div>
        </div>
      </section>

      <!-- 7. Implementation Plan - Backend -->
      <section class="card">
        <h2>7. Implementation Plan &mdash; Backend (C# .NET)</h2>

        <h3>New Files to Create</h3>
        <table>
          <thead><tr><th>Layer</th><th>File Path</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>API</td><td><code>SmartHR_API/APIs/System_Module/PayPaymentApi.cs</code></td><td>REST API controller for payment endpoints</td></tr>
            <tr><td>DTO</td><td><code>SmartHR_API/DTO/System_Module/CrdPaymentDTO.cs</code></td><td>Request/Response DTOs for payment operations</td></tr>
            <tr><td>Controller</td><td><code>SmartHR_API/Infrastructure/Repository/System_Module/PayPaymentController.cs</code></td><td>Business logic for payment CRUD, webhook processing, credit addition</td></tr>
            <tr><td>Service</td><td><code>SmartHR_API/Infrastructure/Services/SmartPayService.cs</code></td><td>SmartPay API client &mdash; HttpClient, HMAC signing, token management, request/response handling</td></tr>
            <tr><td>Service</td><td><code>SmartHR_API/Infrastructure/Services/SmartPayWebhookValidator.cs</code></td><td>Webhook signature verification using shared secret</td></tr>
            <tr><td>DB Migration</td><td><code>SQL Scripts</code></td><td>CREATE TABLE PayPaymentRequest, PayPaymentCallback</td></tr>
          </tbody>
        </table>

        <h3>Key Methods &mdash; PayPaymentController</h3>
        <table>
          <thead><tr><th>Method</th><th>Logic</th></tr></thead>
          <tbody>
            <tr>
              <td><code>CreatePaymentRequest</code></td>
              <td>
                1. Validate license exists and is active<br>
                2. Calculate amount: creditCount x creditPrice (from SysConfig)<br>
                3. Generate idempotencyKey and merchantOrderNo<br>
                4. Call SmartPayService.CreatePaymentRequest()<br>
                5. Save PayPaymentRequest with SpgaPaymentRequestId and PaymentUrl<br>
                6. Return paymentUrl to frontend
              </td>
            </tr>
            <tr>
              <td><code>WebhookCallback</code></td>
              <td>
                1. Read raw request body<br>
                2. Verify HMAC signature using SmartPayWebhookValidator<br>
                3. Parse webhook payload<br>
                4. Find PayPaymentRequest by SpgaPaymentRequestId<br>
                5. Check idempotency (skip if already processed)<br>
                6. Save PayPaymentCallback record<br>
                7. If status = PAID: call stored procedure <code>CRD_CouponAddedByPayment</code> to add credits to CrdCreditUnitAdd<br>
                8. Update PayPaymentRequest status and PaidAt
              </td>
            </tr>
            <tr>
              <td><code>GetPaymentStatus</code></td>
              <td>
                1. Find PayPaymentRequest by ID<br>
                2. Call SmartPayService.GetPaymentStatus() for real-time status<br>
                3. Update local record if status changed<br>
                4. Return current status to frontend
              </td>
            </tr>
          </tbody>
        </table>

        <h3>SmartPayService &mdash; HMAC Signing</h3>
        <p>The <code>SmartPayService</code> class handles all HTTP communication with SmartPay API including HMAC-SHA256 signature generation for every request.</p>
        <table>
          <thead><tr><th>Method</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>GetTokenAsync()</code></td><td>POST /auth/token with apiKey + apiSecret, cache JWT</td></tr>
            <tr><td><code>CreatePaymentRequestAsync(dto)</code></td><td>POST /payments/request with HMAC signature</td></tr>
            <tr><td><code>GetPaymentStatusAsync(id)</code></td><td>GET /payments/request/&#123;id&#125; with HMAC signature</td></tr>
            <tr><td><code>ComputeHmacSignature(method, path, timestamp, body)</code></td><td>Generate HMAC-SHA256 from string-to-sign</td></tr>
            <tr><td><code>ComputeSha256Hash(content)</code></td><td>SHA256 hash of request body</td></tr>
          </tbody>
        </table>
      </section>

      <!-- 8. Implementation Plan - Frontend -->
      <section class="card">
        <h2>8. Implementation Plan &mdash; Frontend (Angular)</h2>

        <h3>Changes to Existing Components</h3>
        <table>
          <thead><tr><th>Component</th><th>Change</th></tr></thead>
          <tbody>
            <tr>
              <td><code>credit-balance-info.component.ts</code></td>
              <td>Add <strong>"Buy Credits Online"</strong> button next to the existing bank transfer information section. Button navigates to the new payment checkout page.</td>
            </tr>
          </tbody>
        </table>

        <h3>New Components</h3>
        <table>
          <thead><tr><th>Component</th><th>Route</th><th>Description</th></tr></thead>
          <tbody>
            <tr>
              <td><code>payment-checkout.component.ts</code></td>
              <td><code>/config-module/payment-checkout</code></td>
              <td>Credit amount selection page &mdash; slider/input for credit count, total price display in MMK, "Pay Now" button that creates payment request and redirects to SmartPay UI.</td>
            </tr>
            <tr>
              <td><code>payment-return.component.ts</code></td>
              <td><code>/config-module/payment-return</code></td>
              <td>Return page after SmartPay payment &mdash; polls payment status, shows success/failure result, displays updated credit balance.</td>
            </tr>
          </tbody>
        </table>

        <h3>New Service</h3>
        <table>
          <thead><tr><th>File</th><th>Methods</th></tr></thead>
          <tbody>
            <tr>
              <td><code>payment.service.ts</code></td>
              <td>
                <code>createPaymentRequest(creditCount)</code> &mdash; POST to PayPaymentApi/CreatePaymentRequest<br>
                <code>getPaymentStatus(id)</code> &mdash; GET PayPaymentApi/GetPaymentStatus/&#123;id&#125;<br>
                <code>getPaymentHistory()</code> &mdash; GET PayPaymentApi/GetPaymentHistory<br>
                <code>cancelPayment(id)</code> &mdash; POST PayPaymentApi/CancelPayment/&#123;id&#125;
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 9. User Flow -->
      <section class="card">
        <h2>9. User Flow &mdash; Step by Step</h2>
        <div class="diagram">
          <div class="diagram-row">
            <div class="diagram-node node-start"><i class="bi bi-1-circle"></i> Buy Credits<small>User clicks button</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-2-circle"></i> Select Amount<small>Slider / Input</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-step"><i class="bi bi-3-circle"></i> See Total Price<small>creditCount x price MMK</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-4-circle"></i> Pay Now<small>Create Payment Request</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-pending"><i class="bi bi-5-circle"></i> Redirect<small>SmartPay Payment Page</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-6-circle"></i> Select Provider<small>KBZ / Wave / CB</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-pending"><i class="bi bi-7-circle"></i> Scan QR<small>Pay in Mobile App</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-8-circle"></i> Provider Confirms<small>Payment Success</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-action"><i class="bi bi-9-circle"></i> Webhook Received<small>Smart HR Callback</small></div>
          </div>
          <div class="diagram-down"><i class="bi bi-arrow-down"></i></div>
          <div class="diagram-row">
            <div class="diagram-node node-action"><i class="bi bi-shield-check"></i> Step 10<small>Verify Signature</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-success"><i class="bi bi-plus-circle"></i> Step 11<small>Credits Added</small></div>
            <div class="diagram-arrow"><i class="bi bi-arrow-right"></i></div>
            <div class="diagram-node node-start"><i class="bi bi-check2-all"></i> Step 12<small>Show Success Page</small></div>
          </div>
        </div>

        <h3>Detailed Steps</h3>
        <ol>
          <li><strong>User clicks "Buy Credits"</strong> on credit balance modal (credit-balance-info component)</li>
          <li><strong>Checkout page</strong> &mdash; Select credit count using slider or numeric input</li>
          <li><strong>See total price</strong> &mdash; Display calculated total in MMK (creditCount x CreditPriceMMK from SysConfig)</li>
          <li><strong>Click "Pay Now"</strong> &mdash; Smart HR API creates payment request, receives paymentUrl from SmartPay</li>
          <li><strong>Browser redirects</strong> to SmartPay payment page (pay.smarticwork.com)</li>
          <li><strong>Customer selects</strong> payment provider: KBZ Pay, Wave Money, or CB Pay</li>
          <li><strong>Customer scans QR</strong> code or completes payment in mobile banking app</li>
          <li><strong>SmartPay receives</strong> payment confirmation from the payment provider</li>
          <li><strong>SmartPay sends webhook</strong> POST to Smart HR API callback URL</li>
          <li><strong>Smart HR verifies</strong> HMAC signature and updates payment status to PAID</li>
          <li><strong>Credits added</strong> to license &mdash; stored procedure <code>CRD_CouponAddedByPayment</code> called, CrdCreditUnitAdd record created</li>
          <li><strong>Customer redirected</strong> back to Smart HR returnUrl &mdash; payment return page shows success and updated balance</li>
        </ol>
      </section>

      <!-- 10. Configuration -->
      <section class="card">
        <h2>10. Configuration</h2>
        <p>New <code>SysConfig</code> keys to add for SmartPay integration.</p>

        <table>
          <thead><tr><th>Config Key</th><th>Value / Format</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>SmartPay_ApiKey</code></td><td>Encrypted string</td><td>SmartPay API key (encrypted in DB)</td></tr>
            <tr><td><code>SmartPay_ApiSecret</code></td><td>Encrypted string</td><td>SmartPay API secret (encrypted in DB)</td></tr>
            <tr><td><code>SmartPay_BaseUrl</code></td><td>https://api.spga.smarticwork.com/api/v1</td><td>SmartPay API base URL (UAT or Production)</td></tr>
            <tr><td><code>SmartPay_ProductCode</code></td><td>Smart-HR-Dev</td><td>Product code for Smart HR credits in SmartPay</td></tr>
            <tr><td><code>SmartPay_WebhookSecret</code></td><td>Encrypted string</td><td>Shared secret for verifying incoming webhook signatures</td></tr>
            <tr><td><code>SmartPay_ReturnUrl</code></td><td>https://&#123;domain&#125;/config-module/payment-return</td><td>URL to redirect customer after payment</td></tr>
            <tr><td><code>CreditPriceMMK</code></td><td>3000</td><td>Price per credit unit in Myanmar Kyat</td></tr>
          </tbody>
        </table>
      </section>

      <!-- 11. Security Considerations -->
      <section class="card">
        <h2>11. Security Considerations</h2>
        <table>
          <thead><tr><th>Concern</th><th>Mitigation</th></tr></thead>
          <tbody>
            <tr><td><strong>API Authentication</strong></td><td>HMAC-SHA256 signature for all SmartPay API calls with timestamp validation</td></tr>
            <tr><td><strong>Webhook Verification</strong></td><td>Verify X-Signature header on all incoming webhooks; reject invalid signatures immediately</td></tr>
            <tr><td><strong>Duplicate Payments</strong></td><td>IdempotencyKey on every payment request prevents duplicate charges</td></tr>
            <tr><td><strong>Payment Expiration</strong></td><td>Payment requests expire after 30 minutes (configurable) to prevent stale payments</td></tr>
            <tr><td><strong>Credential Storage</strong></td><td>SmartPay_ApiKey, SmartPay_ApiSecret, SmartPay_WebhookSecret stored encrypted in SysConfig</td></tr>
            <tr><td><strong>Transport Security</strong></td><td>HTTPS only for all communication between Smart HR and SmartPay</td></tr>
            <tr><td><strong>Rate Limiting</strong></td><td>Rate limit webhook endpoint to prevent abuse (max 100 requests/minute per IP)</td></tr>
            <tr><td><strong>Audit Trail</strong></td><td>Every payment request, callback, and credit addition logged with timestamps and user info</td></tr>
          </tbody>
        </table>
      </section>

      <!-- 12. Error Handling -->
      <section class="card">
        <h2>12. Error Handling &amp; Edge Cases</h2>
        <table>
          <thead><tr><th>Scenario</th><th>Handling</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Payment expired</strong><br><small>Customer did not pay within 30 minutes</small></td>
              <td>Auto-cancel payment request. No credits added. User can create a new payment request.</td>
            </tr>
            <tr>
              <td><strong>Webhook delivery failed</strong><br><small>Smart HR endpoint unreachable</small></td>
              <td>SmartPay retries automatically: 1m, 5m, 15m, 1h, 4h. Smart HR should also poll GetPaymentStatus as fallback.</td>
            </tr>
            <tr>
              <td><strong>Duplicate webhook</strong><br><small>Same webhook delivered twice</small></td>
              <td>Idempotency check on PayPaymentCallback. If PaymentRequestId + Status already exists, skip processing and return 200 OK.</td>
            </tr>
            <tr>
              <td><strong>SmartPay API unavailable</strong><br><small>API timeout or 5xx error</small></td>
              <td>Show user-friendly error message. Allow retry after 30 seconds. Log error for monitoring.</td>
            </tr>
            <tr>
              <td><strong>Invalid webhook signature</strong><br><small>Tampered or forged webhook</small></td>
              <td>Reject with 401 Unauthorized. Log security alert with source IP and payload hash.</td>
            </tr>
            <tr>
              <td><strong>Partial refund</strong><br><small>SmartPay sends REFUNDED status</small></td>
              <td>Reduce credits proportionally from AicLicenseCredit. Create negative CrdCreditUnitAdd record.</td>
            </tr>
            <tr>
              <td><strong>Customer navigates away</strong><br><small>Left SmartPay page mid-payment</small></td>
              <td>Payment stays in PENDING status. Webhook will arrive if paid, or auto-expire after 30 minutes.</td>
            </tr>
            <tr>
              <td><strong>Credit calculation mismatch</strong><br><small>Amount does not match expected</small></td>
              <td>Verify webhook amount matches PayPaymentRequest.Amount. Flag discrepancy and hold credits for manual review.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 13. Testing Plan -->
      <section class="card">
        <h2>13. Testing Plan</h2>

        <h3>Unit Tests</h3>
        <ul>
          <li><strong>SmartPayService</strong> &mdash; HMAC signature generation, token caching, request/response serialization</li>
          <li><strong>SmartPayWebhookValidator</strong> &mdash; Signature verification with valid/invalid/missing signatures</li>
          <li><strong>PayPaymentController</strong> &mdash; Credit calculation (creditCount x price), idempotency checks, status transitions</li>
        </ul>

        <h3>Integration Tests (SmartPay UAT)</h3>
        <table>
          <thead><tr><th>Test Scenario</th><th>Expected Result</th></tr></thead>
          <tbody>
            <tr><td>Successful payment (KBZ Pay)</td><td>Payment status PAID, credits added to license</td></tr>
            <tr><td>Successful payment (Wave Money)</td><td>Payment status PAID, credits added to license</td></tr>
            <tr><td>Failed payment</td><td>Payment status FAILED, no credits added</td></tr>
            <tr><td>Expired payment (wait 30 min)</td><td>Payment status EXPIRED, no credits added</td></tr>
            <tr><td>Duplicate webhook delivery</td><td>Second webhook returns 200 OK, credits not doubled</td></tr>
            <tr><td>Invalid webhook signature</td><td>Returns 401, no credits added, security alert logged</td></tr>
            <tr><td>Cancel unpaid payment</td><td>Payment status CANCELLED, no credits added</td></tr>
            <tr><td>Concurrent payment requests</td><td>Each request gets unique idempotencyKey, no conflicts</td></tr>
          </tbody>
        </table>
      </section>

      <!-- 14. Implementation Phases -->
      <section class="card">
        <h2>14. Implementation Phases</h2>
        <table>
          <thead><tr><th>Phase</th><th>Description</th><th>Duration</th><th>Status</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Phase 1</strong></td>
              <td>Backend API + SmartPay integration &mdash; SmartPayService, PayPaymentApi, HMAC signing, DB tables</td>
              <td>2 weeks</td>
              <td><span class="status-badge status-active">Done</span></td>
            </tr>
            <tr>
              <td><strong>Phase 2</strong></td>
              <td>Frontend checkout + return pages &mdash; payment-checkout component, payment-return component, payment.service</td>
              <td>1 week</td>
              <td><span class="status-badge status-active">Done</span></td>
            </tr>
            <tr>
              <td><strong>Phase 3</strong></td>
              <td>Webhook processing + credit auto-add &mdash; WebhookCallback, signature verification, stored procedure CRD_CouponAddedByPayment</td>
              <td>1 week</td>
              <td><span class="status-badge status-active">Done</span></td>
            </tr>
            <tr>
              <td><strong>Phase 4</strong></td>
              <td>Testing + UAT deployment &mdash; End-to-end testing with SmartPay, return URL redirect, credit addition</td>
              <td>1 week</td>
              <td><span class="status-badge status-pending">In Progress</span></td>
            </tr>
            <tr>
              <td><strong>Phase 5</strong></td>
              <td>Production deployment + monitoring &mdash; Switch to production API, monitor webhooks, alert on failures</td>
              <td>1 week</td>
              <td><span class="status-badge status-pending">Planned</span></td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 15. Doc Log -->
      <section class="card">
        <h2>Doc Log</h2>
        <table>
          <thead><tr><th>Date</th><th>Author</th><th>Change</th></tr></thead>
          <tbody>
            <tr><td>2026-03-27</td><td>Hein Htet Zaw</td><td>Webhook credit addition changed to stored procedure CRD_CouponAddedByPayment, ProductCode updated to Smart-HR-Dev, SmartPay return URL redirect implemented</td></tr>
            <tr><td>2026-03-27</td><td>Hein Htet Zaw</td><td>Backend + Frontend implementation started</td></tr>
            <tr><td>2026-03-27</td><td>Hein Htet Zaw</td><td>Initial design plan</td></tr>
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
      background: #fff3e0; color: #e65100;
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

    table {
      width: 100%; border-collapse: collapse; margin: 0 0 14px; font-size: 13px;
    }
    th {
      text-align: left; padding: 10px 12px; background: #f5f7fa;
      border-bottom: 2px solid #e0e4ec; font-weight: 600; color: #444;
    }
    td { padding: 9px 12px; border-bottom: 1px solid #f0f0f0; color: #444; vertical-align: top; }
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
    .er-table-wide { min-width: 320px; }
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

    /* HTTP Method Badges */
    .method-get {
      background: #e8f5e9; color: #2e7d32; padding: 2px 8px;
      border-radius: 4px; font-size: 11px; font-weight: 700;
    }
    .method-post {
      background: #fff3e0; color: #e65100; padding: 2px 8px;
      border-radius: 4px; font-size: 11px; font-weight: 700;
    }

    /* Status Badges */
    .status-badge {
      display: inline-block; padding: 3px 10px; border-radius: 4px;
      font-size: 12px; font-weight: 600;
    }
    .status-pending { background: #fff3e0; color: #e65100; }
    .status-active { background: #e8f5e9; color: #2e7d32; }
  `]
})
export class SmartPayIntegrationComponent {}
