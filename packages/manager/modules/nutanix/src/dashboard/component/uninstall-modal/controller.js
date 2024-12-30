import { UNINSTALL_GUIDE_LINK, UNINSTALL_PATTERN } from './constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.UNINSTALL_PATTERN = UNINSTALL_PATTERN;
    this.UNINSTALL_GUIDE_LINK = UNINSTALL_GUIDE_LINK;
    this.isLoading = false;
  }

  onSubmit() {
    this.isLoading = true;
    this.uninstallNode()
      .then(() => {
        this.handleSuccess(
          `${this.$translate.instant(
            'nutanix_dashboard_uninstall_node_success_banner',
          )}`,
        );
      })
      .catch((error) => {
        this.handleError(
          `${this.$translate.instant(
            'nutanix_dashboard_uninstall_node_error_banner',
          )} ${error.message}`,
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
