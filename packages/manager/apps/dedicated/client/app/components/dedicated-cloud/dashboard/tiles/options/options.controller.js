import get from 'lodash/get';
import { SNC_LABEL } from './options.constants';
import { LABELS } from '../../../dedicatedCloud.constant';
import { DedicatedCloudDatacenterZertoService } from '../../../datacenter/zerto/dedicatedCloud-datacenter-zerto.service';

export default class Options {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    Alerter,
    atInternet,
    dedicatedCloudZerto,
    ovhFeatureFlipping,
    ovhManagerPccDashboardOptionsModelBindings,
    ovhManagerPccDashboardOptionsService,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.atInternet = atInternet;
    this.dedicatedCloudZerto = dedicatedCloudZerto;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.ovhManagerPccDashboardOptionsService = ovhManagerPccDashboardOptionsService;
    this.bindings = ovhManagerPccDashboardOptionsModelBindings;
    this.SNC_LABEL = SNC_LABEL;
    this.LABELS = LABELS;
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
    this.zertoSiteByState = DedicatedCloudDatacenterZertoService.computeZertoSiteByState(
      this.zertoMultiSites,
    );

    const feature = 'dedicated-cloud:sectorSpecificCompliance';
    return this.$q
      .all({
        featureAvailability: this.ovhFeatureFlipping.checkFeatureAvailability(
          `${feature},${feature}:enable-compliance`,
        ),
        init: this.handleInitialData(),
      })
      .then(({ featureAvailability }) => {
        this.canManageSectorSpecificCompliance = featureAvailability.isFeatureAvailable(
          feature,
        );
        this.canEnableSectorSpecificCompliance = featureAvailability.isFeatureAvailable(
          `${feature}:enable-compliance`,
        );
      });
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

        this.model.zerto = {
          currentZerto: this.currentZerto,
          datacenterList: this.datacenterList,
          zertoGlobalStatus: this.zertoGlobalStatus,

          goToZerto: this.goToZerto,
          goToZertoDatacenterSelection: this.goToZertoDatacenterSelection,
          goToVpnConfiguration: this.goToVpnConfiguration,

          isZertoActionPossible: this.isZertoActionPossible,

          service: this.dedicatedCloudZerto,
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

  onGoToBasicOptionsUpgrade(stateParams) {
    this.atInternet.trackClick({
      name: 'dedicated::dedicatedCloud::details::dashboard::modify-options',
      type: 'action',
    });
    return this.onBasicOptionsUpgrade(stateParams);
  }
}
