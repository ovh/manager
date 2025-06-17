import { POWEROFF_PATTERN } from './constants';
import {
  NUTANIX_GUIDE_LINK,
  PREFIX_TRACKING_NUTANIX_POPUP,
  PREFIX_TRACKING_NUTANIX_NUTANIX,
  PREFIX_TRACKING_NUTANIX_NUTANIX_POPUP,
} from '../../../constants';

export default class {
  /* @ngInject */
  constructor(atInternet, $translate) {
    this.$translate = $translate;
    this.POWEROFF_PATTERN = POWEROFF_PATTERN;
    this.NUTANIX_GUIDE_LINK = NUTANIX_GUIDE_LINK;
    this.isLoading = false;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.atInternet.trackPage({
      name: `${PREFIX_TRACKING_NUTANIX_NUTANIX_POPUP}::cluster::nodes::poweroff_node::${this.nodeId}`,
      type: 'action',
    });
  }

  onSubmit() {
    this.atInternet.trackClick({
      name: `${PREFIX_TRACKING_NUTANIX_POPUP}::button::poweroff_node::confirm::${this.nodeId}`,
      type: 'action',
    });
    this.isLoading = true;
    this.poweroffNode()
      .then(() => {
        this.atInternet.trackPage({
          name: `${PREFIX_TRACKING_NUTANIX_NUTANIX}::banner-success::cluster::nodes::poweroff-node-${this.nodeId}_success`,
        });
        this.handleSuccess(
          `${this.$translate.instant(
            'nutanix_dashboard_poweroff_node_success_banner',
          )}`,
        );
      })
      .catch((error) => {
        this.atInternet.trackPage({
          name: `${PREFIX_TRACKING_NUTANIX_NUTANIX}::banner-error::cluster::nodes::poweroff-node-${this.nodeId}_error`,
        });
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

  onCancel() {
    this.atInternet.trackClick({
      name: `${PREFIX_TRACKING_NUTANIX_POPUP}::button::poweroff_node::cancel::${this.nodeId}`,
      type: 'action',
    });
    this.goBack();
  }
}
