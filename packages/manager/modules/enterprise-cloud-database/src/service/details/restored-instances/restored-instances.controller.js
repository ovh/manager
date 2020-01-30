import assign from 'lodash/assign';
import { MESSAGE_CONTAINER } from '../details.constants';

export default class EnterpriseCloudDatabaseServiceDetailsRestoredInstancesCtrl {
  /* @ngInject */
  constructor($scope, $state, CucCloudMessage, enterpriseCloudDatabaseService) {
    this.$scope = $scope;
    this.$state = $state;
    this.CucCloudMessage = CucCloudMessage;
    this.service = enterpriseCloudDatabaseService;
  }

  $onInit() {
    this.loadMessages();
    this.CucCloudMessage.flushMessages(MESSAGE_CONTAINER);
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'enterprise-cloud-database.service.details.restored-instances',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'enterprise-cloud-database',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  loadDetails(backupId) {
    return this.service
      .getBackupDetails(this.clusterId, backupId)
      .then((res) => assign({ backupDetails: res }));
  }
}
