export default class {
  $onInit() {
    return this.trackingPrefix.then((prefix) => {
      this.prefix = prefix;
    });
  }
}
