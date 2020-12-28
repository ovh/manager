import filter from 'lodash/filter';
import get from 'lodash/get';

export default /* @ngInject */ function TelecomTelephonyServiceVoicemailDefaultCtrl(
  $http,
  $stateParams,
  $q,
  $timeout,
  $filter,
  $translate,
  TucToastError,
  OvhApiTelephony,
  tucTelephonyBulk,
  TucToast,
) {
  const self = this;

  function fetchOptions() {
    return OvhApiTelephony.Line()
      .v6()
      .getOptions({
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      }).$promise;
  }

  function init() {
    self.numbers = [];
    self.options = {};
    self.defaultVoicemail = null;
    self.form = {
      email: null,
    };

    self.loading = true;
    return fetchOptions()
      .then((options) => {
        self.options = options;
        self.defaultVoicemail = options.defaultVoicemail;
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.loading = false;
      });
  }

  self.onDefaultVoicemailChange = function onDefaultVoicemailChange() {
    self.success = false;
    if (self.options.defaultVoicemail.length < 5) {
      return $q.when();
    }

    return $http
      .get('/telephony/searchServices', {
        params: {
          axiom: self.options.defaultVoicemail,
        },
      })
      .then(({ data }) => {
        self.numbers = data;
      });
  };

  self.saveDefaultVoicemail = function saveDefaultVoicemail() {
    self.saving = true;
    const save = OvhApiTelephony.Line()
      .v6()
      .setOptions(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        self.options,
      ).$promise;

    self.success = false;
    return $q
      .all([
        $timeout(angular.noop, 1000), // avoid clipping
        save,
      ])
      .then(() => {
        self.defaultVoicemail = self.options.defaultVoicemail;
        self.success = true;
      })
      .catch((err) => new TucToastError(err))
      .finally(() => {
        self.saving = false;
      });
  };

  self.cancel = function cancel() {
    self.options.defaultVoicemail = self.defaultVoicemail;
  };

  self.formatNumber = function formatNumber(number) {
    const formatted = $filter('tucPhoneNumber')(number.serviceName);
    if (number.description) {
      return number.description === number.serviceName
        ? formatted
        : `${formatted} ${number.description}`;
    }
    if (number.label) {
      return number.label === number.serviceName
        ? formatted
        : `${formatted} ${number.label}`;
    }
    return formatted;
  };

  init();

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'settings',
      actions: [
        {
          name: 'options',
          route: '/telephony/{billingAccount}/line/{serviceName}/options',
          method: 'PUT',
          params: null,
        },
      ],
    },
  };

  self.getBulkParams = function getBulkParams() {
    return {
      defaultVoicemail: self.options.defaultVoicemail,
    };
  };

  self.filterServices = function filterServices(services) {
    return filter(
      services,
      (service) => ['sip', 'mgcp'].indexOf(service.featureType) > -1,
    );
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_line_answer_default_voicemail_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_line_answer_default_voicemail_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant(
          'telephony_line_answer_default_voicemail_bulk_error',
        ),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

    // reset initial values to be able to modify again the options
    OvhApiTelephony.Line()
      .v6()
      .resetAllCache();

    init();
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant(
          'telephony_line_answer_default_voicemail_bulk_on_error',
        ),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };
}
