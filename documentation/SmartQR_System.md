# Smart QR Code System

## Table of Contents
1. [Architecture](#architecture)
2. [Common Wizard Steps](#common-wizard-steps)
3. [QR Types](#qr-types)
   - [URL (Website)](#url-website)
   - [WiFi](#wifi)
   - [vCard](#vcard)
   - [SMS](#sms)
   - [Email](#email)
   - [Location](#location)
   - [Event](#event)
   - [Cryptocurrency](#cryptocurrency)
   - [Plain Text](#plain-text)
4. [Supported Formats](#supported-formats)
5. [Implementation Examples](#implementation-examples)
6. [Best Practices](#best-practices)

## Architecture
- **QR content**: a viewer URL (e.g. `https://<host>/sms/<id>`) so the payload can be updated without reprinting.
- **Payload storage**: persisted as normalized `FieldValues` in the database.
- **Viewer**: loads payload via `SmartQRApi/GetQRPublic/{qrCodeID}` and renders type-specific UI/actions.
- **Analytics**: scan tracking is recorded via `SmartQRApi/ScanQR`.

## Common Wizard Steps
### Step 1: Configure
- Collect type-specific inputs.
- Validate inputs with user-friendly error messages.
- Persist drafts in `sessionStorage` so users can go back/forward without losing work.

### Step 2: Customize + Save
- Customize dot pattern, colors, optional logo, and optional frame.
- Generate QR image (and composite preview when frames are used).
- Save to backend via `SmartQRApi/SaveQR`.

## QR Types
| Type | Create Route | Viewer Route | Primary FieldValues |
|---|---|---|---|
| URL (Website) | `/qr-codes/type/website` | `/website/{id}` | `websiteUrl`, `qrName` |
| WiFi | `/qr-codes/type/wifi` | `/wifi/{id}` | `ssid`, `security`, `password`, `hidden`, `qrName` |
| vCard | `/qr-codes/type/v-card` | `/vcard/{id}` | `fullName`, `phone`, `email`, `companyName`, `companyTitle`, address fields, `socialNetworks`, `portfolioItems`, `imageUrl`, `welcomeScreenImage`, `qrName` |
| SMS | `/qr-codes/type/sms` | `/sms/{id}` | `phoneNumber`, `message`, `qrName` |
| Email | `/qr-codes/type/email` | `/email/{id}` | `to`, `subject`, `body`, `qrName` |
| Location | `/qr-codes/type/location` | `/location/{id}` | `latitude`, `longitude`, `label`, `qrName` |
| Event | `/qr-codes/type/event` | `/event/{id}` | Event fields (name/date/location/description, etc.) |
| Cryptocurrency | `/qr-codes/type/crypto` | `/crypto/{id}` | `currency`, `address`, `amount`, `label`, `message`, `qrName` |
| Plain Text | `/qr-codes/type/text` | `/text/{id}` | `text`, `qrName` |

### URL (Website)
#### Use Cases
- Product landing pages
- Company/portfolio pages
- Social link hubs

#### Parameters (Step 1)
| Field | Required | Validation | Example |
|---|---:|---|---|
| `qrName` | Yes | max 50 | `Company Website` |
| `websiteUrl` | Yes | external URL, rejects localhost/private/internal routes | `https://example.com` |

#### Wizard Steps
- Step 1: enter `websiteUrl` and `qrName`.
- Step 2: customize design and save.

#### Stored FieldValues Example
```json
{
  "qrName": "Company Website",
  "websiteUrl": "https://example.com"
}
```

#### Best Practices
- Always include `https://` for maximum scanner compatibility.
- Avoid redirect chains; they can break on some devices.

### WiFi
#### Use Cases
- Guest WiFi at cafés/restaurants
- Office WiFi for visitors
- Event WiFi sharing (booths, conferences)

#### Parameters (Step 1)
| Field | Required | Validation | Example |
|---|---:|---|---|
| `qrName` | Yes | max 50 | `Cafe WiFi` |
| `ssid` | Yes | max 64 | `MyNetwork` |
| `security` | Yes | `WPA` \| `WEP` \| `nopass` | `WPA` |
| `password` | Cond. | required unless `nopass`; WPA recommends min 8 | `P@ssw0rd123` |
| `hidden` | No | boolean | `false` |

#### Wizard Steps
- Step 1: enter SSID/security/password.
- Step 2: customize design and save.

#### Stored FieldValues Example
```json
{
  "qrName": "Cafe WiFi",
  "ssid": "MyNetwork",
  "security": "WPA",
  "password": "P@ssw0rd123",
  "hidden": true
}
```

#### Best Practices
- Treat WiFi passwords as secrets; only distribute QR codes in trusted spaces.
- Prefer a guest VLAN/network and rotate passwords periodically.

### vCard
#### Use Cases
- Networking at conferences
- Digital business cards for teams
- Recruiting/contact capture

#### Parameters (Step 1)
The vCard wizard captures a richer profile. Common fields include:
| Field | Required | Notes |
|---|---:|---|
| `qrName` | Yes | Friendly name used in dashboards |
| `fullName` | Yes | Display name shown in viewer |
| `phone` | No | Primary phone |
| `altPhone` | No | Secondary phone |
| `email` | No | Email address |
| `website` | No | Personal/company website |
| `companyName` | No | Organization |
| `companyTitle` | No | Job title |
| `street`, `city`, `state`, `postalCode`, `country` | No | Address fields |
| `addressUrl` | No | Maps link |
| `summaryText` | No | Short bio/summary |
| `socialNetworks` | No | Serialized list of social links |
| `portfolioItems` | No | Serialized list of portfolio items |
| `imageUrl`, `welcomeScreenImage` | No | Optional images |

#### Wizard Steps
- Step 1: fill profile details and assets.
- Step 2: customize design and save.

#### Stored FieldValues Example
```json
{
  "qrName": "John - Business Card",
  "fullName": "John Doe",
  "phone": "+14155550123",
  "email": "john@example.com",
  "companyName": "Example Inc.",
  "companyTitle": "Sales"
}
```

#### Best Practices
- Keep the profile concise; focus on the 2–3 most important contact methods.
- Prefer public URLs for social links and verify they load on mobile.

### SMS
#### Use Cases
- One-tap support messages
- Quick inquiries (sales/leads)
- Short code campaigns

#### Parameters (Step 1)
| Field | Required | Validation | Example |
|---|---:|---|---|
| `qrName` | Yes | max 50 | `Text Support` |
| `phoneNumber` | Yes | `^\+?[0-9]{6,15}$` | `+14155550123` |
| `message` | No | max 160 | `Hi, I need help with...` |

#### Viewer Action
- Opens `sms:<phone>?body=<message>` when supported by the device.

### Email
#### Use Cases
- Contact forms without typing
- Lead capture and sales inquiries
- Feedback collection via email

#### Parameters (Step 1)
| Field | Required | Validation | Example |
|---|---:|---|---|
| `qrName` | Yes | max 50 | `Email Sales` |
| `to` | Yes | valid email, max 254 | `sales@example.com` |
| `subject` | No | max 150 | `Inquiry` |
| `body` | No | max 500 | `Hello, I would like...` |

#### Viewer Action
- Opens `mailto:<to>?subject=<subject>&body=<body>`.

### Location
#### Use Cases
- Venue navigation
- Pickup/dropoff locations
- Booth locations at events

#### Parameters (Step 1)
| Field | Required | Validation | Example |
|---|---:|---|---|
| `qrName` | Yes | max 50 | `Main Entrance` |
| `latitude` | Yes | -90..90 | `37.4219983` |
| `longitude` | Yes | -180..180 | `-122.084` |
| `label` | No | max 120 | `Building A` |

#### Viewer Action
- Opens Google Maps using a `q=<lat>,<lon>` link.

### Event
#### Use Cases
- Event registration and check-in
- RSVP collection
- Attendee confirmation pages

#### Parameters (Step 1)
- The Event wizard captures event details (name, description, images, and registration configuration) and stores them as FieldValues.
- Registration APIs exist in `SmartQRController` (register/check/list/summary).

#### Wizard Steps
- Step 1: configure event content and registration settings.
- Step 2: customize design and save.

### Cryptocurrency
#### Use Cases
- Donations
- In-person crypto payments
- Tips (artists/creators)

#### Parameters (Step 1)
| Field | Required | Validation | Example |
|---|---:|---|---|
| `qrName` | Yes | max 50 | `BTC Donations` |
| `currency` | Yes | enumerated | `bitcoin` |
| `address` | Yes | max 120 | `bc1q...` |
| `amount` | No | positive if provided | `0.01` |
| `label` | No | max 80 | `Coffee` |
| `message` | No | max 120 | `Thanks!` |

#### Viewer Action
- Builds wallet deep links such as `bitcoin:<address>?amount=<amount>` or `ethereum:<address>` depending on the selected currency.

#### Best Practices
- Always show the address in the viewer so users can verify it before sending.
- Avoid auto-filling amount for large payments; prefer user-controlled amount entry.

### Plain Text
#### Use Cases
- Short instructions (e.g. WiFi rules, opening hours)
- Quick notes (inventory labels, internal ops)
- Checklists or reminders

#### Parameters (Step 1)
| Field | Required | Validation | Example |
|---|---:|---|---|
| `qrName` | Yes | max 50 | `Store Hours` |
| `text` | Yes | max 300 | `Mon-Fri 9am-5pm` |

#### Viewer Behavior
- Displays the text content and allows copying from the browser.

## Supported Formats
- QR images: `image/png` (default), `image/jpeg`, `image/webp`.
- QR export: SVG generation is supported by the UI service.

## Implementation Examples
### Generate viewer URL content
```ts
generateSimpleQRContent({ type, existingId }: { type: string; existingId?: string }): string {
  const origin = window.location.origin;
  const id = existingId ?? crypto.randomUUID();
  return `${origin}/${type}/${id}`;
}
```

### WiFi form validation (Step 1)
```ts
this.form = this.fb.group({
  qrName: ['', [Validators.required, Validators.maxLength(50)]],
  ssid: ['', [Validators.required, Validators.maxLength(64)]],
  security: ['WPA', [Validators.required]],
  password: ['', [Validators.maxLength(64)]],
  hidden: [false]
}, { validators: [this.wifiPasswordRequiredValidator()] });
```

### Viewer actions (examples)
```ts
this.actionUri = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
this.actionUri = `sms:${encodeURIComponent(phone)}?body=${encodeURIComponent(message)}`;
this.actionUri = `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lon}`)}`;
```

## Best Practices
- Prefer viewer URLs for scan analytics and the ability to update payloads after printing.
- Keep payloads minimal and validated; avoid optional fields that cause ambiguous viewer states.
- Never include secrets in QR codes unless you control distribution (WiFi passwords, private addresses).
- For crypto, display the address clearly and encourage user verification before payment.
- Keep text short for better scan reliability and UI readability.

## Key Source Files
- API: `Smart_QR_API/APIs/SmartQR_Module/SmartQRApi.cs`
- API: `Smart_QR_API/Infrastructure/Repository/SmartQR_Module/SmartQRController.cs`
- UI: `Smart_QR_UI/src/app/services/qr-code.service.ts`
- UI: `Smart_QR_UI/src/app/pages/systematic/modules/qr-code-list/qr-operation/simple-qr-step-one/*`
- UI: `Smart_QR_UI/src/app/pages/systematic/modules/qr-code-list/qr-operation/simple-qr-step-two/*`
- UI: `Smart_QR_UI/src/app/pages/systematic/modules/qr-code-list/qr-viewer/simple-viewer/*`
