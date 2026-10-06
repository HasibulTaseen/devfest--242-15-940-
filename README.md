# TenderPack — Tender Document Package Builder

TenderPack is a frontend-only web application developed for the **AI DevFest 2026 Vibe Coding Contest**.

It helps organizations prepare tender submissions by loading tender requirements, uploading PDF documents, matching documents with requirements, validating missing or expired documents, and generating one correctly ordered PDF package.

---

## Participant Information

**Name:** Hasibul Alam Siddiquee Ta-seen  
**Registration Number:** 242-15-940  
**Contest:** AI DevFest 2026 Vibe Coding Contest

---

## Live Website

YOUR_LIVE_WEBSITE_URL

Example:

https://your-project.vercel.app

---

## Problem

Preparing a tender submission manually can be difficult.

Users need to:

- Check required documents
- Find missing documents
- Check expiry dates
- Avoid duplicate documents
- Arrange documents in the correct order
- Combine many PDFs
- Add a cover page
- Add page numbers
- Prepare the final submission package

TenderPack makes this process easier in the browser.

---

## Main Features

### Requirements JSON Loader

Users can load the provided `requirements.json` file.

The application automatically displays:

- Tender ID
- Tender title
- Procuring entity
- Bidder
- Submission deadline
- Required documents
- Optional documents
- Expiry requirements
- Correct document order

---

### Multiple PDF Upload

Users can upload multiple tender PDF documents.

The application displays:

- File name
- File size
- Number of pages
- Upload status

Limits:

- Maximum 30 PDFs
- Maximum 50 MB total

Non-PDF files are rejected.

---

### PDF Validation

The application detects PDFs that cannot be read and shows a clear error for damaged or password-protected documents.

---

### Duplicate Detection

TenderPack calculates a SHA-256 hash for uploaded documents.

This allows the application to detect exact duplicate PDF content even when duplicate files have different filenames.

Duplicate copies cannot be matched to different tender requirements.

---

### Document Matching

Each uploaded PDF can be assigned to a tender requirement.

Rules enforced by the application:

- One file can match at most one requirement.
- One requirement can have at most one file.
- A duplicate document cannot be used for another requirement.
- Users can change or remove a match.

---

### Expiry Date Validation

For documents requiring an expiry date, the user can enter the expiry date.

The application compares it with the tender submission deadline.

Expiry equal to the submission deadline is accepted.

---

## Validation Status

TenderPack automatically calculates the status of every requirement.

### Missing

A mandatory requirement has no matched document.

**Blocking:** Yes

### Expiry date needed

A document requiring an expiry date is matched, but no expiry date has been entered.

**Blocking:** Yes

### Expired

The expiry date is earlier than the tender submission deadline.

**Blocking:** Yes

### Not provided

An optional document has not been provided.

**Blocking:** No

### OK

The document is correctly matched and passes its expiry validation.

**Blocking:** No

---

## Package Generation

The Generate Package button remains disabled while blocking issues exist.

After all blocking problems are resolved, TenderPack generates:

`<tender_id>_Package.pdf`

The generated package contains:

1. Tender cover page
2. Document index
3. Tender documents in requirement order
4. All original PDF pages
5. Page numbering on every page

The footer format is:

`<tender_id> | Page X of Y`

A dedicated footer area is added so page numbers do not cover the original document content.

---

## Cover Page

The generated cover contains:

- Tender ID
- Tender title
- Procuring entity
- Bidder
- Submission deadline
- Package creation date
- Included documents in requirement order

---

## Document Index

An index page is automatically generated after the cover page.

It shows:

- Requirement order
- Document name
- Starting page number

---

## CSV Checklist Export

Users can download a CSV checklist containing:

- Requirement order
- Requirement ID
- English title
- Bangla title
- Required/optional status
- Expiry requirement
- Validation status
- Matched filename
- Expiry date
- Submission deadline

UTF-8 BOM is included for better Bangla support in spreadsheet applications.

---

## Bangla and English

The application includes an EN / বাংলা language switch.

Users can use the application interface in either English or Bangla.

Tender requirement titles use `title_en` and `title_bn` from the provided requirements file.

---

## Privacy

TenderPack is a browser-only application.

Tender documents are processed locally inside the user's browser.

There is:

- No backend
- No database
- No server-side PDF processing
- No document upload to an application server

---

## Technology Stack

- React
- Vite
- JavaScript
- CSS
- pdf-lib
- Web Crypto API

---

## Run Locally

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL