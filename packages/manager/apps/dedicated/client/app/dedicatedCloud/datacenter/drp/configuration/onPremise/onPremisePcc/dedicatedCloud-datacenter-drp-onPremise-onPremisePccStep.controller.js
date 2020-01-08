import get from 'lodash/get';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_IP_BLOCK_REG_EXP,
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_ZERTO,
} from '../../../dedicatedCloud-datacenter-drp.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $timeout,
    $translate,
    $window,
    dedicatedCloudDrp,
    ovhUserPref,
    DEDICATED_CLOUD_CONSTANTS,
  ) {
    this.$state = $state;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.ovhUserPref = ovhUserPref;
    this.IP_BLOCK_REG_EXP = DEDICATEDCLOUD_DATACENTER_DRP_IP_BLOCK_REG_EXP;
    this.PCC_NEW_GENERATION = DEDICATED_CLOUD_CONSTANTS.pccNewGeneration;
    this.DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS;
    this.DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS = DEDICATEDCLOUD_DATACENTER_DRP_ORDER_OPTIONS;
    this.DEDICATEDCLOUD_DATACENTER_ZERTO = DEDICATEDCLOUD_DATACENTER_ZERTO;
  }

  $onInit() {
    this.drpInformations = this.$state.params.drpInformations;
  }

  validateConfiguration() {
    this.isValidating = true;

    return this.dedicatedCloudDrp
      .enableDrp(
        this.drpInformations,
        this.drpInformations.primaryPcc.generation !== this.PCC_NEW_GENERATION,
      )
      .then((enableDrp) => {
        if (enableDrp.url !== undefined) {
          this.storeZertoOptionOrderInUserPref(this.drpInformations, enableDrp);
          if (!enableDrp.hasAutoPay) {
            this.$window.open(enableDrp.url, '_blank');
          }
        }

        return this.goToPccDashboard(true).then(() => {
          // $timeout necessary to display alerter message
          this.$timeout(() => {
            if (!enableDrp.hasAutoPay) {
              this.displaySuccessMessage(
                `${this.$translate.instant(
                  'dedicatedCloud_datacenter_drp_confirm_order',
                  { billUrl: enableDrp.url },
                )}`,
              );
            } else {
              this.displayInfoMessage(`
                    ${this.$translate.instant(
                      'dedicatedCloud_datacenter_drp_confirm_creation_pending',
                    )} ${this.$translate.instant(
                'dedicatedCloud_datacenter_drp_confirm_creation_pending_task',
              )}
                `);
            }
          });
        });
      })
      .catch((error) => {
        this.displayErrorMessage(
          `${this.$translate.instant(
            'dedicatedCloud_datacenter_drp_confirm_create_error',
          )} ${get(error, 'data.message', error.message)}`,
        );
      })
      .finally(() => {
        this.isValidating = false;
      });
  }
}
