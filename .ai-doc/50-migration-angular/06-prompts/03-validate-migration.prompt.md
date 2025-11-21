---
title: "Prompt 3: Validate Migration"
prompt_id: "03-validate-migration"
phase: "automated-migration"
sequence: 3
tags: [prompt, validation, parity, automation]
ai: true
---

# Prompt 3: Validate Migration

## 🎯 Objective

Validate that the React implementation has **100% functional parity** with the AngularJS module across visual, functional, and technical dimensions.

**Systematic validation to ensure zero regressions.**

## 📋 Context

This is the **third and final prompt** in the automated 2-prompt migration workflow. The implementation is complete. Now validate everything works correctly and matches the original.

## ✅ Prerequisites

- [ ] Prompt 2 completed successfully
- [ ] All features implemented
- [ ] `MIGRATION_NOTES.md` created
- [ ] App builds without errors
- [ ] Access to both AngularJS and React versions

## 📥 Required Inputs

| Input | Description | Location |
|-------|-------------|----------|
| React implementation | Complete code | `{TARGET_PATH}/src/` |
| AngularJS source | Original code | `{SOURCE_PATH}/` |
| MIGRATION_NOTES.md | Mapping docs | `{TARGET_PATH}/` |
| DETECTED_FEATURES.md | Feature list | `{TARGET_PATH}/` |

## 🔧 Validation Actions

### Step 1: Route Parity Validation

**Check**: All AngularJS routes have React equivalents

```typescript
// Compare:
// AngularJS states from *.routing.js
// React routes from Routes.tsx

// Count routes
const angularJsRoutes = extractStatesFromRouting('{SOURCE_PATH}/**/*.routing.js');
const reactRoutes = extractRoutesFromReact('{TARGET_PATH}/src/routes/Routes.tsx');

// Validate
assert(angularJsRoutes.length === reactRoutes.length, 'Route count mismatch');

// Check each route
for (const angularRoute of angularJsRoutes) {
  const reactRoute = findMatchingReactRoute(angularRoute);
  assert(reactRoute !== null, `Missing route: ${angularRoute.name}`);
  assert(reactRoute.path === convertUrlPattern(angularRoute.url), 'URL mismatch');
}
```

**Output**: Route parity report

```markdown
## Route Parity

✅ All X routes migrated
✅ All URL patterns match
✅ All nested routes preserved

| AngularJS State | React Route | Status |
|-----------------|-------------|--------|
| nasha | / | ✅ Match |
| nasha.directory | /listing | ✅ Match |
| ... | ... | ... |
```

