import fs from 'node:fs';
import path from 'node:path';

import { logger } from '@ovh-ux/manager-cli-core/logger';

import { TemplateObject, TemplateSelectorConfig, TemplateValue } from '@/types/TemplateType.js';

/**
 * Ensure a directory exists, creating it recursively if missing.
 */
export function ensureDirectory(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Recursively copy all files from a source directory into a destination.
 */
export function copyTemplate(srcDir: string, destDir: string): void {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      ensureDirectory(destPath);
      copyTemplate(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Safely stringify any supported template value.
 */
function stringifyValue(value: TemplateValue): string {
  if (value === null) return '';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
}

/**
 * Deeply walk through an object and replace all `{{placeholders}}` in string values.
 */
function deepReplacePlaceholders(
  obj: TemplateValue,
  data: Record<string, TemplateValue>,
): TemplateValue {
  if (typeof obj === 'string') {
    let result = obj;
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      const isArrayLike = Array.isArray(value);

      // Inject raw array literal if placeholder sits inside JSON array context
      if (isArrayLike && result.trim() === placeholder) {
        return value;
      }

      result = result.replaceAll(placeholder, stringifyValue(value));
    }
    return result;
  }

  if (Array.isArray(obj)) {
    // Recursively resolve each array entry
    return obj.flatMap((item) => {
      const resolved = deepReplacePlaceholders(item, data);
      // If replacement yields an array, flatten it in-place
      return Array.isArray(resolved) ? resolved : [resolved];
    });
  }

  if (obj && typeof obj === 'object') {
    const out: TemplateObject = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = deepReplacePlaceholders(v, data);
    }
    return out;
  }

  return obj;
}

/**
 * Safely replace placeholders in file content (supports JSON + text files).
 */
export function replaceTemplateStrings(
  content: string,
  data: Record<string, TemplateValue>,
  filePath?: string,
): string {
  const isJson = filePath?.endsWith('.json');

  if (isJson) {
    try {
      const parsed = JSON.parse(content) as TemplateObject;
      const replaced = deepReplacePlaceholders(parsed, data);
      return JSON.stringify(replaced, null, 2);
    } catch {
      // fallback for non-valid JSON templates
      return Object.entries(data).reduce((acc, [key, value]) => {
        const placeholder = `{{${key}}}`;
        return acc.replaceAll(placeholder, stringifyValue(value));
      }, content);
    }
  }

  // for non-JSON files
  return Object.entries(data).reduce((acc, [key, value]) => {
    const placeholder = `{{${key}}}`;
    return acc.replaceAll(placeholder, stringifyValue(value));
  }, content);
}

/**
 * Validates JSON before writing (if applicable).
 */
export function safeWriteFile(filePath: string, content: string): void {
  if (filePath.endsWith('.json')) {
    try {
      JSON.parse(content);
    } catch (err) {
      logger.error(`❌ Invalid JSON generated for ${filePath}:`, err);
      throw err;
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * Applies template replacements to one or more target files.
 */
export function applyTemplateReplacements(
  targetFiles: string[],
  data: Record<string, TemplateValue>,
): void {
  for (const filePath of targetFiles) {
    if (!fs.existsSync(filePath)) continue;
    const original = fs.readFileSync(filePath, 'utf8');
    const replaced = replaceTemplateStrings(original, data, filePath);
    safeWriteFile(filePath, replaced);
  }
}

/**
 * Generic template selector:
 * - Validates all variants exist
 * - Renames the selected template
 * - Removes unused template files
 */
export function selectTemplateFile<Variant extends string>(
  config: TemplateSelectorConfig<Variant>,
): void {
  const {
    targetDir,
    templatePattern,
    variants,
    selected: selectedVariant,
    finalName: outputFilename,
  } = config;

  const buildTemplatePath = (variant: Variant) =>
    path.join(targetDir, templatePattern.replace('{variant}', variant));

  // Ensure all expected template files exist
  for (const variant of variants) {
    const templatePath = buildTemplatePath(variant);
    if (!fs.existsSync(templatePath)) {
      logger.error(`❌ Missing template file: ${templatePath}`);
      process.exit(1);
    }
  }

  const selectedTemplatePath = buildTemplatePath(selectedVariant);
  const outputFilePath = path.join(targetDir, outputFilename);

  // Rename the selected variant template into the final output file
  fs.renameSync(selectedTemplatePath, outputFilePath);

  // Remove all non-selected template files
  for (const variant of variants) {
    if (variant === selectedVariant) continue;
    fs.rmSync(buildTemplatePath(variant));
  }

  logger.success(`✔ Created ${outputFilename} using "${selectedVariant}" template.`);
}
