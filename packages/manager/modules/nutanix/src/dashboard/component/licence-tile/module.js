import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';
import legacyFeatures from './licence-tile-legacy-features';
import features from './licence-tile-features';

const moduleName = 'ovhManagerNutanixLicenceTile';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    legacyFeatures,
    features,
  ])
  .component('nutanixLicenceTile', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
