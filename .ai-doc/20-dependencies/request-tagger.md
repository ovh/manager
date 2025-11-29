---
title: Request Tagger
last_update: 2025-01-27
tags: [request, tagging, tracing, ovhcloud, manager, http, headers, navigation]
ai: true
---

# Request Tagger

> **📦 Version:** `@ovh-ux/request-tagger@^0.5.5`

## 🧭 Purpose

The **Request Tagger** package provides HTTP request tagging functionality for OVHcloud Manager applications. It automatically adds tracking headers to API requests, enabling request tracing, navigation tracking, and request correlation across the Manager ecosystem.

This package is essential for request tracing, debugging, and monitoring API calls in Manager applications.

## ⚙️ Context

Request Tagger is designed for:
- **Request tracing** with unique request IDs
- **Navigation tracking** with navigation IDs
- **Page context** with current page information
- **Version tracking** with application version headers
- **Request correlation** across microservices

This package is essential for:
- **API request monitoring** and debugging
- **Request tracing** in distributed systems
- **Navigation tracking** across applications
- **Performance monitoring** and analysis

## 🔗 References

- [Manager Core API](./manager-core-api.md)
- [Manager React Shell Client](./manager-react-shell-client.md)
- [Manager Config](./manager-config.md)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "dependencies": {
    "@ovh-ux/request-tagger": "^0.5.5"
  }
}
```

### Basic Request Tagging

#### Automatic Header Generation

```typescript
import { getHeaders, isURLValid } from '@ovh-ux/request-tagger';

// Check if URL should be tagged
const url = '/engine/apiv6/me';
const isValid = isURLValid(url); // true

// Get headers for request
const headers = getHeaders(url);
// Returns:
// {
//   'X-OVH-MANAGER-NAVIGATION-ID': 'abc123',
//   'X-OVH-MANAGER-REQUEST-ID': '1234567890-1',
//   'X-OVH-MANAGER-PAGE': 'dashboard',
//   'X-OVH-MANAGER-VERSION': '1.0.0'
// }
```

#### Manual Header Generation

```typescript
import { 
  generateNavigationId, 
  generateRequestId, 
  defineCurrentPage,
  defineApplicationVersion 
} from '@ovh-ux/request-tagger';

// Generate navigation ID
const navigationId = generateNavigationId();

// Generate request ID
const requestId = generateRequestId();

// Define current page
defineCurrentPage('dashboard');

// Define application version
defineApplicationVersion('1.0.0');
```

### Header Management

#### Header Types

```typescript
import { Header } from '@ovh-ux/request-tagger';

// Available headers
const headers = {
  NAVIGATION_ID: 'X-OVH-MANAGER-NAVIGATION-ID',
  REQUEST_ID: 'X-OVH-MANAGER-REQUEST-ID',
  PAGE: 'X-OVH-MANAGER-PAGE',
  VERSION: 'X-OVH-MANAGER-VERSION'
};

// Header interface
interface Headers {
  [Header.NAVIGATION_ID]: string;
  [Header.REQUEST_ID]: string;
  [Header.PAGE]: string;
  [Header.VERSION]?: string;
}
```

#### Navigation ID Management

```typescript
import { generateNavigationId, getNavigationId } from '@ovh-ux/request-tagger';

// Generate new navigation ID
const newNavigationId = generateNavigationId();

// Get current navigation ID
const currentNavigationId = getNavigationId();

// Navigation ID is stored in window.top.ovhRequestTaggerNavigationId
```

#### Request ID Generation

```typescript
import { generateRequestId } from '@ovh-ux/request-tagger';

// Generate unique request ID
const requestId = generateRequestId(); // '1234567890-1'

// Request ID format: timestamp-index
// Increments automatically for each request
```

### Page Management

#### Current Page Tracking

```typescript
import { defineCurrentPage } from '@ovh-ux/request-tagger';

// Set current page
defineCurrentPage('dashboard');
defineCurrentPage('billing');
defineCurrentPage('support');

// Page is used in X-OVH-MANAGER-PAGE header
```

#### Application Version

```typescript
import { defineApplicationVersion, getApplicationVersion } from '@ovh-ux/request-tagger';

// Set application version
defineApplicationVersion('1.0.0');

// Get application version
const version = getApplicationVersion(); // '1.0.0'

// Version is used in X-OVH-MANAGER-VERSION header
```

### Header Overrides

#### Adding Header Overrides

```typescript
import { addHeadersOverride, getHeadersOverride } from '@ovh-ux/request-tagger';

