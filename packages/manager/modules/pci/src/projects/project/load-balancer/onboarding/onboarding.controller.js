import reduce from 'lodash/reduce';
import illustration from './assets/load-balancer.png';
import {
  GUIDES,
  LOAD_BALANCER_CONFIGURE_TRACKING,
  USING_LOAD_BALANCER_GUIDE_ID,
} from '../load-balancer.constants';

export default class {
  /* @ngInject */
  constructor($translate, PciLoadBalancerService) {
    this.$translate = $translate;
    this.PciLoadBalancerService = PciLoadBalancerService;
  }

  $onInit() {
    this.illustration = illustration;
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
          link: this.PciLoadBalancerService.getGuideUrl(guide, this.user),
          title: this.$translate.instant(
            `pci_projects_project_load_balancer_onboarding_guides_${guide.id}_title`,
          ),
        },
      ],
      [],
    );
  }

  onGuideClick(guide) {
    if (guide.id === USING_LOAD_BALANCER_GUIDE_ID) {
      this.PciLoadBalancerService.trackClick(LOAD_BALANCER_CONFIGURE_TRACKING);
    }
  }
}
