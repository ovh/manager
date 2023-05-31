import angular from 'angular';

import highlightText from '../highlightText';

import component from './actionSelect.component';

const moduleName = 'ovhManagerIAMComponentsActionSelect';

angular
  .module(moduleName, [highlightText])
  .component('iamActionSelect', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
