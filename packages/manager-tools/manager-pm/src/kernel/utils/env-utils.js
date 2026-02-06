import process from 'node:process';

export const isCI =
  process.env.CI === 'true' ||
  process.env.GITHUB_ACTIONS === 'true' ||
  process.env.CDS_WORKSPACE != null;

export const skipPostInstall = process.env.SKIP_POST_INSTALL;

export const isEnvOptionEnabled = (option) =>
  ['1', 'true', 'yes', 'y', 'on'].includes(String(option ?? '').toLowerCase());
