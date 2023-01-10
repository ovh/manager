import reduce from 'lodash/reduce';
import illustration from './assets/ColdStorage.png';
import { GUIDES, COLD_ARCHIVE_TRACKING } from '../cold-archives.constants';

export default class PciStorageColdArchivesOnboardingController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.illustration = illustration;
    this.trackPage(COLD_ARCHIVE_TRACKING.ONBOARDING.MAIN);
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
          title: this.$translate.instant(
            `pci_projects_project_storages_cold_archives_guides_${guide.id}_title`,
          ),
          description: this.$translate.instant(
            `pci_projects_project_storages_cold_archives_guides_${guide.id}_description`,
          ),
          link:
            guide.links[this.coreConfig.getUserLanguage().toUpperCase()] ||
            guide.links.DEFAULT,
        },
      ],
      [],
    );
  }

  addColdArchive() {
    this.trackClick(
      `${COLD_ARCHIVE_TRACKING.ONBOARDING.MAIN}::${COLD_ARCHIVE_TRACKING.ONBOARDING.ADD_CONTAINER}`,
    );
    return this.goToAddColdArchive();
  }

  onDocumentationClick(guide) {
    const TRACKING_SUB_STRING = `${COLD_ARCHIVE_TRACKING.ONBOARDING.DOCUMENTATION_LINK}::${guide.id}`;
    this.trackClick(TRACKING_SUB_STRING);
  }
}
