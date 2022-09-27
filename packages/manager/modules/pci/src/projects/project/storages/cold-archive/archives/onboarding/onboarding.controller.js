import reduce from 'lodash/reduce';
import illustration from './assets/ColdStorage.png';
import { GUIDES, TRACKING } from './onboarding.constants';

export default class PciStorageObjectsOnboardingController {
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
            `pci_projects_project_storages_cold_archives_onboarding_guides_${guide.id}_title`,
          ),
          description: this.$translate.instant(
            `pci_projects_project_storages_cold_archives_onboarding_guides_${guide.id}_description`,
          ),
        },
      ],
      [],
    );
  }

  addColdArchive() {
    this.trackClick(TRACKING.ONBOARDING_CREATE_USER);
    this.goToAddColdArchive();
  }

  onDocumentationClick(guide) {
    const TRACKING_SUB_STRING = `docs::${guide.id}`;
    this.trackClick(TRACKING_SUB_STRING);
  }
}
