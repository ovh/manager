import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';

import template from './delete/dedicatedCloud-datacenter-drp-confirmationStep-delete.html';

export default class {
  /* @ngInject */
  constructor(
    $q, $state, $stateParams, $translate, $uibModal, $window,
    Alerter, DedicatedCloudDrp, OvhApiMe, ovhUserPref,
    DEDICATED_CLOUD_CONSTANTS,
    DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS,
    DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
    DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
    DEDICATEDCLOUD_DATACENTER_ZERTO,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.$window = $window;
    this.Alerter = Alerter;
    this.DedicatedCloudDrp = DedicatedCloudDrp;
    this.OvhApiMe = OvhApiMe;
    this.ovhUserPref = ovhUserPref;
    this.PCC_NEW_GENERATION = DEDICATED_CLOUD_CONSTANTS.pccNewGeneration;
    this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS;
    this.DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
    this.DEDICATEDCLOUD_DATACENTER_ZERTO = DEDICATEDCLOUD_DATACENTER_ZERTO;
  }

  $onInit() {
    this.isLoading = true;
    this.drpInformations = this.$stateParams.drpInformations;
    const { state } = this.drpInformations;
    const otherPccInformations = this.getOtherPccInformations();

    return this.$q.all({
      enableDrp: [
        this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered,
        this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering,
        this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.provisionning,
        this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toProvision,
      ].includes(state)
        ? this.$q.when({ state })
        : this.DedicatedCloudDrp.enableDrp(
          this.drpInformations,
          this.drpInformations.primaryPcc.generation !== this.PCC_NEW_GENERATION,
        ),
      me: this.OvhApiMe.v6().get().$promise,
      secondaryPccState: isUndefined(otherPccInformations.serviceName)
        ? this.$q.when({})
        : this.DedicatedCloudDrp.getDrpState(otherPccInformations),
    })
      .then(({ enableDrp, me, secondaryPccState }) => {
        const drpState = get(enableDrp, 'data.state', enableDrp.state);
        if ([
          this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toDo,
          this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivering,
        ].includes(drpState)) {
          this.isEnabling = true;

          if (enableDrp.url !== undefined) {
            this.storeZertoOptionOrderInUserPref(this.drpInformations, enableDrp);
            if (!enableDrp.hasAutoPay) {
              this.$window.open(enableDrp.url, '_blank');
            }
          }
        }

        this.email = me.email;
        this.deleteActionAvailable = secondaryPccState
          .state === this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered;

        if (state === this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered) {
          this.Alerter.success(`
            ${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_success_part_one')} ${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_success_part_two', { email: this.email })}
          `, 'dedicatedCloudDatacenterDrpAlert');
        }
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_error')} ${get(error, 'data.message', error.message)}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  storeZertoOptionOrderInUserPref(drpInformations, enableDrp) {
    const drpInformationsToStore = {
      drpInformations,
      zertoOptionOrderId: enableDrp.orderId,
      zertoOption: drpInformations.drpType === this.DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
        ? this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.ovh
        : this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS.zertoOption.onPremise,
    };

    const { splitter } = this.DEDICATEDCLOUD_DATACENTER_ZERTO;
    const [, ...[formattedServiceName]] = drpInformations.primaryPcc.serviceName.split(splitter);
    const preferenceKey = `${this.DEDICATEDCLOUD_DATACENTER_ZERTO.title}_${formattedServiceName.replace(/-/g, '')}`;

    return this.ovhUserPref.create(preferenceKey, drpInformationsToStore);
  }

  getOtherPccInformations() {
    const primaryOptions = {
      serviceName: get(this.drpInformations, 'primaryPcc.serviceName'),
      datacenterId: get(this.drpInformations, 'primaryDatacenter.id'),
    };

    const secondaryOptions = {
      serviceName: get(this.drpInformations, 'secondaryPcc.serviceName'),
      datacenterId: get(this.drpInformations, 'secondaryDatacenter.id'),
    };

    return [primaryOptions, secondaryOptions]
      .find(({ serviceName }) => serviceName !== this.$stateParams.productId);
  }

  regenerateZsspPassword() {
    this.generatingPassword = true;
    return this.DedicatedCloudDrp.regenerateZsspPassword(this.drpInformations)
      .then(() => {
        this.Alerter.success(`
          ${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_create_success_part_two', { email: this.email })}
        `, 'dedicatedCloudDatacenterDrpAlert');
      })
      .catch((error) => {
        this.Alerter.error(`${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_zssp_password_regenerate_error')} ${get(error, 'message', '')}`, 'dedicatedCloudDatacenterDrpAlert');
      })
      .finally(() => {
        this.generatingPassword = false;
      });
  }

  deleteDrpModal() {
    this.$uibModal.open({
      template,
      controller: 'DedicatedCloudDatacenterDrpConfirmationStepDeleteCtrl',
      controllerAs: '$ctrl',
    }).result
      .then(() => this.DedicatedCloudDrp.disableDrp(this.drpInformations))
      .then(() => {
        this.Alerter.success(this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_delete_drp_success'), 'dedicatedCloudDatacenterAlert');
        return this.$state.go('app.dedicatedClouds.datacenter');
      })
      .catch((error) => {
        if (error != null) {
          this.Alerter.error(this.$translate.instant(`${this.$translate.instant('dedicatedCloud_datacenter_drp_confirm_delete_drp_error')} ${get(error, 'message', '')}`), 'dedicatedCloudDatacenterDrpAlert');
        }
      });
  }

  isProvisionning() {
    return [
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.toProvision,
      this.DEDICATEDCLOUD_DATACENTER_DRP_STATUS.provisionning,
    ].includes(this.drpInformations.state);
  }
}
