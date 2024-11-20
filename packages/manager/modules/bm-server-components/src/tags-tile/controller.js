export default class BmServerComponentsTagsTileController {
  $onInit() {
    this.tags = null;
    const { tags } = this.server.iam;
    if (tags) {
      this.tags = Object.keys(tags)
        .filter((key) => !key.startsWith('ovh:'))
        .map((key) => `${key}:${tags[key]}`)

      if (tags.length > 10) {
        this.tags = [...this.tags.slice(0, 10), '...'];
      }
    }
  }
}
