import component from './dedicated-server-ftp-backup-order.component';

const moduleName = 'ovhManagerDedicatedServerFtpBackupOrder';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('dedicatedServerFtpBackupOrder', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
