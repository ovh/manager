import map from 'lodash/map';

export default class {
  /* @ngInject */
  constructor(
    OvhApiPackXdslDomainActivation,
    $window,
    PACK_SLOTS_DOMAIN_URL,
  ) {
    this.OvhApiPackXdslDomainActivation = OvhApiPackXdslDomainActivation;
    this.$window = $window;
    this.PACK_SLOTS_DOMAIN_URL = PACK_SLOTS_DOMAIN_URL;
  }

  getWebDomain(domainName) {
    return this.PACK_SLOTS_DOMAIN_URL.replace('{domain}', domainName);
  }

  $onInit() {
    this.services = [];

    this.loading = true;

    return this.OvhApiPackXdslDomainActivation
      .v6()
      .query({
        packId: this.pack.packName,
      })
      .$promise
      .then((services) => {
        this.services = map(
          services,
          service => ({
            name: service,
            encoded: this.$window.encodeURIComponent(service),
            tld: service.replace(/^.+\./, '.'),
          }),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
