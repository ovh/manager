export default class PciProjectNewCtrl {
  /* @ngInject */
  constructor(getCurrentStep, getStateLink, newProjectModel) {
    // dependencies injections
    this.getCurrentStep = getCurrentStep;
    this.getStateLink = getStateLink;
    this.newProjectModel = newProjectModel;

    // other attributes used in view
    this.steps = null;
  }

  $onInit() {
    // define steps
    this.steps = ['description', 'payment'];
  }
}
