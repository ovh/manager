export default class {
  $onInit() {
    [this.attachedDomain] = this.attachedDomains;
    this.hasMultipleAttachedDomain = this.attachedDomains.length > 1;
  }
}
