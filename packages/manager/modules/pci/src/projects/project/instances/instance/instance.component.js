import controller from './instance.controller';
import template from './instance.html';

export default {
  template,
  controller,
  bindings: {
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
    reinstallInstance: '<',
    resumeInstance: '<',
    deleteInstance: '<',
    goToBlockStorages: '<',
    attachVolume: '<',

    gotToNetworks: '<',
    attachPrivateNetwork: '<',
  },
};
