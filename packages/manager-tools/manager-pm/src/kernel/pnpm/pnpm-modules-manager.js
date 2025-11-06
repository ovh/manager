import { logger } from '../utils/log-manager.js';

export async function addModuleToPnpm(moduleRef) {
  logger.debug(`addModuleToPnpm(moduleRef="${moduleRef}")`);
}

export async function removeModuleFromPnpm(moduleRef) {
  logger.debug(`removeModuleFromPnpm(moduleRef="${moduleRef}")`);
}
