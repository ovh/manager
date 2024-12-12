import { POWEROFF_PATTERN } from './constants';
import { NUTANIX_GUIDE_LINK } from '../../../constants';

export default class {
  /* @ngInject */
  constructor($window, $translate) {
    this.$translate = $translate;
    this.POWEROFF_PATTERN = POWEROFF_PATTERN;
    this.NUTANIX_GUIDE_LINK = NUTANIX_GUIDE_LINK;
    this.isLoading = false;
  }

  onSubmit() {
    this.isLoading = true;
    this.poweroffNode()
      .then(() => {
        this.handleSuccess(
          `${this.$translate.instant(
            'nutanix_dashboard_poweroff_node_success_banner',
          )}`,
        );
      })
      .catch((error) => {
        this.handleError(
          `${this.$translate.instant(
            'nutanix_dashboard_poweroff_node_error_banner',
          )} ${error.message}`,
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
