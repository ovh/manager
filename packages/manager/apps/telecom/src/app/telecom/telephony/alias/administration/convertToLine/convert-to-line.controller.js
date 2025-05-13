import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import some from 'lodash/some';
import times from 'lodash/times';

export default /* @ngInject */ function TelecomTelephonyAliasAdministrationConvertToLineCtrl(
  $stateParams,
  $q,
  $translate,
  OvhApiTelephony,
  TucToastError,
  TucToast,
  tucTelephonyBulk,
) {
  const self = this;

  function init() {
    self.serviceName = $stateParams.serviceName;
    self.contractsAccepted = false;
    self.isConverting = false;
    self.isLoading = false;
    self.offerError = null;

    return self.refresh().catch((err) => {
      if (
        err.status === 400 &&
        /number range.*forbidden change/.test(get(err, 'data.message'))
      ) {
        self.offerError = $translate.instant(
          'telephony_alias_administration_convert_range_error',
        );
        return $q.reject(err);
      }
      return new TucToastError(err);
    });
  }

  self.refresh = function refresh() {
    self.isLoading = true;
    self.contractsAccepted = false;
    return self
      .fetchConvertToLineTask()
      .then((task) => {
        self.convertTask = task;
        if (!task) {
          return self
            .getAvailableOffers($stateParams)
            .then((availableOffers) => {
              self.offers = availableOffers.offers;
              self.offer = head(self.offers);
              self.contracts = availableOffers.contracts;
            });
        }
        return null;
      })
      .finally(() => {
        self.isLoading = false;
      });
  };

  self.getAvailableOffers = function getAvailableOffers(service) {
    return OvhApiTelephony.Number()
      .v6()
      .convertToLineAvailableOffers({
        billingAccount: service.billingAccount,
        serviceName: service.serviceName,
      }).$promise;
  };

  self.fetchConvertToLineTask = function fetchConvertToLineTask() {
    return OvhApiTelephony.Service()
      .OfferTask()
      .v6()
      .query({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
        action: 'convertToSip',
        type: 'offer',
      })
      .$promise.then((taskIds) =>
        $q
          .all(
            map(
              taskIds,
              (id) =>
                OvhApiTelephony.Service()
                  .OfferTask()
                  .v6()
                  .get({
                    billingAccount: $stateParams.billingAccount,
                    serviceName: $stateParams.serviceName,
                    taskId: id,
                  }).$promise,
            ),
          )
          .then((tasks) => head(filter(tasks, { status: 'todo' }))),
      );
  };

  self.convertToLine = function convertToLine() {
    self.isConverting = true;
    return OvhApiTelephony.Number()
      .v6()
      .convertToLine(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        {
          offer: self.offer.name,
        },
      )
      .$promise.then(() => self.refresh())
      .then(() => {
        TucToast.success(
          $translate.instant('telephony_alias_administration_convert_success'),
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isConverting = false;
      });
  };

  self.cancelConvertion = function cancelConvertion() {
    self.isCancelling = true;
    return OvhApiTelephony.Number()
      .v6()
      .cancelConvertToLine(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        {},
      )
      .$promise.then(() => self.refresh())
      .then(() => {
        TucToast.success(
          $translate.instant(
            'telephony_alias_administration_convert_cancel_success',
          ),
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isCancelling = false;
      });
  };

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'terminate',
      actions: [
        {
          name: 'service',
          route:
            '/telephony/{billingAccount}/number/{serviceName}/convertToLine',
          method: 'POST',
          params: null,
        },
      ],
    },
  };

  self.filterServices = function filterServices(services) {
    function setServicesWithOffer(paramServices, listOffers) {
      const servicesFiltered = [];

      times(listOffers.length, (index) => {
        if (
          listOffers[index].status !== 404 ||
          listOffers[index].status !== 400
        ) {
          if (some(listOffers[index].offers, { name: self.offer.name })) {
            servicesFiltered.push(paramServices[index]);
          }
        }
      });

      return $q.when(servicesFiltered);
    }

    const promises = [];

    forEach(services, (service) => {
      promises.push(self.getAvailableOffers(service));
    });

    return $q
      .allSettled(promises)
      .then((listOffers) => setServicesWithOffer(services, listOffers))
      .catch((listOffers) => setServicesWithOffer(services, listOffers));
  };

  self.getBulkParams = function getBulkParams() {
    return {
      offer: self.offer.name,
    };
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_alias_administration_convert_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_alias_administration_convert_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant(
          'telephony_alias_administration_convert_bulk_error',
        ),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

    init();
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant(
          'telephony_alias_administration_convert_bulk_on_error',
        ),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  init();
}
