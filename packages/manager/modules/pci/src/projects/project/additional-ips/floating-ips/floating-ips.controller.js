export default class FloatingIpController {
  /* @ngInject */
  constructor(coreURLBuilder) {
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.IP_PAGE_LINK = this.coreURLBuilder.buildURL(
      'dedicated',
      `#/ip?serviceName=${this.projectId}&page=1`,
    );
  }

  onAddAdditionalIpClick() {
    this.trackClick('PCI_PROJECTS_FLOATING_IP_ADD', false);
    return this.goToAdditionalIpOrderPage();
  }
}
