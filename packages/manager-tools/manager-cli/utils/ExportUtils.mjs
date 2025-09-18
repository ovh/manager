import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const reportOutputBasePath = resolve(__dirname, '../../../../migration-status-reports');

/**
 * Build a migration report filename for a given report name and format.
 *
 * @param {string} name - Report name prefix (e.g. "routes", "tests", "w3c").
 * @param {'json'|'html'|string|null} format - Output format ("json", "html", or undefined for console).
 * @returns {string|null} - Full path to the report file, or null if console output is used.
 */
export const buildReportFileName = (name, format) => {
  if (format === 'json') return `${reportOutputBasePath}/${name}-migration-report.json`;
  if (format === 'html') return `${reportOutputBasePath}/${name}-migration-report.html`;
  return null; // console output only
};

/**
 * Build the filename for the Routes migration report.
 *
 * @param {'json'|'html'|string|null} format - Output format ("json", "html", or console).
 * @returns {string|null} - Full path to the Routes report file, or null if console mode.
 */
export const buildRoutesReportFileName = (format) => buildReportFileName('routes', format);

/**
 * Build the filename for the SWC migration report.
 *
 * @param {'json'|'html'|string|null} format - Output format ("json", "html", or console).
 * @returns {string|null} - Full path to the SWC report file, or null if console mode.
 */
export const buildSwcReportFileName = (format) => buildReportFileName('swc', format);

/**
 * Build the filename for the Tests migration report.
 *
 * @param {'json'|'html'|string|null} format - Output format ("json", "html", or console).
 * @returns {string|null} - Full path to the Tests report file, or null if console mode.
 */
export const buildTestsReportFileName = (format) => buildReportFileName('tests', format);

/**
 * Build the filename for the Static Kit migration report (ESLint + TS).
 *
 * @param {'json'|'html'|string|null} format - Output format ("json", "html", or console).
 * @returns {string|null} - Full path to the Static Kit report file, or null if console mode.
 */
export const buildStaticKitReportFileName = (format) => buildReportFileName('static-kit', format);

/**
 * Build the filename for the merged full migration report (all categories).
 *
 * @param {'json'|'html'|string|null} format - Output format ("json", "html", or console).
 * @returns {string|null} - Full path to the merged report file, or null if console mode.
 */
export const buildMergedReportFileName = (format) =>
  buildReportFileName('migration-status-full', format);

/**
 * Build the filename for the W3C HTML validation migration report.
 *
 * @param {'json'|'html'|string|null} format - Output format ("json", "html", or console).
 * @returns {string|null} - Full path to the W3C report file, or null if console mode.
 */
export const buildW3CReportFileName = (format) => buildReportFileName('w3c', format);

/**
 * Build the filename for the Accessibility (a11y) migration report.
 *
 * @param {'json'|'html'|string|null} format - Output format ("json", "html", or console).
 * @returns {string|null} - Full path to the a11y report file, or null if console mode.
 */
export const buildA11yReportFileName = (format) => buildReportFileName('a11y', format);

/**
 * Ensure a directory exists, creating it recursively if needed.
 *
 * @param {string} filePath - Path to the file for which the directory must exist.
 */
const ensureDirectory = (filePath) => {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

/**
 * Convert a JSON report into an HTML table.
 *
 * @param {string} title - Title of the report.
 * @param {object[]} data - Report rows.
 * @returns {string} - HTML string.
 */
const renderHtml = (title, data) => {
  const headers = Object.keys(data[0] || {});
  const rows = data
    .map((row) => `<tr>${headers.map((h) => `<td>${row[h]}</td>`).join('')}</tr>`)
    .join('\n');
  const thead = headers.map((h) => `<th>${h}</th>`).join('');
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background: #f2f2f2; text-align: left; }
    h1 { text-align: center;}
    caption { caption-side: top; text-align: left; font-size: 1.2em; font-weight: bold; margin-bottom: 10px; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <table>
    <thead><tr>${thead}</tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
};

/**
 * Render a report to console, JSON file, or HTML file.
 *
 * @param {object[]} report - Array of report rows.
 * @param {object} options - Rendering options.
 * @param {string} options.title - Report title.
 * @param {string[]} options.statusKeys - Keys used to compute the summary.
 * @param {'console'|'json'|'html'} options.format - Output format.
 * @param {string|null} options.filename - File path for JSON/HTML output.
 */
export const renderReport = (report, { title, statusKeys, format, filename }) => {
  if (format === 'json' || format === 'html') {
    ensureDirectory(filename);
  }

  if (format === 'json') {
    writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`✅ JSON report saved to ${filename}`);
    return;
  }

  if (format === 'html') {
    const html = renderHtml(title, report);
    writeFileSync(filename, html, 'utf-8');
    console.log(`✅ HTML report saved to ${filename}`);
    return;
  }

  // Default: console output
  console.log(`\n📦 ${title} Matrix:\n`);
  console.table(report);

  const summary = report.reduce((acc, row) => {
    for (const key of statusKeys) {
      const value = row[key];
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {});

  console.log('\n📊 Summary:');
  Object.entries(summary).forEach(([status, count]) => {
    console.log(`  ${status.padEnd(12)}: ${count}`);
  });
};

/**
 * Build a merged migration report by reading all individual JSON reports.
 *
 * @returns {object[]} - Array of merged report rows.
 */
const buildMergedMigrationReport = () => {
  const reportSources = {
    'Routes Migration': buildRoutesReportFileName('json'),
    'Tests Migration': buildTestsReportFileName('json'),
    'SWC Migration': buildSwcReportFileName('json'),
    'ESLint Migration': buildStaticKitReportFileName('json'),
    'TypeScript Migration': buildStaticKitReportFileName('json'),
    'W3C Migration': buildW3CReportFileName('json'),
    'A11y Migration': buildA11yReportFileName('json'),
  };

  const mergedMap = new Map();

  for (const [label, filePath] of Object.entries(reportSources)) {
    try {
      const content = JSON.parse(readFileSync(filePath, 'utf-8'));
      for (const entry of content) {
        const app = entry.Application;
        if (!mergedMap.has(app)) mergedMap.set(app, { Application: app });
        mergedMap.get(app)[label] = entry[label];
      }
    } catch (err) {
      console.warn(`⚠️ Could not load ${filePath}: ${err.message}`);
    }
  }

  return Array.from(mergedMap.values());
};

/**
 * Render the merged migration report (routes, tests, swc, static-kit, w3c, a11y).
 *
 * @param {object} options - Rendering options.
 * @param {'console'|'json'|'html'} options.format - Output format.
 */
export const renderMergedReport = ({ format }) => {
  const filename = buildMergedReportFileName(format);
  const mergedReport = buildMergedMigrationReport();

  renderReport(mergedReport, {
    title: 'Follow Up All Manager Migration Status',
    statusKeys: [
      'Routes Migration',
      'Tests Migration',
      'SWC Migration',
      'ESLint Migration',
      'TypeScript Migration',
      'W3C Migration',
      'A11y Migration',
    ],
    format,
    filename,
  });
};
