import { LABELS } from '../../../dedicatedCloud.constant';
import { DEDICATEDCLOUD_DATACENTER_DRP_STATUS } from '../dedicatedCloud-datacenter-zerto.constants';

export default class {
  constructor() {
    this.ZERTO = LABELS.ZERTO;
  }

  $onInit() {
    this.isDelivering =
      this.currentZerto.state ===
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering;
  }
}
