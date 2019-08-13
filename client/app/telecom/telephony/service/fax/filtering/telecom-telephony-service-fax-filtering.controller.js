angular.module('managerApp').controller('TelecomTelephonyServiceFaxFilteringCtrl', function ($filter, $q, $stateParams, $timeout, $translate, TelephonyMediator, OvhApiTelephony, TucToast, tucTelephonyBulk) {
  const self = this;
  let faxSettings = null;
  const screenListsTypes = [
    'whitelistedNumbers', 'whitelistedTSI',
    'blacklistedNumbers', 'blacklistedTSI',
  ];

  /* ===============================
  =            HELPERS            =
  =============================== */

  function clearCache() {
    OvhApiTelephony.Fax().v6().resetCache();
    OvhApiTelephony.Fax().v6().resetQueryCache();
  }

  function fetchScreenLists() {
    return OvhApiTelephony.Fax().v6().getScreenLists({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }).$promise.then((screenLists) => {
      self.screenListsForm.filteringList = screenLists.filteringList;
      return _.map(screenListsTypes, type => _.map(_.get(screenLists, type), screen => ({
        callNumber: screenLists.callNumber,
        number: screen,
        type,
        id: _.random(_.now()),
      })));
    }).then(screenLists => _.flatten(screenLists));
  }

  function fetchSettings() {
    clearCache();
    return OvhApiTelephony.Fax().v6().getSettings({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }).$promise;
  }

  self.getSelection = function () {
    return _.filter(
      self.screenLists.raw,
      screen => screen && self.screenLists.selected && self.screenLists.selected[screen.id],
    );
  };

  /* -----  End of HELPERS  ------ */

  /* ===============================
  =            ACTIONS            =
  =============================== */

  self.updateFilteringList = function () {
    self.screenListsForm.isUpdating = true;
    return OvhApiTelephony.Fax().v6().createScreenLists({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }, _.pick(self.screenListsForm, 'filteringList')).$promise.catch((err) => {
      TucToast.error([$translate.instant('telephony_service_fax_filtering_list_update_error'), _.get(err, 'data.message')].join(' '));
      return $q.reject(err);
    }).finally(() => {
      self.screenListsForm.isUpdating = false;
    });
  };

  self.updateAnonymousRejection = function () {
    self.screenListsForm.isUpdating = true;
    const param = _.pick(faxSettings, ['faxMaxCall', 'faxQuality', 'faxTagLine', 'fromEmail', 'fromName', 'mailFormat', 'redirectionEmail']);
    param.rejectAnonymous = self.rejectAnonymous;
    return OvhApiTelephony.Fax().v6().setSettings({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }, param).$promise.then(() => fetchSettings()).catch((error) => {
      TucToast.error([$translate.instant('telephony_service_fax_filtering_anonymous_rejection_update_error'), _.get(error, 'data.message')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.screenListsForm.isUpdating = false;
    });
  };

  self.addScreen = function (form) {
    const screenList = {};
    const screenListType = [
      self.screenListToAdd.nature,
      self.screenListToAdd.type,
    ].join('');
    screenList[screenListType] = [].concat(self.screenListToAdd.number);
    self.screenListsForm.isAdding = true;
    return OvhApiTelephony.Fax().v6().createScreenLists({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }, screenList).$promise.then(() => {
      form.$setPristine();
      self.screenListToAdd.number = '';
      TucToast.success($translate.instant('telephony_service_fax_filtering_new_success'));
      return self.refresh();
    }).catch((error) => {
      TucToast.error([$translate.instant('telephony_service_fax_filtering_new_error'), _.get(error, 'data.message')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.screenListsForm.isAdding = false;
    });
  };

  self.exportSelection = function () {
    return _.map(self.getSelection(), filter => _.pick(filter, ['callNumber', 'number', 'type']));
  };

  self.removeSelectedScreenLists = function () {
    let queries = $q.reject({ statusText: 'Unable to remove selected screenLists' });
    const screenLists = self.getSelection();
    const listQuery = {};

    screenListsTypes.forEach((type) => {
      const rawOfType = _.pluck(_.filter(self.screenLists.raw, { type }), 'number');
      const selectedOfType = _.pluck(_.filter(screenLists, { type }), 'number');
      listQuery[type] = _.difference(rawOfType, selectedOfType);
    });

    if (_.size(listQuery)) {
      queries = {
        update: OvhApiTelephony.Fax().v6().updateScreenLists({
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        }, listQuery).$promise,
        noop: $timeout(angular.noop, 500),
      };
    }
    self.screenLists.isDeleting = true;
    TucToast.info($translate.instant('telephony_service_fax_filtering_table_delete_success'));
    return $q.all(queries).then(() => self.refresh()).catch((err) => {
      TucToast.error([$translate.instant('telephony_service_fax_filtering_table_delete_error'), _.get(err, 'data.message')].join(' '));
      return $q.reject(err);
    }).finally(() => {
      self.screenLists.isDeleting = false;
    });
  };

  self.sortScreenLists = function () {
    let data = angular.copy(self.screenLists.raw);
    data = $filter('filter')(data, self.screenLists.filterBy);
    data = $filter('orderBy')(
      data,
      self.screenLists.orderBy,
      self.screenLists.orderDesc,
    );
    self.screenLists.sorted = data;

    // avoid pagination bug...
    if (self.screenLists.sorted.length === 0) {
      self.screenLists.paginated = [];
    }
  };

  self.orderScreenListsBy = function (by) {
    if (self.screenLists.orderBy === by) {
      self.screenLists.orderDesc = !self.screenLists.orderDesc;
    } else {
      self.screenLists.orderBy = by;
    }
    self.sortScreenLists();
  };

  self.refresh = function () {
    self.screenLists.isLoading = true;
    return fetchScreenLists().then((screenLists) => {
      self.screenLists.raw = screenLists;
      self.sortScreenLists();

      return fetchSettings().then((settings) => {
        faxSettings = settings;
        self.rejectAnonymous = faxSettings.rejectAnonymous;
        return settings;
      }).catch(err => $q.reject(err));
    }).catch((err) => {
      TucToast.error([$translate.instant('telephony_service_fax_filtering_fetch_lists_error'), _.get(err, 'data.message')].join(' '));
      return $q.reject(err);
    }).finally(() => {
      self.screenLists.isLoading = false;
    });
  };

  /* -----  End of ACTIONS  ------ */

  /* ======================================
  =            INITIALIZATION            =
  ====================================== */

  function init() {
    self.loading = {
      init: false,
    };
    self.fax = null;
    self.screenLists = {
      raw: [],
      paginated: null,
      sorted: null,
      selected: {},
      orderBy: 'number',
      orderDesc: false,
      filterBy: {
        type: undefined,
      },
      isLoading: false,
      isDeleting: false,
    };
    self.screenListsForm = {
      filteringList: null,
      isAdding: false,
      isUpdating: false,
    };
    self.screenListToAdd = {
      nature: 'whitelisted',
      type: 'Numbers',
      number: null,
    };
    self.settings = null;
    self.loading.init = true;
    return TelephonyMediator.getGroup($stateParams.billingAccount).then((group) => {
      self.fax = group.getFax($stateParams.serviceName);
      return self.refresh();
    }).catch((err) => {
      TucToast.error([$translate.instant('an_error_occured'), _.get(err, 'data.message')].join(' '));
      return $q.reject(err);
    }).finally(() => {
      self.loading.init = false;
    });
  }

  /* -----  End of INITIALIZATION  ------ */

  /* ===========================
  =            BULK            =
  ============================ */

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'faxFiltering',
      actions: [{
        name: 'faxScreenLists',
        route: '/telephony/{billingAccount}/fax/{serviceName}/screenLists',
        method: 'POST',
        params: null,
      }, {
        name: 'settings',
        route: '/telephony/{billingAccount}/fax/{serviceName}/settings',
        method: 'PUT',
        params: null,
      }],
    },
  };

  self.filterServices = function (services) {
    return _.filter(services, service => ['fax', 'voicefax'].indexOf(service.featureType) > -1);
  };

  self.getBulkParams = function (action) {
    const param = _.pick(faxSettings, ['faxMaxCall', 'faxQuality', 'faxTagLine', 'fromEmail', 'fromName', 'mailFormat', 'redirectionEmail']);

    switch (action) {
      case 'faxScreenLists':
        return _.pick(self.screenListsForm, 'filteringList');
      case 'settings':
        param.rejectAnonymous = self.rejectAnonymous;
        return param;
      default:
        return false;
    }
  };

  self.onBulkSuccess = function (bulkResult) {
    // display message of success or error
    tucTelephonyBulk.getTucToastInfos(bulkResult, {
      fullSuccess: $translate.instant('telephony_service_fax_filtering_bulk_all_success'),
      partialSuccess: $translate.instant('telephony_service_fax_filtering_bulk_some_success', {
        count: bulkResult.success.length,
      }),
      error: $translate.instant('telephony_service_fax_filtering_bulk_error'),
    }).forEach((toastInfo) => {
      TucToast[toastInfo.type](toastInfo.message, {
        hideAfter: null,
      });
    });

    self.refresh();
  };

  self.onBulkError = function (error) {
    TucToast.error([$translate.instant('telephony_service_fax_filtering_bulk_on_error'), _.get(error, 'msg.data')].join(' '));
  };

  /* -----  End of BULK  ------ */

  init();
});
