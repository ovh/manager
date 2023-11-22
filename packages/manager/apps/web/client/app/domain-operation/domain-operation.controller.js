import some from 'lodash/some';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $location,
    $timeout,
    $translate,
    Alerter,
    currentActiveLink,
    domainOperationService,
    domainOperationLink,
    dnsOperationLink,
    wucExchange,
  ) {
    this.$scope = $scope;
    this.$routerParams = wucExchange.getParams();
    this.$location = $location;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Operation = domainOperationService;
    this.currentActiveLink = currentActiveLink;
    this.domainOperationLink = domainOperationLink;
    this.dnsOperationLink = dnsOperationLink;

    this.domainFilters = {
      nicOperation: null,
      operationStatus: null,
    };
    this.domainLoading = {
      filters: true,
      init: false,
    };
    this.dnsFilters = {
      nicOperation: null,
      operationStatus: null,
    };
    this.dnsLoading = {
      filters: true,
      init: false,
    };
  }

  $onInit() {
    this.getDomainModels()
      .then(() => {
        const fnFilter = this.$location.search().function;
        if (some(this.nicOperationEnum, fnFilter)) {
          this.domainFilters.nicOperation = fnFilter;
        }
        if (some(this.dnsNicOperationEnum, fnFilter)) {
          this.dnsFilters.nicOperation = fnFilter;
        }
      })
      .finally(() => {
        this.domainLoading.filters = false;
        this.dnsLoading.filters = false;
      });
  }

  getDomainModels() {
    return this.Operation.getDomainOperationModels()
      .then((models) => {
        this.nicOperationEnum =
          models.models['domain.OperationFunctionEnum'].enum;
        this.operationStatusEnum =
          models.models['domain.OperationStatusEnum'].enum;
      })
      .catch((err) =>
        this.Alerter.alertFromSWS('', err, this.$scope.alerts.main),
      );
  }
}
