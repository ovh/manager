export default /* @ngInject */ function CloudProjectCtrl(
  $scope,
  $state,
  $stateParams,
  $transitions,
  atInternet,
  OvhApiCloud,
  CloudProjectRightService,
  coreConfig,
) {
  const self = this;
  const serviceName = $stateParams.projectId;
  $scope.region = coreConfig.getRegion();

  self.loaders = {
    project: false,
  };

  self.model = {
    project: null,
    hasWriteRight: true,
  };

  self.includes = function includes(stateName) {
    return $state.includes(stateName);
  };

  self.trackTab = function trackTab(name) {
    atInternet.trackClick({
      name,
      type: 'action',
    });
  };

  // reference to our rootScope state change listener
  let stateChangeListener = null;

  function init() {
    self.loaders.project = true;

    // get current project
    if (serviceName) {
      OvhApiCloud.Project().v6().get({
        serviceName,
      }).$promise
        .then((project) => {
          self.model.project = project;
          // if project is suspended, redirect to error page
          if (self.model.project.status === 'suspended' || self.model.project.status === 'creating') {
            $state.go('pci.projects.project.legacy.details');
          } else {
            CloudProjectRightService.userHaveReadWriteRights(serviceName)
              .then((hasWriteRight) => {
                self.model.hasWriteRight = hasWriteRight;
              });
          }
        })
        .catch(() => $state.go('pci.projects.project.legacy.details'))
        .finally(() => {
          self.loaders.project = false;
        });
    } else {
      $state.go('pci.project-new');
      return;
    }

    // before a state change, check if the destination project is suspended,
    // if it's the case just redirect to the error page
    stateChangeListener = $transitions.onStart({}, (transition) => {
      const toParams = transition.params();
      // check if project is loaded
      if (!self.model.project) {
        return;
      }
      // redirection is only for suspended projects
      if (self.model.project.status !== 'suspended' && self.model.project.status !== 'creating') {
        return;
      }
      if (self.model.project.project_id === toParams.projectId) {
        $state.go('pci.projects.project.legacy.details');
      }
    });
  }

  // when controller is destroyed we must remove global state change listener
  $scope.$on('$destroy', () => {
    if (stateChangeListener) {
      stateChangeListener();
    }
  });

  init();
}
