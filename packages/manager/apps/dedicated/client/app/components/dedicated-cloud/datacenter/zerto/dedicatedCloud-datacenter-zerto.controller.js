import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ROLES,
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
    this.zertoInformations = {};
    this.zertoInformations.hasDatacenterWithoutHosts =
      this.datacenterHosts.length === 0;

    this.initializeTransitions();

    this.isDisablingZerto = [
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toDisable,
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabling,
    ].includes(this.currentZerto.state);

    this.isInstallationInError =
      this.currentZerto.state === DEDICATEDCLOUD_DATACENTER_DRP_STATUS.error;

    if (!this.isDisablingZerto) {
      const zerto = this.constructor.isDeliveredOrDelivering(
        this.currentZerto.state,
      )
        ? this.currentZerto
        : null;
      const otherZertoInformations =
        zerto !== null
          ? this.formatPlanInformations(zerto)
          : this.storedZertoInformations;

      if (otherZertoInformations != null) {
        this.zertoInformations = {
          ...this.zertoInformations,
          ...otherZertoInformations,
        };

        return this.goToSummary(this.zertoInformations);
      }
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

  formatPlanInformations({
    datacenterId,
    drpType,
    localSiteInformation,
    remoteSiteInformation,
    state,
  }) {
    const currentPccInformations = this.currentService;
    const currentDatacenterInformations = this.datacenterList.find(
      ({ id }) => id === datacenterId,
    );

    let primaryPcc;
    let primaryDatacenter;
    let secondaryPcc;
    let secondaryDatacenter;
    let vpnConfiguration;

    if (localSiteInformation && remoteSiteInformation) {
      switch (localSiteInformation.role) {
        case DEDICATEDCLOUD_DATACENTER_DRP_ROLES.primary:
          primaryPcc = {
            serviceName: currentPccInformations.serviceName,
          };
          primaryDatacenter = {
            id: currentDatacenterInformations.id,
            displayName: currentDatacenterInformations.displayName,
          };
          secondaryPcc = {
            serviceName: remoteSiteInformation.serviceName,
          };
          secondaryDatacenter = {
            id: remoteSiteInformation.datacenterId,
            displayName: remoteSiteInformation.datacenterName,
          };
          break;
        case DEDICATEDCLOUD_DATACENTER_DRP_ROLES.single:
          primaryPcc = {
            serviceName: currentPccInformations.serviceName,
          };
          primaryDatacenter = {
            id: currentDatacenterInformations.id,
            displayName: currentDatacenterInformations.displayName,
          };

          vpnConfiguration = remoteSiteInformation;
          break;
        default:
          primaryPcc = {
            serviceName: remoteSiteInformation.serviceName,
          };
          primaryDatacenter = {
            id: remoteSiteInformation.datacenterId,
            displayName: remoteSiteInformation.datacenterName,
          };
          secondaryPcc = {
            serviceName: currentPccInformations.serviceName,
          };
          secondaryDatacenter = {
            id: currentDatacenterInformations.id,
            displayName: currentDatacenterInformations.displayName,
          };
          break;
      }
    }

    return {
      drpType,
      state,
      primaryPcc,
      primaryDatacenter,
      secondaryPcc,
      secondaryDatacenter,
      vpnConfiguration,
    };
  }

  static isDeliveredOrDelivering(state) {
    return [
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering,
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered,
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.provisionning,
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toProvision,
    ].includes(state);
  }
}
