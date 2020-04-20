import capitalize from 'lodash/capitalize';
import get from 'lodash/get';
import padStart from 'lodash/padStart';
import range from 'lodash/range';
import 'moment';

import { GET_RECORD_NUMBER_OF_YEARS, POLLER_TIMEOUT } from './cdr.constants';

export default class CarrierSipCdrCtrl {
  /* @ngInject */
  constructor($timeout, $translate, $window, OvhApiTelephony, TucToast) {
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.OvhApiTelephony = OvhApiTelephony;
    this.TucToast = TucToast;
  }

  $onInit() {
    const currentYear = moment().year();
    this.months = moment.months().map(capitalize);
    this.month = null;
    this.years = range(
      currentYear,
      currentYear - GET_RECORD_NUMBER_OF_YEARS,
      -1,
    );
    this.year = null;
    this.poller = null;
  }

  /**
   * Get the Call Detail Records of your Carrier SIP service
   * {@link https://api.ovh.com/console/#/telephony/%7BbillingAccount%7D/carrierSip/%7BserviceName%7D/cdrs#GET}
   * @return {Promise}
   */
  getCallDetailRecords() {
    const { billingAccount, serviceName } = this;
    const month = this.months.indexOf(this.month) + 1;

    const tryGetTelephonyDocument = () =>
      this.OvhApiTelephony.CarrierSip()
        .Cdrs()
        .v6()
        .get({
          billingAccount,
          serviceName,
          month: `${this.year}-${padStart(month, 2, '0')}`,
        })
        .$promise.then(({ validationDate, url }) => {
          if (validationDate) {
            return url;
          }
          this.poller = this.$timeout(tryGetTelephonyDocument, POLLER_TIMEOUT);
          return this.poller;
        });

    this.isExporting = true;
    return tryGetTelephonyDocument()
      .then((url) => {
        this.$window.location.href = url;
        return this.TucToast.success(
          this.$translate.instant('carrier_sip_cdr_action_succeed'),
        );
      })
      .catch((err) =>
        this.TucToast.error(
          `${this.$translate.instant('carrier_sip_cdr_action_failed')} ${get(
            err,
            'data.message',
          )}`,
        ),
      )
      .finally(() => {
        this.isExporting = false;
      });
  }

  isValid() {
    return !this.isExporting && this.month && this.year;
  }

  /**
   * Destroy the poller if user leave the current state.
   * @return {void}
   */
  $onDestroy() {
    this.$timeout.cancel(this.poller);
  }
}
