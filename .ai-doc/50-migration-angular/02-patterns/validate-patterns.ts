/**
 * Pattern Validation Script
 *
 * This script validates that all regex patterns in the YAML files
 * correctly match their test cases.
 *
 * Usage:
 *   npx ts-node .ai-doc/50-migration-angular/02-patterns/validate-patterns.ts
 *
 * Or with Node.js (after installing dependencies):
 *   npm install js-yaml
 *   node --loader ts-node/esm validate-patterns.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Types
interface TestCase {
  input: string;
  expected: Record<string, string> | { match: boolean };
  expected_match?: boolean;
}

interface Pattern {
  regex: string;
  flags?: string;
  groups?: Array<{
    index: number;
    name: string;
    description: string;
  }>;
  test_cases: TestCase[];
}

interface PatternFile {
  patterns: Record<string, Pattern>;
}

interface ValidationResult {
  file: string;
  pattern: string;
  testCase: number;
  passed: boolean;
  input: string;
  expected: unknown;
  actual: unknown;
  error?: string;
}

// YAML-like parser for embedded YAML in markdown
function extractYamlPatterns(content: string): Record<string, Pattern> {
  const patterns: Record<string, Pattern> = {};
  const yamlBlockRegex = /```yaml\n([\s\S]*?)```/g;

  let match;
  while ((match = yamlBlockRegex.exec(content)) !== null) {
    const yamlContent = match[1];

    // Extract pattern name (first line before colon)
    const nameMatch = yamlContent.match(/^(\w+):/m);
    if (!nameMatch) continue;

    const patternName = nameMatch[1];

    // Extract regex
    const regexMatch = yamlContent.match(/regex:\s*['"](.+?)['"]/);
    if (!regexMatch) continue;

    // Extract flags
    const flagsMatch = yamlContent.match(/flags:\s*['"]?([\w]*)?['"]?/);

    // Extract test cases
    const testCases: TestCase[] = [];
    const testCaseRegex = /- input:\s*['"](.+?)['"]\s*\n\s*expected:\s*\n([\s\S]*?)(?=\s*- input:|$)/g;

    let tcMatch;
    while ((tcMatch = testCaseRegex.exec(yamlContent)) !== null) {
      const input = tcMatch[1];
      const expectedBlock = tcMatch[2];

      const expected: Record<string, string> = {};
      const expectedLines = expectedBlock.match(/(\w+):\s*['"](.+?)['"]/g);
      if (expectedLines) {
        expectedLines.forEach((line) => {
          const [, key, value] = line.match(/(\w+):\s*['"](.+?)['"]/) || [];
          if (key && value) {
            expected[key] = value;
          }
        });
      }

      testCases.push({ input, expected });
    }

    if (testCases.length > 0) {
      patterns[patternName] = {
        regex: regexMatch[1],
        flags: flagsMatch?.[1] || '',
        test_cases: testCases,
      };
    }
  }

  return patterns;
}

// Validate a single pattern against its test cases
function validatePattern(
  patternName: string,
  pattern: Pattern,
  fileName: string,
): ValidationResult[] {
  const results: ValidationResult[] = [];

  pattern.test_cases.forEach((testCase, index) => {
    try {
      const regex = new RegExp(pattern.regex, pattern.flags || '');
      const match = regex.exec(testCase.input);

      if ('match' in testCase.expected || 'expected_match' in testCase) {
        // Boolean match test
        const expectedMatch =
          testCase.expected_match ?? (testCase.expected as any).match;
        const actualMatch = match !== null;

        results.push({
          file: fileName,
          pattern: patternName,
          testCase: index + 1,
          passed: expectedMatch === actualMatch,
          input: testCase.input,
          expected: expectedMatch,
          actual: actualMatch,
        });
      } else if (match) {
        // Group extraction test
        const expected = testCase.expected as Record<string, string>;
        let allGroupsPassed = true;

        for (const [key, expectedValue] of Object.entries(expected)) {
          // Find group index by name
          const groupDef = pattern.groups?.find((g) => g.name === key);
          const groupIndex = groupDef?.index || 0;
          const actualValue = match[groupIndex]?.trim();

          if (actualValue !== expectedValue.trim()) {
            allGroupsPassed = false;
            results.push({
              file: fileName,
              pattern: patternName,
              testCase: index + 1,
              passed: false,
              input: testCase.input,
              expected: { [key]: expectedValue },
              actual: { [key]: actualValue },
              error: `Group "${key}" mismatch`,
            });
          }
        }

        if (allGroupsPassed) {
          results.push({
            file: fileName,
            pattern: patternName,
            testCase: index + 1,
            passed: true,
            input: testCase.input,
            expected: testCase.expected,
            actual: 'All groups matched',
          });
        }
      } else {
        // Expected match but got none
        results.push({
          file: fileName,
          pattern: patternName,
          testCase: index + 1,
          passed: false,
          input: testCase.input,
          expected: testCase.expected,
          actual: 'No match',
          error: 'Regex did not match input',
        });
      }
    } catch (error) {
      results.push({
        file: fileName,
        pattern: patternName,
        testCase: index + 1,
        passed: false,
        input: testCase.input,
        expected: testCase.expected,
        actual: null,
        error: `Regex error: ${(error as Error).message}`,
      });
    }
  });

  return results;
}

// Main validation function
function validateAllPatterns(): void {
  const patternsDir = path.dirname(new URL(import.meta.url).pathname);
  const patternFiles = ['angularjs-patterns.yaml', 'ui-patterns.yaml'];

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const allResults: ValidationResult[] = [];

  console.log('\n🔍 Pattern Validation Report\n');
  console.log('='.repeat(60));

  for (const fileName of patternFiles) {
    const filePath = path.join(patternsDir, fileName);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${fileName}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const patterns = extractYamlPatterns(content);

    console.log(`\n📄 ${fileName}`);
    console.log('-'.repeat(40));

    for (const [patternName, pattern] of Object.entries(patterns)) {
      const results = validatePattern(patternName, pattern, fileName);
      allResults.push(...results);

      const passed = results.filter((r) => r.passed).length;
      const failed = results.filter((r) => !r.passed).length;

      totalTests += results.length;
      passedTests += passed;
      failedTests += failed;

      const status = failed === 0 ? '✅' : '❌';
      console.log(
        `  ${status} ${patternName}: ${passed}/${results.length} tests passed`,
      );

      // Show failures
      results
        .filter((r) => !r.passed)
        .forEach((r) => {
          console.log(`     ❌ Test ${r.testCase}: ${r.error || 'Mismatch'}`);
          console.log(`        Input: "${r.input}"`);
          console.log(`        Expected: ${JSON.stringify(r.expected)}`);
          console.log(`        Actual: ${JSON.stringify(r.actual)}`);
        });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary\n');
  console.log(`   Total tests: ${totalTests}`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(
    `   Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`,
  );

  if (failedTests > 0) {
    console.log('\n⚠️  Some tests failed. Please review the patterns.\n');
    process.exit(1);
  } else {
    console.log('\n✅ All patterns validated successfully!\n');
    process.exit(0);
  }
}

// Export for testing
export { validatePattern, extractYamlPatterns };

// Run if executed directly
validateAllPatterns();
