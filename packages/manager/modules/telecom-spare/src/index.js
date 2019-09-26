import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-mondial-relay';
import '@ovh-ux/ng-ovh-contracts';
import '@ovh-ux/ng-ovh-simple-country-list';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'oclazyload';
import 'ovh-ui-angular';
import 'angular-leaflet-directive';
import 'angular-ui-bootstrap';
import 'angular-translate-loader-partial';
import 'angular-translate-loader-pluggable';
import 'angular-translate-storage-cookie';
import 'angular-translate-storage-local';

import 'ovh-manager-webfont/dist/css/ovh-font.css';
import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';
import 'font-awesome/css/font-awesome.css';
import 'ovh-common-style/dist/ovh-common-style.css';
import 'leaflet/dist/leaflet.css';
import 'ui-select/dist/select.css';
import 'intl-tel-input/build/css/intlTelInput.css';

import modems from './modems';
import phones from './phones';
import modemOrder from './modems/order';
import phoneOrder from './phones/order';
import routing from './routing';

import formatModemBrandFilter from './filters/formatModemBrand/format-modem-brand.filter';
import formatPhoneBrandFilter from './filters/formatPhoneBrand/format-phone-brand.filter';

import './index.scss';

const moduleName = 'ovhManagerTelecomSpare';

angular
  .module(moduleName, [
    modems,
    'ngOvhMondialRelay',
    'ngOvhTelecomUniverseComponents',
    modemOrder,
    phones,
    phoneOrder,
    'ngOvhSimpleCountryList',
    'ngOvhContracts',
    'oui',
    'ngTranslateAsyncLoader',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ovh-api-services',
    'ui.bootstrap',
    'angular-translate-loader-pluggable',
    'ui.select',
  ])
  .config(routing)
  .filter('formatModemBrandFilter', formatModemBrandFilter)
  .filter('formatPhoneBrandFilter', formatPhoneBrandFilter)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($transitions, $translate) => {
      $transitions.onBefore({ to: 'spare.**' }, () => $translate.refresh());
    },
  );

export default moduleName;
