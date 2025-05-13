import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import terminate from '../../components/terminate';

import routing from './terminate.routing';

const moduleName = 'ovhManagerVpsAdditionalDiskTerminate';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    terminate,
  ])
  .config(routing);

export default moduleName;
