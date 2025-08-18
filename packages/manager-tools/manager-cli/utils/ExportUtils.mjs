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
 * Build the filename for the PNPM migration report.
 *
 * @param {'json'|'html'|string|null} format - Output format ("json", "html", or console).
 * @returns {string|null} - Full path to the PNPM report file, or null if console mode.
 */
export const buildPnpmReportFileName = (format) => buildReportFileName('pnpm', format);

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
 * Build a merged migration report map for all apps.
 * Each entry includes migration results tagged with scope (react/all).
 *
 * @returns {Array<{Application: string, scopeResults: Record<string, {value: string, scope: 'react'|'all'}>}>}
 */
export const buildMergedMigrationReport = () => {
  const reportSources = {
    'Routes Migration': { file: buildRoutesReportFileName('json'), scope: 'react' },
    'Tests Migration': { file: buildTestsReportFileName('json'), scope: 'react' },
    'SWC Migration': { file: buildSwcReportFileName('json'), scope: 'react' },
    'ESLint Migration': { file: buildStaticKitReportFileName('json'), scope: 'react' },
    'TypeScript Migration': { file: buildStaticKitReportFileName('json'), scope: 'react' },
    'W3C Migration': { file: buildW3CReportFileName('json'), scope: 'react' },
    'A11y Migration': { file: buildA11yReportFileName('json'), scope: 'react' },
    'PNPM Migration': { file: buildPnpmReportFileName('json'), scope: 'all' },
  };

  const mergedMap = new Map();

  for (const [label, { file, scope }] of Object.entries(reportSources)) {
    try {
      const content = JSON.parse(readFileSync(file, 'utf-8'));
      for (const entry of content) {
        const app = entry.Application;
        if (!mergedMap.has(app)) {
          mergedMap.set(app, { Application: app, scopeResults: {} });
        }
        mergedMap.get(app).scopeResults[label] = {
          value: entry[label],
          scope,
        };
      }
    } catch (err) {
      console.warn(`⚠️ Could not load ${label} (${file}): ${err.message}`);
    }
  }

  return Array.from(mergedMap.values());
};

/**
 * Render HTML table of React-only migrations for a single app.
 *
 * @param {string} app - Application name.
 * @param {Record<string, {value: string, scope: 'react'|'all'}>} scopeResults - Migration results by label.
 * @returns {string} HTML snippet (table).
 */
export function renderReactMigrations(app, scopeResults) {
  const rows = Object.entries(scopeResults)
    .filter(([, r]) => r.scope === 'react')
    .map(([label, r]) => `<tr><td>${label}</td><td>${r.value}</td></tr>`)
    .join('\n');

  if (!rows) return '';

  return `
    <section>
      <h2>${app}</h2>
      <table border="1" cellspacing="0" cellpadding="4">
        <thead><tr><th>Migration</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;
}

/**
 * Render HTML table of global (all-app) migrations for a single app.
 *
 * @param {string} app - Application name.
 * @param {Record<string, {value: string, scope: 'react'|'all'}>} scopeResults - Migration results by label.
 * @returns {string} HTML snippet (table).
 */
export function renderGlobalMigrations(app, scopeResults) {
  const rows = Object.entries(scopeResults)
    .filter(([, r]) => r.scope === 'all')
    .map(([label, r]) => `<tr><td>${label}</td><td>${r.value}</td></tr>`)
    .join('\n');

  if (!rows) return '';

  return `
    <section>
      <h2>${app}</h2>
      <table border="1" cellspacing="0" cellpadding="4">
        <thead><tr><th>Migration</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;
}

/**
 * Normalize a migration status into Done / Partial / TODO.
 *
 * @param {string} value - Raw status value from the reports.
 * @returns {'Done'|'Partial'|'TODO'} - Normalized status.
 */
function normalizeStatus(value) {
  if (!value) return 'TODO';
  const v = String(value).toLowerCase();
  if (v.includes('done')) return 'Done';
  if (v.includes('todo')) return 'TODO';
  return 'Partial';
}

/**
 * Compute per-migration summary (counts of Done, Partial, TODO).
 *
 * @param {ReturnType<typeof buildMergedMigrationReport>} merged - Array of merged migration results.
 * @returns {Record<string, {Done: number, Partial: number, TODO: number}>}
 */
export function computeSummaryByType(merged) {
  const summaryByType = {};
  for (const row of merged) {
    for (const [label, { value }] of Object.entries(row.scopeResults)) {
      const normalized = normalizeStatus(value);
      if (!summaryByType[label]) {
        summaryByType[label] = { Done: 0, Partial: 0, TODO: 0 };
      }
      summaryByType[label][normalized] += 1;
    }
  }
  return summaryByType;
}

/**
 * Render global summary in the console.
 *
 * @param {Record<string, {Done: number, Partial: number, TODO: number}>} summaryByType
 */
export function renderConsoleSummary(summaryByType) {
  console.log('\n📦 Global Summary by Migration Type:\n');
  Object.entries(summaryByType).forEach(([label, counts]) => {
    console.log(
      `${label.padEnd(22)}: ✅ ${counts.Done} | ⚠️ ${counts.Partial} | 📝 ${counts.TODO}`,
    );
  });
}

