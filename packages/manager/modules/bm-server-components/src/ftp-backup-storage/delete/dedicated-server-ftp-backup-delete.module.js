import component from './dedicated-server-ftp-backup-delete.component';

const moduleName = 'ovhManagerDedicatedServerFtpBackupDelete';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('dedicatedServerFtpBackupDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
