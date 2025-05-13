import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-pagination-front';

import routing from './mailing-list.routing';

import moderators from './moderators/moderators.module';
import subscribers from './subscribers/subscribers.module';

const moduleName = 'ovhManagerEmailProDashboardMailingList';

angular
  .module(moduleName, [
    'ngPaginationFront',
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    moderators,
    subscribers,
  ])
  .config(routing);

export default moduleName;
