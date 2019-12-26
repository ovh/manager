import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';

angular.module('managerApp').component('linePhoneConfiguration', {
  require: {
    configForm: '^form',
  },
  bindings: {
    configGroup: '=linePhoneConfigurationGroup',
    editMode: '=linePhoneConfigurationEditMode',
    expertMode: '=linePhoneConfigurationExpertMode',
  },
  templateUrl:
    'components/telecom/telephony/group/line/phone/configration/line-phone-configuration.html',
  controller($translate, tucValidator, LINE_PHONE_CONFIGURATION) {
    const self = this;

    self.validator = tucValidator;

    /*= ==============================
      =            HELPERS            =
      =============================== */

    self.isEnumHasToBeTranslated = function isEnumHasToBeTranslated(
      configName,
    ) {
      return (
        LINE_PHONE_CONFIGURATION.configEnumsToTranslate.indexOf(configName) > -1
      );
    };

    self.getConfigValue = function getConfigValue(config) {
      switch (config.type) {
        case 'boolean':
          return config.value
            ? $translate.instant(
                'telephony_line_phone_configuration_config_yes',
              )
            : $translate.instant(
                'telephony_line_phone_configuration_config_no',
              );
        case 'enum':
          return self.isEnumHasToBeTranslated(config.name)
            ? $translate.instant(
                [
                  'telephony_line_phone_configuration_config',
                  snakeCase(config.value),
                ].join('_'),
              )
            : config.value;
        default:
          return config.value;
      }
    };

    self.getPlaceholderTranslation = function getPlaceholderTranslation(
      configName,
    ) {
      const trKey = [
        'telephony_line_phone_configuration_config',
        snakeCase(configName),
      ].join('_');
      const translated = $translate.instant(trKey);
      return translated !== trKey ? translated : configName;
    };

    /* -----  End of HELPERS  ------*/

    /*= =============================
      =            EVENTS            =
      ============================== */

    self.onTextInputBlur = function onTextInputBlur(config) {
      if (isEmpty(config.value)) {
        set(config, 'value', config.prevValue);
      }
    };

    /* -----  End of EVENTS  ------*/
  },
});
