import { DEDICATEDCLOUD_DATACENTER_DRP_STATUS } from '../dedicatedCloud-datacenter-zerto.constants';
import { DedicatedCloudDatacenterZertoService } from '../dedicatedCloud-datacenter-zerto.service';

export default class {
  /* @ngInject */
  constructor(dedicatedCloudZerto) {
    this.dedicatedCloudZerto = dedicatedCloudZerto;
    this.ZERTO_STATES = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
  }

  $onInit() {
    this.globalStatus = DedicatedCloudDatacenterZertoService.getZertoGlobalStatus(
      this.zertoState,
    );
  }
}
