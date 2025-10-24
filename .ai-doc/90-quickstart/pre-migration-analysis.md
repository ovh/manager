---
title: Pre-Migration Analysis Checklist
last_update: 2025-01-27
tags: [migration, analysis, checklist, quickstart, angularjs]
ai: true
---

# Pre-Migration Analysis Checklist

## 🧭 Purpose

Quick 5-minute analysis checklist to extract all necessary information from AngularJS source code before starting migration. This ensures no UI/UX feature is missed.

## ⚙️ Context

**Core Principle**: Analyze source code systematically to identify ALL features that must be reproduced in React.

## 🔗 References

- [US Migration Guide](../50-migration-angular/us-migration-guide.md) - **Complete migration strategy**
- [Migration Patterns](../50-migration-angular/migration-patterns.md) - **Pattern detection details**

## 🚀 Quick Analysis (5 Minutes)

### Step 1: Find Source Files (1 min)

```bash
# Navigate to source module
cd packages/manager/modules/{module-name}/src/

# List key files
ls -la *.routing.js    # Routes and states
ls -la *.template.html  # UI structure
ls -la *.controller.js  # Logic and data
ls -la *.constants.js   # Configuration
ls -la translations/    # i18n keys
```

### Step 2: Scan Routing File (1 min)

Open main `*.routing.js` and extract:

```typescript
// Look for these patterns:
$stateProvider.state('name', {
  url: '/path/:param',           // → URL pattern
  component: 'componentName',     // → Component used
  template: '<div>...</div>',    // → Inline template
  templateUrl: 'path.html',      // → External template
  
  // Special configurations:
  resolve: {
    managerListLayout: /* ... */,  // → Full listing page
    topbarOptions: { /* ... */ },  // → Header actions
    columnConfig: /* ... */        // → Datagrid columns
  }
});
```

**Key Info to Extract:**
- State names and hierarchy
- URL patterns and parameters
- Whether uses `managerListLayout`
- Topbar CTA and actions
- Resolve functions (data fetching)

### Step 3: Quick Template Scan (2 min)

Search for these patterns in `*.template.html`:

#### Layout Components
- `<manager-list-layout>` → Full listing page setup
- `<manager-on-boarding-layout>` → Onboarding page setup
- `<header class="oui-header">` → Page header
- `<oui-header-tabs>` → Tab navigation

#### Data Display
- `<oui-datagrid>` → Data table
- `<oui-tile>` → Information cards
- `<oui-tile-definition>` → Definition lists

#### Actions & Navigation
- `<oui-button>` → Action buttons
- `<oui-action-menu>` → Action menus
- `<changelog-button>` → Changelog button
- `<oui-guide-menu>` → Guides dropdown

#### Interactive Elements
- `<input ... ng-model="search">` → Search functionality
- `filter` or `filtrer` text → Filter button
- `customize-columns` → Column customization
- `<oui-pagination>` → Pagination

#### Forms & Modals
- `<oui-modal>` → Dialogs
- `<oui-field>` → Form fields
- `<oui-input>` → Input fields
- `<oui-select>` → Select dropdowns

### Step 4: API Quick Check (30 seconds)

In `*.controller.js` or services, look for:

```javascript
// API calls:
$http.get('/dedicated/nasha')  // → API endpoint
Service.getList()              // → Service method

// API version indicators:
'/api/v6/'     // → v6 API
'/api/v2/'     // → v2 API
'/engine/2api/' // → Iceberg v2
'/engine/apiv6/' // → Iceberg v6

// Pagination:
{ offset: 0, limit: 25 }  // → Offset pagination
{ cursor: 'abc', pageSize: 25 }  // → Cursor pagination
```

### Step 5: Feature Detection (30 seconds)

Count these UI elements in templates:

```markdown
## Feature Checklist

### Listing Page
- [ ] Title in header
- [ ] Search input
- [ ] Filter button
- [ ] Column customization icon (gear)
- [ ] Data grid
- [ ] Sortable columns
- [ ] Pagination controls
- [ ] Page size selector
- [ ] Order/CTA button
- [ ] Roadmap/Changelog button
- [ ] Guide menu

### Dashboard Page
- [ ] Service name in header
- [ ] Edit button (pencil icon)
- [ ] Action buttons (Roadmap, Guides)
- [ ] Tabs navigation
- [ ] Information tiles
- [ ] Configuration sections
- [ ] Metrics/statistics

### Onboarding Page
- [ ] Hero section with image
- [ ] Product description
- [ ] Guide tiles in grid
- [ ] CTA button (Order)
```

## 📋 Analysis Output Template

After 5-minute analysis, fill this template:

