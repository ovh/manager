import first from 'lodash/first';
import get from 'lodash/get';
import map from 'lodash/map';

import { DOWNLOAD_FILENAME, DOWNLOAD_TYPE } from './download-openrc.constants';

const { saveAs } = require('file-saver');

export default class PciUsersDownloadOpenRcController {
  /* @ngInject */
  constructor(
    $translate,
    ovhManagerRegionService,
    PciProjectsProjectUsersService,
  ) {
    this.$translate = $translate;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.PciProjectsProjectUsersService = PciProjectsProjectUsersService;
  }

  $onInit() {
    this.isLoading = false;
    this.useVersion3 = false;

    this.regions = map(this.regions, (region) => ({
      id: region,
      label: this.ovhManagerRegionService.getTranslatedMicroRegion(region),
    }));
    this.region = first(this.regions);
    this.hasGlobalRegions = this.PciProjectsProjectUsersService.checkGlobalRegion(
      this.regions,
    );
  }

  downloadOpenRc() {
    this.isLoading = true;
    return this.PciProjectsProjectUsersService.downloadOpenRc(
      this.projectId,
      this.user,
      this.region.id,
      this.getOpenRcApiVersion(),
    )
      .then(({ content }) => {
        const data = new Blob([content], { type: DOWNLOAD_TYPE });
        saveAs(data, DOWNLOAD_FILENAME);

        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(data);
        }).then((link) =>
          this.goBack({
            text: this.$translate.instant(
              'pci_projects_project_users_download-openrc_success_message',
              {
                user: this.user.username,
              },
            ),
            link: {
              type: 'download',
              text: this.$translate.instant(
                'pci_projects_project_users_download-openrc_success_message_link',
              ),
              value: link,
              download: DOWNLOAD_FILENAME,
            },
          }),
        );
      })
      .catch((err) =>
        this.goBack(
          this.$translate.instant(
            'pci_projects_project_users_download-openrc_error_openrc',
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

  getOpenRcApiVersion() {
    // Returns v3 if the region list has global regions i.e, GRA, DE, etc
    return this.hasGlobalRegions || this.currentRegion === 'US' ? 3 : 2;
  }
}
