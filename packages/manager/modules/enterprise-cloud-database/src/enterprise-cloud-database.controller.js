import assign from 'lodash/assign';

import {
  DATABASE_CONSTANTS,
  GUIDELINK,
  SERVICE_TYPE,
  STATUS,
} from './enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseCtrl {
  /* @ngInject */
  constructor($q, CucCloudMessage, enterpriseCloudDatabaseService) {
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.DATABASE_CONSTANTS = DATABASE_CONSTANTS;
    this.enterpriseCloudDatabaseService = enterpriseCloudDatabaseService;
    this.GUIDELINK = GUIDELINK;
    this.SERVICE_TYPE = SERVICE_TYPE;
    this.STATUS = STATUS;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('enterprise-cloud-database.list');
    this.messageHandler = this.CucCloudMessage.subscribe(
      'enterprise-cloud-database',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  loadRow(cluster) {
    return this.$q
      .all([
        this.enterpriseCloudDatabaseService.getEndpointsWithDetails(
          cluster.details.id,
        ),
        this.enterpriseCloudDatabaseService.getUser(cluster.details.id),
      ])
      .then((res) => assign({ endpoints: res[0], user: res[1] }));
  }
}
