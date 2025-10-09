import {
  GUIDES,
  LOAD_BALANCER_CONFIGURE_TRACKING,
  USING_LOAD_BALANCER_GUIDE_ID,
  LOAD_BALANCER_MIGRATE_LINKS,
} from './load-balancer.constants';

import { getCriteria } from '../project.utils';

export default class {
  /* @ngInject */
  constructor(
    CucCloudMessage,
    PciLoadBalancerService,
    CHANGELOG,
    coreConfig,
    ovhFeatureFlipping,
  ) {
    this.CucCloudMessage = CucCloudMessage;
    this.coreConfig = coreConfig;
    this.user = coreConfig.getUser();
    this.PciLoadBalancerService = PciLoadBalancerService;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.PciLoadBalancerGuides =
      LOAD_BALANCER_MIGRATE_LINKS[this.user.ovhSubsidiary] ||
      LOAD_BALANCER_MIGRATE_LINKS.DEFAULT;
    this.PciLoadBalancerMigrateGuides = LOAD_BALANCER_MIGRATE_LINKS;
    this.CHANGELOG = CHANGELOG;
  }

  $onInit() {
    this.GUIDES = GUIDES;
    this.loadMessages();
    this.criteria = getCriteria('id', this.loadBalancerId);
    this.ovhFeatureFlipping
      .checkFeatureAvailability('public-cloud:project:eos-load-balancer-test')
      .then((featureAvailability) =>
        featureAvailability.isFeatureAvailable(
          'public-cloud:project:eos-load-balancer-test',
        ),
      )
      .then((isEosMessageActive) => {
        this.getEndOFServiceMessage = isEosMessageActive;
        this.initializeTranslationKeys();
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('load-balancer');
    this.messageHandler = this.CucCloudMessage.subscribe('load-balancer', {
      onMessage: () => this.refreshMessages(),
    });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getGuideUrl(guide) {
    return this.PciLoadBalancerService.constructor.getGuideUrl(
      guide,
      this.user,
    );
  }

  getLoadbalancerDetails({ id: loadBalancerId }) {
    return this.PciLoadBalancerService.getLoadBalancerDetails(
      this.projectId,
      loadBalancerId,
    );
  }

  getEndOfServiceTranslationKey(baseTranslationKey) {
    if (this.getEndOFServiceMessage) {
      return `${baseTranslationKey}_definitive`;
    }

    return baseTranslationKey;
  }

  initializeTranslationKeys() {
    this.getEndServiceKey =
      'pci_projects_project_load_balancer_end_service_definitive';
    this.getEndServiceInformationKey =
      'pci_projects_project_load_balancer_more_information_definitive';
  }

  trackGuideClick(guide) {
    if (guide.id === USING_LOAD_BALANCER_GUIDE_ID) {
      this.PciLoadBalancerService.trackClick(LOAD_BALANCER_CONFIGURE_TRACKING);
    }
  }
}
