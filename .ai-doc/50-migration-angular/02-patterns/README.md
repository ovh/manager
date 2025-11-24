---
title: Pattern Library
last_update: 2025-01-27
tags: [patterns, regex, detection, automation]
ai: true
---

# Pattern Library

## 🧭 Purpose

Machine-readable patterns for detecting AngularJS code and mapping to React equivalents. All patterns use regex with test cases for validation.

## 📋 Available Pattern Files

| File | Purpose | Patterns Count |
|------|---------|----------------|
| [angularjs-patterns.yaml](./angularjs-patterns.yaml) | AngularJS code detection | 20+ patterns |
| [ui-patterns.yaml](./ui-patterns.yaml) | OUI → MUK component mapping | 25+ patterns |

---

## 🎯 Pattern Categories

### AngularJS Patterns

**File**: [angularjs-patterns.yaml](./angularjs-patterns.yaml)

Detects AngularJS constructs:
- **Routing**: State definitions, URLs, components, redirects
- **Resolves**: Resolve functions, dependencies, promises
- **API Calls**: AAPI, Iceberg, v6, cache management
- **Controllers**: Controller definitions, $scope variables/functions
- **Services**: Service definitions, methods
- **Utilities**: Prepare functions, translate calls

**Usage**:
```typescript
const patterns = loadYAML('angularjs-patterns.yaml');
const statePattern = patterns.routing.state_definition;
const matches = sourceCode.matchAll(new RegExp(statePattern.regex));
```

### UI Component Patterns

**File**: [ui-patterns.yaml](./ui-patterns.yaml)

Maps OUI components to MUK:
- **Layout**: managerListLayout, headers
- **Data Display**: Datagrid, tiles, tables
- **Controls**: Buttons, action menus
- **Forms**: Inputs, selects, checkboxes
- **Feedback**: Messages, spinners, modals
- **Navigation**: Tabs, guide menus
- **Features**: Search, filter, pagination detection

**Usage**:
```typescript
const uiPatterns = loadYAML('ui-patterns.yaml');
const datagridPattern = uiPatterns.datagrid.oui_datagrid;
if (template.match(datagridPattern.regex)) {
  console.log(`Maps to: ${datagridPattern.maps_to.muk}`);
}
```

---

## 🔧 Pattern Format

Each pattern follows this structure:

```yaml
pattern_name:
  regex: 'regular expression'
  flags: 'g|m|i'
  groups:
    - index: 1
      name: capture_name
      description: What this captures
  maps_to:
    react: 'React equivalent'
    reference: 'Link to docs'
  test_cases:
    - input: 'Example input'
      expected:
        capture_name: 'Expected value'
```

### Fields Explained

| Field | Description | Required |
|-------|-------------|----------|
| `regex` | Regular expression pattern | ✅ Yes |
| `flags` | Regex flags (g=global, m=multiline, i=case-insensitive) | No |
| `groups` | Named capture groups with descriptions | No |
| `maps_to` | What this pattern converts to in React | ✅ Yes |
| `test_cases` | Example inputs with expected outputs | ✅ Yes |

---

## 🤖 AI Usage Guidelines

### Step 1: Load Patterns

```typescript
import yaml from 'yaml';
import fs from 'fs';

const angularPatterns = yaml.parse(
  fs.readFileSync('.ai-doc/50-migration-angular/02-patterns/angularjs-patterns.yaml', 'utf8')
);

const uiPatterns = yaml.parse(
  fs.readFileSync('.ai-doc/50-migration-angular/02-patterns/ui-patterns.yaml', 'utf8')
);
```

### Step 2: Apply Patterns

```typescript
// Detect AngularJS states
const statePattern = angularPatterns.routing.state_definition;
const regex = new RegExp(statePattern.regex, statePattern.flags);
const matches = [...sourceCode.matchAll(regex)];

for (const match of matches) {
  const stateName = match[1]; // First capture group
  const stateConfig = match[2]; // Second capture group

  console.log(`Found state: ${stateName}`);
  console.log(`Maps to: ${statePattern.maps_to.react}`);
  console.log(`Reference: ${statePattern.maps_to.reference}`);
}
```

### Step 3: Validate Patterns

```typescript
// Test pattern against test cases
function validatePattern(pattern) {
  for (const testCase of pattern.test_cases) {
    const regex = new RegExp(pattern.regex, pattern.flags || '');
    const match = regex.exec(testCase.input);

    if (!match) {
      console.error(`Pattern failed to match: ${testCase.input}`);
      return false;
    }

    // Verify captured groups
    for (const group of pattern.groups || []) {
      const expectedValue = testCase.expected[group.name];
      const actualValue = match[group.index];

      if (actualValue?.trim() !== expectedValue?.trim()) {
        console.error(`Group '${group.name}' mismatch:`);
        console.error(`  Expected: ${expectedValue}`);
        console.error(`  Actual: ${actualValue}`);
        return false;
      }
    }
  }

  return true;
}

// Validate all patterns
for (const [category, patterns] of Object.entries(angularPatterns)) {
  for (const [name, pattern] of Object.entries(patterns)) {
    if (validatePattern(pattern)) {
      console.log(`✅ ${category}.${name}`);
    } else {
      console.log(`❌ ${category}.${name}`);
    }
  }
}
```

