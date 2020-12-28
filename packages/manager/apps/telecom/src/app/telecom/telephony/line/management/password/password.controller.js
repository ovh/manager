import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';
import some from 'lodash/some';

export default /* @ngInject */ function TelecomTelephonyLinePasswordCtrl(
  $scope,
  $state,
  $stateParams,
  TucToast,
  $q,
  $translate,
  OvhApiTelephony,
  tucTelephonyBulk,
  tucVoipLine,
) {
  const self = this;

  self.init = function init() {
    self.password = null;
  };

  self.loading = {
    save: false,
  };

  self.bulkDatas = {
    billingAccount: $stateParams.billingAccount,
    serviceName: $stateParams.serviceName,
    infos: {
      name: 'password',
      actions: [
        {
          name: 'changePassword',
          route:
            '/telephony/{billingAccount}/line/{serviceName}/changePassword',
          method: 'POST',
          params: null,
        },
      ],
    },
  };

  self.getBulkParams = function getBulkParams() {
    return {
      password: self.password,
    };
  };

  self.filterServices = function filterServices(services) {
    const filteredServices = filter(
      services,
      (service) => ['sip'].indexOf(service.featureType) > -1,
    );

    const promises = map(filteredServices, (service) =>
      tucVoipLine.fetchLineInfo(service),
    );

    return $q
      .allSettled(promises)
      .then((listLines) => listLines)
      .catch((listLines) => listLines)
      .then((listLines) =>
        $q.when(
          filter(filteredServices, (service) =>
            some(listLines, {
              serviceName: service.serviceName,
              canChangePassword: true,
            }),
          ),
        ),
      );
  };

  self.onBulkSuccess = function onBulkSuccess(bulkResult) {
    // display message of success or error
    tucTelephonyBulk
      .getTucToastInfos(bulkResult, {
        fullSuccess: $translate.instant(
          'telephony_line_password_bulk_all_success',
        ),
        partialSuccess: $translate.instant(
          'telephony_line_password_bulk_some_success',
          {
            count: bulkResult.success.length,
          },
        ),
        error: $translate.instant('telephony_line_password_bulk_error'),
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
        $translate.instant('telephony_line_password_bulk_on_error'),
        get(error, 'msg.data'),
      ].join(' '),
    );
  };

  this.validators = [
    {
      id: 'length',
      caption: $translate.instant('telephony_line_password_rule_size'),
      validator(str) {
        return str && str.length > 7 && str.length < 21;
      },
    },
    {
      id: 'palindrome',
      caption: $translate.instant('telephony_line_password_rule_palindrome'),
      validator(val) {
        if (!val) {
          return false;
        }
        let palindrome = true;
        for (let i = 0; i < Math.floor(val.length / 2); i += 1) {
          if (val[i] !== val[val.length - 1 - i]) {
            palindrome = false;
          }
        }
        return !palindrome;
      },
      immediateWarning: true,
    },
    {
      id: 'specialChar',
      caption: $translate.instant('telephony_line_password_rule_special', {
        list: '#{}()[]-|@=*+/!:;',
      }),
      validator: /^[\w~"#'{}(\\)[\]\-|\\^@=*+/!:;.,?<>%*µ]+$/,
      immediateWarning: true,
    },
    {
      id: 'class',
      caption: $translate.instant('telephony_line_password_rule_class'),
      validator(val) {
        let classCount = 0;
        if (/[0-9]/.test(val)) {
          classCount += 1;
        }
        if (/[a-zA-Z]/.test(val)) {
          classCount += 1;
        }
        if (/[^a-zA-Z0-9]/.test(val)) {
          classCount += 1;
        }
        return classCount >= 2;
      },
    },
  ];

  this.getStrength = function getStrength(value) {
    return (value.length - 8) / 12;
  };

  /**
   * Cancel modifications and leave the page
   */
  this.cancel = function cancel() {
    $state.go(
      $state.current.name
        .split('.')
        .slice(0, -1)
        .join('.'),
      $stateParams,
      {
        reload: true,
      },
    );
  };

  /**
   * Save the passwords
   * @return {Promise}
   */
  this.save = function save() {
    if (!$scope.passwordForm.$invalid) {
      self.loading.save = true;
      return OvhApiTelephony.Line()
        .v6()
        .changePassword(
          {
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
          },
          {
            password: this.password,
          },
        )
        .$promise.then(() => {
          TucToast.success(
            $translate.instant('telephony_line_password_save_success'),
          );
          self.cancel();
        })
        .catch((err) => {
          TucToast.error(
            $translate.instant('telephony_line_password_save_fail'),
          );
          return $q.reject(err);
        })
        .finally(() => {
          self.loading.save = false;
        });
    }
    return $q.when(null);
  };
}
