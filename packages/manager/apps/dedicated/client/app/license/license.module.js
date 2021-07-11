import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ng-ovh-utils';
import 'angular-ui-bootstrap';
import '@ovh-ux/manager-filters';

import deleteModule from './delete/license-delete.module';
import deleteAtExpirationModule from './delete/at-expiration/license-delete-at-expiration.module';
import detailModule from './detail/license-detail.module';
import directAdminChangeOsModule from './direct-admin/change-os/license-direct-admin-change-os.module';
import migrateModule from './migrate/license-migrate.module';
import orderModule from './order/license-order.module';
import redirectionUpgradeModule from './redirection/upgrade/license-redirection-upgrade.module';
import splaModule from './spla/license-spla.module';
import upgradeModule from './upgrade/license-upgrade.module';

import routing from './license.routes';
import service from './license.service';
import licenseAvailabilityService from './license-feature-availability';
import { LICENSE_TYPES } from './license.constants';

const moduleName = 'licenseModule';

angular
  .module(moduleName, [
    'ngOvhUtils',
    'ui.bootstrap',
    'ovhManagerFilters',
    uiRouter,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    deleteModule,
    deleteAtExpirationModule,
    detailModule,
    directAdminChangeOsModule,
    migrateModule,
    orderModule,
    redirectionUpgradeModule,
    splaModule,
    upgradeModule,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .constant('LICENCE_TYPES', LICENSE_TYPES)
  .service('License', service)
  .service('licenseFeatureAvailability', licenseAvailabilityService);

export default moduleName;
