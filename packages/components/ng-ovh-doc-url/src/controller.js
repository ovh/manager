export default class {
  /* @ngInject */
  constructor(ovhDocUrl) {
    this.ovhDocUrl = ovhDocUrl;
  }

  $onInit() {
    this.url = this.ovhDocUrl.getDocUrl(this.docId);
  }
}
