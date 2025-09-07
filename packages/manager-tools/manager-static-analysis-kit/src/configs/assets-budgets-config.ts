/**
 * Performance budgets for assets, based on HTTP Archive medians (Desktop).
 * Source: https://httparchive.org/reports/page-weight
 */
export const assetsBudgetsConfig = {
  /**
   * Median asset sizes in kilobytes, based on HTTP Archive.
   */
  medians: {
    jsKb: 747.5,
    cssKb: 86.8,
    imgKb: 1066.6,
    htmlKb: 35.5,
  },

  /**
   * Threshold factors for budget evaluation.
   */
  thresholds: {
    nearFactor: 0.8,
    exceedFactor: 1.0,
  },

  /**
   * Number of heaviest assets to show in the HTML <details> section.
   */
  heavyAssetsCount: 5,

  /**
   * Reference links and optimization tips.
   */
  links: {
    httpArchive: [
      { label: 'JavaScript Median', url: 'https://httparchive.org/reports/page-weight#bytesJs' },
      { label: 'CSS Median', url: 'https://httparchive.org/reports/page-weight#bytesCss' },
      { label: 'HTML Median', url: 'https://httparchive.org/reports/page-weight#bytesHtml' },
      { label: 'Image Median', url: 'https://httparchive.org/reports/page-weight#bytesImg' },
    ],
    optimization: [
      { label: 'Web.dev: Learn Performance', url: 'https://web.dev/learn/performance' },
      { label: 'Web.dev: Performance Guide', url: 'https://web.dev/performance' },
      { label: 'Bundle Splitting', url: 'https://www.patterns.dev/vanilla/bundle-splitting/' },
      { label: 'Dynamic Import', url: 'https://www.patterns.dev/vanilla/dynamic-import/' },
      {
        label: 'Import on Interaction',
        url: 'https://www.patterns.dev/vanilla/import-on-interaction/',
      },
      {
        label: 'Import on Visibility',
        url: 'https://www.patterns.dev/vanilla/import-on-visibility/',
      },
      { label: 'Loading Sequence', url: 'https://www.patterns.dev/vanilla/loading-sequence/' },
      { label: 'Virtual Lists', url: 'https://www.patterns.dev/vanilla/virtual-lists/' },
      { label: 'Third-party Scripts', url: 'https://www.patterns.dev/vanilla/third-party/' },
    ],
    tips: [
      { label: 'State Localization', desc: 'Minimize unnecessary re-renders by localizing state.' },
      { label: 'Memoization', desc: 'Use useMemo/useCallback for expensive calcs and functions.' },
      { label: 'Lazy Loading', desc: 'Load components/routes lazily to improve initial load.' },
      { label: 'Virtualization', desc: 'Use react-window/react-virtualized for large lists.' },
      { label: 'Profiling', desc: 'Use React Profiler and browser DevTools to spot bottlenecks.' },
    ],
  },
};
