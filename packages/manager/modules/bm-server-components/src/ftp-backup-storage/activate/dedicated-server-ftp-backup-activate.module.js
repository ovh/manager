import component from './dedicated-server-ftp-backup-activate.component';

const moduleName = 'ovhManagerDedicatedServerFtpBackupActivate';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('dedicatedServerFtpBackupActivate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
