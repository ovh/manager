import component from './dedicated-server-ftp-backup-access-add.component';

const moduleName = 'ovhManagerDedicatedServerFtpBackupAccessAdd';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('dedicatedServerFtpBackupAccessAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
