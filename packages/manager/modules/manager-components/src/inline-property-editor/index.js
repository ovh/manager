import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';

const moduleName = 'ovhManagerInlinePropertyEditor';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
  ])
  .component('managerInlinePropertyEditor', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
