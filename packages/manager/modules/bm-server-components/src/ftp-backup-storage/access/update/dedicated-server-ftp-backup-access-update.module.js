import component from './dedicated-server-ftp-backup-access-update.component';

const moduleName = 'ovhManagerDedicatedServerFtpBackupAccessUpdate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('dedicatedServerFtpBackupAccessUpdate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
