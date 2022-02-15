import { TENANT_STATUS } from '../../../anthos.constants';
import { TRACKING_PREFIX, UPDATE_KEY } from './software-update.constants';

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
      .then(() =>
        this.goBack(
          this.$translate.instant(`${UPDATE_KEY}_success`),
          'success',
          'anthos.dashboard',
          {
            patchTenantStatus: TENANT_STATUS.UPGRADING,
          },
        ),
      )
      .catch(() => {
        this.isUpdating = false;
        this.selectedVersion = null;
        this.displayAlerterMessage(
          'error',
          this.$translate.instant(`${UPDATE_KEY}_error`),
        );
      });
  }

  trackClick(...chunks) {
    this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}::${chunks.join('::')}`,
      type: 'action',
    });
  }
}
