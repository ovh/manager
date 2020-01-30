import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

const moduleName = 'ovhManagerPciComponentsProjectGuidesHeader';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
