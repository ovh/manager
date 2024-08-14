angular.module('App').controller(
  'HostingDomainAttachOrOrderCtrl',
  class HostingDomainAttachOrOrderCtrl {
    /* @ngInject */
    constructor($scope, $rootScope, $window, atInternet) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$window = $window;
      this.atInternet = atInternet;
    }

    $onInit() {
      this.model = {
        actions: {
          ORDER: 'ORDER',
          ATTACH: 'ATTACH',
        },
      };
      this.selected = {
        action: null,
      };

      this.$scope.orderDomain = () => this.orderDomain();
    }

    orderDomain() {
      this.atInternet.trackEvent({
        event: 'hosting-add-domain',
        page: 'web::hosting',
      });
      switch (this.selected.action) {
        case this.model.actions.ORDER:
          this.$window.open(this.$scope.urlDomainOrder);
          this.$scope.resetAction();
          break;
        case this.model.actions.ATTACH:
          this.$scope.setAction('multisite/add/hosting-multisite-add', {
            domains: this.$scope.domains,
          });
          break;
        default:
          break;
      }
    }
  },
);
