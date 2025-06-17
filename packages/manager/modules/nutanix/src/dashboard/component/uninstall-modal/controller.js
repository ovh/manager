import { UNINSTALL_PATTERN } from './constants';
import {
  ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
  NUTANIX_GUIDE_LINK,
  PREFIX_TRACKING_NUTANIX_NUTANIX,
  PREFIX_TRACKING_NUTANIX_NUTANIX_POPUP,
  PREFIX_TRACKING_NUTANIX_POPUP,
} from '../../../constants';

export default class {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.UNINSTALL_PATTERN = UNINSTALL_PATTERN;
    this.NUTANIX_GUIDE_LINK = NUTANIX_GUIDE_LINK;
    this.isLoading = false;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.atInternet.trackPage({
      name: `${PREFIX_TRACKING_NUTANIX_NUTANIX_POPUP}::cluster::nodes::uninstall_node::${this.commercialRange}`,
      level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
    });
  }

  onSubmit() {
    this.atInternet.trackClick({
      name: `${PREFIX_TRACKING_NUTANIX_POPUP}::button::uninstall_node::confirm::${this.commercialRange}`,
      level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
      type: 'action',
    });
    this.isLoading = true;
    this.uninstallNode()
      .then(() => {
        this.atInternet.trackPage({
          name: `${PREFIX_TRACKING_NUTANIX_NUTANIX}::banner-success::cluster::nodes::uninstall-node-${this.commercialRange}_success`,
          level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
        });
        this.handleSuccess(
          `${this.$translate.instant(
            'nutanix_dashboard_uninstall_node_success_banner',
          )}`,
        );
      })
      .catch(() => {
        this.atInternet.trackPage({
          name: `${PREFIX_TRACKING_NUTANIX_NUTANIX}::banner-error::cluster::nodes::uninstall-node-${this.commercialRange}_error`,
          level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
        });
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

  onCancel() {
    this.atInternet.trackClick({
      name: `${PREFIX_TRACKING_NUTANIX_POPUP}::button::uninstall_node::cancel::${this.commercialRange}`,
      level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
      type: 'action',
    });
    return this.goBack();
  }
}
