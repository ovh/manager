import { RTM_WARNING_VALUE } from '../../vps-dashboard.constants';

export default class VpsDashboardTileConfigurationCtrl {
  $onInit() {
    // @TODO: create a VPS model and manage that logic in it
    this.isMaxEliteVcore = this.vps.vcore === 8;
    this.isMaxEliteRam = this.isMaxEliteVcore && this.vps.ram.value === 32;
    this.isMaxEliteStorage =
      this.isMaxEliteVcore && this.stateVps.model.disk === 640;
    this.isVpsStarter = this.stateVps.model.name.indexOf('starter') >= 0;
  }

  isCpuUsageNormal() {
    return this.statistics.cpu < RTM_WARNING_VALUE.min;
  }

  isCpuUsageWarning() {
    return (
      this.statistics.cpu >= RTM_WARNING_VALUE.min &&
      this.statistics.cpu <= RTM_WARNING_VALUE.max
    );
  }

  isCpuUsageHigh() {
    return this.statistics.cpu > RTM_WARNING_VALUE.max;
  }
}