// Add header override for specific route pattern
addHeadersOverride('/engine/apiv6/billing', {
  'X-OVH-MANAGER-PAGE': 'billing',
  'X-OVH-MANAGER-VERSION': '2.0.0'
});

// Get all header overrides
const overrides = getHeadersOverride();
```

#### Removing Header Overrides

```typescript
import { removeHeadersOverride } from '@ovh-ux/request-tagger';

// Remove header override
removeHeadersOverride('/engine/apiv6/billing');

// Override is removed from headers
```

#### Header Override Search

```typescript
import { searchHeadersOverride } from '@ovh-ux/request-tagger';

// Search for header override
const url = '/engine/apiv6/billing/invoices';
const override = searchHeadersOverride(url);

if (override) {
  // Use override headers
  console.log('Override found:', override);
}
```

### URL Validation

#### Valid Routes

```typescript
import { isURLValid, ROUTES_PREFIX } from '@ovh-ux/request-tagger';

// Check if URL should be tagged
const validUrl = '/engine/apiv6/me';
const isValid = isURLValid(validUrl); // true

// Invalid URL
const invalidUrl = '/api/external';
const isInvalid = isURLValid(invalidUrl); // false

// Available route prefixes
const prefixes = ROUTES_PREFIX; // ['/engine/apiv6', '/engine/2api', '/engine/api/v2']
```

#### Custom URL Validation

```typescript
import { isURLValid } from '@ovh-ux/request-tagger';

// Validate multiple URLs
const urls = [
  '/engine/apiv6/me',
  '/engine/2api/billing',
  '/engine/api/v2/support',
  '/api/external'
];

const validUrls = urls.filter(url => isURLValid(url));
// Returns: ['/engine/apiv6/me', '/engine/2api/billing', '/engine/api/v2/support']
```

### Integration with HTTP Clients

#### Axios Integration

```typescript
import axios from 'axios';
import { getHeaders, isURLValid } from '@ovh-ux/request-tagger';

// Create axios instance with request tagging
const apiClient = axios.create({
  baseURL: '/engine/apiv6'
});

// Add request interceptor
apiClient.interceptors.request.use((config) => {
  if (isURLValid(config.url)) {
    const headers = getHeaders(config.url);
    config.headers = { ...config.headers, ...headers };
  }
  return config;
});

// Use tagged requests
const response = await apiClient.get('/me');
```

#### Fetch Integration

```typescript
import { getHeaders, isURLValid } from '@ovh-ux/request-tagger';

// Custom fetch with request tagging
const taggedFetch = async (url: string, options: RequestInit = {}) => {
  if (isURLValid(url)) {
    const headers = getHeaders(url);
    const taggedHeaders = { ...options.headers, ...headers };
    
    return fetch(url, {
      ...options,
      headers: taggedHeaders
    });
  }
  
  return fetch(url, options);
};

// Use tagged fetch
const response = await taggedFetch('/engine/apiv6/me');
```

### React Integration

#### Hook for Request Tagging

```typescript
import { useEffect } from 'react';
import { defineCurrentPage, defineApplicationVersion } from '@ovh-ux/request-tagger';

// Hook for page tracking
export const usePageTracking = (page: string) => {
  useEffect(() => {
    defineCurrentPage(page);
  }, [page]);
};

// Hook for version tracking
export const useVersionTracking = (version: string) => {
  useEffect(() => {
    defineApplicationVersion(version);
  }, [version]);
};
```

#### Component Integration

```typescript
import React from 'react';
import { usePageTracking, useVersionTracking } from './hooks';

function Dashboard() {
  usePageTracking('dashboard');
  useVersionTracking('1.0.0');
  
  return <div>Dashboard</div>;
}
```

### Advanced Usage

#### Custom Header Overrides

```typescript
import { addHeadersOverride, getHeaders } from '@ovh-ux/request-tagger';

// Add custom header overrides
addHeadersOverride('/engine/apiv6/billing', {
  'X-OVH-MANAGER-PAGE': 'billing',
  'X-OVH-MANAGER-VERSION': '2.0.0'
});

addHeadersOverride('/engine/apiv6/support', {
  'X-OVH-MANAGER-PAGE': 'support',
  'X-OVH-MANAGER-VERSION': '1.5.0'
});

// Headers will be applied based on URL pattern
const billingHeaders = getHeaders('/engine/apiv6/billing/invoices');
const supportHeaders = getHeaders('/engine/apiv6/support/tickets');
```

#### Navigation Tracking

```typescript
import { generateNavigationId, getNavigationId } from '@ovh-ux/request-tagger';

