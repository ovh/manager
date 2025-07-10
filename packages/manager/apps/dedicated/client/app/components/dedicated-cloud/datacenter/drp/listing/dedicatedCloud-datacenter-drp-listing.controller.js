import { LABELS } from '../../../dedicatedCloud.constant';

export default class {
  constructor /* @ngInject */(dedicatedCloudDrp) {
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.ZERTO = LABELS.ZERTO;
  }

  $onInit() {
    this.loadZertoMultiSite();
  }

  loadZertoMultiSite() {
    this.isLoading = true;
    this.dedicatedCloudDrp
      .getZertoMultiSite({
        serviceName: this.serviceName,
        datacenterId: this.datacenterId,
      })
      .then((response) => {
        this.zertoMultiSite = response.data;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
