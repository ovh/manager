import { GUIDE } from '../../../iam.constants';
import { IAM_LOG_KINDS_KEYS } from '../../../logs/logs.constants';

export default class IAMAuditLogsController {
  /* @ngInject */
  constructor(coreConfig) {
    this.logServiceGuideLink =
      GUIDE.LOGS[coreConfig.getUser().ovhSubsidiary] ?? GUIDE.LOGS.GB;
    this.logKindsKeys = IAM_LOG_KINDS_KEYS;
  }
}
