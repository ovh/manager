import { EMOJIS } from '../config/muk-config.js';
import { syncComponentDocs } from '../core/component-documentation-utils.js';
import { logger } from '../utils/log-manager.js';

/**
 * Entry point for the addComponentsDocumentation command.
 * Downloads, extracts, and synchronizes base documentation for all components.
 *
 * Uses a hybrid streaming approach for maximum performance and minimal memory.
 *
 * @async
 * @returns {Promise<void>}
 */
export async function addComponentsDocumentation() {
  logger.info(`${EMOJIS.package} Starting Design System documentation sync…`);

  const { created = 0, updated = 0, total = 0 } = (await syncComponentDocs()) || {};

  logger.success(
    `${EMOJIS.check} Sync complete — ${created} new, ${updated} updated, ${total} files streamed.`,
  );

  logger.info(
    `${EMOJIS.rocket} Documentation synced into 'base-component-doc' folders under each component.`,
  );
}
