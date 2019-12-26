import {
  DATABASE_CONSTANTS,
  MASKED_PASSWORD,
  SERVICE_TYPE,
} from '../../../enterprise-cloud-database.constants';
import {
  AUTO_BACKUP,
  BACKUP_FREQUENCY,
  BACKUP_RETENTION,
  USERNAME,
} from './overview.constants';
import { INCLUDED_CLUSTER_SIZE } from '../../service.constants';
import { MESSAGE_CONTAINER } from '../details.constants';

export default class EnterpriseCloudDatabaseServiceDetailsOverviewCtrl {
  /* @ngInject */
  constructor($state, CucCloudMessage, enterpriseCloudDatabaseService) {
    this.$state = $state;
    this.AUTO_BACKUP = AUTO_BACKUP;
    this.BACKUP_RETENTION = BACKUP_RETENTION;
    this.BACKUP_FREQUENCY = BACKUP_FREQUENCY;
    this.DATABASE_CONSTANTS = DATABASE_CONSTANTS;
    this.INCLUDED_CLUSTER_SIZE = INCLUDED_CLUSTER_SIZE;
    this.MASKED_PASSWORD = MASKED_PASSWORD;
    this.SERVICE_TYPE = SERVICE_TYPE;
    this.USERNAME = USERNAME;
    this.CucCloudMessage = CucCloudMessage;
    this.enterpriseCloudDatabaseService = enterpriseCloudDatabaseService;
  }

  $onInit() {
    this.loadMessages();
    this.CucCloudMessage.flushMessages(MESSAGE_CONTAINER);
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'enterprise-cloud-database.service.details.overview',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'enterprise-cloud-database.service.details.overview',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
