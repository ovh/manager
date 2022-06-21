import first from 'lodash/first';
import get from 'lodash/get';
import map from 'lodash/map';

const { saveAs } = require('file-saver');

export default class PciUsersDownloadRcloneController {
  /* @ngInject */
  constructor($compile, $translate, ovhManagerRegionService) {
    this.$compile = $compile;
    this.$translate = $translate;
    this.ovhManagerRegionService = ovhManagerRegionService;
  }

  $onInit() {
    this.isLoading = false;
    this.regions = map(this.regions, (region) => ({
      id: region,
      label: this.ovhManagerRegionService.getTranslatedMicroRegion(region),
    }));
    this.region = first(this.regions);
    this.hasGlobalRegions = this.checkGlobalRegionCallBack(this.regions);
  }

  downloadRclone() {
    this.isLoading = true;
    return this.downloadRCloneConfig(this.region.id)
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
