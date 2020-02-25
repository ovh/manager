import get from 'lodash/get';

import { VEEAM_TARIFF_DETAILS_URL } from '../backup.constants';
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
    this.VEEAM_TARIFF_DETAILS_URL = VEEAM_TARIFF_DETAILS_URL;
  }

  $onInit() {
    this.data = {
      conditionsAccepted: false,
      selectedOffer: {},
      orderInProgress: false,
    };
  }

  scrollToTop() {
    this.$location.hash('backupNewMainAlert');
    this.$anchorScroll();
  }

  orderBackup() {
    this.data.orderInProgress = true;
    return this.datacenterBackupService
      .orderBackup(
        this.currentUser.ovhSubsidiary,
        this.productId,
        this.datacenterId,
        this.data.selectedOffer.backupOffer,
      )
      .then(() => {
        return this.goToBackup(
          this.$translate.instant(
            'dedicatedCloud_datacenter_backup_new_create_success',
            {
              offerType: this.data.selectedOffer.backupOffer,
              guideLink: this.VEEAM_TARIFF_DETAILS_URL,
            },
          ),
        );
      })
      .catch((error) => {
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
      })
      .finally(() => {
        this.data.orderInProgress = false;
      });
  }
}
