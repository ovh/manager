import { EVENT_NAMES } from './support.constants';

export default class {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
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
}
