export default class {
    constructor ($scope, browserAlertService) {
        "ngInject";

        this.alertSvc = browserAlertService;
        this.$scope = $scope;

        this.$scope.isSupported = this.alertSvc.isSupported();
        this.$scope.isDeprecated = this.alertSvc.isDeprecated();
    }

    dismissAlert () {
        this.$scope.isDismissed = true;
    }
}
