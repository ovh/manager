import { get, last, capitalize } from 'lodash';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
} from '../drp/dedicatedCloud-datacenter-drp.constants';

import { DEDICATED_CLOUD_DATACENTER } from '../dedicatedCloud-datacenter.constants';
import { LABELS } from '../../dedicatedCloud.constant';

export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud, dedicatedCloudDrp, $q) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.$q = $q;
    this.DRP_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_STATUS;
    this.DRP_VPN_STATUS = DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS;
    this.LABELS = LABELS;
  }

  $onInit() {
    this.loading = true;
    this.pollNsxTaskId = null;
    this.$q
      .all([
        this.getNsxtDetails(),
        this.getNsxtEdgePendingTask(),
        this.checkForZertoOptionOrder(),
        this.getNsxtOption(),
      ])
      .finally(() => {
        this.loading = false;
      });
  }

  $onDestroy() {
    if (this.pollNsxTaskId) {
      this.DedicatedCloud.stopResizeNsxTaskPoller(this.pollNsxTaskId);
    }
  }

  getNsxtOption() {
    return this.DedicatedCloud.getDatacenterNsxtOptionState(
      this.serviceName,
    ).then(({ enabled }) => {
      this.isNsxtEnabled = enabled;
    });
  }

  pollNsxtTask(taskId) {
    this.pollNsxTaskId = taskId;
    this.DedicatedCloud.datacenterResizeNsxTaskPoller(this.serviceName, taskId)
      .then(() => {
        this.getNsxtDetails();
      })
      .finally(() => {
        this.pollNsxTaskId = null;
      });
  }

  getNsxtEdgePendingTask() {
    return this.DedicatedCloud.getDatacenterPendingResizeNsxTask(
      this.serviceName,
      this.datacenter.model.id,
    ).then((data) => {
      if (data?.length > 0) {
        this.pollNsxtTask(data[0].taskId);
      }
    });
  }

  getNsxtDetails() {
    return this.DedicatedCloud.getDatacenterInfoNsxt(
      this.serviceName,
      this.datacenter.model.id,
    ).then((data) => {
      this.datacenter.model.edgesCount = data.length;
      this.datacenter.model.edgesLevel = data[0]
        ? capitalize(data[0].size)
        : '';
      this.datacenter.model.edgesStatus = data[0] ? data[0].state : '';
    });
  }

  checkForZertoOptionOrder() {
    return this.dedicatedCloudDrp
      .checkForZertoOptionOrder(this.serviceName)
      .then((storedDrpInformations) => {
        const storedDrpStatus =
          storedDrpInformations != null
            ? this.dedicatedCloudDrp.constructor.formatStatus(
                storedDrpInformations.status,
              )
            : this.DRP_STATUS.disabled;

        this.drpStatus =
          [this.currentDrp.state, storedDrpStatus].find(
            (status) => status !== this.DRP_STATUS.disabled,
          ) || this.DRP_STATUS.disabled;

        this.drpRemotePccStatus =
          this.currentDrp.drpType === DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
            ? this.dedicatedCloudDrp.constructor.formatStatus(
                get(this.currentDrp, 'remoteSiteInformation.state'),
              )
            : this.DRP_STATUS.delivered;
      })
      .catch((error) => {
        this.setMessage(
          `${this.$translate.instant(
            'dedicatedCloud_datacenter_drp_get_state_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      });
  }

  /* Update description or name */
  editDescription(value, contextTitle) {
    const context = last(contextTitle.split('_'));
    const successText = this.$translate.instant(
      `dedicatedCloud_datacenter_${context}Modifying_success`,
    );
    const destinationId = DEDICATED_CLOUD_DATACENTER.alertId;

    this.editDetails({
      contextTitle,
      successText,
      datacenterId: this.datacenter.model.id,
      destinationId,
      value,
    });
  }
}
