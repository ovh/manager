import { getCriteria } from '../../project.utils';

export default class FailoverIpsController {
  /* @ngInject */
  constructor(coreURLBuilder) {
    this.FAILOVER_IPS_URL = coreURLBuilder.buildURL(
      'dedicated',
      '#/ip?serviceName=_FAILOVER&page=1',
    );
  }

  $onInit() {
    this.criteria = getCriteria('ip', this.additionalIp);
  }

  onAdditionalIpOrderClick() {
    this.trackClick('PCI_PROJECTS_FAILOVER_IP_ADD', false);
    return this.goToAdditionalIpOrderPage();
  }
}
