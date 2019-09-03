import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import snakeCase from 'lodash/snakeCase';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $stateParams,
    $timeout,
    $translate,
    $uibModal,
    Alerter,
    coreConfig,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.allowDedicatedServerComplianceOptions = this.coreConfig.getRegion() !== 'US';

    this.setAction = (action, data) => this.$scope.$parent.setAction(action, data);
  }

  openModalToEditDescription() {
    return this.$uibModal
      .open({
        animation: true,
        templateUrl: 'components/name-edition/name-edition.html',
        controller: 'NameEditionCtrl',
        controllerAs: '$ctrl',
        resolve: {
          data: () => ({
            contextTitle: 'dedicatedCloud_description',
            productId: this.$stateParams.productId,
            successText: this.$translate.instant('dedicatedCloud_dashboard_nameModifying_success'),
            value: this.currentService.description,
          }),
        },
      }).result;
  }

  buildDescription() {
    const productName = this.$translate.instant(`dedicatedCloud_type_${this.currentService.solution}`);
    const versionDisplayValue = this.currentService.solution === 'VSPHERE' && this.currentService.version
      ? ` ${this.currentService.version.major}`
      : '';

    return `${productName}${versionDisplayValue}`;
  }

  getUserAccessPolicyLabel() {
    const policy = this.currentService.userAccessPolicy;
    const formattedPolicy = snakeCase(policy).toUpperCase();

    return isString(formattedPolicy) && !isEmpty(formattedPolicy)
      ? this.$translate.instant(`dedicatedCloud_user_access_policy_${formattedPolicy}`)
      : '-';
  }
}
