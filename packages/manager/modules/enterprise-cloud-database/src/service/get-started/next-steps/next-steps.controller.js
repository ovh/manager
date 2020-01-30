import find from 'lodash/find';
import isUndefined from 'lodash/isUndefined';
import { COMMANDS_LIST } from '../../connection-details/flags/flags.constants';
import { ENDPOINT_TYPES } from '../../connection-details/connection-details.constants';
import { INCLUDED_CLUSTER_SIZE } from '../../service.constants';
import { GUIDELINK } from '../../../enterprise-cloud-database.constants';

export default class {
  /* @ngInject */
  constructor() {
    this.COMMANDS_LIST = COMMANDS_LIST;
    this.GUIDELINK = GUIDELINK;
  }

  $onInit() {
    const includedClusterCount =
      INCLUDED_CLUSTER_SIZE.PRIMARY +
      INCLUDED_CLUSTER_SIZE.REPLICA +
      INCLUDED_CLUSTER_SIZE.BACKUP;
    this.addedReplicas = this.hostList.length - includedClusterCount;
    this.data = {
      dailyBackup: this.clusterDetails.autoBackup,
    };
    this.readWriteEndpoint = find(this.endPoints, {
      name: ENDPOINT_TYPES.READ_WRITE,
    });
  }

  dataChange(dailyBackup) {
    this.onDataChange({
      data: {
        ...this.data,
        dailyBackup: isUndefined(dailyBackup)
          ? this.data.dailyBackup
          : dailyBackup,
      },
    });
  }

  maintenanceWindowChanged(data) {
    Object.assign(this.data, data);
    this.dataChange();
  }
}
