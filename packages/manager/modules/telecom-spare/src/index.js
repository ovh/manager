/**
 * Difference between loading a module and importing a module
 *
 * Loading a module means:
 * - loading its content
 * - executing its content
 *
 * Modules are singletons, so only one instance of them exists
 *
 * Loading a module may have the following consequences:
 * - if the content exports a feature, then it will be available to be imported by other modules
 * - if the content changes the global object, then the changes will be done
 *
 * Importing is an optional step that follows loading
 *
 * It means, using in the importing module a feature exposed by the exporting module
 */

// here we import the feature exported by the "angular" module and we call it "angular"
import angular from 'angular';

/**
 * Here we load the "@ovh-ux/manager-core" module
 * The body of "@ovh-ux/manager-core" executes code on the "angular" object
 * As "angular" is a singleton, what "@ovh-ux/manager-core" executes on it
 * is reflected here
 */
import '@ovh-ux/manager-core';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import ngOvhMondialRelay from '@ovh-ux/ng-ovh-mondial-relay';
import '@ovh-ux/ng-ovh-contracts';
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
import 'ovh-angular-simple-country-list';

// Import styles
import 'ovh-manager-webfont/dist/css/ovh-font.css';
import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';
import 'font-awesome/css/font-awesome.css';
import 'ovh-common-style/dist/ovh-common-style.css';
import 'ovh-angular-contact/dist/ovh-angular-contact.css';
import 'leaflet/dist/leaflet.css';
import 'ui-select/dist/select.css';
import 'intl-tel-input/build/css/intlTelInput.css';

import modems from './modems';
import phones from './phones';
import template from './template.html';
import modemOrder from './modems/order';
import phoneOrder from './phones/order';
import constant from './constant';

import formatModemBrandFilter from './filters/formatModemBrand/format-modem-brand.filter';
import formatPhoneBrandFilter from './filters/formatPhoneBrand/format-phone-brand.filter';

import './index.scss';

const moduleName = 'ovhManagerTelecomSpare';

angular
  .module(moduleName, [
    modems,
    ngOvhMondialRelay,
    ngOvhTelecomUniverseComponents,
    modemOrder,
    phones,
    phoneOrder,
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
    'ovh-angular-simple-country-list',
  ])
  .constant('SPARE_BRAND', constant.SPARE_BRAND)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('spare', {
        url: '/spare',
        views: {
          '': {
            template,
          },
        },
        abstract: true,
        redirectTo: 'spare.modems',
        resolve: {
          me: /* @ngInject */ OvhApiMe => OvhApiMe.v6().get().$promise,
        },
      });
  })
  .filter('formatModemBrandFilter', formatModemBrandFilter)
  .filter('formatPhoneBrandFilter', formatPhoneBrandFilter)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./common/translations */)
  .run(/* @ngInject */ ($transitions, $translate, $translatePartialLoader) => {
    $translatePartialLoader.addPart('common');

    $transitions.onBefore({ to: 'spare.**' }, () => $translate.refresh());
  });

export default moduleName;