```markdown
## Migration Analysis: {module-name}

### Source Location
- Path: `packages/manager/modules/{module-name}/`
- Main routing: `src/{name}.routing.js`
- Templates: `src/{page}/*.template.html`

### Routes Identified
1. **Route: `/`**
   - Type: listing / dashboard / onboarding
   - Uses managerListLayout: Yes / No
   - UI Components: [list detected components]

2. **Route: `/other`**
   - Type: detail / form
   - UI Components: [list detected components]

### UI Components Detected

#### OUI Components
- `<manager-list-layout>`: Yes / No
- `<oui-datagrid>`: Yes / No
- `<oui-header-tabs>`: Yes / No
- `<oui-tile>`: Yes / No
- `<oui-modal>`: Yes / No
- `<changelog-button>`: Yes / No
- `<oui-guide-menu>`: Yes / No

#### Features
- Search: Yes / No
- Filter: Yes / No
- Column customization: Yes / No
- Pagination: Yes / No
- Page size selector: Yes / No
- Topbar CTA: Yes / No (button label: ___)
- Roadmap button: Yes / No
- Guides menu: Yes / No
- Edit button: Yes / No
- Tabs: Yes / No (tab names: ___)

### API Integration
- API Version: v6 / v2 / aapi
- Uses Iceberg: Yes / No
- Main endpoint: `/path/to/api`
- Pagination: offset / cursor / none

### Translation Keys
- Namespace: `{module}_*`
- Listing keys: `{module}_listing_*`
- Dashboard keys: `{module}_dashboard_*`
- Onboarding keys: `{module}_onboarding_*`

### Missing Elements (Must Implement)
- [ ] Feature 1: [description]
- [ ] Feature 2: [description]
- [ ] Feature 3: [description]

### MUK Components Needed
- BaseLayout
- Datagrid
- Button
- Input
- [Other components...]

### Estimated Complexity
- Simple: Single page, basic CRUD
- Medium: Multiple pages, some interactions
- Complex: Multiple routes, complex interactions, tabs
```

## 🎯 Real Example: Nasha Module

```markdown
## Migration Analysis: nasha

### Source Location
- Path: `packages/manager/modules/nasha/`
- Main routing: `src/directory/directory.routing.js`
- Templates: `src/directory/*.template.html`

### Routes Identified
1. **Route: `/`**
   - Type: listing (redirects to onboarding if empty)
   - Uses managerListLayout: Yes
   - UI Components: Datagrid, topbar CTA, filter, search

### UI Components Detected

#### OUI Components
- `<manager-list-layout>`: Yes
- `<oui-datagrid>`: Yes
- `<oui-header-tabs>`: No
- `<oui-tile>`: No (dashboard only)
- `<changelog-button>`: Yes
- `<oui-guide-menu>`: Yes

#### Features
- Search: Yes
- Filter: Yes (button next to search)
- Column customization: Yes (gear icon)
- Pagination: Yes
- Page size selector: Yes
- Topbar CTA: Yes (button label: "Order a HA-NAS")
- Roadmap button: Yes ("Roadmap & Changelog")
- Guides menu: Yes (dropdown)
- Edit button: No (listing page)

### API Integration
- API Version: v6
- Uses Iceberg: Yes
- Main endpoint: `/dedicated/nasha`
- Pagination: Iceberg cursor-based

### Translation Keys
- Namespace: `nasha_*`
- Listing keys: `nasha_directory_*` (Note: directory, not listing!)
- Dashboard keys: `nasha_dashboard_*`
- Onboarding keys: `nasha_onboarding_*`

### Missing Elements (Initial Implementation)
- [ ] Roadmap & Changelog button in header
- [ ] Filter button next to search
- [ ] Column customization gear icon
- [ ] Page size selector in pagination

### MUK Components Needed
- BaseLayout (header with actions)
- Datagrid (with sorting, pagination)
- Button (Order, Roadmap, Filter)
- Input (Search)
- DropdownMenu (Guides)

### Estimated Complexity
- Medium: Multiple pages, routing logic, onboarding conditional
```

## 🚫 Common Mistakes to Avoid

```markdown
# ❌ WRONG: Skipping analysis
# Starting migration without understanding source
# Result: Missing features (Roadmap button, Filter, etc.)

# ✅ CORRECT: Complete 5-minute analysis first
# Document all features before coding
# Result: Complete implementation from day one

# ❌ WRONG: Assuming simple = no features
# "It's just a list, no need to analyze"
# Result: Missing topbar actions, filters, customization

# ✅ CORRECT: Always analyze, even for "simple" pages
# Every page has nuances (buttons, filters, etc.)
# Result: Accurate parity
```

## 🤖 AI Development Guidelines

### Essential Analysis Rules for AI Code Generation

1. **Always start with analysis**: Never skip the 5-minute checklist
2. **Document all features**: Even if they seem "obvious"
3. **Check templates first**: UI/UX is defined in templates
4. **Verify topbar actions**: Most missed feature is extra buttons
5. **Count all buttons**: Order, Roadmap, Guides, Filter, Edit, etc.
6. **Check for special components**: changelog-button, oui-guide-menu
7. **Identify pagination type**: Affects API integration
8. **Map OUI → MUK early**: Know which components are available

### Analysis Checklist

- [ ] Source files located and listed
- [ ] Routing structure analyzed
- [ ] Templates scanned for components
- [ ] All features detected and documented
- [ ] API endpoints identified
- [ ] Translation keys extracted
- [ ] Missing elements listed
- [ ] MUK components mapped
- [ ] Ready to start migration

---

## ⚖️ The Analysis's Moral

- **5 minutes of analysis** saves hours of rework
- **Complete feature detection** prevents missing UI elements
- **Systematic approach** ensures nothing is overlooked
- **Documentation first** enables accurate implementation

**👉 Good analysis is the foundation of successful migration.**

