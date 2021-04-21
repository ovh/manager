import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';
import './index.scss';

const moduleName = 'ovhManagerWebPaasAdditionalOption';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('webPaasAdditionalOption', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
