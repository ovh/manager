import kebabCase from 'lodash/kebabCase';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import some from 'lodash/some';
import toUpper from 'lodash/toUpper';

export default class MicrosoftOfficeLicenseTabsCtrl {
  /* @ngInject */
  constructor($location, $scope, $stateParams) {
    this.$location = $location;
    this.$scope = $scope;
    this.$stateParams = $stateParams;

    this.defaultTab = 'USER';
  }

  $onInit() {
    this.$scope.toKebabCase = kebabCase;
    this.$scope.tabs = ['USER', 'CONSUMPTION'];

    this.$scope.setSelectedTab = (tab) => {
      if (!isEmpty(tab)) {
        this.$scope.selectedTab = tab;
      } else {
        this.$scope.selectedTab = this.defaultTab;
      }
      this.$location.search('tab', this.$scope.selectedTab);
    };

    if (
      !isNull(this.$stateParams.tab) &&
      some(this.$scope.tabs, (item) => item === toUpper(this.$stateParams.tab))
    ) {
      this.$scope.setSelectedTab(toUpper(this.$stateParams.tab));
    } else {
      this.$scope.setSelectedTab(this.defaultTab);
    }
  }
}
