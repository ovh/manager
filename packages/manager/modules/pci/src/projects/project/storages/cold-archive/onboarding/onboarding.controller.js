import reduce from 'lodash/reduce';
import illustration from './assets/ColdStorage.png';
import { TRACKING } from './onboarding.constants';
import { GUIDES } from '../cold-archives.constants';

export default class PciStorageColdArchivesOnboardingController {
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
    this.trackClick(TRACKING.ONBOARDING_CREATE_USER);
    return this.goToAddColdArchive();
  }

  onDocumentationClick(guide) {
    const TRACKING_SUB_STRING = `guides::go_to_${guide.id}`;
    this.trackClick(TRACKING_SUB_STRING);
  }
}
