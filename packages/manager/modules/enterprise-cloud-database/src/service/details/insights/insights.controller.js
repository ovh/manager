import { MESSAGE_CONTAINER } from '../details.constants';

export default class EnterpriseCloudDatabaseServiceDetailsInsightsCtrl {
  /* @ngInject */
  constructor(CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.CucCloudMessage.flushMessages(MESSAGE_CONTAINER);
  }
}
