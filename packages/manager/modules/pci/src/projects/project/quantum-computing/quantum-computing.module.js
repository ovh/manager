import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ui-kit';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';

import add from './add';
import component from './quantum-computing.component';
import dashboard from './dashboard';
import deleteNotebook from './delete-notebook';
import onboarding from './onboarding';
import routing from './quantum-computing.routing';
import service from './quantum-computing.service';

import './index.scss';

const moduleName = 'ovhManagerPciQuantumComputing';

angular
  .module(moduleName, [
    add,
    dashboard,
    deleteNotebook,
    ngOvhSwimmingPoll,
    onboarding,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectQuantumComputing', component)
  .service('QuantumService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
