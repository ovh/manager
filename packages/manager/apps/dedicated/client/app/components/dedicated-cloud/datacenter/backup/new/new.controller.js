import find from 'lodash/find';
import get from 'lodash/get';

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
      manualOrderValidationRequired: !(
        this.backup.isLegacy() || !!this.defaultPaymentMethod
      ),
      selectedOffer: {
        backupOffer: get(
          this.enabledBackupOffer,
          'backupOffer',
          BACKUP_OFFER_CLASSIC,
        ),
      },
      selectedOfferDetails: null,
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
      'datacenterBackupNew',
    );
    this.scrollToTop();
    this.data.currentStep = 0;
  }

  createBackupOrder() {
    this.data.backupOrder = null;
    this.data.orderCreationInProgress = true;
    this.data.selectedOfferDetails = find(this.backupOffers, {
      offerName: this.data.selectedOffer.backupOffer,
    });
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
            ...this.backup,
            backupOffer: this.data.selectedOffer.backupOffer,
          },
        )
      : this.dedicatedCloudDatacenterBackupService.checkoutCart(
          this.data.backupOrder.cartItem,
          !!this.defaultPaymentMethod,
        )
    )
      .then((order) => {
        this.backup.state = BACKUP_STATE_ENABLING;
        return this.goToBackup(
          this.$translate.instant(
            this.data.manualOrderValidationRequired
              ? 'dedicatedCloud_datacenter_backup_new_order_success'
              : 'dedicatedCloud_datacenter_backup_new_create_success',
            {
              offerType: get(
                this.BACKUP_OFFER_NAME,
                this.data.selectedOffer.backupOffer,
              ),
              operationsUrl: this.operationsUrl,
              orderUrl: order.url,
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
