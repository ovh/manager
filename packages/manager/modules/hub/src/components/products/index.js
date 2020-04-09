import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';

import hubTile from '../tile';

import component from './products.component';
import './index.scss';

const moduleName = 'ovhManagerHubProducts';

angular
  .module(moduleName, ['ngAtInternet', 'pascalprecht.translate', hubTile])
  .component('hubProducts', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
