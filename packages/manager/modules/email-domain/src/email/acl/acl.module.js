import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import aclDelete from './delete';
import routing from './acl.routing';

const moduleName = 'ovhManagerEmailDomainDashboardEmailAcl';

angular
  .module(moduleName, [
    aclDelete,
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
