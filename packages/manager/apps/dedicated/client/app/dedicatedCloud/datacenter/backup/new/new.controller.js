import get from 'lodash/get';
import pick from 'lodash/pick';

import {
  BACKUP_OFFER_CLASSIC,
  BACKUP_OFFER_NAME,
  BACKUP_STATE_ENABLING,
} from '../backup.constants';

export default class {
  /* @ngInject */
  constructor($q, $translate, Alerter, dedicatedCloudDatacenterBackupService) {
    this.$q = $q;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.dedicatedCloudDatacenterBackupService = dedicatedCloudDatacenterBackupService;

    this.BACKUP_OFFER_NAME = BACKUP_OFFER_NAME;
  }

  $onInit() {
    this.data = {
      backupOrder: null,
      conditionsAccepted: false,
      currentStep: 0,
      orderInProgress: false,
      orderCreationInProgress: false,
      selectedOffer: {
        backupOffer: get(
          this.enabledBackupOffer,
          'backupOffer',
          BACKUP_OFFER_CLASSIC,
        ),
      },
    };
    if (this.backup.isLegacy()) {
      this.showOrderFlow = false;
    }
  }

  handleOrderError(error) {
    this.alerter.error(
      this.$translate.instant(
        'dedicatedCloud_datacenter_backup_new_create_error',
        {
          message: get(error, ['data', 'message'], error.message),
        },
      ),
      'app.dedicatedClouds.datacenter.backup.new',
    );
    this.scrollToTop();
    this.data.currentStep = 0;
  }

  createBackupOrder() {
    this.data.backupOrder = null;
    this.data.orderCreationInProgress = true;
    return (this.backup.isLegacy()
      ? this.$q.when({})
      : this.dedicatedCloudDatacenterBackupService.createBackupOrder(
          this.currentUser.ovhSubsidiary,
          this.productId,
          this.datacenterId,
          this.data.selectedOffer.backupOffer,
        )
    )
      .then((order) => {
        this.data.backupOrder = order;
      })
      .catch((error) => this.handleOrderError(error))
      .finally(() => {
        this.data.orderCreationInProgress = false;
      });
  }

  orderBackup() {
    this.data.orderInProgress = true;
    return (this.backup.isLegacy()
      ? this.dedicatedCloudDatacenterBackupService.updateBackupCapabilities(
          this.productId,
          this.datacenterId,
          {
            ...pick(this.backup, [
              'backupDurationInReport',
              'backupSizeInReport',
              'diskSizeInReport',
              'fullDayInReport',
              'restorePointInReport',
              'mailAddress',
            ]),
            backupOffer: this.data.selectedOffer.backupOffer,
          },
        )
      : this.dedicatedCloudDatacenterBackupService.checkoutCart(
          this.data.backupOrder.cartItem,
        )
    )
      .then(() => {
        this.backup.state = BACKUP_STATE_ENABLING;
        return this.goToBackup(
          this.$translate.instant(
            'dedicatedCloud_datacenter_backup_new_create_success',
            {
              offerType: get(
                this.BACKUP_OFFER_NAME,
                this.data.selectedOffer.backupOffer,
              ),
              operationsUrl: this.operationsUrl,
            },
          ),
        );
      })
      .catch((error) => this.handleOrderError(error))
      .finally(() => {
        this.data.orderInProgress = false;
      });
  }
}
