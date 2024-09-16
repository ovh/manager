import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import 'angular-ui-bootstrap';
import '@ovh-ux/ng-ovh-user-pref';

import block from './block';

const moduleName = 'ovhManagerPciStoragesBlocks';

angular
  .module(moduleName, [
    block,
    'ngOvhUserPref',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
