import reduce from 'lodash/reduce';
import illustration from './assets/blocks.png';

import { GUIDES, IN_SUBSIDIARY } from './onboarding.constants';

export default class PciStorageBlocksOnboardingController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.illustration = illustration;
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          id: guide.id,
          link:
            this.coreConfig.getUser().ovhSubsidiary === IN_SUBSIDIARY
              ? guide.asialink
              : guide.defaultlink,
          title: this.$translate.instant(
            `pci_projects_project_storages_blocks_onboarding_guides_${guide.id}_title`,
          ),
          description: this.$translate.instant(
            `pci_projects_project_storages_blocks_onboarding_guides_${guide.id}_description`,
          ),
        },
      ],
      [],
    );
  }
}
