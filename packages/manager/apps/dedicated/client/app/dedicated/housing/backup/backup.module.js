import angular from 'angular';
import '@uirouter/angularjs';

import controller from './dedicated-housing-backup.controller';
import routing from './backup.routes';

const moduleName = 'ovhManagerDedicatedHousingDashboardBackup';

angular
  .module(moduleName, ['oui', 'ui.router'])
  .config(routing)
  .controller('HousingFtpBackupCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
