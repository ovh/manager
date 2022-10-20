import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import additionalDiskUpgrade from '../../components/additional-disk/upgrade';

import routing from './upgrade.routing';

const moduleName = 'ovhManagerVpsAdditionalDiskUpgrade';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    additionalDiskUpgrade,
  ])
  .config(routing);

export default moduleName;
