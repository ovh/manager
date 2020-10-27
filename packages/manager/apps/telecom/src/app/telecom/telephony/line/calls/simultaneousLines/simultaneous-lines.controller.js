import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import map from 'lodash/map';
import set from 'lodash/set';
import some from 'lodash/some';
import startsWith from 'lodash/startsWith';

export default /* @ngInject */ function TelecomTelephonyLineCallsSimultaneousLinesCtrl(
  $filter,
  $q,
  $stateParams,
  $translate,
  currentLine,
  OvhApiOrderTelephony,
  OvhApiTelephony,
  OvhApiTelephonyService,
  tucTelephonyBulk,
  TucToast,
) {
  const self = this;
  const apiResources = {
    getSimultaneousLines: OvhApiOrderTelephony.v6().getSimultaneousLines,
    orderSimultaneousLines: OvhApiOrderTelephony.v6().orderSimultaneousLines,
  };

  let unitPrices = null;

  self.bulkOrders = [];
  self.isTrunk = false;

  self.orderUrl = null;
  self.showBulkOrderSummary = false;

  self.needSave = function needSave() {
    return self.options.simultaneousLines !== self.saved.simultaneousLines;
  };

  self.doOrder = function doOrder() {
    self.loading.doOrder = true;

    return apiResources
      .orderSimultaneousLines(
        {
          serviceName: $stateParams.serviceName,
        },
        {
          quantity: self.options.simultaneousLines,
        },
      )
      .$promise.then((order) => {
        self.orderUrl = order.url;
        self.prices = order.prices;
        return order;
      })
      .catch((err) =>
        $translate(
          'telephony_line_actions_line_calls_simultaneous_line_order_error',
        ).then((message) => {
          TucToast.error(message);
          return $q.reject(err);
        }),
      )
      .finally(() => {
        self.loading.order = false;
        self.loading.doOrder = false;
      });
  };

  function getOfferTasks() {
    return OvhApiTelephonyService.OfferTask()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        action: 'removeSimltaneousLines',
      })
      .$promise.then((offerTasks) =>
        $q.all(
          map(offerTasks, (taskId) =>
            OvhApiTelephonyService.OfferTask()
              .v6()
              .get({
                billingAccount: $stateParams.billingAccount,
                serviceName: $stateParams.serviceName,
                taskId,
              })
              .$promise.then((taskDetail) => {
                set(
                  taskDetail,
                  'formatedDate',
                  $filter('date')(taskDetail.executionDate, 'fullDate'),
                );
                return taskDetail;
              })
              .catch((err) =>
                $translate(
                  'telephony_line_actions_line_calls_simultaneous_line_offer_task_error',
                ).then((message) => {
                  TucToast.error(message);
                  return $q.reject(err);
                }),
              ),
          ),
        ),
      )
      .then((offerTasksDetails) => {
        self.offerTasks = offerTasksDetails;
        return self.offerTasks;
      });
  }

  self.doRemoveSimultaneousLines = function doRemoveSimultaneousLines() {
    self.loading.save = true;

    return OvhApiTelephony.Line()
      .v6()
      .removeSimultaneousLine(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        {
          quantityRemove:
            self.saved.simultaneousLines - self.options.simultaneousLines,
        },
      )
      .$promise.then(() => {
        self.loading.save = false;
        self.showDoRemoveButtons = false;
        self.saved.simultaneousLines = self.options.simultaneousLines;
        return getOfferTasks();
      })
      .catch((err) =>
        $translate(
          'telephony_line_actions_line_calls_simultaneous_line_write_error',
        ).then((message) => {
          TucToast.error([message, get(err, 'data.message')].join(' '));
          self.cancelRemove();
          self.options.minimumAvailableSimultaneousLines =
            self.saved.simultaneousLines;
          return $q.reject(err);
        }),
      )
      .finally(() => {
        self.loading.save = false;
      });
  };

  self.cancelRemove = function cancelRemove() {
    self.showDoRemoveButtons = false;
    self.options.simultaneousLines = self.saved.simultaneousLines;
  };

  self.save = function save() {
    self.prices = null;
    self.contractsAccepted = false;
    self.showDoRemoveButtons = false;

    if (self.needSave()) {
      if (self.saved.simultaneousLines < self.options.simultaneousLines) {
        self.showDoRemoveButtons = false;
        self.recalculatePrices();
      }
      if (
        self.saved.simultaneousLines > self.options.simultaneousLines &&
        self.options.simultaneousLines
      ) {
        self.showDoRemoveButtons = true;
      }
    } else {
      self.showDoRemoveButtons = false;
    }
  };

  self.recalculatePrices = function recalculatePrices() {
    const quantity =
      self.options.simultaneousLines - self.saved.simultaneousLines;

    self.prices = {
      tax: { text: $filter('currency')(unitPrices.tax.value * quantity) },
      withTax: {
        text: $filter('currency')(unitPrices.withTax.value * quantity),
      },
      withoutTax: {
        text: $filter('currency')(unitPrices.withoutTax.value * quantity),
      },
    };
  };

  function getUnitPrices() {
    return apiResources
      .getSimultaneousLines({
        serviceName: $stateParams.serviceName,
        quantity: currentLine.simultaneousLinesDetails.current + 1,
      })
      .$promise.then((order) => {
        self.contracts = order.contracts;
        unitPrices = order.prices;
        return order;
      })
      .catch((err) =>
        $translate(
          'telephony_line_actions_line_calls_simultaneous_line_write_error',
        ).then((message) => {
          TucToast.error([message, get(err, 'data.message')].join(' '));
          return $q.reject(err);
        }),
      );
  }

  function init() {
    if (!currentLine) {
      TucToast.error(
        $translate.instant(
          'telephony_line_actions_line_calls_simultaneous_line_load_error',
        ),
      );
      return $q.when(null);
    }

    self.loading = {
      init: true,
      order: false,
      orderUrl: null,
      doOrder: false,
      save: false,
    };
    self.contractsAccepted = false;
    self.contracts = null;
    self.hundredLines = false;
    self.prices = null;
    self.saved = {};
    self.offerTasks = [];
    self.options = {
      simultaneousLines: null,
      maximumAvailableSimultaneousLines:
        currentLine.simultaneousLinesDetails.maximum,
      minimumAvailableSimultaneousLines: 1,
    };

    self.showBulkOrderSummary = false;

    self.options.simultaneousLines = currentLine.simultaneousLines;
    self.hundredLines = currentLine.simultaneousLines >= 100;

    self.isTrunk = some(currentLine.offers, (offer) =>
      startsWith(offer, 'voip.main.offer.trunk'),
    );

    if (self.isTrunk) {
      apiResources.getSimultaneousLines = OvhApiOrderTelephony.v6().getSimultaneousTrunkLines;
      apiResources.orderSimultaneousLines = OvhApiOrderTelephony.v6().orderSimultaneousTrunkLines;
    }

    self.options.details = currentLine.simultaneousLinesDetails;
    self.saved = angular.copy(self.options);

    return $q
      .all([getOfferTasks(), getUnitPrices()])
      .finally(() => {
        self.loading.init = false;
      })
      .catch(() =>
        $translate(
          'telephony_line_actions_line_calls_simultaneous_line_load_error',
        ).then((message) => TucToast.error(message)),
      );
  }

  init();

  /* ===========================
        =            BULK            =
        ============================ */

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'simultaneousCalls',
      actions: [
        {
          name: 'removeSimultaneousLines',
          route:
            '/telephony/{billingAccount}/line/{serviceName}/removeSimultaneousLines',
          method: 'POST',
          params: null,
        },
        {
          name: 'updateSimultaneousChannels',
          route:
            '/order/telephony/lines/{serviceName}/updateSimultaneousChannels',
          method: 'POST',
          params: null,
        },
      ],
    },
  };

  self.filterServices = function filterServices(services) {
    return filter(
      services,
      (service) =>
        ['sip', 'mgcp'].indexOf(service.featureType) > -1 &&
        service.hasValidPublicOffer() &&
        !service.isSipTrunkRates(),
    );
  };

  self.getBulkParams = function getBulkParams() {
    return self.options.simultaneousLines;
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_line_actions_line_calls_simultaneous_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_line_actions_line_calls_simultaneous_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant(
          'telephony_line_actions_line_calls_simultaneous_bulk_error',
        ),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

    if (bulkResult.success.length > 0) {
      self.buildOrderSummary(bulkResult.success);
    }
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant(
          'telephony_line_actions_line_calls_simultaneous_bulk_on_error',
        ),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  self.buildOrderSummary = function buildOrderSummary(orders) {
    self.bulkOrders = map(
      filter(flatten(map(orders, 'values')), {
        action: 'updateSimultaneousChannels',
      }),
      'value',
    );

    self.showBulkOrderSummary = self.bulkOrders.length > 0;
  };

  /* -----  End of BULK  ------ */
}
