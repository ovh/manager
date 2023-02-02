import {
  DOWNLOAD_FILETYPE,
  RCLONE_SERVICE_TYPE,
} from './download-rclone.constants';
import { COLD_ARCHIVE_TRACKING } from '../../cold-archives.constants';

const { saveAs } = require('file-saver');

export default class ColdArchiveUsersDownloadRcloneController {
  /* @ngInject */
  constructor($translate, ovhManagerRegionService) {
    this.$translate = $translate;
    this.ovhManagerRegionService = ovhManagerRegionService;
  }

  $onInit() {
    this.isLoading = false;
    this.downloadFileType = DOWNLOAD_FILETYPE;
    this.fileType = DOWNLOAD_FILETYPE.S3;
    this.regions = this.regions.map((region) => ({
      id: region,
      label: this.ovhManagerRegionService.getTranslatedMicroRegion(region),
    }));
    this.storageS3Regions = this.storageS3Regions.map((region) => ({
      id: region,
      label: this.ovhManagerRegionService.getTranslatedMicroRegion(region),
    }));
    [this.region] = this.regions;
    [this.storageS3Region] = this.storageS3Regions;
  }

  downloadRclone() {
    this.trackDownloadRCloneModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);
    this.isLoading = true;
    this.serviceType =
      RCLONE_SERVICE_TYPE[this.fileType?.toUpperCase()] ||
      RCLONE_SERVICE_TYPE.S3;
    this.regionId =
      this.fileType === DOWNLOAD_FILETYPE.SWIFT
        ? this.region.id
        : this.storageS3Region.id;
    return this.downloadRCloneConfig(this.regionId, this.serviceType)
      .then(({ content }) => {
        const data = new Blob([content], { type: this.file.fileType });
        saveAs(data, this.file.fileName);
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(data);
        }).then((link) => {
          this.trackDownloadRCloneModalPage(
            COLD_ARCHIVE_TRACKING.STATUS.SUCCESS,
          );
          return this.goBack({
            text: this.$translate.instant(
              'pci_projects_project_storages_cold_archive_users_download-rclone_success_message',
              {
                user: this.user.username,
              },
            ),
            link: {
              type: 'download',
              text: this.$translate.instant(
                'pci_projects_project_storages_cold_archive_users_download-rclone_success_message_link',
              ),
              value: link,
              download: this.file.fileName,
            },
          });
        });
      })
      .catch((err) => {
        this.trackDownloadRCloneModalPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);
        return this.goBack(
          this.$translate.instant(
            'pci_projects_project_storages_cold_archive_users_download-rclone_error_rclone',
            {
              message: err?.data?.message || err?.message || err.data,
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    this.trackDownloadRCloneModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL);
    return this.goBack();
  }

  trackDownloadRCloneModalPage(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_RCLONE}_${action}`;
    this.trackPage(hit);
  }

  trackDownloadRCloneModalClick(action) {
    const hit = `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_RCLONE}::${action}`;
    this.trackClick(hit);
  }
}
