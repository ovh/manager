import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import map from 'lodash/map';
import pick from 'lodash/pick';
import sortBy from 'lodash/sortBy';

export default /* @ngInject */ function TelecomTelephonyAliasConfigurationRecordsOvhPabxCtrl(
  $q,
  $stateParams,
  TelephonyMediator,
  OvhApiTelephony,
  TucToastError,
) {
  const self = this;

  /*= ==============================
  =            HELPERS            =
  =============================== */

  self.fetchQueues = function fetchQueues() {
    return OvhApiTelephony.OvhPabx()
      .Hunting()
      .Queue()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((ids) =>
        $q
          .all(
            map(
              ids,
              (id) =>
                OvhApiTelephony.OvhPabx()
                  .Hunting()
                  .Queue()
                  .v6()
                  .get({
                    billingAccount: $stateParams.billingAccount,
                    serviceName: $stateParams.serviceName,
                    queueId: id,
                  }).$promise,
            ),
          )
          .then((queues) => sortBy(queues, 'queueId')),
      );
  };

  self.fetchRecords = function fetchRecords() {
    OvhApiTelephony.OvhPabx()
      .Records()
      .v6()
      .resetAllCache();
    return OvhApiTelephony.OvhPabx()
      .Records()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((recordsIds) =>
        $q
          .all(
            map(
              chunk(recordsIds, 50),
              (chunkIds) =>
                OvhApiTelephony.OvhPabx()
                  .Records()
                  .v6()
                  .getBatch({
                    billingAccount: $stateParams.billingAccount,
                    serviceName: $stateParams.serviceName,
                    id: chunkIds,
                  }).$promise,
            ),
          )
          .then((chunkResult) => map(flatten(chunkResult), 'value')),
      );
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
  =            ACTIONS            =
  =============================== */

  self.updateQueue = function updateQueue(queue) {
    const attrs = [
      'record',
      'askForRecordDisabling',
      'recordDisablingLanguage',
      'recordDisablingDigit',
    ];
    return OvhApiTelephony.OvhPabx()
      .Hunting()
      .Queue()
      .v6()
      .change(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
          queueId: get(queue, 'queueId'),
        },
        pick(queue, attrs),
      ).$promise;
  };

  self.deleteSelectedRecords = function deleteSelectedRecords(records) {
    return $q.all(
      map(
        records,
        (record) =>
          OvhApiTelephony.OvhPabx()
            .Records()
            .v6()
            .remove({
              billingAccount: $stateParams.billingAccount,
              serviceName: $stateParams.serviceName,
              id: record.id,
            }).$promise,
      ),
    );
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.isLoading = true;
    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
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
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isLoading = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
