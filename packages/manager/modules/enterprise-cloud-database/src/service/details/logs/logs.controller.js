import { MESSAGE_CONTAINER } from '../details.constants';

export default class EnterpriseCloudDatabaseServiceDetailsLogsCtrl {
  /* @ngInject */
  constructor(CucCloudMessage, enterpriseCloudDatabaseService) {
    this.CucCloudMessage = CucCloudMessage;
    this.enterpriseCloudDatabaseService = enterpriseCloudDatabaseService;
  }

  $onInit() {
    this.CucCloudMessage.flushMessages(MESSAGE_CONTAINER);
  }

  loadLogDetails(logId) {
    return this.enterpriseCloudDatabaseService.getLogDetails(this.clusterId, logId);
  }
}
