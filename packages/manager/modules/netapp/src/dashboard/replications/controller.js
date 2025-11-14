export default class OvhManagerNetAppReplicationsCtrl {
  /* @ngInject */
  constructor($http, $q, $translate) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
  }

  $onInit() {
    this.replications = this.getShareReplication;
  }
}
