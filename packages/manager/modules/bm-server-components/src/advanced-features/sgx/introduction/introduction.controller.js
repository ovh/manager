import SgxService from '../sgx.service';

export default class {
  $onInit() {
    this.tileDocumentationUrl = SgxService.getDocumentation(
      this.user.ovhSubsidiary,
    );
  }
}
