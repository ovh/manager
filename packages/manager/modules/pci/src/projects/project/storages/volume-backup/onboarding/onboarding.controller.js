import reduce from 'lodash/reduce';

import { GUIDES } from '../volume-backup.constants';

export default class PciStorageColdArchivesOnboardingController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.guides = reduce(
      GUIDES,
      (list, guide) => [
        ...list,
        {
          ...guide,
          title: this.$translate.instant(
            `pci_projects_project_storages_volume_backup_guides_${guide.id}_title`,
          ),
          description: this.$translate.instant(
            `pci_projects_project_storages_volume_backup_guides_${guide.id}_description`,
          ),
          link:
            guide.links[this.coreConfig.getUserLanguage().toUpperCase()] ||
            guide.links.DEFAULT,
        },
      ],
      [],
    );
  }

  onAddVolumeBlockStorageClick() {
    // TODO: tracking

    this.goToAddVolumeBlockStorage();
  }
}
