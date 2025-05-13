import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/manager-core';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import routing from './email-pro.routing';

const moduleName = 'ovhManagerEmailPro';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    ListLayoutHelper.moduleName,
    'ui.router',
  ])
  .config(routing);

export default moduleName;
