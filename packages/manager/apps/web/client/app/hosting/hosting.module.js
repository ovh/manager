import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import routing from './hosting.routing';

const moduleName = 'ovhManagerHostings';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
    ListLayoutHelper.moduleName,
  ])
  .config(routing);

export default moduleName;
