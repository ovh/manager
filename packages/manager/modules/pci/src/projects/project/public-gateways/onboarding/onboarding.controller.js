import reduce from 'lodash/reduce';
import illustration from './assets/public-gateway.png';
import { GUIDES } from './onboarding.constants';

export default class PciPublicGatewaysOnboardingController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, coreConfig) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.illustration = illustration;
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
          title: this.$translate.instant(
            `pci_projects_project_public_gateways_onboarding_guides_${guide.id}_title`,
          ),
          link: guide.links[this.user.ovhSubsidiary] || guide.links.DEFAULT,
        },
      ],
      [],
    );
  }

  onAddPublicGatewayClick() {
    this.trackPublicGateways('onboarding::add');
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.public-gateways.onboarding',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.public-gateways.onboarding',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  onDocumentationClick(guide) {
    this.trackPublicGateways(`onboarding::documentation::${guide.id}`);
  }
}
