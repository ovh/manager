angular
  .module('Module.sharepoint.controllers')
  .controller('SharepointTabsCtrl', class SharepointTabsCtrl {
    constructor($location, MicrosoftSharepointLicenseService, $stateParams, $scope) {
      this.$location = $location;
      this.sharepointService = MicrosoftSharepointLicenseService;
      this.$stateParams = $stateParams;
      this.$scope = $scope;
    }

    $onInit() {
      this.defaultTab = 'INFORMATION';

      this.$scope.toKebabCase = _.kebabCase;
      this.$scope.tabs = ['INFORMATION', 'ACCOUNT', 'TASK'];


      this.$scope.setSelectedTab = (tab) => {
        if (!_.isEmpty(tab)) {
          this.$scope.selectedTab = tab;
        } else {
          this.$scope.selectedTab = this.defaultTab;
        }
        this.$location.search('tab', this.$scope.selectedTab);
      };

      this.sharepointService.getAssociatedExchangeService(this.$stateParams.exchangeId)
        .catch(() => this.$scope.tabs.splice(1, 0, 'DOMAIN'))
        .finally(() => {
          if (!_.isNull(this.$stateParams.tab)
            && _.some(
              this.$scope.tabs,
              item => item === angular.uppercase(this.$stateParams.tab),
            )) {
            this.$scope.setSelectedTab(angular.uppercase(this.$stateParams.tab));
          } else {
            this.$scope.setSelectedTab(this.defaultTab);
          }
        });
    }
  });
