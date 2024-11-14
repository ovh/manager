export default class BmServerComponentsTagsTileController {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  $onInit() {
    this.tags = null;
    const { tags } = this.server.iam;
    if (tags) {
      this.tags = Object.keys(tags).map((key) => `${key}:${tags[key]}`);

      if (tags.length > 10) {
        this.tags = [...this.tags.slice(0, 10), '...'];
      }
    }
  }

  goToTags() {
    this.$state.go('app.dedicated-server.server.tags');
  }
}
