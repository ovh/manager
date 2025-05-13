import chunk from 'lodash/chunk';
import forEach from 'lodash/forEach';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import set from 'lodash/set';

export default /* @ngInject */ function TelecomTelephonyBillingAccountBillingBillCtrl(
  $stateParams,
  $filter,
  $q,
  $timeout,
  $window,
  OvhApiTelephony,
  TucToastError,
) {
  const self = this;

  function fetchConsumption() {
    return OvhApiTelephony.HistoryConsumption()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
      })
      .$promise.then((ids) =>
        $q
          .all(
            map(
              chunk(ids, 50),
              (chunkIds) =>
                OvhApiTelephony.HistoryConsumption()
                  .v6()
                  .getBatch({
                    billingAccount: $stateParams.billingAccount,
                    date: chunkIds,
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
      );
  }

  this.$onInit = function $onInit() {
    self.consumption = {
      raw: null,
    };
    self.refresh();
  };

  self.refresh = function refresh() {
    fetchConsumption().then(
      (result) => {
        self.consumption.raw = result;
      },
      (err) => new TucToastError(err),
    );
  };

  self.fetchFile = function fetchFile(consumption, type) {
    const tryDownload = function tryDownload() {
      return OvhApiTelephony.HistoryConsumption()
        .v6()
        .getFile({
          billingAccount: $stateParams.billingAccount,
          date: consumption.date,
          extension: type,
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

  self.download = function download(consumption, type) {
    set(consumption, 'downloading', true);
    self
      .fetchFile(consumption, type)
      .then(
        (info) => {
          // eslint-disable-next-line no-param-reassign
          $window.location.href = info.url;
        },
        (err) => new TucToastError(err),
      )
      .finally(() => {
        set(consumption, 'downloading', false);
      });
  };
}
