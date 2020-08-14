import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import routing from './account.routing';

const moduleName = 'ovhManagerSharepointDashboardAccount';

angular
  .module(moduleName, [ngTranslateAsyncLoader, 'oui', 'pascalprecht.translate'])
  .config(routing);

export default moduleName;
