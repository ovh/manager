import angular from 'angular';
import themeComponent from './theme/theme.component';

const moduleName = 'ovhManagerTelecomTelephonyComponent';

angular
  .module(moduleName, [])
  .component('themePicker', themeComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
