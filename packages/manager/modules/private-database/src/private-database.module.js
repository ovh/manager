import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-utils';
import '@uirouter/angularjs';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import routing from './private-database.routing';

const moduleName = 'ovhManagerPrivateDatabase';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhUtils',
    'oui',
    'ui.router',
    ListLayoutHelper.moduleName,
  ])
  .config(routing);

export default moduleName;
