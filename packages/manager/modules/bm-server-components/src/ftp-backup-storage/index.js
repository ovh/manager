import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import dedicatedServerFtpBackupAccessUpdate from './access/update/dedicated-server-ftp-backup-access-update.module';
import dedicatedServerFtpBackupAccessDelete from './access/delete/dedicated-server-ftp-backup-access-delete.module';
import dedicatedServerFtpBackupAccessAdd from './access/add/dedicated-server-ftp-backup-access-add.module';
import dedicatedServerFtpBackupPasswordRequest from './password-request/dedicated-server-ftp-backup-password-request.module';
import dedicatedServerFtpBackupOrder from './order/dedicated-server-ftp-backup-order.module';
import dedicatedServerFtpBackupDelete from './delete/dedicated-server-ftp-backup-delete.module';
import dedicatedServerFtpBackupActivate from './activate/dedicated-server-ftp-backup-activate.module';

import component from './component';

const moduleName = 'ovhManagerBmServerComponentsFtpBackupStorage';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    dedicatedServerFtpBackupAccessUpdate,
    dedicatedServerFtpBackupAccessDelete,
    dedicatedServerFtpBackupAccessAdd,
    dedicatedServerFtpBackupPasswordRequest,
    dedicatedServerFtpBackupOrder,
    dedicatedServerFtpBackupDelete,
    dedicatedServerFtpBackupActivate,
  ])
  .component('serverFtpBackupStorage', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
