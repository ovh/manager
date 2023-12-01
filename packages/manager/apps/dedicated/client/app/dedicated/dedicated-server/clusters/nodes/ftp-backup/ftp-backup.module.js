import angular from 'angular';
import '@uirouter/angularjs';
import { serverFtpBackupStorage } from '@ovh-ux/manager-bm-server-components';

import routing from './ftp-backup.routing';
import ftpBackupAccessUpdateRouting from './access/dedicated-server-ftp-backup-access-update.routing';
import ftpBackupAccessDeleteRouting from './access/dedicated-server-ftp-backup-access-delete.routing';
import ftpBackupAccessAddRouting from './access/dedicated-server-ftp-backup-access-add.routing';
import ftpBackupPasswordRequestRouting from './password-request/dedicated-server-ftp-backup-password-request.routing';
import ftpBackupOrderRouting from './order/dedicated-server-ftp-backup-order.routing';
import ftpBackupDeleteRouting from './delete/dedicated-server-ftp-backup-delete.routing';
import ftpBackupActivateRouting from './activate/dedicated-server-ftp-backup-activate.routing';
import component from './component';

const moduleName = 'ovhManagerDedicatedClusterNodeFtpBackupStorage';

angular
  .module(moduleName, ['ui.router', serverFtpBackupStorage])
  .config(routing)
  .config(ftpBackupAccessUpdateRouting)
  .config(ftpBackupAccessDeleteRouting)
  .config(ftpBackupAccessAddRouting)
  .config(ftpBackupPasswordRequestRouting)
  .config(ftpBackupOrderRouting)
  .config(ftpBackupDeleteRouting)
  .config(ftpBackupActivateRouting)
  .component('dedicatedClusterNodeFtpBackupStorage', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
