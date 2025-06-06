import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const reportOutputBasePath = resolve(__dirname, '../../../migration-status-reports');

/**
 * Ensure directory exists.
 */
const ensureDirectory = (filePath) => {
  const dir = dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

/**
 * Convert report to HTML table.
 */
const renderHtml = (title, data) => {
  const headers = Object.keys(data[0] || {});
  const rows = data.map(row => `<tr>${headers.map(h => `<td>${row[h]}</td>`).join('')}</tr>`).join('\n');
  const thead = headers.map(h => `<th>${h}</th>`).join('');
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
    caption { caption-side: top; text-align: left; font-size: 1.2em; font-weight: bold; margin-bottom: 10px; }
  </style>
</head>
<body>
  <table>
    <caption>${title}</caption>
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
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`✅ JSON report saved to ${filename}`);
    return;
  }

  if (format === 'html') {
    const html = renderHtml(title, report);
    fs.writeFileSync(filename, html, 'utf-8');
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
