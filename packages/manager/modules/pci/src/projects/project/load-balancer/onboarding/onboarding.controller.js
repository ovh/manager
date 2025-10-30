import reduce from 'lodash/reduce';
import illustration from './assets/load-balancer.png';
import {
  GUIDES,
  LOAD_BALANCER_CONFIGURE_TRACKING,
  LOAD_BALANCER_LINKS,
  USING_LOAD_BALANCER_GUIDE_ID,
} from '../load-balancer.constants';

export default class {
  /* @ngInject */
  constructor(
    $translate,
    PciLoadBalancerService,
    coreConfig,
    ovhFeatureFlipping,
  ) {
    this.$translate = $translate;
    this.PciLoadBalancerService = PciLoadBalancerService;
    this.coreConfig = coreConfig;
    this.user = coreConfig.getUser();
    this.ovhFeatureFlipping = ovhFeatureFlipping;
    this.PciLoadBalancerGuides =
      LOAD_BALANCER_LINKS[this.user.ovhSubsidiary] ||
      LOAD_BALANCER_LINKS.DEFAULT;
  }

  $onInit() {
    this.illustration = illustration;
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
          link: this.PciLoadBalancerService.constructor.getGuideUrl(
            guide,
            this.user,
          ),
          title: this.$translate.instant(
            `pci_projects_project_load_balancer_onboarding_guides_${guide.id}_title`,
          ),
        },
      ],
      [],
    );
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

  onGuideClick(guide) {
    if (guide.id === USING_LOAD_BALANCER_GUIDE_ID) {
      this.PciLoadBalancerService.trackClick(LOAD_BALANCER_CONFIGURE_TRACKING);
    }
  }

  getEndOfServiceTranslationKey(baseTranslationKey) {
    if (this.getEndOFServiceMessage) {
      return `${baseTranslationKey}_definitive`;
    }
    return baseTranslationKey;
  }

  initializeTranslationKeys() {
    this.getEndServiceKey = this.getEndOfServiceTranslationKey(
      'pci_projects_project_load_balancer_end_service',
    );
    this.getEndServiceWelcomeKey = this.getEndOfServiceTranslationKey(
      'pci_projects_project_load_balancer_end_service_welcome',
    );
    this.getEndServiceInformationKey =
      'pci_projects_project_load_balancer_more_information';
  }
}
