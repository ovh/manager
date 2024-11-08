export default class BmServerComponentsTagsTileController {
  /* @ngInject */
  constructor($scope, atInternet) {
    this.atInternet = atInternet;
    this.$scope = $scope;
  }

  $onInit() {
    this.$scope.tags = null;
    const { tags } = this.server.iam;
    if (tags) {
      this.$scope.tags = Object.keys(tags).map((key) => `${key}:${tags[key]}`);

      if (tags.length > 10) {
        this.$scope.tags = [...this.$scope.tags.slice(0, 10), '...'];
      }
    }
  }
}
