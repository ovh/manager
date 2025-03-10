import { GUIDE } from '../../iam.constants';
import { IAM_LOGS_TRACKING_HITS, IAM_LOG_KINDS_KEYS } from '../logs.constants';
import { URL } from '../logs.service';

export default class IAMAuditLogsController {
  /* @ngInject */
  constructor(coreConfig) {
    this.IAM_AUDIT_LOGS_TRACKING_HITS = IAM_LOGS_TRACKING_HITS.AUDIT;
    this.URL = URL;
    this.logServiceGuideLink =
      GUIDE.LOGS[coreConfig.getUser().ovhSubsidiary] ?? GUIDE.LOGS.GB;
    this.logKindsKeys = IAM_LOG_KINDS_KEYS;
  }
}
