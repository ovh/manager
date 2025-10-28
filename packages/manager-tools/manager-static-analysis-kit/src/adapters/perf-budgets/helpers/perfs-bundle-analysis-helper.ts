import fs from 'node:fs';
import path from 'node:path';

import { assetsBudgetsConfig } from '../../../configs/assets-budgets-config';
import { evaluatePerfBudgets } from '../rules/perfs-budgets-rules';
import { scoreAllPerfBudgets } from '../rules/perfs-budgets-scoring';
import { PerfBudgetResult, PerfBudgetsSummary } from '../types/PerfBudget';
import { ParsedAsset, ParsedBundle } from '../types/PerfBudgetAssets';

/**
 * Escape HTML entities for safe embedding.
 */
export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Builds normalized asset information from a list of parsed assets.
 *
 * Each asset is mapped to an object containing:
 * - `filename`: The asset's name, or `"unknown"` if not provided.
 * - `sizeKb`: The asset size in kilobytes, derived from `parsedSize` if numeric.
 * - `type`: The asset type inferred from the file extension
 *   (`"js"`, `"css"`, `"html"`, `"img"`, or `"other"`).
 *
 * @param {ParsedAsset[]} data - List of parsed assets to transform.
 * @returns {ParsedAsset[]} A new array of assets enriched with filename, size, and type.
 */
const buildAssetsInfos = (data: ParsedAsset[]): ParsedAsset[] =>
  data.map((entry: any): ParsedAsset => {
    const filename: string = entry?.filename ?? 'unknown';
    const sizeKb: number = typeof entry?.parsedSize === 'number' ? entry.parsedSize / 1024 : 0;

    let type: ParsedAsset['type'] = 'other';

    if (/\.(js|mjs|cjs|ts|tsx)$/i.test(filename)) {
      type = 'js';
    } else if (/\.css$/i.test(filename)) {
      type = 'css';
    } else if (/\.html?$/i.test(filename)) {
      type = 'html';
    } else if (/\.(png|jpe?g|gif|svg|webp)$/i.test(filename)) {
      type = 'img';
    }

    return { filename, type, sizeKb };
  });

/**
 * Parse vite-bundle-analyzer JSON output to extract KB totals
 * and per-asset details.
 *
 * @param raw - The parsed JSON from bundle-report.json
 * @returns Aggregated bundle info with asset breakdown
 */
export function parseAnalyzerJson(raw: ParsedAsset[]): ParsedBundle {
  if (!Array.isArray(raw)) {
    return { jsKb: 0, cssKb: 0, htmlKb: 0, imgKb: 0, assets: [] };
  }

  const assets: ParsedAsset[] = buildAssetsInfos(raw);
  const sumByType = (type: ParsedAsset['type']) =>
    assets.filter((a) => a.type === type).reduce((sum, a) => sum + a.sizeKb, 0);

  return {
    jsKb: sumByType('js'),
    cssKb: sumByType('css'),
    htmlKb: sumByType('html'),
    imgKb: sumByType('img'),
    assets,
  };
}

/**
 * Collect and aggregate all performance budget reports across apps.
 *
 * This function parses JSON bundle reports (from vite-bundle-analyzer)
 * generated per application, normalizes them against configured medians
 * (HTTP Archive values), and produces a combined summary.
 */
