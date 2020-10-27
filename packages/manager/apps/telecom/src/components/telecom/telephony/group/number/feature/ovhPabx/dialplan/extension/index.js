import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import edit from './edit';
import rule from './rule';

import component from './extension.component';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyGroupNumberFeatureOvhPabxDiaplplanExtension';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    edit,
    rule,
  ])
  .component('telephonyNumberOvhPabxDialplanExtension', component);

export default moduleName;
