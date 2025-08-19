import { DedicatedCloudDatacenterZertoService } from './dedicatedCloud-datacenter-zerto.service';
import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
} from './dedicatedCloud-datacenter-zerto.constants';

export default class {
  /* @ngInject */
  constructor($state, $transitions, $translate, Alerter, dedicatedCloudZerto) {
    this.$state = $state;
    this.$transitions = $transitions;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.dedicatedCloudZerto = dedicatedCloudZerto;
  }

  $onInit() {
    this.initializeTransitions();

    this.isDisablingZerto = DedicatedCloudDatacenterZertoService.getIsDisablingZerto(
      this.currentZerto.state,
    );

    this.isInstallationInError =
      this.currentZerto.state === DEDICATEDCLOUD_DATACENTER_DRP_STATUS.error;

    if (!this.isDisablingZerto && !!this.currentZerto.localSiteInformation) {
      return this.goToSummary(this.zertoInformations);
    }

    return null;
  }

  initializeTransitions() {
    this.$transitions.onError(
      {
        from: '**.datacenter.zerto.**.orderIp',
      },
      () => {
        this.Alerter.error(
          this.$translate.instant('ip_order_finish_error'),
          'dedicatedCloudDatacenterZertoAlert',
        );
      },
    );
  }

  selectZertoType() {
    this.zertoInformations.drpType = this.selectedZertoType.id;
    const stateToGo =
      this.zertoInformations.drpType ===
      DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
        ? 'ovh.mainPccStep'
        : 'onPremise.ovhPccStep';

    return this.goToConfiguration(this.zertoInformations, stateToGo);
  }
}
