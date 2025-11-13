import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-at-internet-ui-router-plugin';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNetAppReplications';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ngAtInternet',
    'ngAtInternetUiRouterPlugin',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component(moduleName, component)
  .config(routing);

export default moduleName;
