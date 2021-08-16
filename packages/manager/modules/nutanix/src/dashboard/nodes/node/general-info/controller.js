export default class NutanixNodeGeneralInfoCtrl {
  $onInit() {
    this.loadServer();
  }

  loadServer() {
    /* if there is no os installed, the api return "none_64" */
    if (/^none_\d{2}?$/.test(this.server.os)) {
      this.server.os = null;
    }
  }
}
