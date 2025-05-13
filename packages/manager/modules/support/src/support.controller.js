import { EVENT_NAMES } from './support.constants';

export default class {
  /* @ngInject */
  constructor($scope, $translate, coreConfig) {
    this.$scope = $scope;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.$scope.$on(EVENT_NAMES.startLoading, () => this.startLoading());

    this.$scope.$on(EVENT_NAMES.stopLoading, () => this.stopLoading());
  }

  startLoading() {
    this.isLoading = true;
  }

  stopLoading() {
    this.isLoading = false;
  }

  descriptionOfHeading() {
    return this.coreConfig.getRegion() !== 'US'
      ? this.$translate.instant('ovhManagerSupport_description')
      : '';
  }
}
