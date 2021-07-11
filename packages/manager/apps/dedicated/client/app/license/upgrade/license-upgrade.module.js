import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './license-upgrade.routes';

import pleskTemplte from './PLESK.html';
import sqlServerTemplte from './SQLSERVER.html';
import virtuozzoTemplte from './VIRTUOZZO.html';
import windowsTemplte from './WINDOWS.html';
import worklightTemplte from './WORKLIGHT.html';

const moduleName = 'licenseUpgrade';

angular
  .module(moduleName, [
    uiRouter,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put('license/upgrade/PLESK.html', pleskTemplte);

      $templateCache.put('license/upgrade/SQLSERVER.html', sqlServerTemplte);

      $templateCache.put('license/upgrade/VIRTUOZZO.html', virtuozzoTemplte);

      $templateCache.put('license/upgrade/WINDOWS.html', windowsTemplte);

      $templateCache.put('license/upgrade/WORKLIGHT.html', worklightTemplte);
    },
  );

export default moduleName;
