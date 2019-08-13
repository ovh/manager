angular.module('managerApp').controller('TelecomTelephonyAliasConfigurationRecordsOvhPabxCtrl', function ($q, $stateParams, TelephonyMediator, OvhApiTelephony, TucToastError) {
  const self = this;

  /*= ==============================
  =            HELPERS            =
  =============================== */

  self.fetchQueues = function () {
    return OvhApiTelephony.OvhPabx().Hunting().Queue().v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise
      .then(ids => $q.all(_.map(ids, id => OvhApiTelephony.OvhPabx().Hunting().Queue().v6()
        .get({
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
          queueId: id,
        }).$promise)).then(queues => _.sortBy(queues, 'queueId')));
  };

  self.fetchRecords = function () {
    OvhApiTelephony.OvhPabx().Records().v6().resetAllCache();
    return OvhApiTelephony.OvhPabx().Records().v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise
      .then(recordsIds => $q
        .all(_.map(
          _.chunk(recordsIds, 50),
          chunkIds => OvhApiTelephony.OvhPabx().Records().v6().getBatch({
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
            id: chunkIds,
          }).$promise,
        ))
        .then(chunkResult => _.pluck(_.flatten(chunkResult), 'value')));
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
  =            ACTIONS            =
  =============================== */

  self.updateQueue = function (queue) {
    const attrs = ['record', 'askForRecordDisabling', 'recordDisablingLanguage', 'recordDisablingDigit'];
    return OvhApiTelephony.OvhPabx().Hunting().Queue().v6()
      .change({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        queueId: _.get(queue, 'queueId'),
      }, _.pick(queue, attrs)).$promise;
  };

  self.deleteSelectedRecords = function (records) {
    return $q.all(_.map(records, record => OvhApiTelephony.OvhPabx().Records().v6().remove({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
      id: record.id,
    }).$promise));
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.isLoading = true;
    return TelephonyMediator.getGroup($stateParams.billingAccount).then((group) => {
      self.number = group.getNumber($stateParams.serviceName);
      return self.number.feature.init().then(() => {
        if (self.number.getFeatureFamily() === 'ovhPabx') {
          self.recordsApi = {
            fetchQueues: self.fetchQueues,
            updateQueue: self.updateQueue,
            fetchRecords: self.fetchRecords,
            deleteSelectedRecords: self.deleteSelectedRecords,
          };
        }
      });
    }).catch(err => new TucToastError(err)).finally(() => {
      self.isLoading = false;
    });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
