import angular from 'angular';

import 'angular-translate';
import 'ovh-ui-angular';

import './configuration-price.scss';

import component from './configuration-price.component';

const moduleName = 'ovhManagerVpsUpscaleConfigurationPrice';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vpsUpscaleConfigurationPrice', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
