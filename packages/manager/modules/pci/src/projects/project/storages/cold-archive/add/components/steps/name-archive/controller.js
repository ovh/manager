import { COLD_ARCHIVE_NAME_ARCHIVE_PATTERN } from './constants';

export default class ColdArchiveNameArchiveController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;

    this.COLD_ARCHIVE_NAME_ARCHIVE_PATTERN = COLD_ARCHIVE_NAME_ARCHIVE_PATTERN;
  }
}
