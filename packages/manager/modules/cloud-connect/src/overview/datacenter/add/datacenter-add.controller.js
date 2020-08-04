import get from 'lodash/get';

import CloudConnectDatacenter from '../../../cloud-connect-datacenter.class';
import { IPV4_BLOCK_REGEX, ASN_MIN } from '../../../cloud-connect.constants';

export default class DataCenterAddCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
    this.IPV4_BLOCK_REGEX_RANGE_0_TO_28 = IPV4_BLOCK_REGEX.RANGE_0_TO_28;
    this.ASN_MIN = ASN_MIN;
  }

  create() {
    this.isLoading = true;
    const options = {
      ovhBgpArea: this.ovhBgpArea,
      datacenterId: this.datacenter.id,
      subnet: this.subnet,
    };
    return this.cloudConnectService
      .addDatacenterConfiguration(this.cloudConnectId, this.popId, options)
      .then((task) => {
        const dc = new CloudConnectDatacenter({
          ...options,
          id: task.resourceId,
          status: 'init',
          dcName: get(this.datacenter, 'name', null),
        });
        this.cloudConnect.addDcConfiguration(dc);
        return this.goBack(
          {
            textHtml: this.$translate.instant(
              'cloud_connect_datacenter_add_success',
              {
                tasksUrl: this.tasksHref,
              },
            ),
          },
          'success',
          false,
        ).then(() => {
          if (task) {
            this.cloudConnectService
              .checkTaskStatus(this.cloudConnectId, task.id)
              .finally(() => {
                dc.setActive();
              });
          }
        });
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('cloud_connect_datacenter_add_error', {
            message: get(error, 'data.message', error.message),
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
