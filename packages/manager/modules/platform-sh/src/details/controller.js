export default class PlatformShProjectCtrl {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    this.$scope.$on('changePlatformShProjectName', (event, displayName) => {
      this.project.projectName = displayName;
    });
  }
}
