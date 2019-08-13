angular.module('managerApp').controller('TelecomTelephonyLineCallsFilteringCtrl', function ($stateParams, $q, $timeout, $translate, TucToast, TucToastError, OvhApiTelephony, tucTelephonyBulk) {
  const self = this;

  self.fetchScreenLists = function () {
    OvhApiTelephony.Screen().ScreenLists().v6().resetAllCache();
    return OvhApiTelephony.Screen().ScreenLists().v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise
      .then(ids => $q
        .all(_.map(
          _.chunk(ids, 50),
          chunkIds => OvhApiTelephony.Screen().ScreenLists().v6().getBatch({
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
            id: chunkIds,
          }).$promise,
        ))
        .then((chunkResult) => {
          const result = _.pluck(_.flatten(chunkResult), 'value');
          return _.each(result, (filter) => {
            _.set(filter, 'shortType', _.startsWith(filter.type, 'incoming') ? 'incoming' : 'outgoing');
            _.set(filter, 'list', filter.type.indexOf('White') >= 0 ? 'white' : 'black');
          });
        }));
  };

  self.addScreenList = function (screen) {
    return OvhApiTelephony.Screen().ScreenLists().v6().create({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }, screen).$promise;
  };

  self.onScreenListAdded = function () {
    self.screenLists.update();
  };

  self.removeScreenList = function (screen) {
    return OvhApiTelephony.Screen().ScreenLists().v6().remove({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
      id: screen.id,
    }).$promise;
  };

  self.fetchScreen = function () {
    return OvhApiTelephony.Screen().v6().get({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }).$promise;
  };

  self.fetchOptions = function () {
    return OvhApiTelephony.Line().v6().getOptions({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }).$promise;
  };

  function init() {
    self.screen = {
      raw: [],
      modified: null,
      isLoading: false,
      isIncomingLoading: false,
      isOutgoingLoading: false,
    };
    self.screenLists = {
      fetchAll: self.fetchScreenLists,
      remove: self.removeScreenList,
      update: angular.noop,
      getList() {
        return [];
      },
    };
    self.options = {
      raw: null,
      modified: null,
      isUpdating: null,
    };
    self.serviceName = $stateParams.serviceName;
    self.isInitializing = true;
    return self.refresh().catch(err => new TucToastError(err)).finally(() => {
      self.isInitializing = false;
    });
  }

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'screen',
      actions: [{
        name: 'screen',
        route: '/telephony/{billingAccount}/screen/{serviceName}',
        method: 'PUT',
        params: null,
      }, {
        name: 'options',
        route: '/telephony/{billingAccount}/line/{serviceName}/options',
        method: 'PUT',
        params: null,
      }],
    },
  };

  self.getBulkParams = function (action) {
    switch (action) {
      case 'screen':
        return {
          outgoingScreenList: _.get(self, 'screen.modified.outgoingScreenList'),
          incomingScreenList: _.get(self, 'screen.modified.incomingScreenList'),
        };
      case 'options':
        return _.get(self, 'options.modified');
      default:
        return false;
    }
  };

  self.onBulkSuccess = function (bulkResult) {
    // display message of success or error
    tucTelephonyBulk.getTucToastInfos(bulkResult, {
      fullSuccess: $translate.instant('telephony_line_calls_filtering_bulk_all_success'),
      partialSuccess: $translate.instant('telephony_line_calls_filtering_bulk_some_success', {
        count: bulkResult.success.length,
      }),
      error: $translate.instant('telephony_line_calls_filtering_bulk_error'),
    }).forEach((toastInfo) => {
      TucToast[toastInfo.type](toastInfo.message, {
        hideAfter: null,
      });
    });

    // reset initial values to be able to modify again the options
    OvhApiTelephony.Line().v6().resetAllCache();

    init();
  };

  self.onBulkError = function (error) {
    TucToast.error([$translate.instant('telephony_line_calls_filtering_bulk_on_error'), _.get(error, 'msg.data')].join(' '));
  };

  self.updateScreen = function (type) {
    self.screen.isLoading = true;
    if (type === 'incoming') {
      self.screen.isIncomingLoading = true;
    } else {
      self.screen.isOutgoingLoading = true;
    }
    return OvhApiTelephony.Screen().v6().change({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }, {
      outgoingScreenList: self.screen.modified.outgoingScreenList,
      incomingScreenList: self.screen.modified.incomingScreenList,
    }).$promise.then(() => {
      self.screen.raw = angular.copy(self.screen.modified);
    }).catch((err) => {
      self.screen.modified = angular.copy(self.screen.raw);
      return new TucToastError(err);
    }).finally(() => {
      self.screen.isLoading = false;
      self.screen.isIncomingLoading = false;
      self.screen.isOutgoingLoading = false;
    });
  };

  self.changeOption = function (opt) {
    self.options.isUpdating = {};
    self.options.isUpdating[opt] = true;
    return OvhApiTelephony.Line().v6()
      .setOptions({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }, _.pick(self.options.modified, opt))
      .$promise
      .then(() => {
        _.assign(self.options.raw, _.pick(self.options.modified, opt));
        $timeout(angular.noop, 500);
      })
      .catch(err => new TucToastError(err))
      .finally(() => {
        self.options.isUpdating = null;
      });
  };

  self.refresh = function () {
    self.isLoading = true;
    return $q.all({
      screen: self.fetchScreen(),
      options: self.fetchOptions(),
    }).then((result) => {
      self.screen.raw = result.screen;
      self.screen.modified = angular.copy(self.screen.raw);
      self.options.raw = result.options;
      self.options.modified = angular.copy(result.options);
    }).catch(err => new TucToastError(err)).finally(() => {
      self.isLoading = false;
    });
  };

  init();
});
