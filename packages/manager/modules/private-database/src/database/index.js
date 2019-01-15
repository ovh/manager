import angular from 'angular';

import databaseAddCtrl from './add/private-database-database-add.controller';
import archiveDumpCtrl from './archive/dump/private-database-database-archive-dump.controller';
import archiveListCtrl from './archive/list/private-database-database-archive-list.controller';
import certificateCtrl from './certificate/private-database-database-certificate.controller';
import deleteCtrl from './delete/private-database-database-delete.controller';
import dumpCtrl from './dump/private-database-database-dump.controller';
import dumpDeleteCtrl from './dump/delete/private-database-database-dump-delete.controller';
import extensionCtrl from './extension/private-database-database-extension.controller';
import importCtrl from './import/private-database-database-import.controller';
import databaseCtrl from './private-database-database.controller';
import listCtrl from './list/private-database-database-list.controller';
import ramUpdateCtrl from './ram/update/private-database-database-ram-update.controller';
import restartCtrl from './restart/private-database-database-restart.controller';
import restoreCtrl from './restore/private-database-database-restore.controller';
import restoreArchiveCtrl from './restore-archive/private-database-database-restore-archive.controller';
import startCtrl from './start/private-database-database-start.controller';
import stopCtrl from './stop/private-database-database-stop.controller';
import userCtrl from './user/private-database-database-user.controller';
import versionUpdateCtrl from './version/update/private-database-database-version-update.controller';

import databaseAddTemplate from './add/private-database-database-add.html';
import archiveDumpTemplate from './archive/dump/private-database-database-archive-dump.html';
import archiveListTemplate from './archive/list/private-database-database-archive-list.html';
import certificateTemplate from './certificate/private-database-database-certificate.html';
import deleteTemplate from './delete/private-database-database-delete.html';
import dumpTemplate from './dump/private-database-database-dump.html';
import dumpDeleteTemplate from './dump/delete/private-database-database-dump-delete.html';
import extensionTemplate from './extension/private-database-database-extension.html';
import importTemplate from './import/private-database-database-import.html';
import databaseTemplate from './private-database-database.html';
import listTemplate from './list/private-database-database-list.html';
import ramUpdateTemplate from './ram/update/private-database-database-ram-update.html';
import restartTemplate from './restart/private-database-database-restart.html';
import restoreTemplate from './restore/private-database-database-restore.html';
import restoreArchiveTemplate from './restore-archive/private-database-database-restore-archive.html';
import startTemplate from './start/private-database-database-start.html';
import stopTemplate from './stop/private-database-database-stop.html';
import userTemplate from './user/private-database-database-user.html';
import versionUpdateTemplate from './version/update/private-database-database-version-update.html';

import extensionService from './extension/private-database-database-extension.service';

const moduleName = 'managerPrivateDatabaseDatabase';

angular.module(moduleName, [])
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('private-database/database/add/private-database-database-add.html', databaseAddTemplate);
    $templateCache.put('private-database/database/archive/dump/private-database-database-archive-dump.html', archiveDumpTemplate);
    $templateCache.put('private-database/database/archive/list/private-database-database-archive-list.html', archiveListTemplate);
    $templateCache.put('private-database/database/certificate/private-database-database-certificate.html', certificateTemplate);
    $templateCache.put('private-database/database/delete/private-database-database-delete.html', deleteTemplate);
    $templateCache.put('private-database/database/dump/private-database-database-dump.html', dumpTemplate);
    $templateCache.put('private-database/database/dump/delete/private-database-database-dump-delete.html', dumpDeleteTemplate);
    $templateCache.put('private-database/database/extension/private-database-database-extension.html', extensionTemplate);
    $templateCache.put('private-database/database/import/private-database-database-import.html', importTemplate);
    $templateCache.put('private-database/database/private-database-database.html', databaseTemplate);
    $templateCache.put('private-database/database/list/private-database-database-list.html', listTemplate);
    $templateCache.put('private-database/database/ram/update/private-database-database-ram-update.html', ramUpdateTemplate);
    $templateCache.put('private-database/database/restart/private-database-database-restart.html', restartTemplate);
    $templateCache.put('private-database/database/restore/private-database-database-restore.html', restoreTemplate);
    $templateCache.put('private-database/database/restore-archive/private-database-database-restore-archive.html', restoreArchiveTemplate);
    $templateCache.put('private-database/database/start/private-database-database-start.html', startTemplate);
    $templateCache.put('private-database/database/stop/private-database-database-stop.html', stopTemplate);
    $templateCache.put('private-database/database/user/private-database-database-user.html', userTemplate);
    $templateCache.put('private-database/database/version/update/private-database-database-version-update.html', versionUpdateTemplate);
  })
  .controller('PrivateDatabaseAddBddCtrl', databaseAddCtrl)
  .controller('PrivateDatabaseArchiveDumpCtrl', archiveDumpCtrl)
  .controller('PrivateDatabaseArchiveListCtrl', archiveListCtrl)
  .controller('PrivateDatabaseCertificateCtrl', certificateCtrl)
  .controller('PrivateDatabaseDeleteBDDCtrl', deleteCtrl)
  .controller('PrivateDatabaseBDDsDumpsCtrl', dumpCtrl)
  .controller('PrivateDatabaseBDDsDumpsDeleteCtrl', dumpDeleteCtrl)
  .controller('PrivateDatabaseBDDsExtensionCtrl', extensionCtrl)
  .controller('PrivateDatabaseImportCtrl', importCtrl)
  .controller('PrivateDatabaseBDDsCtrl', databaseCtrl)
  .controller('PrivateDatabaseBDDsListCtrl', listCtrl)
  .controller('PrivateDatabaseChangeRamCtrl', ramUpdateCtrl)
  .controller('PrivateDatabaseRestartCtrl', restartCtrl)
  .controller('PrivateDatabaseRestoreBDDCtrl', restoreCtrl)
  .controller('PrivateDatabaseRestoreArchiveBDDCtrl', restoreArchiveCtrl)
  .controller('PrivateDatabaseStartCtrl', startCtrl)
  .controller('PrivateDatabaseStopCtrl', stopCtrl)
  .controller('PrivateDatabaseUserDatabaseCtrl', userCtrl)
  .controller('PrivateDatabaseChangeVersionCtrl', versionUpdateCtrl)
  .service('PrivateDatabaseExtension', extensionService);

export default moduleName;
