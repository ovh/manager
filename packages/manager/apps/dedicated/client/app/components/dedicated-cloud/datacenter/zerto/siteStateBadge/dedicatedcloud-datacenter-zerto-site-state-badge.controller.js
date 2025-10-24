import { DedicatedCloudDatacenterZertoService } from '../dedicatedCloud-datacenter-zerto.service';

export default class {
  $onInit() {
    this.zertoSiteByState = DedicatedCloudDatacenterZertoService.computeZertoSiteByState(
      this.zertoMultiSites,
    );
  }
}
