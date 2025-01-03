import { POWEROFF_GUIDE_LINKS, POWEROFF_PATTERN } from './constants';

export default class {
  /* @ngInject */
  constructor($window, $translate) {
    this.$translate = $translate;
    this.POWEROFF_PATTERN = POWEROFF_PATTERN;
    this.isLoading = false;
  }

  get poweroffGuidelink() {
    return POWEROFF_GUIDE_LINKS[this.userSubsidiary] ?? POWEROFF_GUIDE_LINKS.EN;
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
