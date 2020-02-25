import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import reinstall from '../../../instances/instance/reinstall/reinstall.module';
import routing from './reinstall.routing';

const moduleName = 'ovhManagerPciBaremetalInstanceReinstall';

angular
  .module(moduleName, [
    reinstall,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
