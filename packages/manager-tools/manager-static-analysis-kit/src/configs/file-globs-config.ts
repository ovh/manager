/**
 * Common file glob patterns used in ESLint Flat Config.
 */

export const allModules = '**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx,mjsx,mtsx}';

export const jsFiles = '**/*.{js,mjs,cjs}';
export const tsFiles = '**/*.{ts,tsx}';
export const jsxTsxFiles = '**/*.{jsx,tsx}';
export const jsTsFiles = '**/*.{js,jsx,ts,tsx}';
export const jsFilesLoose = '**/*.{js,jsx}';

export const cssFiles = '**/*.{scss,css}';
export const htmlFiles = '**/*.html';

export const storyFiles = '**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)';
export const testFiles = ['**/*.{test,spec}.{ts,tsx,js,jsx}', '**/__tests__/**/*.{ts,tsx,js,jsx}'];

export const commonTextFiles = '**/*.{ts,tsx,mts,js,jsx,mjs,json,yml,yaml,md}';
export const jsonFiles = '**/*.json';
export const yamlFiles = '**/*.{yml,yaml}';
export const markdownFiles = '**/*.md';
