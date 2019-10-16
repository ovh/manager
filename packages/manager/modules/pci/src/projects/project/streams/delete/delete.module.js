import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import 'angular-translate';
import 'ovh-api-services';

import deleteStream from '../stream/delete/delete.module';

import routing from './delete.routing';

const moduleName = 'ovhManagerPciStreamsDelete';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ngOvhCloudUniverseComponents',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    deleteStream,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
