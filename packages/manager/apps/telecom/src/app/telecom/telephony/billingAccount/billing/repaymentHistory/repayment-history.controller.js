import chunk from 'lodash/chunk';
import forEach from 'lodash/forEach';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import set from 'lodash/set';

export default /* @ngInject */ function TelecomTelephonyBillingAccountBillingRepaymentHistoryCtrl(
  $q,
  $filter,
  $window,
  $timeout,
  $stateParams,
  $translate,
  TelephonyMediator,
  OvhApiTelephony,
  TucToast,
) {
  const self = this;

  self.group = null;
  self.consumptionData = null;

  self.groupCalledFeesHistoryUrl = TelephonyMediator.getV6ToV4RedirectionUrl(
    'group.group_called_fees_history',
  );

  /*= ==============================
  =            HELPERS            =
  =============================== */

  function fetchHistory() {
    return OvhApiTelephony.HistoryRepaymentConsumption()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then((dates) =>
        $q
          .all(
            map(
              chunk(dates, 50),
              (chunkDates) =>
                OvhApiTelephony.HistoryRepaymentConsumption()
                  .v6()
                  .getBatch({
                    billingAccount: $stateParams.billingAccount,
                    date: chunkDates,
                  }).$promise,
            ),
          )
          .then((chunkResult) => {
            const result = map(flatten(chunkResult), 'value');
            return forEach(result, (consumption) => {
              set(
                consumption,
                'priceValue',
                consumption.price ? consumption.price.value : null,
              );
            });
          }),
      )
      .catch((err) => {
        self.consumptionData = [];
        TucToast.error(
          [
            $translate.instant(
              'telephony_group_billing_repayment_history_download_error',
            ),
            (err.data && err.data.message) || '',
          ].join(' '),
        );
        return $q.reject(err);
      });
  }

  self.fetchFile = function fetchFile(consumption) {
    const tryDownload = function tryDownload() {
      return OvhApiTelephony.HistoryRepaymentConsumption()
        .v6()
        .getDocument({
          billingAccount: $stateParams.billingAccount,
          date: consumption.date,
        })
        .$promise.then((info) => {
          if (info.status === 'error') {
            return $q.reject({
              statusText: 'Unable to download message',
            });
          }
          if (info.status === 'done') {
            return $q.when(info);
          }

          // file is not ready to download, just retry
          return $timeout(tryDownload, 1000);
        });
    };
    return tryDownload();
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
  =            ACTIONS            =
  =============================== */

  self.download = function download(consumption) {
    set(consumption, 'downloading', true);

    return self
      .fetchFile(consumption)
      .then((info) => {
        // eslint-disable-next-line no-param-reassign
        $window.location.href = info.url;
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_group_billing_repayment_history_download_error',
            ),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
        return $q.reject(error);
      });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  this.$onInit = function $onInit() {
    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.group = group;

        return fetchHistory().then((consumptions) => {
          self.consumptionData = consumptions;
        });
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_group_billing_repayment_history_download_error',
            ),
            (error.data && error.data.message) || '',
          ].join(' '),
        );
        return $q.reject(error);
      });
  };
}
