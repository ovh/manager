import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import 'ovh-api-services';

import component from './reset-cursor.component';
import routing from './reset-cursor.routing';

const moduleName = 'ovhManagerPciStreamsStreamSubscriptionsResetCursor';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ngOvhCloudUniverseComponents',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciStreamsStreamSubscriptionsResetCursor', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
