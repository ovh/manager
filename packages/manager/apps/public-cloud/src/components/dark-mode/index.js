import angular from 'angular';
import 'angular-translate';
import 'angular-ui-bootstrap';
import '@ovh-ux/ui-kit';

import component from './dark-mode.component';

const moduleName = 'ovhManagerPublicCloudDarkMode';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.bootstrap'])
  .component('publicCloudDarkMode', component)
  .run(/* @ngTranslationsInject:json ./modal/translations */);

export default moduleName;
