import { DOC_URL } from './constants';

export default class KubernetesCtrl {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    this.DOC_URL = DOC_URL;

    this.$scope.$on('changeKubernetesName', (event, displayName) => {
      this.cluster.name = displayName;
    });
  }
}
