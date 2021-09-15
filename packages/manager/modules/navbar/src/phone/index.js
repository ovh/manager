import angular from 'angular';

import '@ovh-ux/ui-kit';

import './index.scss';

import component from './component';

const moduleName = 'ovhManagerNavbarPhone';

angular
  .module(moduleName, ['oui'])
  .component('ovhManagerNavbarPhone', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
