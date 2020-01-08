import angular from 'angular';

import deleteComponent from './delete';
import backupsComponent from './backups.component';
import manualBackup from './manual-backup';
import routing from './backups.routing';
import recovery from './recovery';
import restore from './restore';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsBackups';

angular
  .module(moduleName, [deleteComponent, manualBackup, recovery, restore])
  .config(routing)
  .component(
    'enterpriseCloudDatabaseServiceDetailsBackupsComponent',
    backupsComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
