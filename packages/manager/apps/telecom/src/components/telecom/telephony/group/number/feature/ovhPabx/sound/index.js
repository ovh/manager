import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import list from './list';
import popoverSection from './popover-section';
import uploader from './uploader';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyGroupNumberFeatureOvhPabxSound';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    list,
    popoverSection,
    uploader,
  ])
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
