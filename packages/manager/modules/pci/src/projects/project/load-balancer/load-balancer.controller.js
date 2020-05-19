import {
  GUIDES,
  LOAD_BALANCER_CONFIGURE_TRACKING,
  USING_LOAD_BALANCER_GUIDE_ID,
} from './load-balancer.constants';

export default class {
  /* @ngInject */
  constructor(CucCloudMessage, PciLoadBalancerService) {
    this.CucCloudMessage = CucCloudMessage;
    this.PciLoadBalancerService = PciLoadBalancerService;
  }

  $onInit() {
    this.GUIDES = GUIDES;
    this.loadMessages();
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
    return this.PciLoadBalancerService.getGuideUrl(guide, this.user);
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
