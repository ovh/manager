export default class {
  /* @ngInject */
  constructor() {
    this.project = {};
  }

  getProjectInfo() {
    return this.project;
  }

  setProjectInfo(project = {}) {
    this.project = project;
  }
}
