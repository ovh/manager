import angular from 'angular';

import constant from './line-phone-configuration.constant';
import phoneConfigurationComponent from './line-phone-configuration.component';
import phoneConfigurationFactory from './line-phone-configuration.factory';
import userInterfaceComponent from './userInterface/line-phone-configuration-user-interface.component';
import extensionComponent from './extension/line-phone-configuration-extension.component';

const moduleName = 'ovhManagerTelephonyGroupLinePhoneConfiguration';

angular.module(moduleName, [])
  .constant('LINE_PHONE_CONFIGURATION', constant.LINE_PHONE_CONFIGURATION)
  .component('linePhoneConfiguration', phoneConfigurationComponent)
  .factory('TelephonyGroupLinePhoneConfiguration', phoneConfigurationFactory)
  .component('linePhoneConfigurationUserInterface', userInterfaceComponent)
  .component('linePhoneConfigurationExtension', extensionComponent);

export default moduleName;
