import {
  ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
  PREFIX_TRACKING_NUTANIX_DATAGRID,
} from '../../../../constants';
import { NO_OS_INSTALLED_REGEX, TRAVAUX_LINK } from './constants';

export default class NutanixNodeGeneralInfoCtrl {
  /* @ngInject */
  constructor(
    $translate,
    coreConfig,
    NutanixNode,
    $rootScope,
    Alerter,
    atInternet,
  ) {
    this.$translate = $translate;
    this.region = coreConfig.getRegion();
    this.nutanixNodeService = NutanixNode;
    this.$rootScope = $rootScope;
    this.Alerter = Alerter;
    this.atInternet = atInternet;
    this.TRAVAUX_LINK = TRAVAUX_LINK[this.region] || TRAVAUX_LINK.DEFAULT;
  }

  $onInit() {
    this.atInternet.trackPage({
      name: `${PREFIX_TRACKING_NUTANIX_DATAGRID}::link::details_node::${this.commercialRange}`,
      level2: ENTERPRISE_SOLUTIONS_LEVEL_2_CODE,
    });
    this.isRebooting = false;
    this.loadServer();
    // Server Restart
    this.$rootScope.$on('nutanix.node.reboot', (e, _task) => {
      let task = _task;
      this.isRebooting = true;
      task = task.data ? task.data : task;
      task.id = task.taskId;
      this.pollTask(task);
    });
  }

  loadServer() {
    /* if there is no os installed, the api return "none_64" */
    if (NO_OS_INSTALLED_REGEX.test(this.server.os)) {
      this.server.os = null;
    }
  }

  showNameActions() {
    return this.region !== 'US';
  }

  getFormatedCommercialRange() {
    if (this.isHousingRange()) {
      return this.$translate.instant(
        'server_configuration_description_housing',
      );
    }
    return this.server.description || '-';
  }

  isHousingRange() {
    return this.server.commercialRange === 'housing';
  }

  pollTask(task) {
    this.nutanixNodeService
      .startPolling(this.nodeId, task)
      .then(() => {
        this.isRebooting = false;
        this.Alerter.alertFromSWS(
          this.$translate.instant('server_configuration_reboot_successfull', {
            serverName: this.server.displayName,
          }),
          'DONE',
          'nutanix_node_alert',
        );
      })
      .catch(() => {
        this.isRebooting = false;
        this.Alerter.alertFromSWS(
          this.$translate.instant('server_configuration_reboot_fail_task'),
          'ERROR',
          'nutanix_node_alert',
        );
      });
  }
}
