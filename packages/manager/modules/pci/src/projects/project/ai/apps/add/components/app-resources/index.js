import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import resourceSelector from '@ovh-ux/manager-components';
import component from './app-resources.component';

const moduleName = 'ovhManagerPciProjectAppsAppResources';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', resourceSelector])
  .component('appResources', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
