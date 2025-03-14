import { GUIDE } from '../../../iam.constants';
import { IAM_LOG_KINDS_KEYS } from '../../../logs/logs.constants';
import { URL } from '../../../logs/audit/audit-logs.service';

export default class IAMAuditLogsController {
  /* @ngInject */
  constructor(coreConfig) {
    this.URL = URL;
    this.logServiceGuideLink =
      GUIDE.LOGS[coreConfig.getUser().ovhSubsidiary] ?? GUIDE.LOGS.GB;
    this.logKindsKeys = IAM_LOG_KINDS_KEYS;
  }
}
