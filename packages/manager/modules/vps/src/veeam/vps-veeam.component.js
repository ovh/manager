import controller from './vps-veeam.controller';
import template from './vps-veeam.html';

export default {
  controller,
  bindings: {
    automatedBackupOption: '<',
    goToVeeamMount: '<',
    goToVeeamRestore: '<',
    goToVeeamScheduleBackup: '<',
    goToVpsUpgrade: '<',
    hasAutomatedBackupOption: '<',
    isAutomatedBackupAvailable: '<',
    tabSummary: '<',
    vpsDetails: '<vps',
  },
  name: 'vpsVeeam',
  template,
};
