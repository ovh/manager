import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';

import './model-price.scss';

import component from './model-price.component';

const moduleName = 'ovhManagerVpsUpscaleModelPrice';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('vpsUpscaleModelPrice', component)
  .run(/* @ngTranslationsInject:json ../translations */);

export default moduleName;
