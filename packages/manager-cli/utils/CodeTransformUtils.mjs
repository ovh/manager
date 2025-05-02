import { access } from 'fs/promises';
import { constants } from 'fs';

/**
 * Check if a code file exists and is readable.
 */
export const isCodeFileExists = async (filePath) => {
  if (!filePath || typeof filePath !== 'string') {
    console.warn('⚠️ Invalid file path provided to isCodeFileExists');
    return false;
  }

  try {
    await access(filePath, constants.R_OK);
    return true;
  } catch {
    return false;
  }
};

/**
 * Ensure a named import is injected into the list of import blocks.
 */
export const injectNamedImport = (importBlocks, { from, name }) => {
  if (!from || !name || !Array.isArray(importBlocks)) {
    console.warn('⚠️ Invalid arguments passed to injectNamedImport');
    return importBlocks || [];
  }

  let hasImport = false;

  const updated = importBlocks.map((block) => {
    if (typeof block !== 'string') return block;

    if (block.includes(`from '${from}'`)) {
      const match = block.match(new RegExp(`import\\s*{([^}]*)}\\s*from\\s*['"]${from}['"]`));
      if (match) {
        const existing = match[1].split(',').map((s) => s.trim());
        if (!existing.includes(name)) {
          existing.push(name);
          hasImport = true;
          return block.replace(match[0], `import { ${existing.join(', ')} } from '${from}'`);
        } else {
          hasImport = true;
        }
      }
    }

    return block;
  });

  if (!hasImport) {
    updated.push(`import { ${name} } from '${from}';`);
  }

  return updated;
};

/**
 * Build a preserved file header from imports + extra lines.
 */
export const extractPreservedBlocks = ({
   imports = [],
   requiredImports = [],
   excludedModules = [],
   extraLines = [],
   headerComment = '',
 }) => {
  const cleanedImports = (imports || []).filter(
    (block) => !excludedModules.some((mod) => block.includes(mod)),
  );

  for (const requiredImport of requiredImports || []) {
    const exists = cleanedImports.some((block) => block.includes(requiredImport));
    if (!exists) {
      cleanedImports.unshift(requiredImport);
    }
  }

  const extraBodyLines = (extraLines || []).filter((line) => typeof line === 'string' && line.trim());

  return [
    headerComment,
    ...cleanedImports,
    '',
    ...extraBodyLines,
  ]
    .filter(Boolean)
    .join('\n');
};

/**
 * Split code into import blocks and the remaining body.
 */
export const splitImportsAndBody = (
  code,
  {
    findImportsEndLine = () => -1,
    excludedImports = [],
    requiredImports = [],
  } = {},
) => {
  if (!code || typeof code !== 'string') {
    console.warn('⚠️ Invalid code input in splitImportsAndBody');
    return { importBlocks: [], body: [] };
  }

  const lines = code.split('\n');
  const cutoff = findImportsEndLine(lines);
  const topLines = cutoff !== -1 ? lines.slice(0, cutoff) : lines;

  const importBlocks = [];
  const body = [];
  let currentImport = null;

  for (const line of topLines) {
    const trimmed = line.trim();

    if (!trimmed.includes('import')) {
      body.push(line);
      continue;
    }

    if (trimmed.startsWith('import') && !currentImport) {
      currentImport = [line];
    } else if (currentImport) {
      currentImport.push(line);

      if (
        trimmed.endsWith(';') ||
        trimmed.endsWith('}') ||
        trimmed.endsWith(')')
      ) {
        importBlocks.push(currentImport.join('\n'));
        currentImport = null;
      }
    } else {
      body.push(line);
    }
  }

  if (currentImport) {
    importBlocks.push(currentImport.join('\n'));
  }

  const filteredImports = importBlocks.filter(
    (block) => !excludedImports.some((mod) => block.includes(mod)),
  );

  for (const required of requiredImports) {
    const isMissing = !filteredImports.some((block) => block.includes(required));
    if (isMissing) filteredImports.unshift(required);
  }

  return {
    importBlocks: filteredImports,
    body,
  };
};
