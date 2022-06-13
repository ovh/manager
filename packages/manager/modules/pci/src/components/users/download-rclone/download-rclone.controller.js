import first from 'lodash/first';
import get from 'lodash/get';
import map from 'lodash/map';

import {
  DOWNLOAD_FILENAME,
  DOWNLOAD_TYPE,
  DOWNLOAD_RCLONE_FILETYPE,
  DOWNLOAD_RCLONE_FILENAME,
  STATE_TYPE,
} from './download-rclone.constants';

const { saveAs } = require('file-saver');

export default class PciUsersDownloadRcloneController {
  /* @ngInject */
  constructor(
    $compile,
    $translate,
    ovhManagerRegionService,
    PciProjectsProjectUsersService,
    PciStoragesObjectStorageService,
  ) {
    this.$compile = $compile;
    this.$translate = $translate;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.PciProjectsProjectUsersService = PciProjectsProjectUsersService;
    this.PciStoragesObjectStorageService = PciStoragesObjectStorageService;
  }

  $onInit() {
    this.isLoading = false;

    this.regions = map(this.regions, (region) => ({
      id: region,
      label: this.ovhManagerRegionService.getTranslatedMicroRegion(region),
    }));
    this.region = first(this.regions);
    this.hasGlobalRegions = this.PciProjectsProjectUsersService.checkGlobalRegion(
      this.regions,
    );
  }

  downloadRclone() {
    this.isLoading = true;
    this.serviceCall =
      this.state === STATE_TYPE
        ? this.PciStoragesObjectStorageService
        : this.PciProjectsProjectUsersService;
    this.fileType =
      this.state === STATE_TYPE ? DOWNLOAD_RCLONE_FILETYPE : DOWNLOAD_TYPE;
    this.fileName =
      this.state === STATE_TYPE ? DOWNLOAD_RCLONE_FILENAME : DOWNLOAD_FILENAME;
    return this.serviceCall
      .downloadRclone(this.projectId, this.user, this.region.id)
      .then(({ content }) => {
        const data = new Blob([content], { type: this.fileType });
        saveAs(data, this.fileName);
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
              download: this.fileName,
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
