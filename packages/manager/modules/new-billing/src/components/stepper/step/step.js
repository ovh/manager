export default class {
  /* @ngInject */
  constructor(name, state, header) {
    this.name = name;
    this.state = state;
    this.header = header;

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