**Reference**: [Parity Validation Guide - Routes](../parity-validation-guide.md#route-parity)

### Step 2: API Parity Validation

**Check**: All AngularJS API calls have React hooks

```typescript
// Extract API calls from AngularJS
const angularApiCalls = [
  ...extractAAPIcalls(resolves),
  ...extractIcebergCalls(resolves),
  ...extractV6Calls(controllers),
];

// Extract React hooks
const reactHooks = findAllHooks('{TARGET_PATH}/src/data/api/hooks/**/*.ts');

// Validate
for (const apiCall of angularApiCalls) {
  const hook = findMatchingHook(apiCall, reactHooks);
  assert(hook !== null, `Missing hook for: ${apiCall.endpoint}`);
  assert(hook.usesCorrectAPI(apiCall.type), 'API type mismatch');
}
```

**Output**: API parity report

```markdown
## API Parity

✅ All X API endpoints migrated
✅ All AAPI calls use aapi
✅ All Iceberg calls use fetchIcebergV6
✅ All v6 calls use apiClient.v6

| AngularJS Call | React Hook | API Type | Status |
|----------------|------------|----------|--------|
| OvhApiDedicatedNasha.Aapi() | useNashaDetail | AAPI | ✅ Match |
| iceberg().query() | usePartitions | Iceberg | ✅ Match |
| ... | ... | ... | ... |
```

**Reference**: [Parity Validation Guide - API](../parity-validation-guide.md#api-parity)

### Step 3: Component Parity Validation

**Check**: All OUI components replaced with MUK

```typescript
// Extract OUI components from templates
const ouiComponents = extractOUIComponents('{SOURCE_PATH}/**/*.template.html');

// Check React code
const reactCode = readAllFiles('{TARGET_PATH}/src/**/*.tsx');

// Validate no OUI imports remain
assert(!reactCode.includes('@ovhcloud/ods-components'), 'ODS components still used');
assert(!reactCode.includes('oui-'), 'OUI classes still used');

// Validate MUK components used
for (const ouiComp of ouiComponents) {
  const mukEquivalent = getMukEquivalent(ouiComp);
  assert(reactCode.includes(mukEquivalent), `Missing MUK: ${mukEquivalent}`);
}
```

**Output**: Component parity report

```markdown
## Component Parity

✅ All OUI components replaced with MUK
✅ No ODS imports found
✅ All MUK imports correct

| OUI Component | MUK Component | Count | Status |
|---------------|---------------|-------|--------|
| <oui-datagrid> | <Datagrid> | 1 | ✅ Replaced |
| <oui-tile> | <Tile.Root> | 3 | ✅ Replaced |
| ... | ... | ... | ... |
```

**Reference**:
- [Migration Patterns - Component Mapping](../migration-patterns.md#template-component-mapping)
- [Parity Validation Guide - UI](../parity-validation-guide.md#visual-parity)

### Step 4: Translation Parity Validation

**Check**: All translations migrated with exact values

```typescript
// Load AngularJS translations
const angularTranslations = loadJSON('{SOURCE_PATH}/src/translations/Messages_en.json');

// Load React translations
const reactTranslations = loadJSON('{TARGET_PATH}/src/translations/en.json');

// Validate all keys present (values may differ)
const angularKeys = flattenKeys(angularTranslations);
const reactKeys = flattenKeys(reactTranslations);

for (const key of angularKeys) {
  const angularValue = getTranslation(angularTranslations, key);
  const reactValue = findTranslationValue(reactTranslations, angularValue);

  assert(reactValue !== null, `Missing translation: ${key} = "${angularValue}"`);
  assert(reactValue === angularValue, 'Translation value changed (parity violation)');
}
```

**Output**: Translation parity report

```markdown
## Translation Parity

✅ All X keys migrated
✅ All values exactly match (100% parity)
⚠️ Y keys renamed (documented in MIGRATION_NOTES.md)

| Legacy Key | New Key | Value | Status |
|------------|---------|-------|--------|
| nasha_listing_title | nasha.listing.title | "NAS-HA Services" | ✅ Match (key renamed) |
| ... | ... | ... | ... |
```

**Reference**: [Migration Guide - i18n Policy](../README.md#i18n-translations-policy)

### Step 5: Feature Completeness Validation

**Check**: All detected features implemented

```typescript
// Load detected features
const features = parseMarkdown('{TARGET_PATH}/DETECTED_FEATURES.md');

// Verify each feature
const featureChecks = {
  search: hasSearchImplementation(reactCode),
  filter: hasFilterImplementation(reactCode),
  pagination: hasPaginationImplementation(reactCode),
  columnCustomization: hasColumnCustomizationImplementation(reactCode),
  tracking: hasTrackingImplementation(reactCode),
  // ... check all detected features
};

// Report
for (const [feature, implemented] of Object.entries(featureChecks)) {
  assert(implemented, `Feature not implemented: ${feature}`);
}
```

**Output**: Feature completeness report

```markdown
## Feature Completeness

✅ All detected features implemented

- ✅ Search functionality
- ✅ Filter functionality
- ✅ Column customization
- ✅ Pagination
- ✅ Topbar CTA
- ✅ Changelog button
- ✅ Guides menu
- ✅ Tracking integration
- ✅ Error handling
- ✅ Loading states
```

**Reference**: [Parity Validation Guide - Features](../parity-validation-guide.md#functional-parity)

### Step 6: Tracking Parity Validation

**Check**: All tracking events migrated

```typescript
// Extract AngularJS tracking
const angularTracking = extractAtInternetCalls('{SOURCE_PATH}/**/*.{js,html}');

// Extract React tracking
const reactTracking = extractUseOvhTrackingCalls('{TARGET_PATH}/src/**/*.tsx');

// Validate
for (const angularTrack of angularTracking) {
  const reactTrack = findMatchingTracking(angularTrack, reactTracking);
  assert(reactTrack !== null, `Missing tracking: ${angularTrack.action}`);
}
```

**Output**: Tracking parity report

```markdown
## Tracking Parity

✅ All X tracking events migrated

| AngularJS Event | React Event | Status |
|-----------------|-------------|--------|
| nasha::directory::add | listing::add | ✅ Match |
| ... | ... | ... |
```

**Reference**: [Manager React Shell Client - Tracking](@.ai-doc/20-dependencies/manager-react-shell-client.md#tracking)

### Step 7: Code Quality Validation

**Check**: Code follows standards

```bash
# Run linting
npm run lint

# Run type check
npm run type-check

# Run build
npm run build

# Check for TODOs
grep -r "TODO" src/ --exclude-dir=node_modules
```

**Output**: Code quality report

```markdown
## Code Quality

✅ Linting passed (0 errors)
✅ Type checking passed
✅ Build successful
✅ No unresolved TODOs (except documented)

### Documented Limitations
- Feature X: Waiting for MUK v2.0 (ticket #123)
```

**Reference**: [Development Standards](@.ai-doc/30-best-practices/development-standards.md)

### Step 8: Manual Testing Checklist

**Perform manual tests**:

```markdown
## Manual Testing Checklist

### Navigation
- [ ] Root route redirects correctly
- [ ] All routes accessible via URL
- [ ] Browser back/forward works
- [ ] Deep linking works

### Data Loading
- [ ] Listing page loads data
- [ ] Dashboard page loads data
- [ ] Loading states shown
- [ ] Empty states shown correctly

### User Interactions
- [ ] Search works
- [ ] Filter works
- [ ] Pagination works
- [ ] Buttons clickable
- [ ] Forms submittable
- [ ] Modals open/close

### Visual Appearance
- [ ] Layout matches AngularJS
- [ ] Colors match
- [ ] Spacing matches
- [ ] Responsive design works
- [ ] Icons display correctly

### Error Handling
- [ ] 404 routes show error
- [ ] API errors show messages
- [ ] Error boundary works

### Translations
- [ ] All texts display correctly
- [ ] Language switching works (if applicable)
- [ ] No missing translations

### Tracking
- [ ] Page views tracked
- [ ] Button clicks tracked
- [ ] Form submissions tracked
```

**Output**: Manual testing report with screenshots

**Reference**: [Parity Validation Guide - Visual Parity](../parity-validation-guide.md#visual-parity)

### Step 9: Generate Final Validation Report

Create `{TARGET_PATH}/VALIDATION_REPORT.md`:

```markdown
# Migration Validation Report

**Module**: {MODULE_NAME}
**Validation Date**: {DATE}
**Validator**: AI Assistant

## Summary

✅ **PASSED** - 100% parity achieved

## Validation Results

### Route Parity: ✅ PASS
- All X routes migrated
- All URL patterns match
- See [details](#route-parity)

### API Parity: ✅ PASS
- All X API calls migrated
- All API types correct
- See [details](#api-parity)

### Component Parity: ✅ PASS
- All OUI → MUK conversions complete
- No ODS imports remain
- See [details](#component-parity)

### Translation Parity: ✅ PASS
- All X keys migrated
- All values exactly match
- See [details](#translation-parity)

### Feature Completeness: ✅ PASS
- All detected features implemented
- See [details](#feature-completeness)

### Tracking Parity: ✅ PASS
- All X events migrated
- See [details](#tracking-parity)

### Code Quality: ✅ PASS
- Linting passed
- Build successful
- See [details](#code-quality)

### Manual Testing: ✅ PASS
- All checklist items verified
- Screenshots attached
- See [details](#manual-testing)

## Detailed Reports

[Include all detailed reports from steps 1-8]

## Known Limitations

[List any documented limitations from MIGRATION_NOTES.md]

## Recommendations

1. Deploy to staging environment
2. Run E2E tests
3. Perform QA testing
4. Review with team

## Sign-off

- [ ] AI validation complete
- [ ] Ready for human review
- [ ] Ready for QA testing
```

## 📤 Expected Outputs

| Output | Description | Status |
|--------|-------------|--------|
| VALIDATION_REPORT.md | Complete validation report | ✅ Required |
| Route parity verified | All routes match | ✅ Required |
| API parity verified | All API calls match | ✅ Required |
| Component parity verified | All components MUK | ✅ Required |
| Translation parity verified | All values exact | ✅ Required |
| Features complete | All features working | ✅ Required |
| Tracking verified | All events migrated | ✅ Required |
| Code quality verified | Lint + build pass | ✅ Required |
| Manual testing done | All checks passed | ✅ Required |

## ✅ Final Checklist

Before declaring migration complete:

- [ ] All automated validations passed
- [ ] All manual tests passed
- [ ] VALIDATION_REPORT.md created
- [ ] No unresolved issues
- [ ] No performance regressions
- [ ] Documentation complete (MIGRATION_NOTES.md)
- [ ] Code ready for review
- [ ] Ready for QA

## 📚 References

**Primary Docs:**
- [Parity Validation Guide](../parity-validation-guide.md) - Validation framework
- [Development Standards](@.ai-doc/30-best-practices/development-standards.md)

## 🎉 Migration Complete

If all validations pass, the migration is complete!

Next steps:
1. Submit for code review
2. Deploy to staging
3. Run E2E tests
4. Perform QA testing
5. Deploy to production

---

## 📋 Copy-Paste Template

```
Validate React implementation has 100% parity with AngularJS:

INPUT:
- @{TARGET_PATH}/src/ (React code)
- @{SOURCE_PATH} (AngularJS code)
- @{TARGET_PATH}/MIGRATION_NOTES.md
- @{TARGET_PATH}/DETECTED_FEATURES.md

VALIDATE:
1. Route parity (count + URLs)
2. API parity (all endpoints)
3. Component parity (MUK only)
4. Translation parity (exact values)
5. Feature completeness (all implemented)
6. Tracking parity (all events)
7. Code quality (lint + build)
8. Manual testing (checklist)

OUTPUT:
- VALIDATION_REPORT.md with all results
- Pass/fail status for each check
- Screenshots for manual tests

REFERENCE: @.ai-doc/50-migration-angular/parity-validation-guide.md
```
