export default class BmServerComponentsTagsTileController {
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
}
