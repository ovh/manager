import 'leaflet';

import angular from 'angular';
import 'angular-translate';
import 'angular-leaflet-directive';
import 'ovh-api-services';

import { PICTURES, MONDIAL_RELAY } from './constants';

import directive from './directive';

import './index.less';

const moduleName = 'ngOvhMondialRelay';

angular
  .module(moduleName, [
    'leaflet-directive',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .constant('MONDIAL_RELAY', MONDIAL_RELAY)
  .constant('MONDIAL_RELAY_PICS', PICTURES)
  .directive('mondialRelay', directive)
  .run(/* @ngTranslationsInject ./translations */);

export default moduleName;
