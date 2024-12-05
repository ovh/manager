export default class {
  /* @ngInject */
  constructor($http, coreConfig) {
    this.$http = $http;
    this.coreConfig = coreConfig;
  }
}
