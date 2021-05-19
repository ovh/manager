import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';

import add from './add';
import component from './notebooks.component';
import dashboard from './dashboard';
import onboarding from './onboarding';
import routing from './notebooks.routing';
import service from './notebooks.service';

import './index.scss';

const moduleName = 'ovhManagerPciNotebooks';

angular
  .module(moduleName, [
    add,
    dashboard,
    ngOvhSwimmingPoll,
    onboarding,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectNotebooks', component)
  .service('NotebookService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
