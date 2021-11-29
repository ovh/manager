import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';

import component from './apps.component';
import routing from './apps.routing';
import service from './apps.service';

import add from './add';
import onboarding from './onboarding';
import dashboard from './dashboard';
import deleteApp from './delete-app';

import './index.scss';

const moduleName = 'ovhManagerPciApps';

angular
  .module(moduleName, [
    ngOvhSwimmingPoll,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
    add,
    dashboard,
    onboarding,
    deleteApp,
  ])
  .config(routing)
  .component('ovhManagerPciProjectApps', component)
  .service('AppService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