// Initialize navigation tracking
const initializeNavigation = () => {
  const navigationId = generateNavigationId();
  console.log('Navigation started:', navigationId);
  return navigationId;
};

// Track navigation changes
const trackNavigation = (newPage: string) => {
  const navigationId = getNavigationId();
  console.log('Navigation to:', newPage, 'ID:', navigationId);
};
```

#### Request Correlation

```typescript
import { generateRequestId, getHeaders } from '@ovh-ux/request-tagger';

// Correlate related requests
const correlateRequests = async (baseUrl: string) => {
  const headers = getHeaders(baseUrl);
  const requestId = headers['X-OVH-MANAGER-REQUEST-ID'];
  
  console.log('Request correlation ID:', requestId);
  
  // Use same request ID for related requests
  return requestId;
};
```

### Best Practices

#### 1. Page Tracking

```typescript
// ✅ CORRECT: Track page changes
import { defineCurrentPage } from '@ovh-ux/request-tagger';

const handlePageChange = (newPage: string) => {
  defineCurrentPage(newPage);
  // Navigate to new page
};

// ❌ WRONG: Don't forget to track page changes
const handlePageChange = (newPage: string) => {
  // Missing page tracking
  // Navigate to new page
};
```

#### 2. Version Management

```typescript
// ✅ CORRECT: Set application version
import { defineApplicationVersion } from '@ovh-ux/request-tagger';

const initializeApp = (version: string) => {
  defineApplicationVersion(version);
  // Initialize application
};

// ❌ WRONG: Missing version tracking
const initializeApp = (version: string) => {
  // Missing version definition
  // Initialize application
};
```

#### 3. Header Overrides

```typescript
// ✅ CORRECT: Use header overrides for specific routes
import { addHeadersOverride } from '@ovh-ux/request-tagger';

addHeadersOverride('/engine/apiv6/billing', {
  'X-OVH-MANAGER-PAGE': 'billing'
});

// ❌ WRONG: Don't override headers unnecessarily
// Overriding headers for all routes
```

### Common Pitfalls

#### ❌ Wrong: Missing Request Tagging

```typescript
// Don't forget to tag requests
const response = await fetch('/engine/apiv6/me');
// Missing request tagging
```

#### ✅ Correct: Proper Request Tagging

```typescript
import { getHeaders, isURLValid } from '@ovh-ux/request-tagger';

const url = '/engine/apiv6/me';
const headers = isURLValid(url) ? getHeaders(url) : {};

const response = await fetch(url, {
  headers: { ...headers }
});
```

#### ❌ Wrong: Incorrect URL Validation

```typescript
// Don't tag external URLs
const externalUrl = 'https://api.external.com/data';
const headers = getHeaders(externalUrl); // Returns empty object
```

#### ✅ Correct: Validate URLs Before Tagging

```typescript
import { getHeaders, isURLValid } from '@ovh-ux/request-tagger';

const url = '/engine/apiv6/me';
if (isURLValid(url)) {
  const headers = getHeaders(url);
  // Use headers
}
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always tag valid URLs**: Use isURLValid before getHeaders
2. **Track page changes**: Call defineCurrentPage on navigation
3. **Set application version**: Call defineApplicationVersion on app start
4. **Use header overrides**: Configure specific route headers
5. **Integrate with HTTP clients**: Add request interceptors
6. **Handle navigation IDs**: Use generateNavigationId for new sessions
7. **Correlate requests**: Use request IDs for related operations
8. **Validate URLs**: Check URL validity before tagging

### Request Tagging Checklist

- [ ] URL validation implemented
- [ ] Headers generated for valid URLs
- [ ] Page tracking configured
- [ ] Application version set
- [ ] Navigation ID generated
- [ ] Request ID generated
- [ ] Header overrides configured
- [ ] HTTP client integration

### Page Tracking Checklist

- [ ] defineCurrentPage called on navigation
- [ ] Page changes tracked
- [ ] Navigation ID generated
- [ ] Page context maintained
- [ ] Route changes handled
- [ ] Page state synchronized

### Header Management Checklist

- [ ] Headers generated for API requests
- [ ] Header overrides configured
- [ ] URL validation implemented
- [ ] Request correlation enabled
- [ ] Navigation tracking active
- [ ] Version information included

---

## ⚖️ The Request Tagger's Moral

- **Request tracing** enables debugging and monitoring of API calls
- **Navigation tracking** provides context for user actions
- **Header correlation** enables request tracing across services
- **Version tracking** helps identify application versions in logs

**👉 Good request tagging is invisible to users but essential for debugging and monitoring.**
