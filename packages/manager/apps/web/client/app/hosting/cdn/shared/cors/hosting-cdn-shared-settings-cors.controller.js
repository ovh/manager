const CORS_ORIGIN_REGEX =
  '/^[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/';

export default class HostingCdnSharedCorsController {
  $onInit() {
    this.origins =
      this.cors.config.origins !== '*'
        ? this.cors.config.origins.split(',')
        : [];

    this.originRegex = CORS_ORIGIN_REGEX;

    this.domainsToRemove = [];
  }

  addDomain(domain) {
    this.origins = [...this.origins, domain];

    this.domainToAdd = null;
  }

  removeDomains(domainsToRemove) {
    this.origins = this.origins.filter(
      (domain) => !domainsToRemove.includes(domain),
    );

    this.domainsToRemove = [];
  }
}
