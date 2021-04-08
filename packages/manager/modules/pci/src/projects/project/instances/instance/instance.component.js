import controller from './instance.controller';
import template from './instance.html';

export default {
  template,
  controller,
  bindings: {
    disablePrivateNetworks: '<',
    projectId: '<',
    instanceId: '<',
    instance: '<',
    instancePrice: '<',

    instanceLink: '<',
    consoleLink: '<',
    currentActiveLink: '<',

    editInstance: '<',
    enableMonthlyBillingInstance: '<',
    createBackupInstance: '<',
    startRescueInstance: '<',
    endRescueInstance: '<',
    softRebootInstance: '<',
    hardRebootInstance: '<',
    startInstance: '<',
    stopInstance: '<',
    reinstallInstance: '<',
    resumeInstance: '<',
    deleteInstance: '<',
    shelveInstance: '<',
    unshelveInstance: '<',
    goToBlockStorages: '<',
    applicationAccess: '<',
    attachVolume: '<',

    reverseDnsLink: '<',
    firewallLink: '<',
    ipMitigationLink: '<',
    gotToNetworks: '<',
    attachPrivateNetwork: '<',
    scheduleAutoBackup: '<',
    guideUrl: '<',
    vncDisabled: '<',
  },
};
