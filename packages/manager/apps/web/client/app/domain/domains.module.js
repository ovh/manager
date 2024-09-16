import { ApiV2ListHelper } from '@ovh-ux/manager-ng-apiv2-helper';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import angular from 'angular';
import 'angular-translate';
import routing from './domains.routing';
import component from './list/list-domain-layout.component';
import restoreRenew from './list/restore-renew';
import './list/style.scss';

const moduleName = 'ovhManagerDomains';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    restoreRenew,
    ngOvhUtils,
    ListLayoutHelper.moduleName,
    ApiV2ListHelper.moduleName,
  ])
  .config(routing)
  .component('managerListDomainLayout', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
