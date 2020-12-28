import filter from 'lodash/filter';
import get from 'lodash/get';
import method from 'lodash/method';
import some from 'lodash/some';

export default /* @ngInject */ function TelecomTelephonyLineClick2CallAddUserCtrl(
  $q,
  $stateParams,
  $state,
  $translate,
  OvhApiTelephony,
  TelephonyGroupLineClick2CallUser,
  TucToast,
  tucTelephonyBulk,
) {
  const self = this;

  this.rules = [
    {
      id: 'length',
      caption: $translate.instant(
        'telephony_group_line_calls_click2call_addUser_rule_size',
      ),
      validator(str) {
        return str && str.length > 7 && str.length < 21;
      },
    },
    {
      id: 'specialChar',
      caption: $translate.instant(
        'telephony_group_line_calls_click2call_addUser_rule_special',
        { list: '#{}()[]-|@=*+/!:;' },
      ),
      validator: /^[\w~"#'{}(\\)[\]\-|\\^@=*+/!:;.,?<>%*µÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]+$/,
      immediateWarning: true,
    },
  ];

  this.getStrength = function getStrength(val) {
    return (val.length - 8) / 12;
  };

  this.loading = {
    addUser: false,
  };

  this.add = function add() {
    this.loading.addUser = true;

    this.user = new TelephonyGroupLineClick2CallUser(
      {
        billingAccount: $stateParams.billingAccount,
        serviceName: $stateParams.serviceName,
      },
      {
        login: self.login,
        password: self.password,
      },
    );

    return this.user
      .add()
      .then(
        () => {
          TucToast.success(
            $translate.instant(
              'telephony_group_line_calls_click2call_addUser_added',
              { name: self.user.login },
            ),
          );
          self.close();
        },
        (error) => {
          TucToast.error(
            $translate.instant(
              'telephony_group_line_calls_click2call_addUser_fail',
              { name: self.user.login },
            ),
          );
          return $q.reject(error);
        },
      )
      .finally(() => {
        self.loading.addUser = false;
      });
  };

  this.close = function close() {
    $state.go('telecom.telephony.billingAccount.line.click2call', {
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    });
  };

  /* ===========================
    =            BULK            =
    ============================ */

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'click2Call',
      actions: [
        {
          name: 'click2CallAddUser',
          route:
            '/telephony/{billingAccount}/line/{serviceName}/click2CallUser',
          method: 'POST',
          params: null,
        },
      ],
    },
  };

  self.filterServices = function filterServices(services) {
    const filteredServices = filter(
      services,
      (service) => ['sip', 'mgcp'].indexOf(service.featureType) > -1,
    );

    // TODO : remove once bulk action is available for fax
    // return some(service.offers, method("includes", "sipfax")) ||
    //     some(service.offers, method("includes", "priceplan")) ||
    //     some(service.offers, method("includes", "voicefax"));

    return filter(
      filteredServices,
      (service) =>
        some(service.offers, method('includes', 'sipfax')) ||
        some(service.offers, method('includes', 'priceplan')),
    );
  };

  self.getBulkParams = function getBulkParams() {
    const data = {
      login: self.login,
      password: self.password,
    };

    return data;
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_group_line_calls_click2call_addUser_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_group_line_calls_click2call_addUser_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant(
          'telephony_group_line_calls_click2call_addUser_bulk_error',
        ),
      })
      .forEach((toastInfo) => {
        TucToast[toastInfo.type](toastInfo.message, {
          hideAfter: null,
        });
      });

    // reset initial values to be able to modify again the options
    OvhApiTelephony.Line()
      .Click2Call()
      .User()
      .resetCache();
    self.close();
  };

  self.onBulkError = function onBulkError(error) {
    TucToast.error(
      [
        $translate.instant(
          'telephony_group_line_calls_click2call_addUser_bulk_on_error',
        ),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  /* -----  End of BULK  ------ */
}
