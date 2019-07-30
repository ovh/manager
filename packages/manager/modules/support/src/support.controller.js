import _ from 'lodash';

import {
  EVENTS,
  STATE_NAME,
} from './support.constants';


export default class {
  /* @ngInject */
  constructor(
    $scope,
    $transitions,
  ) {
    this.$scope = $scope;
    this.$transitions = $transitions;
  }

  $onInit() {
    const transitionCriteria = {
      from: `${STATE_NAME}.**`,
    };

    this.unsubscribers = [
      this.$scope.$on(EVENTS.startLoading, () => this.startLoading()),
      this.$scope.$on(EVENTS.stopLoading, () => this.stopLoading()),
      this.$transitions.onStart(transitionCriteria, () => this.startLoading()),
      this.$transitions.onSuccess(transitionCriteria, () => this.stopLoading()),
    ];
  }

  $onDestroy() {
    _.forEach(
      this.unsubscribers,
      hook => hook(),
    );
  }

  startLoading() {
    this.isLoading = true;
  }

  stopLoading() {
    this.isLoading = false;
  }
}
