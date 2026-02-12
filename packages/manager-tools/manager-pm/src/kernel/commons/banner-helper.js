import { logger } from '../utils/log-manager.js';

/**
 * Display a banner describing the migration process when adding
 * a target to PNPM.
 *
 * @param {string} target - Relative path of the target being migrated.
 */
export function displayAddHelpBanner(target) {
  logger.info(`
------------------------------------------------------------
🚀 Starting migration of "${target}" to PNPM

⚠️ This operation can take several minutes because it will:
   • Normalize critical React dependency versions
   • Update Yarn and PNPM catalogs
   • Clean old package-manager artifacts
   • Patch vitest configuration
   • Run a full "yarn install" at the repo root

Please do not interrupt this process.
------------------------------------------------------------
  `);
}

/**
 * Display a banner describing the rollback process when removing
 * a target from PNPM (back to Yarn).
 *
 * @param {string} target - Relative path of the target being rolled back.
 */
export function displayRemoveHelpBanner(target) {
  logger.info(`
------------------------------------------------------------
♻️ Rolling back "${target}" to Yarn

⚠️ This operation can take several minutes because it will:
   • Update PNPM and Yarn catalogs
   • Clean PNPM-specific artifacts
   • Run a full "yarn install" at the repo root

Please do not interrupt this process.
------------------------------------------------------------
  `);
}

/**
 * Display final recommended build/test instructions
 * after migration or rollback is completed.
 *
 * @param {string} target - Relative path of the target migrated/rolled back.
 * @param {'migration'|'rollback'} [action='migration'] - Operation type, affects wording.
 */
export function displayFinalInstructionsHelpBanner(target, action = 'migration') {
  logger.info(`
------------------------------------------------------------
🏗️  Next recommended step: full monorepo build & test

To validate the ${action} is done successfully for "${target}"
and does not introduce side-effects across all workspace, run:

   yarn build
   yarn test   # optional

This will:
   • Rebuild the entire repository with updated catalogs
   • Ensure "${target}" is properly ${action === 'rollback' ? 'restored' : 'integrated'}
   • Catch regressions early (type, lint, test)

⚠️  Build is manual by design to keep ${action} predictable.
------------------------------------------------------------
`);
}
