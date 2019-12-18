import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import edit from '../../../instances/instance/edit/edit.module';
import routing from './edit.routing';

const moduleName = 'ovhManagerPciBaremetalInstanceEdit';

angular
  .module(moduleName, [
    edit,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
