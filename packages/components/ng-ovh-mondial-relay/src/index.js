import 'leaflet';

import angular from 'angular';
import 'angular-translate';
import 'angular-leaflet-directive';
import 'ovh-api-services';

import component from './component';

import './index.less';

const moduleName = 'ngOvhMondialRelay';

angular
  .module(moduleName, [
    'leaflet-directive',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .component('ovhMondialRelay', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
