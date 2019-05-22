import reduce from 'lodash/reduce';
import privateRegistryImage from '../assets/private-registry.png';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $stateParams,
    $translate,
    CucCloudMessage,
    GUIDES,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.registryId = $stateParams.registryId;
    this.GUIDES = GUIDES;
  }

  $onInit() {
    this.loadMessages();
    this.privateRegistryImage = privateRegistryImage;
    this.guides = reduce(
      this.GUIDES,
      (list, guide) => ([
        ...list,
        {
          ...guide,
          title: this.$translate.instant(
            `private_registry_onboarding_guides_${guide.id}_title`,
          ),
        },
      ]),
      [],
    );
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.private-registry.onboarding');
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.private-registry.onboarding', { onMessage: () => this.refreshMessages() });
  }

  createRegistry() {
    return this.$state.go('pci.projects.project.private-registry.onboarding.create', { fromState: 'onboarding' });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  generateCredentials() {
    return this.$state.go('pci.projects.project.private-registry.onboarding.credentials', {
      fromState: 'onboarding',
      confirmationRequired: false,
      registryId: this.registryId,
    });
  }
}
