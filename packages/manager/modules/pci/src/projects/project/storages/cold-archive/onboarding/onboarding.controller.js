import reduce from 'lodash/reduce';
import illustration from './assets/ColdStorage.png';
import {
  ONBOARDING_DOC_LINKS,
  COLD_ARCHIVE_TRACKING,
} from '../cold-archives.constants';

export default class PciStorageColdArchivesOnboardingController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.illustration = illustration;
    this.guides = reduce(
      ONBOARDING_DOC_LINKS,
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
            guide.links[this.coreConfig.getUser()?.ovhSubsidiary] ||
            guide.links.DEFAULT,
        },
      ],
      [],
    );
  }

  onAddColdArchiveClick() {
    this.trackClick(
      `${COLD_ARCHIVE_TRACKING.ONBOARDING.MAIN}::${COLD_ARCHIVE_TRACKING.ONBOARDING.ADD_CONTAINER}`,
    );
    return this.goToAddColdArchive();
  }

  onDocumentationClick(guide) {
    const TRACKING_SUB_STRING = `${COLD_ARCHIVE_TRACKING.ONBOARDING.MAIN}::${COLD_ARCHIVE_TRACKING.ONBOARDING.DOCUMENTATION_LINK}::${guide.id}`;
    this.trackClick(TRACKING_SUB_STRING);
  }
}
