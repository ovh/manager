export default class NotebookFrameworksListController {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  onFrameworkChange(frameworkModel, version) {
    const { framework } = this.notebookModel.selected;
    framework.model = frameworkModel;
    framework.version = version;
  }
}
