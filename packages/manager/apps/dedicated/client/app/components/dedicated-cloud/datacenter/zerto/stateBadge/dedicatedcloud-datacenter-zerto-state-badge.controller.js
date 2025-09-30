import { DEDICATEDCLOUD_DATACENTER_DRP_STATUS } from '../dedicatedCloud-datacenter-zerto.constants';

export default class {
  /* @ngInject */
  constructor(dedicatedCloudZerto) {
    this.dedicatedCloudZerto = dedicatedCloudZerto;
    this.ZERTO_STATES = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
  }

  $onInit() {
    this.globalStatus = this.getZertoGlobalStatus(this.zertoState);
  }

  getZertoGlobalStatus(zertoState) {
    if (
      this.dedicatedCloudZerto.constructor.isZertoSiteCriticalState(zertoState)
    ) {
      return 'error';
    }

    if (
      this.dedicatedCloudZerto.constructor.isZertoSiteWarningState(zertoState)
    ) {
      return 'warning';
    }

    if (
      this.dedicatedCloudZerto.constructor.isZertoSiteSuccessState(zertoState)
    ) {
      return 'success';
    }

    if (this.dedicatedCloudZerto.constructor.isZertoSiteInfoState(zertoState)) {
      return 'info';
    }

    return 'unknown';
  }
}
