import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-pagination-front';

import routing from './moderators.routing';

const moduleName = 'ovhManagerEmailProDashboardModerators';

angular
  .module(moduleName, [
    'ngPaginationFront',
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing);

export default moduleName;
