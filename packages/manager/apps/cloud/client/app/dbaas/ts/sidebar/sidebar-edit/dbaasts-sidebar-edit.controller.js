import set from 'lodash/set';

// our sidebar edit controller
angular.module('managerApp').controller('DBaasTsSidebarEditCtrl', [
  '$rootScope',
  '$scope',
  '$timeout',
  '$translate',
  'managerSidebarMenuItemController',
  'DBaasTsSidebarEditMediator',
  'locals',
  'OvhApiDBaasTsProject',
  'Toast',
  function DBaasTsSidebarEditCtrl(
    $rootScope,
    $scope,
    $timeout,
    $translate,
    managerSidebarMenuItemController,
    DBaasTsSidebarEditMediator,
    locals,
    OvhApiDBaasTsProject,
    Toast,
  ) {
    const self = this;

    $scope.loader = {
      save: false,
    };

    $scope.model = {
      name: locals.project.name,
    };

    self.init = function init() {
      DBaasTsSidebarEditMediator.startEdition($scope);
      // if state change, abort edition
      DBaasTsSidebarEditMediator.watchForLeavingEdition();
    };

    $scope.resetTemplate = function resetTemplate() {
      managerSidebarMenuItemController.loadDefaultTemplate();
    };

    $scope.cancelEdition = function cancelEdition() {
      DBaasTsSidebarEditMediator.stopEdition();
    };

    $scope.saveName = function saveName() {
      $scope.loader.save = true;

      OvhApiDBaasTsProject.v6()
        .setup(
          {
            serviceName: locals.project.serviceName,
          },
          {
            displayName: $scope.model.name || '',
          },
        )
        .$promise.then(
          () => {
            // Update the project name in sidebar
            set(locals, 'sidebarElt.name', $scope.model.name);
            set(locals, 'project.name', $scope.model.name);

            $rootScope.$broadcast(
              'dbaasts-reloadproject',
              locals.project.serviceName,
            );
          },
          (err) => {
            Toast.error(
              [
                $translate.instant('dbaasts_sidebar_edit_name_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
          },
        )
        .finally(() => {
          $scope.loader.save = false;
          DBaasTsSidebarEditMediator.stopEdition();
          OvhApiDBaasTsProject.v6().resetCache();
        });
    };

    $scope.watchForEscapeKey = function watchForEscapeKey($event) {
      if ($event.keyCode === 27) {
        // escape key code
        $scope.cancelEdition();
      }
    };

    self.init();
  },
]);
