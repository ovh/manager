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
  .run(/* @ngTranslationsInject:json ./translations/DE */)
  .run(/* @ngTranslationsInject:json ./translations/DEFAULT */)
  .run(/* @ngTranslationsInject:json ./translations/ES */)
  .run(/* @ngTranslationsInject:json ./translations/FR */)
  .run(/* @ngTranslationsInject:json ./translations/IT */)
  .run(/* @ngTranslationsInject:json ./translations/MA */)
  .run(/* @ngTranslationsInject:json ./translations/PL */)
  .run(/* @ngTranslationsInject:json ./translations/PT */)
  .run(/* @ngTranslationsInject:json ./translations/QC */)
  .run(/* @ngTranslationsInject:json ./translations/SN */)
  .run(/* @ngTranslationsInject:json ./translations/TN */)
  .run(/* @ngTranslationsInject:json ./translations/WS */);

export default moduleName;
