import {
  JSPLUMB_INSTANCE_OPTIONS,
  JSPLUMB_CONNECTIONS_OPTIONS,
  JSPLUMB_ENDPOINTS_OPTIONS,
} from './number.constants';

export default class TelephonyNumberCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $translate,
    $translatePartialLoader,
    atInternet,
    autoScrollOnToggle,
    tucJsPlumbService,
    TucToast,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.$translatePartialLoader = $translatePartialLoader;
    this.atInternet = atInternet;
    this.autoScrollOnToggle = autoScrollOnToggle;
    this.tucJsPlumbService = tucJsPlumbService;
    this.TucToast = TucToast;
    this.jsPlumbInstanceOptions = JSPLUMB_INSTANCE_OPTIONS;
    this.jsPlumbEndpointsOptions = JSPLUMB_ENDPOINTS_OPTIONS;
    this.jsPlumbConnectionsOptions = JSPLUMB_CONNECTIONS_OPTIONS;
  }

  $onInit() {
    this.loading = {
      init: true,
      feature: false,
      translations: false,
      save: false,
    };

    this.saveFeature = angular.noop;
    this.jsPlumbInstance = null;

    this.verticalLayout = true;
    this.reorderingMode = false;

    this.$scope.$on('dialplan.extensions.loaded', () => {
      this.dialplanLoaded = true;
    });

    return this.$q
      .all([this.getTranslations(), this.tucJsPlumbService.initJsPlumb()])
      .finally(() => {
        this.loading.init = false;
      });
  }

  $onDestroy() {
    this.number.stopEdition(true, true);
  }

  saveNumber() {
    this.loading.save = true;

    if (this.number.getFeatureFamily() === 'ovhPabx') {
      return this.$q.when(this.number);
    }

    return this.number
      .save()
      .then(() => {
        // number is saved - stop its edition only
        this.number.stopEdition().startEdition();

        // resolve save defered to tell feature sub component to launch feature save
        return this.saveFeature();
      })
      .catch((err) => new this.TucToastError(err))
      .finally(() => {
        this.isLoading = false;
      });
  }

  getTranslations() {
    this.loading.translations = true;

    this.$translatePartialLoader.addPart(
      '../components/telecom/telephony/group/number',
    );
    if (this.number.getFeatureFamily() === 'conference') {
      this.$translatePartialLoader.addPart(
        '../components/telecom/telephony/group/number/feature/conference',
      );
    }
    return this.$translate.refresh().finally(() => {
      this.loading.translations = false;
    });
  }

  toggleCcsLayout() {
    this.verticalLayout = !this.verticalLayout;
    this.atInternet.trackClick({
      name: `ccs::change-layout::to-${
        this.verticalLayout ? 'vertical' : 'horizontal'
      }`,
      type: 'action',
    });
  }

  validateReorderSteps() {
    this.reorderingMode = false;
  }
}
