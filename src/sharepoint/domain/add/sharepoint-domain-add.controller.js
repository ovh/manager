angular
  .module('Module.sharepoint.controllers')
  .controller('SharepointAddDomainController', class SharepointAddDomainController {
    constructor(
      $scope,
      $stateParams,
      $translate,
      Alerter,
      MicrosoftSharepointLicenseService,
      OvhApiDomain,
      WucValidator,
    ) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.alerter = Alerter;
      this.sharepointService = MicrosoftSharepointLicenseService;
      this.OvhApiDomain = OvhApiDomain;
      this.validatorService = WucValidator;
    }

    $onInit() {
      this.punycode = window.punycode;

      this.loading = true;
      this.domainType = 'ovhDomain';
      this.model = {
        name: '',
        displayName: null,
      };

      this.$scope.addDomain = () => this.addDomain();

      this.loadDomainData();
    }

    loadDomainData() {
      this.loading = true;

      return this.OvhApiDomain.v6()
        .query()
        .$promise
        .then(domains => _.sortBy(_.map(domains, domain => ({
          name: domain,
          displayName: this.punycode.toUnicode(domain),
          type: 'DOMAIN',
        })), 'displayName'))
        .then(domains => this.prepareData(domains))
        .catch(err => this.alerter.alertFromSWS(this.$translate.instant('sharepoint_add_domain_error_message_text'), err, this.$scope.alerts.main))
        .finally(() => { this.loading = false; });
    }

    prepareData(data) {
      const domains = _.filter(data, item => item.type === 'DOMAIN');

      return this.sharepointService.getUsedUpnSuffixes()
        .then((upnSuffixes) => {
          _.remove(domains, domain => _.indexOf(upnSuffixes, domain.name) >= 0);
        })
        .finally(() => {
          this.availableDomains = domains;
          this.availableDomainsBuffer = _.clone(this.availableDomains);
        });
    }

    resetSearchValue() {
      this.search.value = null;
      this.availableDomains = _.clone(this.availableDomainsBuffer);
    }

    resetName() {
      if (!_.isUndefined(this.search) && _.has(this.search, 'value')) {
        this.availableDomains = _.filter(
          this.availableDomainsBuffer,
          n => n.displayName.search(this.search.value) > -1,
        );
      }

      this.model.displayName = null;
      this.model.name = '';
    }

    changeName() {
      this.model.name = this.punycode.toASCII(this.model.displayName);

      // URL validation based on http://www.regexr.com/39nr7
      this.domainValid = this.validatorService.isValidURL(this.model.name);
    }

    addDomain() {
      return this.sharepointService
        .addSharepointUpnSuffixe(this.$stateParams.exchangeId, this.model.name)
        .then(() => this.alerter.success(this.$translate.instant('sharepoint_add_domain_confirm_message_text', { t0: this.model.displayName }), this.$scope.alerts.main))
        .catch(err => this.alerter.alertFromSWS(this.$translate.instant('sharepoint_add_domain_error_message_text'), err, this.$scope.alerts.main))
        .finally(() => {
          this.$scope.resetAction();
        });
    }
  });
