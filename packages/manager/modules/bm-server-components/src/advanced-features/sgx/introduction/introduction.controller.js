import SgxService from '../sgx.service';

export default class {
  $onInit() {
    this.trackPage(this.sgxTrackingPrefix);

    this.tileDocumentationUrl = SgxService.getDocumentation(
      this.user.ovhSubsidiary,
    );

    this.trackingDocumentation = `${this.sgxTrackingPrefix}::go-to-documentation`;
  }
}
