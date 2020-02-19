import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import attachPrivateNetwork from '../../../instances/instance/attach-private-network/attach-private-network.module';
import routing from './attach-private-network.routing';

const moduleName = 'ovhManagerPciBaremetalInstanceAttachPrivateNetwork';

angular
  .module(moduleName, [
    attachPrivateNetwork,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
