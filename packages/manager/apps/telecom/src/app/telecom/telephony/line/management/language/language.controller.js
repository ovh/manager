import find from 'lodash/find';
import snakeCase from 'lodash/snakeCase';

export default /* @ngInject */ function TelecomTelephonyLineManagementLanguageCtrl(
  $translate,
  $q,
  $stateParams,
  $timeout,
  TucToast,
  OvhApiTelephony,
  $filter,
) {
  const self = this;

  this.loaders = {
    init: true,
    change: false,
  };
  this.availableLanguages = [];
  this.language = null;
  this.changeSuccess = false;

  this.changeLanguage = function changeLanguage() {
    self.loaders.change = true;

    return OvhApiTelephony.Line()
      .Options()
      .v6()
      .update(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        {
          language: self.language,
        },
      )
      .$promise.then(() => {
        self.changeSuccess = true;
        $timeout(() => {
          self.changeSuccess = false;
        }, 2000);
        TucToast.success(
          $translate.instant('telephony_line_language_ok_change'),
          { hideAfter: 3 },
        );
      })
      .catch((err) => {
        TucToast.error(
          $translate.instant('telephony_line_language_error_change'),
          err,
        );
      })
      .finally(() => {
        self.loaders.change = false;
      });
  };

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.loaders.init = true;
    self.language = null;
    return OvhApiTelephony.v6()
      .schema()
      .$promise.then((schema) => {
        angular.forEach(
          schema.models['telephony.LineOptionLanguageEnum'].enum,
          (language) => {
            self.availableLanguages.push({
              value: language,
              label: $translate.instant(
                `telephony_line_language_value_${snakeCase(language)}`,
              ),
            });
          },
        );
        self.availableLanguages = $filter('orderBy')(
          self.availableLanguages,
          'label',
        );
        return self.availableLanguages;
      })
      .then(() =>
        OvhApiTelephony.Line()
          .Options()
          .v6()
          .get({
            billingAccount: $stateParams.billingAccount,
            serviceName: $stateParams.serviceName,
          })
          .$promise.then((options) => {
            const language = find(self.availableLanguages, {
              value: options.language,
            });
            if (language) {
              self.language = language.value;
            }
            return self.language;
          }),
      )
      .catch(() => {
        TucToast.error(
          $translate.instant('telephony_line_language_error_init'),
        );
      })
      .finally(() => {
        self.loaders.init = false;
      });
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
