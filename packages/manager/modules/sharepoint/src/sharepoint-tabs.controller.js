import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import some from 'lodash/some';
import kebabCase from 'lodash/kebabCase';

export default class SharepointTabsCtrl {
  /* @ngInject */
  constructor(
    $location,
    MicrosoftSharepointLicenseService,
    $stateParams,
    $scope,
  ) {
    this.$location = $location;
    this.sharepointService = MicrosoftSharepointLicenseService;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
  }

  $onInit() {
    this.defaultTab = 'INFORMATION';

    this.$scope.toKebabCase = kebabCase;
    this.$scope.tabs = ['INFORMATION', 'ACCOUNT', 'TASK'];

    this.$scope.setSelectedTab = (tab) => {
      if (!isEmpty(tab)) {
        this.$scope.selectedTab = tab;
      } else {
        this.$scope.selectedTab = this.defaultTab;
      }
      this.$location.search('tab', this.$scope.selectedTab);
    };

    this.sharepointService
      .getAssociatedExchangeService(this.$stateParams.exchangeId)
      .catch(() => this.$scope.tabs.splice(1, 0, 'DOMAIN'))
      .finally(() => {
        if (
          !isNull(this.$stateParams.tab) &&
          some(
            this.$scope.tabs,
            (item) => item === this.$stateParams.tab.toUpperCase(),
          )
        ) {
          this.$scope.setSelectedTab(this.$stateParams.tab.toUpperCase());
        } else {
          this.$scope.setSelectedTab(this.defaultTab);
        }
      });
  }
}
