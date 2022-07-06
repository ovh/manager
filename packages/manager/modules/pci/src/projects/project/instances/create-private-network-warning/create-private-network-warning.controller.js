const TRACKING_PREFIX =
  'PublicCloud::pci::projects::project::instances::create-private-network-warning';

export default class PciProjectsProjectInstancesCreatePrivateWarningCtrl {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
  }

  close() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::cancel`,
      type: 'action',
    });
    return this.goBack();
  }

  onCreatePrivateNetworkClick() {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::confirm`,
      type: 'action',
    });
    return this.goToPrivateNetworkConfigPage();
  }
}
