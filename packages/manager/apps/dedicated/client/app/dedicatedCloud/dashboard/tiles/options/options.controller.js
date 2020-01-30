import get from 'lodash/get';

import OptionsBindings from './models/bindings/bindings';

export default class Options {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    Alerter,
    dedicatedCloudDrp,
    ovhManagerPccDashboardOptionsService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.ovhManagerPccDashboardOptionsService = ovhManagerPccDashboardOptionsService;
  }

  $onInit() {
    // used for calculations before passing to bindings
    this.model = {
      currentUser: this.currentUser,
      currentService: this.currentService,
      options: {
        basic: undefined,
      },
      pendingOrder: {
        exists: undefined,
        status: undefined,
      },
      servicePacks: {
        // all the service packs the API can associate to this service
        all: undefined,
        current: undefined,
        // the service pack the user has ordered
        ordered: undefined,
        // all the service packs the user can potentially order
        orderable: {
          // the orderable service packs with a certification
          withACertification: undefined,
          // the orderable service packs with no certification (only basic options)
          withOnlyBasicOptions: undefined,
        },
      },
    };

    this.bindings = new OptionsBindings();

    return this.handleInitialData();
  }

  handleInitialData() {
    this.bindings.isLoading = true;

    return this.ovhManagerPccDashboardOptionsService
      .getInitialData(
        this.currentService.name,
        this.currentUser.ovhSubsidiary,
        this.currentService.servicePackName,
      )
      .then((model) => {
        this.model = model;
        this.model.currentUser = this.currentUser;
        this.model.currentService = this.currentService;

        this.model.drp = {
          currentDrp: this.currentDrp,
          datacenterList: this.datacenterList,
          drpGlobalStatus: this.drpGlobalStatus,

          goToDrp: this.goToDrp,
          goToDrpDatacenterSelection: this.goToDrpDatacenterSelection,
          goToVpnConfiguration: this.goToVpnConfiguration,

          isDrpActionPossible: this.isDrpActionPossible,
          isDrpAvailable: this.isDrpAvailable,

          service: this.dedicatedCloudDrp,
        };

        this.bindings.update(model);
      })
      .catch((error) => {
        const errorMessage = get(error.data, 'message', error.data);

        this.Alerter.error(
          `${this.$translate.instant(
            'ovhManagerPccDashboardOptions_handleInitialData_error',
          )}${errorMessage ? ` (${errorMessage})` : ''}`,
          'dedicatedCloud',
        );
      })
      .finally(() => {
        this.bindings.isLoading = false;
      });
  }
}
