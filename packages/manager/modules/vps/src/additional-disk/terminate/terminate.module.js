import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import additionalDiskTerminate from '../../components/additional-disk/terminate';

import routing from './terminate.routing';

const moduleName = 'ovhManagerVpsAdditionalDiskTerminate';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    additionalDiskTerminate,
  ])
  .config(routing);

export default moduleName;
