import { DOC_URL, TRACKING_TABS } from './constants';

export default class KubernetesCtrl {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
    this.TRACKING_TABS = TRACKING_TABS;
  }

  $onInit() {
    this.DOC_URL = DOC_URL;

    this.$scope.$on('changeKubernetesName', (event, displayName) => {
      this.cluster.name = displayName;
    });
  }
}
