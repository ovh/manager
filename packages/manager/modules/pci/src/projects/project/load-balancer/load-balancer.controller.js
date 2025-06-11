import {
  GUIDES,
  LOAD_BALANCER_CONFIGURE_TRACKING,
  USING_LOAD_BALANCER_GUIDE_ID,
  LOAD_BALANCER_MIGRATE_LINKS,
} from './load-balancer.constants';

import { getCriteria } from '../project.utils';

export default class {
  /* @ngInject */
  constructor(CucCloudMessage, PciLoadBalancerService, CHANGELOG, coreConfig) {
    this.CucCloudMessage = CucCloudMessage;
    this.coreConfig = coreConfig;
    this.user = coreConfig.getUser();
    this.PciLoadBalancerService = PciLoadBalancerService;
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

  trackGuideClick(guide) {
    if (guide.id === USING_LOAD_BALANCER_GUIDE_ID) {
      this.PciLoadBalancerService.trackClick(LOAD_BALANCER_CONFIGURE_TRACKING);
    }
  }
}
