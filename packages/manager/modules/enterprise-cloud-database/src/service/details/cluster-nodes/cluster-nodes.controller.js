import { INCLUDED_CLUSTER_SIZE } from '../../service.constants';
import { MESSAGE_CONTAINER } from '../details.constants';

export default class EnterpriseCloudDatabaseServiceDetailsClusterSizeCtrl {
  /* @ngInject */
  constructor(CucCloudMessage, enterpriseCloudDatabaseService) {
    this.CucCloudMessage = CucCloudMessage;
    this.enterpriseCloudDatabaseService = enterpriseCloudDatabaseService;
    this.INCLUDED_CLUSTER_SIZE = INCLUDED_CLUSTER_SIZE;
  }

  $onInit() {
    this.includedClusterCount =
      INCLUDED_CLUSTER_SIZE.PRIMARY +
      INCLUDED_CLUSTER_SIZE.REPLICA +
      INCLUDED_CLUSTER_SIZE.BACKUP;
    this.CucCloudMessage.flushMessages(MESSAGE_CONTAINER);
  }
}
