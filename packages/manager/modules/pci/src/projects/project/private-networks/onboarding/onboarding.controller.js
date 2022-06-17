import reduce from 'lodash/reduce';
import illustration from './assets/private-networks.png';
import { GUIDES } from './onboarding.constants';

export default class PciPrivateNetworkEmptyController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.loading = false;
    this.illustration = illustration;
    this.onboardingTrackPrefix = 'onboarding::';
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
          title: this.$translate.instant(
            `pci_projects_project_network_private_vrack_guides_${guide.id}_title`,
          ),
          link: guide.links[this.user.ovhSubsidiary] || guide.links.DEFAULT,
        },
      ],
      [],
    );
  }

  onAddPrivateNetworkClick() {
    this.trackPrivateNetworks(`${this.onboardingTrackPrefix}add`);
    this.createNetwork();
  }

  onDocumentationClick(guide) {
    this.trackPrivateNetworks(
      `${this.onboardingTrackPrefix}documentation::${guide.id}`,
    );
  }
}
