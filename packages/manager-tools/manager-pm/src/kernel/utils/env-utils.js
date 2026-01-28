import process from 'node:process';

export const isCI =
  process.env.CI === 'true' ||
  process.env.GITHUB_ACTIONS === 'true' ||
  process.env.CDS_WORKSPACE != null;
