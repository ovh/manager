import {
  DEDICATEDCLOUD_DATACENTER_DRP_ROLES,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_ZERTO,
} from './dedicatedCloud-datacenter-drp.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    $transitions,
    $translate,
    Alerter,
    DedicatedCloudDrp,
    ovhPaymentMethod,
    ovhUserPref,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$transitions = $transitions;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.DedicatedCloudDrp = DedicatedCloudDrp;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.ovhUserPref = ovhUserPref;
    this.DEDICATEDCLOUD_DATACENTER_DRP_ROLES = DEDICATEDCLOUD_DATACENTER_DRP_ROLES;
    this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
    this.DEDICATEDCLOUD_DATACENTER_ZERTO = DEDICATEDCLOUD_DATACENTER_ZERTO;
  }

  $onInit() {
    this.loading = true;
    this.selectedDrpType = { id: this.$stateParams.selectedDrpType };
    this.drpInformations = { };
    this.drpInformations.hasDatacenterWithoutHosts = this.datacenterHosts.length === 0;

    this.initializeTransitions();

    const drp = this.pccPlan
      .find(({ state }) => this.isDeliveredOrDelivering(state));

    this.isDisablingDrp = this.pccPlan
      .some(({ state }) => [
        this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toDisable,
        this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabling,
      ].includes(state));

    return this.checkForZertoOptionOrder()
      .then((storedDrpInformations) => {
        if (!this.isDisablingDrp) {
          const otherDrpInformations = drp != null
            ? this.formatPlanInformations(drp)
            : storedDrpInformations;

          if (otherDrpInformations != null) {
            this.drpInformations = {
              ...this.drpInformations,
              ...otherDrpInformations,
            };

            return this.$state.go(`app.dedicatedClouds.datacenter.drp.${this.drpInformations.drpType}.confirmationStep`, {
              drpInformations: this.drpInformations,
            });
          }
        }

        return this.$q.when();
      })
      .catch((error) => {
        this.Alerter.error(
          `${this.$translate.instant('dedicatedCloud_datacenter_drp_get_state_error')} ${_.get(error, 'data.message', error.message)}`,
          'dedicatedCloudDatacenterAlert',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  checkForZertoOptionOrder() {
    let storedZertoOption;

    const { splitter } = this.DEDICATEDCLOUD_DATACENTER_ZERTO;
    const [, ...[formattedServiceName]] = this.$stateParams.productId.split(splitter);
    const preferenceKey = `${this.DEDICATEDCLOUD_DATACENTER_ZERTO.title}_${formattedServiceName.replace(/-/g, '')}`;

    return this.ovhUserPref.getValue(preferenceKey)
      .then(({ drpInformations, zertoOptionOrderId }) => {
        if (drpInformations != null
            && drpInformations.primaryPcc.serviceName === this.$stateParams.productId) {
          storedZertoOption = drpInformations;
          return this.DedicatedCloudDrp.getZertoOptionOrderStatus(zertoOptionOrderId);
        }

        return this.$q.when({});
      })
      .then(({ status: zertoOrderStatus }) => {
        const pendingOrderStatus = [
          this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering,
          this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered,
        ].find(status => status === zertoOrderStatus);

        return pendingOrderStatus != null
          ? { ...storedZertoOption, state: pendingOrderStatus }
          : this.$q.when(null);
      })
      .catch(error => (error.status === 404 ? this.$q.when(null) : this.$q.reject(error)));
  }

  initializeTransitions() {
    this.$transitions.onError({
      from: 'app.dedicatedClouds.datacenter.drp.**.orderIp',
    }, () => {
      this.Alerter.error(this.$translate.instant('ip_order_finish_error'), 'dedicatedCloudDatacenterDrpAlert');
    });
  }

  selectDrpType() {
    this.drpInformations.drpType = this.selectedDrpType.id;
    return this.$state.go(`app.dedicatedClouds.datacenter.drp.${this.selectedDrpType.id}.mainPccStep`, {
      drpInformations: this.drpInformations,
    });
  }

  isDeliveredOrDelivering(state) {
    return [
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering,
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered,
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.provisionning,
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toProvision,
    ].includes(state);
  }

  formatPlanInformations({
    datacenterId, drpType, localSiteInformation, remoteSiteInformation, serviceName, state,
  }) {
    const currentPccInformations = _.find(this.pccList, { serviceName });
    const currentDatacenterInformations = this.datacenterList.find(({ id }) => id === datacenterId);

    let primaryPcc;
    let primaryDatacenter;
    let secondaryPcc;
    let secondaryDatacenter;

    if (localSiteInformation && remoteSiteInformation) {
      if (localSiteInformation.role === this.DEDICATEDCLOUD_DATACENTER_DRP_ROLES.primary) {
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
      } else {
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
      }
    }

    return {
      drpType,
      state,
      primaryPcc,
      primaryDatacenter,
      secondaryPcc,
      secondaryDatacenter,
    };
  }
}
