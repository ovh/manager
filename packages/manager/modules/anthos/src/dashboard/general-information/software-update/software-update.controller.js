import { TRACKING_PREFIX } from './software-update.constants';

export default class SoftwareUpdateController {
  /* @ngInject */
  constructor($translate, AnthosTenantsService, atInternet) {
    this.$translate = $translate;
    this.AnthosTenantsService = AnthosTenantsService;
    this.atInternet = atInternet;
    this.selectedVersion = null;
    this.isUpdating = false;
  }

  onGoToChangelog({ version, changelogLink }) {
    this.trackClick('changelog', version);
    return window.open(changelogLink, '_blank');
  }

  updateSoftware() {
    const {
      selectedVersion: { version: selectedVersion },
      serviceName,
      tenant: { version: currentVersion },
    } = this;

    this.trackClick('confirm-update', currentVersion, selectedVersion);

    this.isUpdating = true;

    return this.AnthosTenantsService.updateSoftware(
      serviceName,
      selectedVersion,
    )
      .then(() => {
        const successVerbatim = this.$translate.instant(
          'anthos_tenant_dashboard_general_information_software_update_success',
        );
        this.goBack(successVerbatim, 'success');
      })
      .catch(() => {
        const errorVerbatim = this.$translate.instant(
          'anthos_tenant_dashboard_general_information_software_update_error',
        );
        this.displayAlerterMessage('error', errorVerbatim);
      })
      .finally(() => {
        this.isUpdating = false;
        this.selectedVersion = null;
      });
  }

  trackClick(...chunks) {
    chunks.unshift(TRACKING_PREFIX);
    const name = chunks.join('::');
    this.atInternet.trackClick({
      name,
      type: 'action',
    });
  }
}
