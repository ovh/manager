import difference from 'lodash/difference';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import map from 'lodash/map';
import now from 'lodash/now';
import pick from 'lodash/pick';
import random from 'lodash/random';
import size from 'lodash/size';

export default /* @ngInject */ function TelecomTelephonyServiceFaxFilteringCtrl(
  $filter,
  $q,
  $stateParams,
  $timeout,
  $translate,
  TelephonyMediator,
  OvhApiTelephony,
  TucToast,
  tucTelephonyBulk,
) {
  const self = this;
  let faxSettings = null;
  const screenListsTypes = [
    'whitelistedNumbers',
    'whitelistedTSI',
    'blacklistedNumbers',
    'blacklistedTSI',
  ];

  /* ===============================
  =            HELPERS            =
  =============================== */

  function clearCache() {
    OvhApiTelephony.Fax()
      .v6()
      .resetCache();
    OvhApiTelephony.Fax()
      .v6()
      .resetQueryCache();
  }

  function fetchScreenLists() {
    return OvhApiTelephony.Fax()
      .v6()
      .getScreenLists({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((screenLists) => {
        self.screenListsForm.filteringList = screenLists.filteringList;
        return map(screenListsTypes, (type) =>
          map(get(screenLists, type), (screen) => ({
            callNumber: screenLists.callNumber,
            number: screen,
            type,
            id: random(now()),
          })),
        );
      })
      .then((screenLists) => flatten(screenLists));
  }

  function fetchSettings() {
    clearCache();
    return OvhApiTelephony.Fax()
      .v6()
      .getSettings({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise;
  }

  self.getSelection = function getSelection() {
    return filter(
      self.screenLists.raw,
      (screen) =>
        screen &&
        self.screenLists.selected &&
        self.screenLists.selected[screen.id],
    );
  };

  /* -----  End of HELPERS  ------ */

  /* ===============================
  =            ACTIONS            =
  =============================== */

  self.updateFilteringList = function updateFilteringList() {
    self.screenListsForm.isUpdating = true;
    return OvhApiTelephony.Fax()
      .v6()
      .createScreenLists(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        pick(self.screenListsForm, 'filteringList'),
      )
      .$promise.catch((err) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_service_fax_filtering_list_update_error',
            ),
            get(err, 'data.message'),
          ].join(' '),
        );
        return $q.reject(err);
      })
      .finally(() => {
        self.screenListsForm.isUpdating = false;
      });
  };

  self.updateAnonymousRejection = function updateAnonymousRejection() {
    self.screenListsForm.isUpdating = true;
    const param = pick(faxSettings, [
      'faxMaxCall',
      'faxQuality',
      'faxTagLine',
      'fromEmail',
      'fromName',
      'mailFormat',
      'redirectionEmail',
    ]);
    param.rejectAnonymous = self.rejectAnonymous;
    return OvhApiTelephony.Fax()
      .v6()
      .setSettings(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        param,
      )
      .$promise.then(() => fetchSettings())
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_service_fax_filtering_anonymous_rejection_update_error',
            ),
            get(error, 'data.message'),
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.screenListsForm.isUpdating = false;
      });
  };

  self.addScreen = function addScreen(form) {
    const screenList = {};
    const screenListType = [
      self.screenListToAdd.nature,
      self.screenListToAdd.type,
    ].join('');
    screenList[screenListType] = [].concat(self.screenListToAdd.number);
    self.screenListsForm.isAdding = true;
    return OvhApiTelephony.Fax()
      .v6()
      .createScreenLists(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        screenList,
      )
      .$promise.then(() => {
        form.$setPristine();
        self.screenListToAdd.number = '';
        TucToast.success(
          $translate.instant('telephony_service_fax_filtering_new_success'),
        );
        return self.refresh();
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_service_fax_filtering_new_error'),
            get(error, 'data.message'),
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.screenListsForm.isAdding = false;
      });
  };

  self.exportSelection = function exportSelection() {
    return map(self.getSelection(), (selection) =>
      pick(selection, ['callNumber', 'number', 'type']),
    );
  };

  self.removeSelectedScreenLists = function removeSelectedScreenLists() {
    let queries = $q.reject({
      statusText: 'Unable to remove selected screenLists',
    });
    const screenLists = self.getSelection();
    const listQuery = {};

    screenListsTypes.forEach((type) => {
      const rawOfType = map(filter(self.screenLists.raw, { type }), 'number');
      const selectedOfType = map(filter(screenLists, { type }), 'number');
      listQuery[type] = difference(rawOfType, selectedOfType);
    });

    if (size(listQuery)) {
      queries = {
        update: OvhApiTelephony.Fax()
          .v6()
          .updateScreenLists(
            {
              billingAccount: $stateParams.billingAccount,
              serviceName: $stateParams.serviceName,
            },
            listQuery,
          ).$promise,
        noop: $timeout(angular.noop, 500),
      };
    }
    self.screenLists.isDeleting = true;
    TucToast.info(
      $translate.instant(
        'telephony_service_fax_filtering_table_delete_success',
      ),
    );
    return $q
      .all(queries)
      .then(() => self.refresh())
      .catch((err) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_service_fax_filtering_table_delete_error',
            ),
            get(err, 'data.message'),
          ].join(' '),
        );
        return $q.reject(err);
      })
      .finally(() => {
        self.screenLists.isDeleting = false;
      });
  };

  self.sortScreenLists = function sortScreenLists() {
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

  self.orderScreenListsBy = function orderScreenListsBy(by) {
    if (self.screenLists.orderBy === by) {
      self.screenLists.orderDesc = !self.screenLists.orderDesc;
    } else {
      self.screenLists.orderBy = by;
    }
    self.sortScreenLists();
  };

  self.refresh = function refresh() {
    self.screenLists.isLoading = true;
    return fetchScreenLists()
      .then((screenLists) => {
        self.screenLists.raw = screenLists;
        self.sortScreenLists();

        return fetchSettings()
          .then((settings) => {
            faxSettings = settings;
            self.rejectAnonymous = faxSettings.rejectAnonymous;
            return settings;
          })
          .catch((err) => $q.reject(err));
      })
      .catch((err) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_service_fax_filtering_fetch_lists_error',
            ),
            get(err, 'data.message'),
          ].join(' '),
        );
        return $q.reject(err);
      })
      .finally(() => {
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
    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.fax = group.getFax($stateParams.serviceName);
        return self.refresh();
      })
      .catch((err) => {
        TucToast.error(
          [
            $translate.instant('an_error_occured'),
            get(err, 'data.message'),
          ].join(' '),
        );
        return $q.reject(err);
      })
      .finally(() => {
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
      actions: [
        {
          name: 'faxScreenLists',
          route: '/telephony/{billingAccount}/fax/{serviceName}/screenLists',
          method: 'POST',
          params: null,
        },
        {
          name: 'settings',
          route: '/telephony/{billingAccount}/fax/{serviceName}/settings',
          method: 'PUT',
          params: null,
        },
      ],
    },
  };

  self.filterServices = function filterServices(services) {
    return filter(
      services,
      (service) => ['fax', 'voicefax'].indexOf(service.featureType) > -1,
    );
  };

  self.getBulkParams = function getBulkParams(action) {
    const param = pick(faxSettings, [
      'faxMaxCall',
      'faxQuality',
      'faxTagLine',
      'fromEmail',
      'fromName',
      'mailFormat',
      'redirectionEmail',
    ]);

    switch (action) {
      case 'faxScreenLists':
        return pick(self.screenListsForm, 'filteringList');
      case 'settings':
        param.rejectAnonymous = self.rejectAnonymous;
        return param;
      default:
        return false;
    }
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_service_fax_filtering_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_service_fax_filtering_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant('telephony_service_fax_filtering_bulk_error'),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

    self.refresh();
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant('telephony_service_fax_filtering_bulk_on_error'),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  /* -----  End of BULK  ------ */

  init();
}
