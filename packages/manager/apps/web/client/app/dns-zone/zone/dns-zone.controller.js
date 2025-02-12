import punycode from 'punycode';

export default class DnsZoneCtrl {
  /**
   * Constructor
   * @param $scope
   * @param $stateParams
   * @param $timeout
   * @param Alerter
   * @param Domain
   * @param currentSection
   */
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $timeout,
    $translate,
    Alerter,
    capabilities,
    Domain,
    contactManagementLink,
    currentSection,
    emailLink,
    isEmailDomainAvailable,
    constants,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.capabilities = capabilities;
    this.contactManagementLink = contactManagementLink;
    this.Domain = Domain;
    this.currentSection = currentSection;
    this.emailLink = emailLink;
    this.isEmailDomainAvailable = isEmailDomainAvailable;
    this.constants = constants;
  }

  $onInit() {
    this.loading = {
      domainsInfos: false,
    };
    this.stepPath = '';

    this.$scope.alerts = { page: 'domain_alert_page' };
    this.$scope.currentAction = null;
    this.$scope.currentActionData = null;
    this.$scope.currentSection = this.currentSection;

    this.$scope.resetAction = () => this.$scope.setAction(false);

    this.$scope.setAction = (action, data) => {
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data;

      if (action) {
        this.stepPath = `domain/${this.$scope.currentAction}.html`;
        $('#currentAction').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        this.$scope.currentActionData = null;
        this.$timeout(() => {
          this.stepPath = '';
        }, 300);
      }
    };

    this.loadDomain();
  }

  loadDomain() {
    this.loading.domainsInfos = true;
    this.Domain.getTabZoneDns(this.$stateParams.productId, 1)
      .then((tabZone) => {
        if (tabZone) {
          this.hasZoneDns = true;
        }

        this.domain = {
          name: this.$stateParams.productId,
          displayName: this.$stateParams.productId,
        };

        return this.Domain.getZoneByZoneName(this.domain.name).then(
          (zoneInfos) => {
            this.domain.nameServers = zoneInfos.nameServers;
            return this.domain;
          },
        );
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('domain_dashboard_loading_error'),
          err,
          this.$scope.alerts.page,
        ),
      )
      .finally(() => {
        this.loading.domainsInfos = false;
      });
  }

  static convertToPunycode(domain) {
    return punycode.toUnicode(domain);
  }
}
