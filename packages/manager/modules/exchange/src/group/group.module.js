import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './group.routing';

import manager from './manager/manager.module';
import member from './member/member.module';
import alias from './alias/alias.module';

const moduleName = 'ovhManagerExchangeDashboardGroup';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    manager,
    member,
    alias,
  ])
  .config(routing);

export default moduleName;
