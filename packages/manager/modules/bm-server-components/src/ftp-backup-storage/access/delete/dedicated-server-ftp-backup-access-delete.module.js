import component from './dedicated-server-ftp-backup-access-delete.component';

const moduleName = 'ovhManagerDedicatedServerFtpBackupAccessDelete';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('dedicatedServerFtpBackupAccessDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
