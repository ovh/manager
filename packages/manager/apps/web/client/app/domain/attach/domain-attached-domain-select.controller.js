import isArray from 'lodash/isArray';

angular.module('App').controller(
  'DomainAttachedDomainSelectCtrl',
  class DomainAttachedDomainSelectCtrl {
    /* @ngInject */
    constructor(
      $scope,
      $rootScope,
      $stateParams,
      $timeout,
      HostingDomain,
      Navigator,
    ) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$stateParams = $stateParams;
      this.$timeout = $timeout;
      this.HostingDomain = HostingDomain;
      this.Navigator = Navigator;
    }

    $onInit() {
      this.domainName = this.$stateParams.productId;
      this.loading = false;
      this.$scope.goToHosting = () => this.goToHosting();
      this.$scope.addDomain = () => this.addDomain();

      this.getAttachedDomains();
    }

    getAttachedDomains() {
      this.loading = true;
      this.hosting = this.$scope.currentActionData.hosting;
      return this.HostingDomain.getAttachedDomains(
        this.$scope.currentActionData.hosting,
      )
        .then((data) => {
          if (isArray(data) && data.length > 0) {
            this.attachedDomains = data;
            [this.selectedAttachedDomain] = this.attachedDomains;
          } else {
            this.$scope.resetAction();
          }
        })
        .catch(() => this.$scope.resetAction())
        .finally(() => {
          this.loading = false;
        });
    }

    addDomain() {
      this.HostingDomain.addDomain(
        this.$scope.currentActionData.domain?.name,
        this.$scope.currentActionData.subdomain,
        './',
        true,
        true,
        'NONE',
        null,
        'NONE',
        null,
        true,
        null,
        this.$scope.currentActionData.hosting,
      ).then(() => {
        this.goToHosting();
      });
    }

    goToHosting() {
      this.$scope.resetAction();
      this.$timeout(() => {
        this.$rootScope.$broadcast('leftNavigation.selectProduct.fromName', {
          name: this.selectedAttachedDomain,
          type: 'HOSTING',
        });
        this.Navigator.navigate(
          `configuration/hosting/${this.hosting}/multisite`,
        );
      }, 500);
    }
  },
);
