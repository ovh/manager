import assign from 'lodash/assign';
import filter from 'lodash/filter';
import head from 'lodash/head';
import pick from 'lodash/pick';

export default /* @ngInject */ function controller(
  $filter,
  $q,
  $timeout,
  $translate,
  TelephonyMediator,
  TucToastError,
  TucToast,
) {
  const self = this;

  /*= ==============================
        =            HELPERS            =
        =============================== */

  function fetchEnums() {
    return TelephonyMediator.getApiModelEnum(
      'telephony.OvhPabxHuntingQueueRecordDisablingLanguageEnum',
    ).then((enumValue) => enumValue);
  }

  function refreshQueues() {
    self.queues.isLoading = true;
    return self.api
      .fetchQueues()
      .then((queues) => {
        self.queues.raw = queues;
        self.queues.selected = head(self.queues.raw);
        self.queueForm = angular.copy(self.queues.selected);
      })
      .finally(() => {
        self.queues.isLoading = false;
      });
  }

  function refreshRecords() {
    self.records.isLoading = true;
    return self.api
      .fetchRecords()
      .then((records) => {
        self.records.raw = records;
        self.sortRecords(records);
      })
      .finally(() => {
        self.records.isLoading = false;
      });
  }

  self.hasChanges = function hasChanges() {
    return !angular.equals(self.queues.selected, self.queueForm);
  };

  self.getSelection = function getSelection() {
    return filter(
      self.records.raw,
      (record) => self.records.selected && self.records.selected[record.id],
    );
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
        =            ACTIONS            =
        =============================== */

  self.changeQueue = function changeQueue() {
    self.queues.isLoading = true;
    $timeout(angular.noop, 100).finally(() => {
      self.queueForm = angular.copy(self.queues.selected);
      self.queues.isLoading = false;
    });
  };

  self.submitQueueChanges = function submitQueueChanges() {
    const attrs = [
      'record',
      'askForRecordDisabling',
      'recordDisablingLanguage',
      'recordDisablingDigit',
    ];
    self.queues.isUpdating = true;
    return self.api
      .updateQueue(self.queueForm)
      .then(() => {
        assign(self.queues.selected, pick(self.queueForm, attrs));
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.queues.isUpdating = false;
      });
  };

  self.undoChanges = function undoChanges() {
    self.queueForm = angular.copy(self.queues.selected);
  };

  self.sortRecords = function sortRecords() {
    let data = angular.copy(self.records.raw);
    data = $filter('orderBy')(
      data,
      self.records.orderBy,
      self.records.orderDesc,
    );
    self.records.sorted = data;

    // avoid pagination bug…
    if (self.records.sorted.length === 0) {
      self.records.paginated = [];
    }
  };

  self.orderRecordsBy = function orderRecordsBy(by) {
    if (self.records.orderBy === by) {
      self.records.orderDesc = !self.records.orderDesc;
    } else {
      self.records.orderBy = by;
    }
    self.sortRecords();
  };

  self.deleteSelectedRecords = function deleteSelectedRecords() {
    const records = self.getSelection();
    self.records.isDeleting = true;
    TucToast.info(
      $translate.instant(
        'telephony_alias_configuration_records_list_delete_success',
      ),
    );
    return self.api
      .deleteSelectedRecords(records)
      .then(() => {
        self.records.selected = {};
        refreshRecords();
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.records.isDeleting = false;
      });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
        =            INITIALIZATION            =
        ====================================== */

  self.$onInit = function $onInit() {
    self.enums = null;
    self.queues = {
      raw: [],
      selected: null,
      isLoading: false,
      isUpdating: false,
    };
    self.queueForm = null;
    self.records = {
      raw: [],
      paginated: null,
      sorted: null,
      selected: {},
      orderBy: 'callStart',
      orderDesc: false,
      isLoading: false,
      isDeleting: false,
    };

    return $translate.refresh().finally(() => {
      self.isInitialized = true;
      return $q
        .all({
          enums: fetchEnums(),
          queue: refreshQueues(),
          records: refreshRecords(),
        })
        .then((result) => {
          self.enums = result.enums;
        })
        .catch((err) => new TucToastError(err));
    });
  };

  /* -----  End of INITIALIZATION  ------*/
}
