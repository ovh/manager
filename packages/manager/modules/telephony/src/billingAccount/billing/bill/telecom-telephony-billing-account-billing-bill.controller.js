angular.module('managerApp').controller('TelecomTelephonyBillingAccountBillingBillCtrl', function ($stateParams, $filter, $q, $timeout, $window, OvhApiTelephony, TucToastError) {
  const self = this;

  function fetchConsumption() {
    return OvhApiTelephony.HistoryConsumption().v6()
      .query({
        billingAccount: $stateParams.billingAccount,
      }).$promise
      .then(ids => $q
        .all(_.map(
          _.chunk(ids, 50),
          chunkIds => OvhApiTelephony.HistoryConsumption().v6().getBatch({
            billingAccount: $stateParams.billingAccount,
            date: chunkIds,
          }).$promise,
        ))
        .then((chunkResult) => {
          const result = _.pluck(_.flatten(chunkResult), 'value');
          return _.each(result, (consumption) => {
            _.set(consumption, 'priceValue', consumption.price ? consumption.price.value : null);
          });
        }));
  }

  this.$onInit = function () {
    self.consumption = {
      raw: null,
    };
    self.refresh();
  };

  self.refresh = function () {
    fetchConsumption().then((result) => {
      self.consumption.raw = result;
    }, err => new TucToastError(err));
  };

  self.fetchFile = function (consumption, type) {
    const tryDownload = function () {
      return OvhApiTelephony.HistoryConsumption().v6().getFile({
        billingAccount: $stateParams.billingAccount,
        date: consumption.date,
        extension: type,
      }).$promise.then((info) => {
        if (info.status === 'error') {
          return $q.reject({
            statusText: 'Unable to download message',
          });
        } if (info.status === 'done') {
          return $q.when(info);
        }

        // file is not ready to download, just retry
        return $timeout(tryDownload, 1000);
      });
    };
    return tryDownload();
  };

  self.download = function (consumption, type) {
    _.set(consumption, 'downloading', true);
    self.fetchFile(consumption, type).then((info) => {
      $window.location.href = info.url; // eslint-disable-line
    }, err => new TucToastError(err)).finally(() => {
      _.set(consumption, 'downloading', false);
    });
  };
});
