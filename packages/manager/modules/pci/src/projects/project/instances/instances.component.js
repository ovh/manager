import controller from './instances.controller';
import template from './instances.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    addInstance: '<',
    viewInstance: '<',
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
    instanceLink: '<',
  },
};
