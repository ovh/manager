import { DOMAINS_REPRICING, PRODUCT_TYPE_DOMAIN } from './dashboard.constants';

export default class DashboardController {
  $onInit() {
    this.hasDomainRepricing = false;

    // Check if the tld of domains are present in the list affected by the domain repricing MANAGER-9696.
    this.products
      .then((elm) =>
        elm.find((item) => item.productType === PRODUCT_TYPE_DOMAIN),
      )
      .then((domains) => {
        this.hasDomainRepricing = !!domains?.data?.find((domain) => {
          const domainName = domain.resource.name;
          const tld = domainName.slice(domainName.lastIndexOf('.') + 1);
          return DOMAINS_REPRICING.includes(tld);
        });
      });

    return this.trackingPrefix.then((prefix) => {
      this.prefix = prefix;
    });
  }
}
