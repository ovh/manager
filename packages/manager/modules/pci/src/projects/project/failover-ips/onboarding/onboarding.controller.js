import reduce from 'lodash/reduce';
import { GUIDES } from './onboarding.constants';

export default class PciFailoverIpsOnboardingController {
  /* @ngInject */
  constructor($translate, CucCloudMessage, coreConfig) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    const guideKey = 'pci_projects_project_failoverip_onboarding_guides_';
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          id: guide.id,
          link: guide.link[this.user.ovhSubsidiary] || guide.link.DEFAULT,
          title: this.$translate.instant(`${guideKey}${guide.id}_title`),
          description: this.$translate.instant(
            `${guideKey}${guide.id}_description`,
          ),
        },
      ],
      [],
    );
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'pci.projects.project.failover-ips.onboarding',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'pci.projects.project.failover-ips.onboarding',
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
