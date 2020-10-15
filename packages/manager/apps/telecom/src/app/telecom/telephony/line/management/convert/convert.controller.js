import filter from 'lodash/filter';
import get from 'lodash/get';
import method from 'lodash/method';
import some from 'lodash/some';

export default /* @ngInject */ function TelecomTelephonyLineConvertCtrl(
  $q,
  $stateParams,
  $translate,
  OvhApiPackXdslVoipLine,
  OvhApiTelephony,
  TelephonyMediator,
  TucToast,
  TucToastError,
  tucTelephonyBulk,
) {
  const self = this;

  function init() {
    self.isLoading = true;
    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => group.getLine($stateParams.serviceName))
      .then((line) => {
        self.line = line;
        return line.getConvertionTask().then((task) => {
          self.task = task;
        });
      })
      .then(() =>
        self.line.isIncludedInXdslPack().then((inPack) => {
          self.isInXdslPack = inPack;
        }),
      )
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isLoading = false;
      });
  }

  self.convertToNumber = function convertToNumber() {
    self.isConverting = true;
    return OvhApiTelephony.Line()
      .v6()
      .convertToNumber(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        {},
      )
      .$promise.then(() => self.line.getConvertionTask())
      .then((task) => {
        self.task = task;
        TucToast.success(
          $translate.instant('telephony_line_convert_convert_success'),
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isConverting = false;
      });
  };

  self.cancelConvertToNumber = function cancelConvertToNumber() {
    self.isCancelling = true;
    return OvhApiTelephony.Line()
      .v6()
      .cancelConvertToNumber(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        {},
      )
      .$promise.then(() => self.line.getConvertionTask())
      .then((task) => {
        self.task = task;
        TucToast.success(
          $translate.instant('telephony_line_convert_cancel_success'),
        );
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.isCancelling = false;
      });
  };

  /* ===========================
    =            BULK            =
    ============================ */

  self.bulkDatas = {
    infos: {
      name: 'convertToNumber',
      actions: [
        {
          name: 'convertToNumber',
          route:
            '/telephony/{billingAccount}/line/{serviceName}/convertToNumber',
          method: 'POST',
          params: null,
        },
      ],
    },
  };

  self.filterServices = function filterServices(services) {
    let filteredServices = filter(
      services,
      (service) => !some(service.offers, method('includes', 'individual')),
    );

    filteredServices = filter(
      filteredServices,
      (service) => ['sip', 'mgcp'].indexOf(service.featureType) > -1,
    );

    return OvhApiPackXdslVoipLine.v7()
      .services()
      .aggregate('packName')
      .execute()
      .$promise.then((lines) => {
        filteredServices = filter(
          filteredServices,
          (service) => !some(lines, { key: service.serviceName }),
        );

        return $q.when(filteredServices);
      });
  };

  self.getBulkParams = function getBulkParams() {
    return {};
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_line_convert_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_line_convert_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant('telephony_line_convert_bulk_error'),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

    return self.line.getConvertionTask().then((task) => {
      self.task = task;
    });
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant('telephony_line_convert_bulk_on_error'),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  /* -----  End of BULK  ------ */

  init();
}
