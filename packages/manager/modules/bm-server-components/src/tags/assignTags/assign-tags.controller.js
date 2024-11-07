export default class BmServerComponentsAssignTagsController {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.loading = false;
  }
}
