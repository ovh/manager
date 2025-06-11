import { IPLB_LOG_KINDS_KEYS, GUIDE } from '../logs.constants';

export default class IplbLogsController {
  /* @ngInject */
  constructor(coreConfig) {
    this.logServiceGuideLink =
      GUIDE[coreConfig.getUser().ovhSubsidiary] ?? GUIDE.GB;
    this.logKindsKeys = IPLB_LOG_KINDS_KEYS;
  }
}
