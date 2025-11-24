---
title: Validation Automation
last_update: 2025-01-27
tags: [validation, automation, parity, quality]
ai: true
---

# Validation Automation

## 🧭 Purpose

Automated validation framework to ensure 100% parity between AngularJS and React implementations. Provides executable checks with clear pass/fail criteria.

## 📋 Available Validation Files

| File | Purpose | Checks Count |
|------|---------|--------------|
| [parity-checklist.yaml](./parity-checklist.yaml) | Complete parity validation | 40+ checks |

---

## 🎯 Validation Categories

The checklist covers 7 main categories:

| Category | Description | Checks | Criticality |
|----------|-------------|--------|--------------|
| **Route Parity** | All routes migrated correctly | 4 | ⚠️ Critical |
| **API Parity** | All API calls migrated correctly | 6 | ⚠️ Critical |
| **Component Parity** | UI components migrated to MUK | 6 | ⚠️ Critical |
| **Translation Parity** | Translations with exact values | 4 | ⚠️ Critical |
| **Feature Parity** | All features implemented | 7 | ⚠️ High |
| **Tracking Parity** | Tracking events migrated | 3 | ⚠️ High |
| **Performance Parity** | No performance regressions | 3 | ⚠️ Medium |
| **Code Quality** | Code quality standards | 5 | ⚠️ Critical |

---

## 🤖 Using the Checklist

### For AI Assistants

**Load checklist**:
```typescript
import yaml from 'yaml';
const checklist = yaml.parse(
  fs.readFileSync('parity-checklist.yaml', 'utf8')
);
```

**Run validation**:
```typescript
const results = {
  passed: [],
  failed: [],
  manual: []
};

for (const category of Object.keys(checklist)) {
  if (category.endsWith('_parity')) {
    for (const check of checklist[category].checks) {
      if (check.automated) {
        const result = executeCheck(check);
        if (result.passed) {
          results.passed.push({ category, check });
        } else {
          results.failed.push({
            category,
            check,
            error: check.error_message,
            fix: check.fix_suggestion
          });
        }
      } else {
        results.manual.push({ category, check });
      }
    }
  }
}
```

**Generate report**:
```typescript
generateValidationReport(results);
```

### For Humans

1. **Read** [parity-checklist.yaml](./parity-checklist.yaml)
2. **Run automated checks** using validation script
3. **Review** failed checks with error messages
4. **Apply fixes** using fix suggestions
5. **Perform manual checks** for non-automated items
6. **Re-run** validation until all pass

---

## 📊 Check Types

### Automated Checks

Executable programmatically:

| Check Type | Description | Example |
|------------|-------------|---------|
| `comparison` | Compare counts/values | Route count: Angular vs React |
| `pattern_match` | Regex pattern matching | URL patterns match |
| `exists` | Check if pattern exists | useOvhTracking imported |
| `not_exists` | Check pattern doesn't exist | No console.log in code |
| `value_match` | Exact value comparison | Translation values match |
| `structure_match` | Structure comparison | Tile structure matches |
| `exit_code` | Command exit code | npm run lint exits 0 |

### Manual Checks

Require human verification:

| Check Type | Description | Example |
|------------|-------------|---------|
| `manual` | Manual verification needed | Visual parity check |
| `screenshot_diff` | Visual comparison | UI looks identical |
| `load_time` | Performance measurement | Load time < 3 seconds |

---

## 🚦 Severity Levels

| Severity | Meaning | Action |
|----------|---------|--------|
| ⚠️ **Critical** | Blocks migration | Must fix before merge |
| ⚠️ **High** | Major issue | Should fix before merge |
| ⚠️ **Medium** | Minor issue | Should fix eventually |
| ℹ️ **Low** | Nice-to-have | Can defer |

---

## 📋 Example Validation Flow

### Step 1: Route Parity

```typescript
// Check: route_count
const angularStates = extractStates(angularjsSource);
const reactRoutes = extractRoutes(reactSource);

if (angularStates.length !== reactRoutes.length) {
  fail({
    check: 'route_count',
    error: `Route count mismatch: AngularJS ${angularStates.length}, React ${reactRoutes.length}`,
    fix: 'Review Routes.tsx and ensure all AngularJS states are mapped'
  });
}
```

### Step 2: API Parity

```typescript
// Check: aapi_migration
const aapiCalls = findPattern(angularjsSource, patterns.api.aapi_call);

for (const call of aapiCalls) {
  const hookExists = reactSource.includes(`use${call.resource}Detail`);
  const usesAapi = reactSource.includes("import { aapi } from '@ovh-ux/manager-core-api'");

  if (!hookExists || !usesAapi) {
    fail({
      check: 'aapi_migration',
      error: `AAPI call '${call.endpoint}' not migrated to aapi client`,
      fix: "Use: import { aapi } from '@ovh-ux/manager-core-api'; aapi.get(endpoint)"
    });
  }
}
```

### Step 3: Component Parity

```typescript
// Check: oui_components_replaced
const ouiComponents = findPattern(reactSource, /<oui-/gi);

if (ouiComponents.length > 0) {
  fail({
    check: 'oui_components_replaced',
    error: `Found ${ouiComponents.length} OUI components in React code`,
    fix: 'Replace with MUK equivalents (see ui-patterns.yaml)'
  });
}
```

### Step 4: Generate Report

```typescript
const report = `
# Validation Report

**Date**: ${new Date().toISOString()}
**Status**: ${results.failed.length === 0 ? '✅ PASSED' : '❌ FAILED'}

## Summary

- ✅ Passed: ${results.passed.length} checks
- ❌ Failed: ${results.failed.length} checks
- ⚠️ Manual: ${results.manual.length} checks

