import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ROLES,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
} from './dedicatedCloud-datacenter-drp.constants';

export default class {
  /* @ngInject */
  constructor($state, $transitions, $translate, Alerter, dedicatedCloudDrp) {
    this.$state = $state;
    this.$transitions = $transitions;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
  }

  $onInit() {
    this.drpInformations = {};
    this.drpInformations.hasDatacenterWithoutHosts =
      this.datacenterHosts.length === 0;

    this.initializeTransitions();

    this.isDisablingDrp = [
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toDisable,
      DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabling,
    ].includes(this.currentDrp.state);

    this.isInstallationInError =
      this.currentDrp.state === DEDICATEDCLOUD_DATACENTER_DRP_STATUS.error;

    if (!this.isDisablingDrp) {
      const drp = this.constructor.isDeliveredOrDelivering(
        this.currentDrp.state,
      )
        ? this.currentDrp
        : null;
      const otherDrpInformations =
        drp !== null
          ? this.formatPlanInformations(drp)
          : this.storedDrpInformations;

      if (otherDrpInformations != null) {
        this.drpInformations = {
          ...this.drpInformations,
          ...otherDrpInformations,
        };

        return this.goToSummary(this.drpInformations);
      }
    }

    return null;
  }

  initializeTransitions() {
    this.$transitions.onError(
      {
        from: '**.datacenter.drp.**.orderIp',
      },
      () => {
        this.Alerter.error(
          this.$translate.instant('ip_order_finish_error'),
          'dedicatedCloudDatacenterDrpAlert',
        );
      },
    );
  }

  selectDrpType() {
    this.drpInformations.drpType = this.selectedDrpType.id;
    const stateToGo =
      this.drpInformations.drpType === DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
        ? 'ovh.mainPccStep'
        : 'onPremise.ovhPccStep';

    return this.goToConfiguration(this.drpInformations, stateToGo);
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
            formattedName: currentDatacenterInformations.formattedName,
          };
          secondaryPcc = {
            serviceName: remoteSiteInformation.serviceName,
          };
          secondaryDatacenter = {
            id: remoteSiteInformation.datacenterId,
            formattedName: remoteSiteInformation.datacenterName,
          };
          break;
        case DEDICATEDCLOUD_DATACENTER_DRP_ROLES.single:
          primaryPcc = {
            serviceName: currentPccInformations.serviceName,
          };
          primaryDatacenter = {
            id: currentDatacenterInformations.id,
            formattedName: currentDatacenterInformations.formattedName,
          };

          vpnConfiguration = remoteSiteInformation;
          break;
        default:
          primaryPcc = {
            serviceName: remoteSiteInformation.serviceName,
          };
          primaryDatacenter = {
            id: remoteSiteInformation.datacenterId,
            formattedName: remoteSiteInformation.datacenterName,
          };
          secondaryPcc = {
            serviceName: currentPccInformations.serviceName,
          };
          secondaryDatacenter = {
            id: currentDatacenterInformations.id,
            formattedName: currentDatacenterInformations.formattedName,
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
