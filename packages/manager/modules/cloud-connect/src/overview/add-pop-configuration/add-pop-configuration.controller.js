import find from 'lodash/find';
import get from 'lodash/get';

import {
  POP_TYPE_CONSTANT,
  IPV4_BLOCK_REGEX,
  ASN_MIN,
} from '../../cloud-connect.constants';

export default class AddPopConfigurationCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
    this.IPV4_BLOCK_REGEX_RANGE_30 = IPV4_BLOCK_REGEX.RANGE_30;
    this.ASN_MIN = ASN_MIN;
    this.POP_TYPE_CONSTANT = POP_TYPE_CONSTANT;
  }

  $onInit() {
    this.isLoading = false;
    this.pop = {};
    this.popType = null;
    if (!this.cloudConnect.isDirectService()) {
      this.popType = find(this.popTypes, { id: POP_TYPE_CONSTANT.L3 });
    }
    if (this.allowedPopType) {
      this.popType = find(this.popTypes, { id: this.allowedPopType.type });
      this.popTypeSelected = !!this.popType;
    }
  }

  configurePop() {
    this.cloudConnectService.trackClick(
      'cloud-connect::overview::add-pop::confirm',
    );
    this.isLoading = true;
    this.cloudConnectService
      .addPopConfiguration(
        this.cloudConnect.id,
        this.interfaceId,
        this.popType.id,
        this.pop,
      )
      .then((task) => {
        const popConfig = this.cloudConnect.addPopConfiguration({
          ...this.pop,
          id: task.resourceId,
          status: 'init',
          interfaceId: this.interfaceId,
          type: this.popType.id,
        });
        return this.goBack(
          {
            textHtml: this.$translate.instant(
              'cloud_connect_pop_add_configuration_success',
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
              .checkTaskStatus(this.cloudConnect.id, task.id)
              .finally(() => {
                popConfig.setActive();
              });
          }
        });
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('cloud_connect_pop_add_configuration_error', {
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
