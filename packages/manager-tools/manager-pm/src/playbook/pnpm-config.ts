import path from 'node:path';

/** Default PNPM version to download. */
export const pnpmVersion = '10.11.1';

/** Directory where the PNPM binary will be stored. */
export const pnpmBinaryPath: string = path.resolve('./target/pnpm');

/** Basename used for the pnpm binary without platform extension. */
export const pnpmExecutablePath: string = path.join(pnpmBinaryPath, 'pnpm');