/**
 * Render tabbed app details (React Apps vs All Apps) with grid layout.
 *
 * @param {ReturnType<typeof buildMergedMigrationReport>} merged - Array of merged migration results.
 * @returns {string} HTML snippet with tabs and grid content.
 */
export function renderTabsHtml(merged) {
  const reactSections = merged
    .map((row) => renderReactMigrations(row.Application, row.scopeResults))
    .join('\n');
  const allSections = merged
    .map((row) => renderGlobalMigrations(row.Application, row.scopeResults))
    .join('\n');

  return `
  <div class="tabs">
    <div class="tab active" data-target="react">React Apps</div>
    <div class="tab" data-target="all">All Apps</div>
  </div>
  <div class="tab-content">
    <div id="react" class="tab-pane active">
      <div class="apps-grid">
        ${reactSections || '<p>No React apps migrations found.</p>'}
      </div>
    </div>
    <div id="all" class="tab-pane">
      <div class="apps-grid">
        ${allSections || '<p>No All-app migrations found.</p>'}
      </div>
    </div>
  </div>`;
}

/**
 * Render HTML summary cards for each migration type inside a grid container.
 *
 * @param {Record<string, {Done: number, Partial: number, TODO: number}>} summaryByType
 * @returns {string} HTML snippet with grid of summary cards.
 */
export function renderHtmlSummaryCards(summaryByType) {
  const cards = Object.entries(summaryByType)
    .map(
      ([label, counts]) => `
        <div class="summary-card">
          <h3>${label}</h3>
          <p>✅ ${counts.Done} &nbsp;|&nbsp; ⚠️ ${counts.Partial} &nbsp;|&nbsp; 📝 ${counts.TODO}</p>
        </div>`,
    )
    .join('\n');

  return `<div class="summary-grid">\n${cards}\n</div>`;
}

/**
 * Render final merged report (React vs All Apps) with global summary per migration type.
 *
 * @param {object} options - Rendering options.
 * @param {'console'|'json'|'html'} options.format - Output format.
 */
export const renderMergedReport = ({ format }) => {
  const filename = buildMergedReportFileName(format);
  const merged = buildMergedMigrationReport();
  const summaryByType = computeSummaryByType(merged);

  if (format === 'console') {
    renderConsoleSummary(summaryByType);

    const flat = merged.map((row) => {
      const result = { Application: row.Application };
      for (const [label, { value }] of Object.entries(row.scopeResults)) {
        result[label] = value;
      }
      return result;
    });
    renderReport(flat, {
      title: 'Follow Up All Manager Migration Status',
      statusKeys: Object.keys(flat[0] || {}).filter((k) => k !== 'Application'),
      format: 'console',
      filename: null,
    });
    return;
  }

  if (format === 'json') {
    ensureDirectory(filename);
    writeFileSync(filename, JSON.stringify({ summary: summaryByType, apps: merged }, null, 2));
    console.log(`✅ JSON merged report saved to ${filename}`);
    return;
  }

  if (format === 'html') {
    const summaryHtml = renderHtmlSummaryCards(summaryByType);
    const tabsHtml = renderTabsHtml(merged);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Migration Status Reports</title>
  <style>
    body { font-family: sans-serif; margin: 20px; }
    h1 { text-align: center; font-size: 2.2em; margin-bottom: 10px; }
    h1::before { content: "📊 "; }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .summary-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      background: #fafafa;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .summary-card h3 { margin: 0 0 8px; font-size: 1.1em; }
    .apps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .apps-grid section {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 10px;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .apps-grid h2 {
      text-transform: capitalize;
      font-size: 1.1em;
      margin-bottom: 8px;
    }
    .apps-grid table {
      width: 100%;
      border-collapse: collapse;
    }
    .apps-grid th, .apps-grid td {
      border: 1px solid #ddd;
      padding: 4px 6px;
      font-size: 0.9em;
    }
    .apps-grid th {
      background: #f9f9f9;
    }
    .tabs { display: flex; justify-content: center; margin: 20px 0; }
    .tab {
      padding: 10px 20px;
      border: 1px solid #ccc;
      border-bottom: none;
      cursor: pointer;
      background: #f5f5f5;
    }
    .tab.active { background: #fff; font-weight: bold; }
    .tab-content { border: 1px solid #ccc; padding: 20px; border-radius: 0 0 8px 8px; }
    .tab-pane { display: none; }
    .tab-pane.active { display: block; }
    section { margin-bottom: 20px; }
    h2 { margin-top: 1em; }
  </style>
</head>
<body>
  <h1>Migration Status Reports</h1>

  ${summaryHtml}

  ${tabsHtml}

  <script>
    const tabs = document.querySelectorAll('.tab');
    const panes = document.querySelectorAll('.tab-pane');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.target).classList.add('active');
      });
    });
  </script>
</body>
</html>
    `;

    ensureDirectory(filename);
    writeFileSync(filename, html, 'utf-8');
    console.log(`✅ HTML merged report saved to ${filename}`);
  }
};
