angular
  .module('managerApp')
  .directive(
    'writeRightRequired',
    ($stateParams, CloudProjectRightService) => ({
      // The directive must be applied after all directives to overwrite conflicts(ex: ng-if)
      priority: -1001,
      restrict: 'A',
      link(scope, element) {
        CloudProjectRightService.userHaveReadWriteRights(
          $stateParams.projectId,
        ).then((hasWriteRight) => {
          if (!hasWriteRight) {
            element.addClass('hide');
          }
        });
      },
    }),
  );
