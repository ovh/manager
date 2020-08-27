angular
  .module('managerApp')
  .controller(
    'TelecomTelephonyLineClick2CallChangePasswordCtrl',
    function TelecomTelephonyLineClick2CallChangePasswordCtrl(
      $q,
      $stateParams,
      $state,
      $translate,
      TelephonyGroupLineClick2CallUser,
      TucToast,
    ) {
      const self = this;

      this.rules = [
        {
          id: 'length',
          caption: $translate.instant(
            'telephony_group_line_calls_click2call_changePassword_rule_size',
          ),
          validator(str) {
            return str && str.length > 7 && str.length < 21;
          },
        },
        {
          id: 'specialChar',
          caption: $translate.instant(
            'telephony_group_line_calls_click2call_changePassword_rule_special',
            { list: '#{}()[]-|@=*+/!:;' },
          ),
          validator: /^[\w~"#'{}(\\)[\]\-|\\^@=*+/!:;.,?<>%*µÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]+$/,
          immediateWarning: true,
        },
      ];

      this.getStrength = function getStrength(val) {
        return (val.length - 8) / 12;
      };

      this.changePassword = function changePassword() {
        this.loading.changePassword = true;

        return this.user
          .changePassword(self.password)
          .then(
            () => {
              TucToast.success(
                $translate.instant(
                  'telephony_group_line_calls_click2call_changePassword_success',
                  { name: self.user.login },
                ),
              );
              self.close();
              return self.user;
            },
            (error) => {
              TucToast.error(
                $translate.instant(
                  'telephony_group_line_calls_click2call_changePassword_fail',
                  { name: self.user.login },
                ),
              );
              return $q.reject(error);
            },
          )
          .finally(() => {
            self.loading.changePassword = false;
          });
      };

      this.close = function close() {
        $state.go(
          'telecom.telephony.billingAccount.line.dashboard.calls.click2call',
          {
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
          },
        );
      };

      function init() {
        self.loading = {
          changePassword: false,
          readUser: true,
        };

        self.user = new TelephonyGroupLineClick2CallUser(
          {
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
          },
          {
            id: $stateParams.userId,
          },
        );

        return self.user
          .getUser()
          .then((data) => {
            self.user.login = data.login;
          })
          .catch((err) => $q.reject(err))
          .finally(() => {
            self.loading.readUser = false;
          });
      }

      init();
    },
  );
