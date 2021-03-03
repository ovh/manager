import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-pagination-front';
import '@ovh-ux/ng-ovh-export-csv';

import routing from './subscribers.routing';

const moduleName = 'ovhManagerEmailProDashboardSubscribers';

angular
  .module(moduleName, [
    'ngOvhExportCsv',
    'ngPaginationFront',
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing);

export default moduleName;
