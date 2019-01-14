import _ from 'lodash';
import template from './line-phone-configuration.html';

export default {
  require: {
    configForm: '^form',
  },
  bindings: {
    configGroup: '=linePhoneConfigurationGroup',
    editMode: '=linePhoneConfigurationEditMode',
    expertMode: '=linePhoneConfigurationExpertMode',
  },
  template,
  controller($translate, tucValidator, LINE_PHONE_CONFIGURATION) {
    const self = this;

    self.validator = tucValidator;

    /*= ==============================
      =            HELPERS            =
      =============================== */

    self.isEnumHasToBeTranslated = function isEnumHasToBeTranslated(configName) {
      return LINE_PHONE_CONFIGURATION.configEnumsToTranslate.indexOf(configName) > -1;
    };

    self.getConfigValue = function getConfigValue(config) {
      switch (config.type) {
        case 'boolean':
          return config.value ? $translate.instant('telephony_line_phone_configuration_config_yes') : $translate.instant('telephony_line_phone_configuration_config_no');
        case 'enum':
          return self.isEnumHasToBeTranslated(config.name) ? $translate.instant(['telephony_line_phone_configuration_config', _.snakeCase(config.value)].join('_')) : config.value;
        default:
          return config.value;
      }
    };

    self.getPlaceholderTranslation = function getPlaceholderTranslation(configName) {
      const trKey = ['telephony_line_phone_configuration_config', _.snakeCase(configName)].join('_');
      const translated = $translate.instant(trKey);
      return translated !== trKey ? translated : configName;
    };

    /* -----  End of HELPERS  ------*/

    /*= =============================
      =            EVENTS            =
      ============================== */

    self.onTextInputBlur = function onTextInputBlur(config) {
      if (_.isEmpty(config.value)) {
        _.set(config, 'value', config.prevValue);
      }
    };

    /* -----  End of EVENTS  ------*/
  },
};
