import { VOLUME_BACKUP_TRACKING } from '../volume-backup.constants';

export default class PciStorageColdArchivesOnboardingController {
  /* @ngInject */
  constructor($translate, coreConfig) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
  }

  onDocumentationClick(guide) {
    this.trackClick(`${VOLUME_BACKUP_TRACKING.ONBOARDING.GUIDE}::${guide.id}`);
  }

  onAddVolumeBlockStorageClick() {
    this.trackClick(VOLUME_BACKUP_TRACKING.ONBOARDING.ADD);

    return this.goToCreateVolumeBackup();
  }
}
