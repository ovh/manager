export default class WebPaasStatusCtrl {
  isLicenseStatus() {
    return typeof this.userList !== 'undefined';
  }
}
