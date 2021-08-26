import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-web-universe-components';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-utils';

import routing from './database.routing';

import archive from './archive';
import dump from './dump';
import extension from './extension';
import list from './list';
import user from './user';

import addBddController from './add/private-database-database-add.controller';
import addBddTemplate from './add/private-database-database-add.html';
import certificateController from './certificate/private-database-database-certificate.controller';
import certificateTemplate from './certificate/private-database-database-certificate.html';
import deleteController from './delete/private-database-database-delete.controller';
import deleteTemplate from './delete/private-database-database-delete.html';
import importController from './import/private-database-database-import.controller';
import importTemplate from './import/private-database-database-import.html';

import ramUpdateController from './ram/update/private-database-database-ram-update.controller';
import ramUpdateTemplate from './ram/update/private-database-database-ram-update.html';
import restartController from './restart/private-database-database-restart.controller';
import restartTemplate from './restart/private-database-database-restart.html';
import restoreController from './restore/private-database-database-restore.controller';
import restoreTemplate from './restore/private-database-database-restore.html';

import restoreArchiveController from './restore-archive/private-database-database-restore-archive.controller';
import restoreArchiveTemplate from './restore-archive/private-database-database-restore-archive.html';
import startController from './start/private-database-database-start.controller';
import startTemplate from './start/private-database-database-start.html';
import stopController from './stop/private-database-database-stop.controller';
import stopTemplate from './stop/private-database-database-stop.html';
import versionUpdateController from './version/update/private-database-database-version-update.controller';
import versionUpdateTemplate from './version/update/private-database-database-version-update.html';

const moduleName = 'ovhManagerPrivateDatabaseDatabase';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhWebUniverseComponents',
    'oui',
    'ui.router',
    'ngOvhUtils',
    archive,
    dump,
    extension,
    list,
    user,
  ])
  .config(routing)

  .controller('PrivateDatabaseAddBddCtrl', addBddController)
  .controller('PrivateDatabaseCertificateCtrl', certificateController)
  .controller('PrivateDatabaseDeleteBDDCtrl', deleteController)
  .controller('PrivateDatabaseImportCtrl', importController)
  .controller('PrivateDatabaseChangeRamCtrl', ramUpdateController)
  .controller('PrivateDatabaseRestartCtrl', restartController)
  .controller('PrivateDatabaseRestoreBDDCtrl', restoreController)
  .controller('PrivateDatabaseRestoreArchiveBDDCtrl', restoreArchiveController)
  .controller('PrivateDatabaseStartCtrl', startController)
  .controller('PrivateDatabaseStopCtrl', stopController)
  .controller('PrivateDatabaseChangeVersionCtrl', versionUpdateController)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'private-database/database/add/private-database-database-add.html',
        addBddTemplate,
      );
      $templateCache.put(
        'private-database/database/certificate/private-database-database-certificate.html',
        certificateTemplate,
      );
      $templateCache.put(
        'private-database/database/delete/private-database-database-delete.html',
        deleteTemplate,
      );
      $templateCache.put(
        'private-database/database/import/private-database-database-import.html',
        importTemplate,
      );
      $templateCache.put(
        'private-database/database/ram/update/private-database-database-ram-update.html',
        ramUpdateTemplate,
      );
      $templateCache.put(
        'private-database/database/restart/private-database-database-restart.html',
        restartTemplate,
      );
      $templateCache.put(
        'private-database/database/restore/private-database-database-restore.html',
        restoreTemplate,
      );

      $templateCache.put(
        'private-database/database/restore-archive/private-database-database-restore-archive.html',
        restoreArchiveTemplate,
      );
      $templateCache.put(
        'private-database/database/start/private-database-database-start.html',
        startTemplate,
      );
      $templateCache.put(
        'private-database/database/stop/private-database-database-stop.html',
        stopTemplate,
      );
      $templateCache.put(
        'private-database/database/version/update/private-database-database-version-update.html',
        versionUpdateTemplate,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
