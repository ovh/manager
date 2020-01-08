class pciSlideshowCtrl {
  constructor(
    $scope,
    $state,
    $stateParams,
    $uibModalInstance,
    $window,
    atInternet,
    ovhUserPref,
  ) {
    this.$state = $state;
    this.$scope = $scope;
    this.$uibModalInstance = $uibModalInstance;
    this.$window = $window;
    this.projectId = $stateParams.projectId;
    this.ovhUserPref = ovhUserPref;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.trackSlideshow('cloud::pci::notification_new_menu_pci_1');
    this.$scope.$on('$locationChangeStart', (event) => {
      event.preventDefault();
    });
  }

  dismiss(discover) {
    if (discover) {
      this.trackSlideshow('cloud::pci::notification_new_menu_pci_discover');
    }
    this.$uibModalInstance.close();
    this.$state.go('iaas.pci-project.compute.infrastructure.diagram', {
      projectId: this.projectId,
    });
    this.ovhUserPref.assign('SHOW_PCI_ONBOARDING', { value: false });
  }

  onPanelChange(direction, index) {
    if (direction === 'next') {
      this.trackSlideshow(`cloud::pci::notification_new_menu_pci_${index + 1}`);
    }
  }

  trackSlideshow(name) {
    this.atInternet.trackClick({
      name,
      type: 'action',
    });
  }
}

angular.module('managerApp').controller('pciSlideshowCtrl', pciSlideshowCtrl);
