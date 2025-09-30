import { get, last, capitalize } from 'lodash';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
} from '../zerto/dedicatedCloud-datacenter-zerto.constants';

import { DEDICATED_CLOUD_DATACENTER } from '../dedicatedCloud-datacenter.constants';
import { LABELS } from '../../dedicatedCloud.constant';

export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud, dedicatedCloudZerto, $q) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.dedicatedCloudZerto = dedicatedCloudZerto;
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

    this.zertoSiteByState = this.computeZertoSiteByState(this.zertoMultiSites);
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
    return this.dedicatedCloudZerto
      .checkForZertoOptionOrder(this.serviceName)
      .then((storedZertoInformations) => {
        const storedZertoStatus =
          storedZertoInformations != null
            ? this.dedicatedCloudZerto.constructor.formatStatus(
                storedZertoInformations.status,
              )
            : this.DRP_STATUS.disabled;

        this.zertoStatus =
          [this.currentZerto.state, storedZertoStatus].find(
            (status) => status !== this.DRP_STATUS.disabled,
          ) || this.DRP_STATUS.disabled;

        this.zertoRemotePccStatus =
          this.currentZerto.drpType ===
          DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
            ? this.dedicatedCloudZerto.constructor.formatStatus(
                get(this.currentZerto, 'remoteSiteInformation.state'),
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

  computeZertoSiteByState(zertoSites) {
    return {
      success: zertoSites.filter((site) =>
        this.dedicatedCloudZerto.constructor.isZertoSiteSuccessState(
          site.state,
        ),
      ).length,
      error: zertoSites.filter((site) =>
        this.dedicatedCloudZerto.constructor.isZertoSiteErrorState(site.state),
      ).length,
      warning: zertoSites.filter((site) =>
        this.dedicatedCloudZerto.constructor.isZertoSiteWarningState(
          site.state,
        ),
      ).length,
    };
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
