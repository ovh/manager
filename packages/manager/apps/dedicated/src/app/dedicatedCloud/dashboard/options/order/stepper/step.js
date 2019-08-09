export default class {
  /* @ngInject */
  constructor(componentName, headerDisplayValue, name, state = {}) {
    this.componentName = componentName;
    this.headerDisplayValue = headerDisplayValue;
    this.name = name;
    this.state = state;

    this.setAsToBeDone();
  }

  setAsActive() {
    this.isActive = true;
    this.isComplete = false;
  }

  setAsCompleted() {
    this.isActive = false;
    this.isComplete = true;
  }

  setAsToBeDone() {
    this.isActive = false;
    this.isComplete = false;
  }
}