export function collectPerfBudgets(reportOutputDir: string): PerfBudgetsSummary {
  const reportsRoot = path.join(reportOutputDir);

  if (!fs.existsSync(reportsRoot)) {
    throw new Error(`Reports directory not found: ${reportsRoot}`);
  }

  const apps = fs.readdirSync(reportsRoot).filter((d) => {
    const appJson = path.join(reportsRoot, d, 'bundle-report.json');
    return fs.existsSync(appJson);
  });

  const results: (PerfBudgetResult & { assets: ParsedAsset[] })[] = [];

  for (const app of apps) {
    const jsonPath = path.join(reportsRoot, app, 'bundle-report.json');
    const raw: ParsedAsset[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    const { jsKb, cssKb, htmlKb, imgKb, assets } = parseAnalyzerJson(raw);

    const appResult = {
      ...evaluatePerfBudgets({ app, jsKb, cssKb, htmlKb, imgKb }),
      assets,
    };

    results.push(appResult);
  }

  const scores = scoreAllPerfBudgets(results);

  return {
    results,
    scores,
    medians: assetsBudgetsConfig.medians,
  };
}

/**
 * Generate a combined HTML dashboard from collected performance budgets.
 *
 * Each row shows totals and the single heaviest asset per type inline,
 * plus a <details> dropdown with the top-N heaviest assets.
 */
// eslint-disable-next-line max-lines-per-function
export function generatePerfBudgetsHtml(summary: PerfBudgetsSummary): string {
  const { results, scores, medians } = summary;
  const heavyCount = assetsBudgetsConfig.heavyAssetsCount;

  function colorizeClass(status: 'ok' | 'near' | 'exceed'): string {
    switch (status) {
      case 'ok':
        return 'status-ok';
      case 'near':
        return 'status-near';
      case 'exceed':
        return 'status-exceed';
    }
  }

  function heaviestOfType(assets: (typeof results)[number]['assets'], type: string) {
    return assets.filter((a) => a.type === type).sort((a, b) => b.sizeKb - a.sizeKb)[0];
  }

  function formatCell(
    total: number,
    status: 'ok' | 'near' | 'exceed',
    type: 'js' | 'css' | 'html' | 'img',
    assets: (typeof results)[number]['assets'],
  ): string {
    const heavy = heaviestOfType(assets, type);
    const heavyInfo = heavy
      ? `<br/><small><b>Largest ${type.toUpperCase()} asset:</b> <code>${escapeHtml(
          heavy.filename,
        )}</code> — ${heavy.sizeKb.toFixed(1)} KB</small>`
      : '';

    return `<td class="${colorizeClass(status)}">
      <b>Total ${type.toUpperCase()} assets size:</b> ${total.toFixed(1)} KB
      ${heavyInfo}
    </td>`;
  }

  const rows = scores
    .map((s) => {
      const result = results.find((r) => r.app === s.app)!;

      const heavyAssets = [...result.assets]
        .sort((a, b) => b.sizeKb - a.sizeKb)
        .slice(0, heavyCount);

      const assetsHtml = heavyAssets
        .map(
          (a) =>
            `<li><code>${escapeHtml(a.filename)}</code> — <strong>${a.sizeKb.toFixed(
              1,
            )} KB</strong> (${a.type})</li>`,
        )
        .join('\n');

      return `
        <tr>
          <td><strong>${escapeHtml(s.app)}</strong></td>
          ${formatCell(result.jsKb, result.jsStatus, 'js', result.assets)}
          ${formatCell(result.cssKb, result.cssStatus, 'css', result.assets)}
          ${formatCell(result.htmlKb, result.htmlStatus, 'html', result.assets)}
          ${formatCell(result.imgKb, result.imgStatus, 'img', result.assets)}
          <td><b>${escapeHtml(s.status.toUpperCase())}</b></td>
          <td>
            <details>
              <summary>Top ${heavyCount} Assets</summary>
              <ul>${assetsHtml || '<li>No assets found</li>'}</ul>
            </details>
          </td>
        </tr>
      `;
    })
    .join('\n');

  const linksHtml = assetsBudgetsConfig.links.httpArchive
    .map(
      ({ label, url }) =>
        `<li><a href="${escapeHtml(url)}" target="_blank">${escapeHtml(label)}</a></li>`,
    )
    .join('\n');

  const tipsHtml = assetsBudgetsConfig.links.tips
    .map(({ label, desc }) => `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(desc)}</li>`)
    .join('\n');

  const optimizationHtml = assetsBudgetsConfig.links.optimization
    .map(
      ({ label, url }) =>
        `<li><a href="${escapeHtml(url)}" target="_blank">${escapeHtml(label)}</a></li>`,
    )
    .join('\n');

  return `
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Perf Budgets Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #fafafa; }
        h1, h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
        th { background: #f0f0f0; }
        tr:nth-child(even) { background: #f9f9f9; }
        tr:hover { background: #f1f7ff; }
        .status-ok { background: #e6f9e6; color: #207520; }
        .status-near { background: #fff8e1; color: #a87900; }
        .status-exceed { background: #fdecea; color: #b71c1c; }
        code { font-family: monospace; background: #f5f5f5; padding: 1px 3px; border-radius: 3px; }
        details summary { cursor: pointer; }
        .box { border: 1px solid #ccc; background: #fff; padding: 10px; margin: 15px 0; border-radius: 6px; }
      </style>
    </head>
    <body>
      <h1>Performance Budgets Report</h1>
      <div class="box">
        <h2>Medians (Desktop)</h2>
        <p>
          JS: ${medians.jsKb} KB ·
          CSS: ${medians.cssKb} KB ·
          HTML: ${medians.htmlKb} KB ·
          IMG: ${medians.imgKb} KB
        </p>
        <p><b>Links:</b></p>
        <ul>${linksHtml}</ul>
      </div>

      <div class="box">
        <details open>
          <summary><b>Optimization & Best Practices</b></summary>
          <h3>Tips</h3>
          <ul>${tipsHtml}</ul>
          <h3>Resources</h3>
          <ul>${optimizationHtml}</ul>
        </details>
      </div>

      <h2>Applications</h2>
      <table>
        <tr>
          <th>App</th>
          <th>JS</th>
          <th>CSS</th>
          <th>HTML</th>
          <th>IMG</th>
          <th>Status</th>
          <th>Details</th>
        </tr>
        ${rows}
      </table>
    </body>
  </html>`;
}
