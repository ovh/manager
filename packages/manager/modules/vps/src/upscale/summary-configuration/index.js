import angular from 'angular';
import 'angular-translate';
import 'ovh-ui-angular';
import './summary-configuration.scss';

import component from './summary-configuration.component';

const moduleName = 'ovhManagerVpsUpscaleSummaryConfiguration';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vpsUpscaleSummaryConfiguration', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
