angular
  .module('managerApp')
  .controller('CloudProjectCtrl', function CloudProjectCtrl(
    $scope,
    $state,
    $stateParams,
    $transitions,
    atInternet,
    CloudProjectRightService,
    CucControllerHelper,
    ovhUserPref,
    OvhApiCloud,
    coreConfig,
    TRACKING_CLOUD,
  ) {
    const self = this;
    const serviceName = $stateParams.projectId;
    const onboardingKey = 'SHOW_PCI_ONBOARDING';
    $scope.region = coreConfig.getRegion();
    self.TRACKING_CLOUD = TRACKING_CLOUD;

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

    function openOnboarding() {
      CucControllerHelper.modal.showModal({
        modalConfig: {
          templateUrl: 'app/cloud/project/onboarding/onboarding-pci.html',
          controller: 'pciSlideshowCtrl',
          controllerAs: '$ctrl',
          backdrop: 'static',
        },
      });
    }

    function init() {
      self.loaders.project = true;

      ovhUserPref
        .getValue(onboardingKey)
        .then(({ value }) => {
          if (value) {
            openOnboarding();
          }
        })
        .catch((err) => {
          // Check error status and if key is there in error message
          if (err.status === 404 && err.data.message.includes(onboardingKey)) {
            openOnboarding();
          }
        });

      // get current project
      if (serviceName) {
        OvhApiCloud.Project()
          .v6()
          .get({
            serviceName,
          })
          .$promise.then((project) => {
            self.model.project = project;
            // if project is suspended, redirect to error page
            if (
              self.model.project.status === 'suspended' ||
              self.model.project.status === 'creating'
            ) {
              $state.go('iaas.pci-project.details');
            } else {
              CloudProjectRightService.userHaveReadWriteRights(
                serviceName,
              ).then((hasWriteRight) => {
                self.model.hasWriteRight = hasWriteRight;
              });
            }
          })
          .catch(() => $state.go('iaas.pci-project.details'))
          .finally(() => {
            self.loaders.project = false;
          });
      } else {
        $state.go('iaas.pci-project-new');
        return;
      }

      // before a state change, check if the destination project is suspended,
      // if it's the case just redirect to the error page
      stateChangeListener = $transitions.onStart({}, (transition) => {
        const toState = transition.to();
        const toParams = transition.params();
        // avoid infinite state redirection loop
        if (toState && toState.name === 'iaas.pci-project.details') {
          return;
        }
        // check if project is loaded
        if (!self.model.project) {
          return;
        }
        // redirection is only for suspended projects
        if (
          self.model.project.status !== 'suspended' &&
          self.model.project.status !== 'creating'
        ) {
          return;
        }
        if (self.model.project.project_id === toParams.projectId) {
          $state.go('iaas.pci-project.details');
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
  });
