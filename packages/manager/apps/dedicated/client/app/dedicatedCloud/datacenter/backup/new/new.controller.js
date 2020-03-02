import get from 'lodash/get';

import { MODES } from '../components/termsOfUse/terms-of-use.constants';

export default class {
  /* @ngInject */
  constructor(
    $anchorScroll,
    $location,
    $translate,
    Alerter,
    datacenterBackupService,
  ) {
    this.$anchorScroll = $anchorScroll;
    this.$location = $location;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.datacenterBackupService = datacenterBackupService;

    this.MODES = MODES;
  }

  $onInit() {
    this.data = {
      backupOrder: null,
      conditionsAccepted: false,
      currentStep: 0,
      orderInProgress: false,
      orderCreationInProgress: false,
      selectedOffer: {},
    };
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
    return this.datacenterBackupService
      .createBackupOrder(
        this.currentUser.ovhSubsidiary,
        this.productId,
        this.datacenterId,
        this.data.selectedOffer.backupOffer,
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
    return this.datacenterBackupService
      .checkoutCart(this.data.backupOrder.cartItem)
      .then(() => {
        return this.goToBackup(
          this.$translate.instant(
            'dedicatedCloud_datacenter_backup_new_create_success',
            {
              offerType: this.data.selectedOffer.backupOffer,
              guideLink: this.backupTariffUrl,
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