## Failed Checks

${results.failed.map(f => `
### ${f.check.name}

**Error**: ${f.error}
**Fix**: ${f.fix}
`).join('\n')}

## Manual Checks Required

${results.manual.map(m => `- ${m.check.name}`).join('\n')}
`;

fs.writeFileSync('VALIDATION_REPORT.md', report);
```

---

## 🔧 Implementing Validation Script

### Basic Validator (TypeScript)

```typescript
import yaml from 'yaml';
import fs from 'fs';

interface ValidationCheck {
  id: string;
  name: string;
  automated: boolean;
  severity: string;
  check: any;
  error_message: string;
  fix_suggestion: string;
}

interface ValidationResult {
  check: ValidationCheck;
  passed: boolean;
  error?: string;
}

class MigrationValidator {
  private checklist: any;
  private angularjsPath: string;
  private reactPath: string;

  constructor(angularjsPath: string, reactPath: string) {
    this.angularjsPath = angularjsPath;
    this.reactPath = reactPath;
    this.checklist = yaml.parse(
      fs.readFileSync('.ai-doc/50-migration-angular/05-validation/parity-checklist.yaml', 'utf8')
    );
  }

  async validate(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const [category, config] of Object.entries(this.checklist)) {
      if (!category.endsWith('_parity')) continue;

      for (const check of (config as any).checks) {
        if (check.automated) {
          const result = await this.executeCheck(check);
          results.push(result);
        }
      }
    }

    return results;
  }

  private async executeCheck(check: ValidationCheck): Promise<ValidationResult> {
    switch (check.check.type) {
      case 'comparison':
        return this.checkComparison(check);
      case 'pattern_match':
        return this.checkPatternMatch(check);
      case 'exists':
        return this.checkExists(check);
      case 'not_exists':
        return this.checkNotExists(check);
      default:
        return { check, passed: false, error: 'Unknown check type' };
    }
  }

  private checkComparison(check: ValidationCheck): ValidationResult {
    // Implement comparison logic
    const sourceValue = this.evaluateExpression(check.check.source);
    const targetValue = this.evaluateExpression(check.check.target);
    const passed = this.compare(sourceValue, targetValue, check.check.operator);

    return {
      check,
      passed,
      error: passed ? undefined : check.error_message
        .replace('{source}', sourceValue)
        .replace('{target}', targetValue)
    };
  }

  private checkPatternMatch(check: ValidationCheck): ValidationResult {
    // Implement pattern matching logic
    const pattern = new RegExp(check.check.pattern, 'g');
    const reactCode = fs.readFileSync(this.reactPath, 'utf8');
    const matches = reactCode.match(pattern);
    const passed = matches && matches.length > 0;

    return {
      check,
      passed,
      error: passed ? undefined : check.error_message
    };
  }

  // ... more check implementations
}

// Usage
const validator = new MigrationValidator(
  'packages/manager/modules/nasha',
  'packages/manager/apps/bmc-nasha'
);

const results = await validator.validate();
console.log(`Passed: ${results.filter(r => r.passed).length}`);
console.log(`Failed: ${results.filter(r => !r.passed).length}`);
```

---

## 📊 Validation Report Template

The validation generates a markdown report:

```markdown
# Migration Validation Report

**Module**: nasha
**Date**: 2025-01-27
**Status**: ❌ FAILED (35/40 checks passed)

## Summary

- ✅ Passed: 35 checks (87.5%)
- ❌ Failed: 5 checks (12.5%)
- ⚠️ Manual: 8 checks

## Critical Issues (Must Fix)

### ❌ route_redirects
**Category**: Route Parity
**Error**: Redirect not implemented for 'nasha.dashboard.edit' → 'nasha.dashboard'
**Fix**: Add useNavigate() + useEffect() or <Navigate> component

### ❌ aapi_migration
**Category**: API Parity
**Error**: AAPI call '/dedicated/nasha/{serviceName}' not migrated to aapi client
**Fix**: Use: import { aapi } from '@ovh-ux/manager-core-api'; aapi.get(endpoint)

## High Priority Issues (Should Fix)

### ❌ search_feature
**Category**: Feature Parity
**Error**: Search feature not implemented
**Fix**: Add search prop to Datagrid with useState

## Manual Checks Required

- ⚠️ Visual parity verification
- ⚠️ Load time < 3 seconds
- ⚠️ API call waterfall check

## Next Steps

1. Fix 5 failed checks (see above)
2. Perform 8 manual checks
3. Re-run validation
```

---

## ✅ Success Criteria

Migration is complete when:

- ✅ All critical checks pass (100%)
- ✅ All high priority checks pass (100%)
- ✅ Medium priority checks pass (>80%)
- ✅ All manual checks verified
- ✅ VALIDATION_REPORT.md shows PASSED status

---

## 📚 References

**Related Documentation**:
- [Parity Validation Guide](../parity-validation-guide.md) - Detailed validation methodology
- [Pattern Library](../02-patterns/) - Patterns for detection
- [Prompts](../06-prompts/03-validate-migration.prompt.md) - Validation prompt

**Tools**:
- [Decision Tree](../01-workflows/decision-tree.json) - Workflow navigation
- [AngularJS Patterns](../02-patterns/angularjs-patterns.yaml) - Detection patterns
- [UI Patterns](../02-patterns/ui-patterns.yaml) - Component patterns

---

## ⚖️ The Validation's Moral

- **Automated checks** catch errors early
- **Clear criteria** remove ambiguity
- **Fix suggestions** speed up resolution
- **Reports** provide audit trail

**👉 Good validation ensures 100% parity and zero regressions.**
