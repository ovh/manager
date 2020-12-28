import filter from 'lodash/filter';
import get from 'lodash/get';

export default /* @ngInject */ function TelecomTelephonyServiceVoicemailPasswordCtrl(
  $state,
  $stateParams,
  $translate,
  $timeout,
  OvhApiTelephony,
  TucToastError,
  tucTelephonyBulk,
  TucToast,
) {
  const self = this;

  function init() {
    self.options = null;
    self.loading = true;
    self.submitting = false;
    self.reset();

    self.isFax = $state.current.name.indexOf('fax') > -1;

    return OvhApiTelephony.Voicemail()
      .v6()
      .getNumbersSettings({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      })
      .$promise.then((options) => {
        self.options = options;
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.loading = false;
      });
  }

  self.checkPasswordConfirm = function checkPasswordConfirm(form) {
    form.passwordConfirm.$setValidity('matching', true);
    if (self.passwordConfirm && self.passwordConfirm !== self.password) {
      form.passwordConfirm.$setValidity('matching', false);
    }
  };

  self.reset = function reset() {
    self.password = '';
    self.passwordConfirm = '';
    self.success = false;
  };

  self.submitPasswordChange = function submitPasswordChange(form) {
    self.submitting = true;
    self.success = false;
    return OvhApiTelephony.Voicemail()
      .v6()
      .changePassword(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        {
          password: self.password,
        },
      )
      .$promise.then(() => {
        self.success = true;
        $timeout(() => {
          self.reset();
          form.$setPristine();
        }, 3000);
      })
      .catch(
        () =>
          new TucToastError(
            $translate.instant(
              'telephony_line_answer_voicemail_password_change_error',
            ),
          ),
      )
      .finally(() => {
        self.submitting = false;
      });
  };

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'password',
      actions: [
        {
          name: 'password',
          route:
            '/telephony/{billingAccount}/voicemail/{serviceName}/settings/changePassword',
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
        ['sip', 'mgcp', 'fax', 'voicefax'].indexOf(service.featureType) > -1,
    );
  };

  self.getBulkParams = function getBulkParams() {
    return {
      password: self.password,
    };
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_line_answer_voicemail_password_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_line_answer_voicemail_password_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant(
          'telephony_line_answer_voicemail_password_bulk_error',
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
          'telephony_line_answer_voicemail_password_bulk_on_error',
        ),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  init();
}
