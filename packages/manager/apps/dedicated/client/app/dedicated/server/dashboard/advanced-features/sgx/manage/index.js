import angular from 'angular';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import confirmation from './confirmation';

import component from './manage.component';
import routing from './manage.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardSgxManage';

angular
  .module(moduleName, [
    confirmation,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedServerDashboardSgxManage', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