### Step 4: Generate Mappings

```typescript
// Generate mapping report
function generateMappingReport(sourceCode, patterns) {
  const report = {
    routes: [],
    apiCalls: [],
    components: []
  };

  // Detect routes
  const statePattern = patterns.routing.state_definition;
  const states = [...sourceCode.matchAll(new RegExp(statePattern.regex, 'g'))];

  for (const match of states) {
    report.routes.push({
      angularjs: match[1],
      react: statePattern.maps_to.react,
      reference: statePattern.maps_to.reference
    });
  }

  // Detect API calls
  const aapiPattern = patterns.api.aapi_call;
  const apiCalls = [...sourceCode.matchAll(new RegExp(aapiPattern.regex, 'g'))];

  for (const match of apiCalls) {
    report.apiCalls.push({
      resource: match[1],
      angularjs: `OvhApi${match[1]}.Aapi()`,
      react: aapiPattern.maps_to.react,
      reference: aapiPattern.maps_to.reference
    });
  }

  return report;
}
```

---

## 📊 Pattern Coverage

### AngularJS Patterns

| Category | Patterns | Status |
|----------|----------|--------|
| Routing | 5 | ✅ Complete |
| Resolves | 2 | ✅ Complete |
| API Calls | 6 | ✅ Complete |
| Controllers | 3 | ✅ Complete |
| Services | 2 | ✅ Complete |
| Utilities | 2 | ✅ Complete |
| **Total** | **20** | **✅** |

### UI Component Patterns

| Category | Patterns | Status |
|----------|----------|--------|
| Layout | 2 | ✅ Complete |
| Datagrid | 2 | ✅ Complete |
| Buttons | 2 | ✅ Complete |
| Tiles | 3 | ✅ Complete |
| Modals | 1 | ✅ Complete |
| Forms | 4 | ✅ Complete |
| Messages | 1 | ✅ Complete |
| Loaders | 1 | ✅ Complete |
| Tabs | 1 | ✅ Complete |
| Menus | 2 | ✅ Complete |
| Features | 4 | ✅ Complete |
| **Total** | **23** | **✅** |

---

## 🔍 Pattern Examples

### Example 1: Detect AngularJS State

**Input**:
```javascript
$stateProvider.state('nasha.dashboard', {
  url: '/:serviceName',
  component: 'nashaComponent'
});
```

**Pattern**: `angularjs-patterns.yaml → routing.state_definition`

**Output**:
```typescript
{
  state_name: 'nasha.dashboard',
  state_config: " url: '/:serviceName', component: 'nashaComponent' ",
  maps_to: {
    react: '<Route path="..." Component={...} />',
    reference: '@.ai-doc/50-migration-angular/angularjs-react-mapping-guide.md#routing-mappings'
  }
}
```

### Example 2: Detect AAPI Call

**Input**:
```javascript
OvhApiDedicatedNasha.Aapi().get({ serviceName }).$promise
```

**Pattern**: `angularjs-patterns.yaml → api.aapi_call`

**Output**:
```typescript
{
  resource_name: 'DedicatedNasha',
  maps_to: {
    react: 'aapi from @ovh-ux/manager-core-api',
    reference: '@.ai-doc/20-dependencies/manager-core-api.md#aapi'
  }
}
```

### Example 3: Detect OUI Datagrid

**Input**:
```html
<oui-datagrid rows="$ctrl.services" columns="$ctrl.columns">
</oui-datagrid>
```

**Pattern**: `ui-patterns.yaml → datagrid.oui_datagrid`

**Output**:
```typescript
{
  component: 'oui-datagrid',
  maps_to: {
    muk: '<Datagrid> from @ovh-ux/muk',
    reference: '@.ai-doc/20-dependencies/muk.md#datagrid'
  }
}
```

---

## ✅ Validation

All patterns include test cases. Validate before use:

```bash
# Pseudocode for validation script
for pattern in patterns:
  for test_case in pattern.test_cases:
    result = apply_pattern(pattern, test_case.input)
    assert result == test_case.expected
```

---

## 📚 References

**Documentation**:
- [AngularJS React Mapping Guide](../angularjs-react-mapping-guide.md)
- [Migration Patterns](../migration-patterns.md)
- [Parity Validation Guide](../parity-validation-guide.md)

**Prompts**:
- [Analyze & Structure Prompt](../06-prompts/01-analyze-and-structure.prompt.md) - Uses these patterns
- [Implement Features Prompt](../06-prompts/02-implement-features.prompt.md) - Uses mappings

**Dependencies**:
- [Manager Core API](@.ai-doc/20-dependencies/manager-core-api.md)
- [MUK Components](@.ai-doc/20-dependencies/muk.md)
- [React Router](@.ai-doc/20-dependencies/react-router-dom.md)

---

## ⚖️ The Pattern Library's Moral

- **Machine-readable** patterns enable automation
- **Test cases** ensure reliability
- **Explicit mappings** reduce ambiguity
- **Comprehensive coverage** ensures completeness

**👉 Good patterns make migration predictable and verifiable.**
