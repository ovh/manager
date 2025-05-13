import component from './dedicated-server-ftp-backup-password-request.component';

const moduleName = 'ovhManagerDedicatedServerFtpBackupPasswordRequest';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('dedicatedServerFtpBackupPasswordRequest', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
