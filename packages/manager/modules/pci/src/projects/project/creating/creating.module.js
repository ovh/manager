import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@uirouter/angularjs';
import 'angular-translate';
import 'angular-animate';

import notPaid from './notPaid';

import routing from './creating.routing';
import component from './creating.component';
import service from './creating.service';

import './creating.scss';

const moduleName = 'ovhManagerPciProjectsNewCreating';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhSwimmingPoll',
    'ngAnimate',
    notPaid,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectCreating', component)
  .service('projectCreating', service);

export default moduleName;
