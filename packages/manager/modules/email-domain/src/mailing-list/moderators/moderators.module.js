import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import moderatorsCreate from './create';
import moderatorsDelete from './delete';
import routing from './moderators.routing';

const moduleName = 'ovhManagerEmailDomainDashboardModerators';
angular
  .module(moduleName, [
    moderatorsCreate,
    moderatorsDelete,
    ngTranslateAsyncLoader,
    'oui',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
