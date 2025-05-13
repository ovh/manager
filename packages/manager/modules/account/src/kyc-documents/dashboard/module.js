import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerKycDocumentsDashboard';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('kycDocuments', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./DE/translations */)
  .run(/* @ngTranslationsInject:json ./DEFAULT/translations */)
  .run(/* @ngTranslationsInject:json ./ES/translations */)
  .run(/* @ngTranslationsInject:json ./FR/translations */)
  .run(/* @ngTranslationsInject:json ./IT/translations */)
  .run(/* @ngTranslationsInject:json ./MA/translations */)
  .run(/* @ngTranslationsInject:json ./PL/translations */)
  .run(/* @ngTranslationsInject:json ./PT/translations */)
  .run(/* @ngTranslationsInject:json ./QC/translations */)
  .run(/* @ngTranslationsInject:json ./SN/translations */)
  .run(/* @ngTranslationsInject:json ./TN/translations */)
  .run(/* @ngTranslationsInject:json ./WS/translations */);

export default moduleName;
