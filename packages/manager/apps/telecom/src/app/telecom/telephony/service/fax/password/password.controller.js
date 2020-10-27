import filter from 'lodash/filter';
import get from 'lodash/get';
import pick from 'lodash/pick';

export default /* @ngInject */ function TelecomTelephonyServiceFaxPasswordCtrl(
  $stateParams,
  $translate,
  $timeout,
  TelephonyMediator,
  OvhApiTelephony,
  TucToast,
  TucToastError,
  tucTelephonyBulk,
) {
  const self = this;

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.reset = function reset() {
    self.passwordForm.password = '';
    self.passwordForm.confirm = '';
    self.passwordForm.isSuccess = false;
  };

  self.submitPasswordChange = function submitPasswordChange(form) {
    self.passwordForm.isUpdating = true;
    self.passwordForm.isSuccess = false;
    return OvhApiTelephony.Fax()
      .v6()
      .changePassword(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        pick(self.passwordForm, 'password'),
      )
      .$promise.then(() => {
        self.passwordForm.isSuccess = true;
        $timeout(() => {
          self.reset();
          form.$setUntouched();
        }, 3000);
      })
      .catch((err) => {
        TucToast.error(
          $translate.instant('telephony_service_fax_password_change_error', {
            error: get(err, 'data.message'),
          }),
        );
      })
      .finally(() => {
        self.passwordForm.isUpdating = false;
      });
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loading = {
      init: false,
    };

    self.fax = null;

    self.passwordForm = {
      password: null,
      confirm: null,
      isUpdating: false,
      isSuccess: false,
    };

    self.loading.init = true;
    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.fax = group.getFax($stateParams.serviceName);
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.loading.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  /* ===========================
    =            BULK            =
    ============================ */

  self.bulkDatas = {
    infos: {
      name: 'faxPassword',
      actions: [
        {
          name: 'password',
          route:
            '/telephony/{billingAccount}/fax/{serviceName}/settings/changePassword',
          method: 'POST',
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

  self.getBulkParams = function getBulkParams() {
    const data = {
      password: self.passwordForm.password,
    };

    return data;
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_service_fax_password_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_service_fax_password_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant('telephony_service_fax_password_bulk_error'),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

    // reset initial values to be able to modify again the options
    self.reset();
    self.faxPasswordForm.$setUntouched();
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant('telephony_service_fax_password_bulk_on_error'),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  /* -----  End of BULK  ------ */

  init();
}
