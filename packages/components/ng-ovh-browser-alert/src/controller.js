export default class BrowserAlertController {
  /* @ngInject */
  constructor($scope, ovhBrowserAlertService) {
    this.$scope = $scope;
    this.ovhBrowserAlertService = ovhBrowserAlertService;

    this.$scope.isSupported = this.ovhBrowserAlertService.isSupported();
    this.$scope.isDeprecated = this.ovhBrowserAlertService.isDeprecated();
  }

  dismissAlert() {
    this.$scope.isDismissed = true;
  }
}
