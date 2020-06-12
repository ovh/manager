import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import reinstallInstance from '../instance/reinstall/reinstall.module';
import routing from './reinstall.routing';

const moduleName = 'ovhManagerPciInstancesReinstall';

angular
  .module(moduleName, [
    reinstallInstance,
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
