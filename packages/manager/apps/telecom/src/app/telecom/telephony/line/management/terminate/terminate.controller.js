import get from 'lodash/get';

export default /* @ngInject */ function TelecomTelephonyLineTerminateCtrl(
  $stateParams,
  $state,
  TelephonyMediator,
  TucToast,
  $translate,
  tucTelephonyBulk,
) {
  const self = this;

  self.loading = {
    init: false,
    terminate: false,
  };

  self.availableReasons = [];
  self.reason = {
    id: '',
  };
  self.hasPhone = false;

  self.terminate = function terminate() {
    self.loading.terminate = true;

    return self.line
      .terminate(self.reason)
      .then(() => {
        $state
          .go('.cancel')
          .then(() =>
            TucToast.success(
              $translate.instant('telephony_group_line_terminating_ok'),
            ),
          );
      })
      .catch((error) => {
        TucToast.error(
          $translate.instant('telephony_group_line_terminating_ko', {
            error: error.data.message,
          }),
        );
      })
      .finally(() => {
        self.reason = {
          id: '',
        };
        self.loading.terminate = false;
      });
  };

  self.haveToGiveReasonDetail = function haveToGiveReasonDetail() {
    return ['missingOptions', 'other'].indexOf(self.reason.id) !== -1;
  };

  self.cleanReasonDetail = function cleanReasonDetail() {
    if (!self.haveToGiveReasonDetail()) {
      delete self.reason.details;
    }
  };

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading.init = true;

    TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.line = group.getLine($stateParams.serviceName);
        return self.line.getPhone().then(
          (phone) => {
            self.hasPhone = !!(phone && phone.brand);
            return self.hasPhone;
          },
          () => {
            self.hasPhone = false;
            return self.hasPhone;
          },
        );
      })
      .then(() =>
        TelephonyMediator.getApiScheme().then((schema) => {
          self.availableReasons =
            schema.models['telephony.TerminationReasonEnum'].enum;
          return self.availableReasons;
        }),
      )
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'terminate',
      actions: [
        {
          name: 'service',
          route: '/telephony/{billingAccount}/service/{serviceName}',
          method: 'DELETE',
          params: null,
        },
      ],
    },
  };

  self.getBulkParams = function getBulkParams() {
    return {
      details: self.reason.details,
      reason: self.reason.id,
    };
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_group_line_terminating_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_group_line_terminating_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant(
          'telephony_group_line_terminating_bulk_error',
        ),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

    // reset initial values to be able to modify again the options
    self.init();
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant('telephony_group_line_terminating_bulk_on_error'),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  init();
}
