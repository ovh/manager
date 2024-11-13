export default class DomainContactDashboardCtrl {
  /* @ngInject */
  constructor(coreConfig, Domain) {
    this.coreConfig = coreConfig;
    this.DomainService = Domain;
    this.user = this.coreConfig.getUser();
    this.hideAdminDescription = true;
    this.loading = true;
  }

  $onInit() {
    this.DomainService.getServiceInfo(this.domainName)
      .then((data) => {
        this.domainInfos = data;
        this.isOwner = this.user.email === this.domain.whoisOwner.email;
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        this.saveError = error.message;
      });
  }

  toggleAdminDescription() {
    this.hideAdminDescription = !this.hideAdminDescription;
  }
}
