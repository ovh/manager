import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const reportOutputBasePath = resolve(__dirname, '../../../../migration-status-reports');

export const buildRoutesReportFileName = (outputFormat) =>
  outputFormat === 'json'
    ? `${reportOutputBasePath}/routes-migration-report.json`
    : outputFormat === 'html'
      ? `${reportOutputBasePath}/routes-migration-report.html`
      : null;

export const buildSwcReportFileName = (outputFormat) =>
  outputFormat === 'json'
    ? `${reportOutputBasePath}/swc-migration-report.json`
    : outputFormat === 'html'
      ? `${reportOutputBasePath}/swc-migration-report.html`
      : null;

export const buildTestsReportFileName = (outputFormat) =>
  outputFormat === 'json'
    ? `${reportOutputBasePath}/tests-migration-report.json`
    : outputFormat === 'html'
      ? `${reportOutputBasePath}/tests-migration-report.html`
      : null;

export const buildStaticKitReportFileName = (outputFormat) =>
  outputFormat === 'json'
    ? `${reportOutputBasePath}/static-kit-migration-report.json`
    : outputFormat === 'html'
      ? `${reportOutputBasePath}/static-kit-migration-report.html`
      : null;

export const buildMergedReportFileName = (outputFormat) =>
  outputFormat === 'json'
    ? `${reportOutputBasePath}/migration-status-full-report.json`
    : outputFormat === 'html'
      ? `${reportOutputBasePath}/migration-status-full-report.html`
      : null;

export const buildW3CReportFileName = (outputFormat) =>
  outputFormat === 'json'
    ? `${reportOutputBasePath}/w3c-migration-report.json`
    : outputFormat === 'html'
      ? `${reportOutputBasePath}/w3c-migration-report.html`
      : null;

export const buildA11yReportFileName = (outputFormat) =>
  outputFormat === 'json'
    ? `${reportOutputBasePath}/a11y-migration-report.json`
    : outputFormat === 'html'
      ? `${reportOutputBasePath}/a11y-migration-report.html`
      : null;

/**
 * Ensure directory exists.
 */
const ensureDirectory = (filePath) => {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

/**
 * Convert report to HTML table.
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
 * Render report to console or file.
 */
export const renderReport = (report, { title, statusKeys, format, filename }) => {
  if (format === 'json' || format === 'html') {
    ensureDirectory(filename); // <-- ensure output path exists
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
 * Build merged migration report
 * @returns {any[]}
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
 * Render merged migration report (routes + tests + swc).
 * Honors format: json, html, or undefined (logs to console).
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
      'W3C Migration',
      'A11y Migration',
    ],
    format,
    filename,
  });
};
