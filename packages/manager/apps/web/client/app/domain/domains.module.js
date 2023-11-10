import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import routing from './domains.routing';
import component from './list/list-domain-layout.component';
import restoreRenew from './list/restore-renew';

const moduleName = 'ovhManagerDomains';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    ListLayoutHelper.moduleName,
    restoreRenew,
  ])
  .config(routing)
  .component('managerListDomainLayout', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
