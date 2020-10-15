import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import conferenceFeature from './feature/conference';
import ovhPabxFeature from './feature/ovhPabx';
import redirectFeature from './feature/redirect';
import sviFeature from './feature/svi';

import component from './number.component';

import './number.less';

const moduleName = 'ovhManagerTelecomComponentsTelecomTelephonyGroupNumber';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    conferenceFeature,
    ovhPabxFeature,
    redirectFeature,
    sviFeature,
  ])
  .component('telephonyNumber', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
