import assign from 'lodash/assign';
import compact from 'lodash/compact';
import 'moment';

import { MESSAGE_CONTAINER } from '../details.constants';
import { STATUS } from '../../../enterprise-cloud-database.constants';

export default class EnterpriseCloudDatabaseServiceDetailsBackupsCtrl {
  /* @ngInject */
  constructor(CucCloudMessage, enterpriseCloudDatabaseService) {
    this.CucCloudMessage = CucCloudMessage;
    this.service = enterpriseCloudDatabaseService;
    this.STATUS = STATUS;
  }

  $onInit() {
    this.loadMessages();
    let firstBackupId = null;
    if (compact(this.backupList).length > 0) {
      firstBackupId = this.backupList[this.backupList.length - 1].id;
      this.getBackupDetails(firstBackupId).then((backup) => {
        this.minDate = backup.creationDate;
      });
    }
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

  loadBackupDetails(backupId) {
    return this.service
      .getBackupDetails(this.clusterDetails.id, backupId)
      .then((backup) =>
        assign(backup, {
          expirationDate: moment(backup.creationDate).add(90, 'days').format(),
        }),
      );
  }
}
