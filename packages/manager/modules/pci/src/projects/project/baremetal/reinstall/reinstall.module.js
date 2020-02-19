import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import reinstall from '../instance/reinstall/reinstall.module';
import routing from './reinstall.routing';

const moduleName = 'ovhManagerPciBaremetalReinstall';

angular
  .module(moduleName, [
    reinstall,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
