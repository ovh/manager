import reduce from 'lodash/reduce';
import privateRegistryImage from '../assets/private-registry.png';
import { GUIDES } from '../private-registry.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    CucCloudMessage,
    Poller,
    pciPrivateRegistryService,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.Poller = Poller;
    this.privateRegistryService = pciPrivateRegistryService;
    this.GUIDES = GUIDES;
    this.pollingNamespace = 'pci.private.project.creating';
    this.registryCreated = false;
  }

  $onInit() {
    this.stopCreationPolling();
    if (this.registryId) {
      this.startCreationPolling();
    }
    this.loadMessages();
    this.privateRegistryImage = privateRegistryImage;
    this.guides = reduce(
      this.GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
          title: this.$translate.instant(
            `private_registry_onboarding_guides_${guide.id}_title`,
          ),
        },
      ],
      [],
    );
  }

  startCreationPolling() {
    return this.Poller.poll(
      `/cloud/project/${this.projectId}/containerRegistry/${this.registryId}`,
      null,
      {
        namespace: this.pollingNamespace,
        successRule(details) {
          return details.status === 'READY' || details.status === 'ERROR';
        },
      },
    ).then(() => this.onProjectCreated());
  }

  stopCreationPolling() {
    return this.Poller.kill({
      namespace: this.pollingNamespace,
    });
  }

  onProjectCreated() {
    this.registryCreated = true;
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.private-registry.onboarding',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.private-registry.onboarding',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  create() {
    return this.$state.go('pci.projects.project.private-registry.create');
  }

  generateCredentials() {
    return this.$state.go(
      'pci.projects.project.private-registry.onboarding.credentials',
      {
        projectId: this.projectId,
        registryId: this.registryId,
      },
    );
  }

  getCompiledLinks(linkTemplate) {
    return this.privateRegistryService.constructor.getCompiledLinks(
      linkTemplate,
      this.registryContracts,
    );
  }
}
