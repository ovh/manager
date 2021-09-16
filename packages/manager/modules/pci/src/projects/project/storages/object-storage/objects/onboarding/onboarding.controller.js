import reduce from 'lodash/reduce';
import illustration from './assets/objects.png';

import { GUIDES } from './onboarding.constants';

export default class PciStorageObjectsOnboardingController {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.atInternet = atInternet;
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
            `pci_projects_project_storages_objects_onboarding_guides_${guide.id}_title`,
          ),
          description: this.$translate.instant(
            `pci_projects_project_storages_objects_onboarding_guides_${guide.id}_description`,
          ),
        },
      ],
      [],
    );
  }

  onDocumentationClick(guide) {
    this.atInternet.trackClick({
      name: `${this.trackingPrefix}onboarding::documentation::${guide.id}`,
      type: 'action',
    });
  }
}
