import { UNINSTALL_PATTERN } from './constants';
import { NUTANIX_GUIDE_LINK } from '../../../constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.UNINSTALL_PATTERN = UNINSTALL_PATTERN;
    this.NUTANIX_GUIDE_LINK = NUTANIX_GUIDE_LINK;
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
      .catch(() => {
        this.handleError(
          this.$translate.instant(
            'nutanix_dashboard_uninstall_node_error_banner',
          ),
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
