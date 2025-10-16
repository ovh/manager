import { EMOJIS } from '../config/muk-config.js';
import {
  syncComponentDocs,
  syncStorybookBaseDocuments,
} from '../core/component-documentation-utils.js';
import { aggregateOperationsStats, safeSync } from '../core/tasks-utils.js';
import { logger } from '../utils/log-manager.js';

/**
 * CLI Command: addComponentsDocumentation
 *
 * Synchronizes all Design System documentation artifacts into the Manager Wiki.
 *
 * This process performs two major synchronization operations:
 *
 * 1. **Component Base Documentation** — retrieves and updates
 *    each component’s `base-component-doc` folder in the Wiki.
 *
 * 2. **Storybook Source Documentation** — downloads and mirrors all
 *    Storybook `components`, `constants`, and `helpers` under:
 *    `packages/manager-wiki/stories/manager-ui-kit/base-documents/`
 *
 * Both steps use streaming extraction from the ODS tarball,
 * ensuring minimal memory usage and safe incremental updates.
 *
 * @async
 * @returns {Promise<void>} Completes when both synchronizations finish.
 */
export async function addComponentsDocumentation() {
  logger.info(`${EMOJIS.package} Starting Design System documentation sync…`);

  // --- Step 1: Component documentation sync
  const componentResult = await safeSync('component base-docs', syncComponentDocs);

  // --- Step 2: Storybook base documents sync
  const storybookResult = await safeSync('storybook base-documents', syncStorybookBaseDocuments);

  // --- Aggregate statistics
  const stats = aggregateOperationsStats([componentResult, storybookResult]);

  logger.success(
    `${EMOJIS.check} Sync complete — ${stats.created} new, ${stats.updated} updated, ${stats.total} files streamed.`,
  );

  logger.info(
    `${EMOJIS.rocket} Components updated under their base-doc folders, and Storybook sources mirrored to 'stories/manager-ui-kit/base-documents'.`,
  );
}
