import reduce from 'lodash/reduce';
import { GUIDELINK } from '../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseServiceDetailsCtrl {
  /* @ngInject */
  constructor(CucCloudMessage) {
    this.CucCloudMessage = CucCloudMessage;
    this.GUIDELINK = GUIDELINK;
  }

  $onInit() {
    this.loadMessages();
    this.rulesCount = reduce(
      this.securityGroups,
      (rulesCount, securityGroup) => rulesCount + securityGroup.rulesCount,
      0,
    );
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'enterprise-cloud-database.service.details',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'enterprise-cloud-database.service.details',
      { onMessage: () => this.refreshMessage() },
    );
  }
}
