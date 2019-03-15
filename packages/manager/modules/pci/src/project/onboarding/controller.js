export default class pciSlideshowCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $stateParams,
    $uibModalInstance,
    $window,
    ovhUserPref,
  ) {
    this.$state = $state;
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this.$window = $window;
    this.projectId = $stateParams.projectId;
    this.ovhUserPref = ovhUserPref;
  }

  $onInit() {
    this.$scope.$on('$locationChangeStart', (event) => {
      event.preventDefault();
    });
  }

  dismiss() {
    this.$uibModalInstance.close();
    this.$state.go('iaas.pci-project.compute.infrastructure.diagram', {
      projectId: this.projectId,
    });
    this.ovhUserPref.assign('SHOW_PCI_ONBOARDING', { value: false });
  }
}
