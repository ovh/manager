import angular from 'angular';
import '@uirouter/angularjs';

import controller from './dedicated-housing-backup.controller';
import routing from './backup.routes';

import accessAddCtrl from './access/add/dedicated-housing-backup-access-add.controller';
import accessAddTpl from './access/add/dedicated-housing-backup-access-add.html';

import accessDeleteCtrl from './access/delete/dedicated-housing-backup-access-delete.controller';
import accessDeleteTpl from './access/delete/dedicated-housing-backup-access-delete.html';

import backupEnableCtrl from './enable/dedicated-housing-backup-enable.controller';
import backupEnableTpl from './enable/dedicated-housing-backup-enable.html';

import backupDisableCtrl from './disable/dedicated-housing-backup-disable.controller';
import backupDisableTpl from './disable/dedicated-housing-backup-disable.html';

import passwordResetCtrl from './password/reset/dedicated-housing-backup-password-reset.controller';
import passwordResetTpl from './password/reset/dedicated-housing-backup-password-reset.html';

const moduleName = 'ovhManagerDedicatedHousingDashboardBackup';

angular
  .module(moduleName, ['oui', 'ui.router'])
  .config(routing)
  .controller('HousingFtpBackupCtrl', controller)
  .controller('HousingAddAccessFtpBackupCtrl', accessAddCtrl)
  .controller('HousingDeleteAccessFtpBackupCtrl', accessDeleteCtrl)
  .controller('HousingActivateFtpBackupCtrl', backupEnableCtrl)
  .controller('HousingActivateFtpBackupCtrl', backupEnableCtrl)
  .controller('HousingDeleteFtpBackupCtrl', backupDisableCtrl)
  .controller('HousingRequestFtpBackupPasswordCtrl', passwordResetCtrl)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'dedicated/housing/backup/access/add/dedicated-housing-backup-access-add.html',
        accessAddTpl,
      );
      $templateCache.put(
        'dedicated/housing/backup/access/delete/dedicated-housing-backup-access-delete.html',
        accessDeleteTpl,
      );
      $templateCache.put(
        'dedicated/housing/backup/disable/dedicated-housing-backup-disable.html',
        backupEnableTpl,
      );
      $templateCache.put(
        'dedicated/housing/backup/disable/dedicated-housing-backup-disable.html',
        backupDisableTpl,
      );
      $templateCache.put(
        'dedicated/housing/backup/password/reset/dedicated-housing-backup-password-reset.html',
        passwordResetTpl,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
