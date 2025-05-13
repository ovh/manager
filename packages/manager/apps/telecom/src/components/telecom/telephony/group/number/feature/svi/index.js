import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';

import configurationTemplate from './svi-configuration.html';

import component from './svi.component';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyGroupNumberFeatureSvi';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('telephonyNumberSvi', component)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'components/telecom/telephony/group/number/feature/svi/svi-configuration.html',
        configurationTemplate,
      );
    },
  );

export default moduleName;
