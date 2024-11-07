export default class BmServerComponentsUnassignTagsController {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.loading = false;
  }
}
