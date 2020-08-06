import reduce from 'lodash/reduce';
import illustration from './assets/partner.png';
import { GUIDES } from './onboarding.constants';

export default class PciServingOnboardingController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.loading = false;
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
            `pci_projects_project_training_onboarding_guides_${guide.id}_title`,
          ),
          description: this.$translate.instant(
            `pci_projects_project_training_onboarding_guides_${guide.id}_description`,
          ),
        },
      ],
      [],
    );
  }

  submit() {
    this.loading = true;
    if (this.isAuthorized) {
      return this.submitJobLink();
    }
    return this.createAuthorization();
  }
}
