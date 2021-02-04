export default class WebPaasProjectCtrl {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    this.$scope.alerts = {
      dashboard: 'web_paas_dashboard_alert',
    };
    this.$scope.$on('changeWebPaasProjectName', (event, displayName) => {
      this.project.projectName = displayName;
    });
  }
}
