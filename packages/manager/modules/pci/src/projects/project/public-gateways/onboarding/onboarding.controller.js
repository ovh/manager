import reduce from 'lodash/reduce';
import illustration from './assets/public-gateway.png';
import { GUIDES } from './onboarding.constants';

export default class PciPublicGatewaysOnboardingController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
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
          description: this.$translate.instant(
            `pci_projects_project_public_gateways_onboarding_guides_${guide.id}_description`,
          ),
        },
      ],
      [],
    );
  }

  onAddPublicGatewayClick() {
    this.trackPublicGateways('onboarding::add');
  }

  onDocumentationClick(guide) {
    this.trackPublicGateways(`onboarding::documentation::${guide.id}`);
  }
}
