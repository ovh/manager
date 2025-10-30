---
title: Migration Prompt Template
last_update: 2025-01-27
tags: [prompt, template, migration]
ai: true
---

# Migration Prompt Template

Use this template for efficient migrations:

```
Migrate @module-name/ to @bmc-module-name/ following @.ai-doc/

Source: packages/manager/modules/module-name/
Target: packages/manager/apps/bmc-module-name/

Routes to implement:
1. / (root) - [describe behavior]
2. /listing - [describe]
3. /dashboard/:id - [describe]

API endpoints:
- Listing: /api/endpoint (Iceberg v6/v2)
- Details: /api/endpoint/:id (v6/v2)

Special requirements:
- [Any specific requirements]
```

This format helps AI understand:
- Source location
- Routes needed
- API type (crucial for data fetching)
- Special cases

## Example Usage

### Complete Migration (Recommended)
```
Migrate @nasha/ to @bmc-nasha/ following @.ai-doc/

CRITICAL: Analyze AngularJS source code following @.ai-doc/90-quickstart/pre-migration-analysis.md to detect ALL UI features before implementing.

Source: packages/manager/modules/nasha/
Target: packages/manager/apps/bmc-nasha/

Routes: 
- / (redirect to onboarding if empty, listing if services exist)
- /onboarding (empty state page)
- /listing (services list with full features)

API: /dedicated/nasha (Iceberg v6)
Product: NAS-HA storage service

Requirements:
- Analyze templates to detect ALL features (search, filter, column customization, etc.)
- Reproduce ALL detected UI elements including topbar buttons
- Use @.ai-doc/20-dependencies/muk-components-reference.md for OUI→MUK mapping
- Maintain 100% UI/UX parity with AngularJS version
```

### Simple Migration (Less Recommended)
```
Migrate @nasha/ to @bmc-nasha/ following @.ai-doc/

Source: packages/manager/modules/nasha/
Routes: / (redirect to onboarding if empty, listing if services exist), /onboarding, /listing
API: /dedicated/nasha (Iceberg v6)
Product: NAS-HA storage service

⚠️ Note: This minimal prompt may miss features. Use Complete Migration format above for better results.
```

### Complex Migration
```
Migrate @dedicated-server/ to @bmc-dedicated-server/ following @.ai-doc/

Source: packages/manager/modules/dedicated-server/
Routes: 
- / (root) - redirect to listing
- /listing - server list with filters
- /dashboard/:id - server details with tabs
- /configuration/:id - server configuration
- /intervention/:id - server interventions

API endpoints:
- Listing: /dedicated/server (Iceberg v6)
- Details: /dedicated/server/:id (v6)
- Configuration: /dedicated/server/:id/configuration (v6)

Special requirements:
- Server status filtering
- Multiple datacenter support
- Intervention history
```

## Key Information to Include

### 1. Source Analysis
- Read the original AngularJS routing file
- Identify the main API endpoints
- Note any special logic (redirects, empty states)

### 2. Route Structure
- List all routes that need to be implemented
- Describe the behavior of each route
- Note any conditional logic (empty state vs populated state)

### 3. API Information
- Specify the API version (v6, v2, Iceberg)
- List all endpoints that will be used
- Note any special API requirements

### 4. Product Context
- Describe what the product does
- Note any special features or requirements
- Include any domain-specific logic

## Common Patterns

### Empty State Pattern
```
Routes: / (redirect to onboarding if empty, listing if services exist)
```
This is common for products that need onboarding when no services exist.

### Simple Listing Pattern
```
Routes: / (redirect to listing), /listing
```
This is for products that always show a listing.

### Dashboard Pattern
```
Routes: / (redirect to listing), /listing, /dashboard/:id
```
This is for products with detailed views.

## Checklist Before Prompting

- [ ] Read the source AngularJS routing file
- [ ] Identify all API endpoints used
- [ ] List all routes and their behavior
- [ ] Note any special requirements
- [ ] Check if there are any domain-specific features
- [ ] Use the template format above
