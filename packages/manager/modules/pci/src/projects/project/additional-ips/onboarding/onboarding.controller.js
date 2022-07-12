import reduce from 'lodash/reduce';
import { GUIDES } from './onboarding.constants';

export default class PciAdditionalIpsOnboardingController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, coreConfig) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
          title: this.$translate.instant(
            `pci_additional_ips_onboarding_guides_${guide.id}_title`,
          ),
          description: this.$translate.instant(
            `pci_additional_ips_onboarding_guides_${guide.id}_description`,
          ),
          link: guide.links[this.user.ovhSubsidiary] || guide.links.DEFAULT,
        },
      ],
      [],
    );
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.additional-ips.onboarding',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.additional-ips.onboarding',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
