/* eslint-disable import/extensions */
/* eslint-disable import/no-webpack-loader-syntax */

import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-utils';
import 'angular-ui-bootstrap';
import '@ovh-ux/manager-filters';
import 'script-loader!angular-translate/dist/angular-translate-loader-partial/angular-translate-loader-partial.min.js';
import 'ovh-api-services';

import ngOvhWebUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngOvhUiRouterLayout from '@ovh-ux/ng-ui-router-layout';

import ovhManagerCore from '@ovh-ux/manager-core';

import deleteModule from './delete/license-delete.module';
import deleteAtExpirationModule from './delete/at-expiration/license-delete-at-expiration.module';
import detailModule from './detail/license-detail.module';
import directAdminChangeOsModule from './direct-admin/change-os/license-direct-admin-change-os.module';
import migrateModule from './migrate/license-migrate.module';
import orderModule from './order/license-order.module';
import redirectionUpgradeModule from './redirection/upgrade/license-redirection-upgrade.module';
import splaModule from './spla/license-spla.module';
import upgradeModule from './upgrade/license-upgrade.module';
import ducTranslate from './ducTranslate';
import ducPriceFilter from './ducPrice';

import routing from './license.routes';
import service from './license.service';
import licenseAvailabilityService from './license-feature-availability';
import { LICENSE_TYPES } from './license.constants';
import config, { getConstants } from './config/config';

const moduleName = 'licenseModule';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ngOvhUtils',
    'ui.bootstrap',
    'ovhManagerFilters',
    'ovh-api-services',
    'oui',
    uiRouter,
    ngOvhWebUniverseComponents,
    ngOvhUiRouterLayout,
    deleteModule,
    deleteAtExpirationModule,
    detailModule,
    directAdminChangeOsModule,
    migrateModule,
    orderModule,
    redirectionUpgradeModule,
    splaModule,
    upgradeModule,
    ngOvhFeatureFlipping,
    ngTranslateAsyncLoader,
    ovhManagerCore,
    ducTranslate,
    ducPriceFilter,
  ])
  .config(routing)
  .factory(
    'licenseConstants',
    /* @ngInject */ (coreConfig) => {
      const configConstants = getConstants(coreConfig.getRegion());

      return {
        aapiRootPath: config.aapiRootPath,
        renew: configConstants.RENEW_URL,
      };
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($transitions, $translate) => {
      $transitions.onBefore({ to: 'license.**' }, () => $translate.refresh());
    },
  )
  .constant('LICENCE_TYPES', LICENSE_TYPES)
  .service('License', service)
  .service('licenseFeatureAvailability', licenseAvailabilityService);

export default moduleName;
