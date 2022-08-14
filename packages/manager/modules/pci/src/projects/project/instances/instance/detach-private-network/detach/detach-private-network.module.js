import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import detachPrivateNetwork from '../detach-private-network.module';
import routing from './detach-private-network.routing';

const moduleName = 'ovhManagerPciInstanceDetachPrivateNetwork';

angular
  .module(moduleName, [
    detachPrivateNetwork,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
