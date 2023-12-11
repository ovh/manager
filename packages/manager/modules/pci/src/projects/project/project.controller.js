import isNil from 'lodash/isNil';

import {
  COMMUNITY_LINKS,
  PRODUCT_IMAGES,
  PCI_FEATURES,
} from './project.constants';

export default class ProjectController {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $stateParams,
    $uibModal,
    atInternet,
    coreConfig,
    OvhApiCloudProject,
    ovhFeatureFlipping,
    PciProject,
    CucCloudMessage,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$uibModal = $uibModal;
    this.atInternet = atInternet;
    this.OvhApiCloudProject = OvhApiCloudProject;
    this.region = coreConfig.getRegion();
    this.coreConfig = coreConfig;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.PciProject = PciProject;
    this.CucCloudMessage = CucCloudMessage;

    const filterByRegion = (list) =>
      list.filter(
        ({ regions }) => isNil(regions) || coreConfig.isRegion(regions),
      );

    this.PCI_FEATURES = PCI_FEATURES;
    this.communityLinks = filterByRegion(COMMUNITY_LINKS);
  }

  $onInit() {
    this.productImages = PRODUCT_IMAGES;

    this.projectQuotaAboveThreshold = this.quotas.find(
      (quota) => quota.quotaAboveThreshold,
    );

    this.PciProject.setProjectInfo(this.project);
    this.loadMessages();
  }

  loadMessages() {
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  isDisplayableLink({ availableForTrustedZone }) {
    const { isTrustedZone } = this;

    return !isTrustedZone || (isTrustedZone && availableForTrustedZone);
  }

  getStateParams(action) {
    return {
      ...action.stateParams,
      projectId: this.project.project_id,
    };
  }

  /**
   * finds and returns array of features
   * @param {Array} items
   */
  static findFeatureToCheck(items) {
    return items.reduce((features, item) => {
      return [...features, item.feature].filter((feature) => !!feature);
    }, []);
  }

  onActivateProjectClick() {
    return this.goToDiscoveryProjectActivationPage();
  }

  onActivateDiscoveryModalSuccess() {
    this.activateDiscovery = false;
    this.goToDiscoveryProjectActivationPage();
  }

  onActivateDiscoveryModalClose() {
    this.activateDiscovery = false;
  }
}
