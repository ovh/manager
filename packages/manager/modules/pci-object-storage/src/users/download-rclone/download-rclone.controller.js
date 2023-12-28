import get from 'lodash/get';
import map from 'lodash/map';
import {
  DOWNLOAD_FILETYPE,
  RCLONE_SERVICE_TYPE,
} from './download-rclone.constants';

const { saveAs } = require('file-saver');

export default class PciUsersDownloadRcloneController {
  /* @ngInject */
  constructor(
    $compile,
    $translate,
    ovhManagerRegionService,
    ovhFeatureFlipping,
  ) {
    this.$compile = $compile;
    this.$translate = $translate;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.downloadFileType = DOWNLOAD_FILETYPE;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    this.isLoading = true;
    this.ovhFeatureFlipping
      .checkFeatureAvailability('public-cloud:object-storage')
      .then((feature) =>
        feature.isFeatureAvailable('public-cloud:object-storage'),
      )
      .then((status) => {
        this.showFileType = status;
        this.isLoading = false;
      })
      .catch(() => null);
    this.fileType = DOWNLOAD_FILETYPE.SWIFT;
    this.regions = map(this.regions, (region) => ({
      id: region,
      label: this.ovhManagerRegionService.getTranslatedMicroRegion(region),
    }));
    this.storageS3Regions = this.storageS3Regions.map((region) => ({
      id: region,
      label: this.ovhManagerRegionService.getTranslatedMicroRegion(region),
    }));
    [this.region] = this.regions;
    [this.storageS3Region] = this.storageS3Regions;
    this.hasGlobalRegions = this.checkGlobalRegionCallBack(this.regions);
  }

  downloadRclone() {
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
        }).then((link) =>
          this.goBack({
            text: this.$translate.instant(
              'pci_projects_project_users_download-rclone_success_message',
              {
                user: this.user.username,
              },
            ),
            link: {
              type: 'download',
              text: this.$translate.instant(
                'pci_projects_project_users_download-rclone_success_message_link',
              ),
              value: link,
              download: this.file.fileName,
            },
          }),
        );
      })
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_users_download-rclone_error_rclone',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
