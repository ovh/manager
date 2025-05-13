import set from 'lodash/set';

angular.module('App').controller(
  'AddSubdomainCtrl',
  class AddSubdomainCtrl {
    /* @ngInject */
    constructor($scope, atInternet, Domain, DomainValidator) {
      this.$scope = $scope;
      this.atInternet = atInternet;
      this.Domain = Domain;
      this.DomainValidator = DomainValidator;
    }

    $onInit() {
      this.domain = this.$scope.currentActionData.domain;
      this.model = {};

      if (typeof this.$scope.currentActionData.subdomain !== 'undefined') {
        set(this.model, 'subdomain', this.$scope.currentActionData.subdomain);
        set(this.model, 'action', 'addToMutu');
      }

      this.$scope.actionRedirect = () => this.actionRedirect();
    }

    subDomainCheck(input) {
      input.$setValidity(
        'subdomain',
        this.model.subdomain === null ||
          this.model.subdomain === '' ||
          this.DomainValidator.isValidTarget(
            `${this.model.subdomain}.${this.domain.displayName}`,
            'CNAME',
          ),
      );
    }

    actionRedirect() {
      switch (this.model.action) {
        case 'redirection': {
          const domain = angular.copy(this.domain);
          domain.subdomainPreset = this.model.subdomain;
          this.atInternet.trackClick({
            name: 'domain-add-subdomain',
            type: 'action',
          });
          return this.$scope.setAction(
            'redirection/add/domain-redirection-add',
            domain,
          );
        }
        case 'addRecord':
          return this.Domain.getTabZoneDns(this.domain.name).then((zone) =>
            this.$scope.setAction('zone/record/add/domain-zone-record-add', {
              domain: this.domain,
              fieldTypes: zone.fieldsTypes,
              subdomainPreset: this.model.subdomain,
            }),
          );
        case 'addToMutu':
          return this.$scope.setAction(
            'subdomain/add/domain-subdomain-add-hosting-choice',
            { domain: this.domain, subdomain: this.model.subdomain },
          );
        default:
          return null;
      }
    }
  },
);
