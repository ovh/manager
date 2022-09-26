import reduce from 'lodash/reduce';
import illustration from './assets/ColdStorage.png';
import { COLD_ARCHIVE_TRACKING_PREFIX } from '../../cold-archives.constants';
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
    this.atInternet.trackClick({
      name: `${COLD_ARCHIVE_TRACKING_PREFIX}::onboarding::add_a_user`,
      type: 'action',
    });
  }

  onDocumentationClick(guide) {
    this.atInternet.trackClick({
      name: `${COLD_ARCHIVE_TRACKING_PREFIX}::onboarding::documentation::${guide.id}`,
      type: 'action',
    });
  }
}
