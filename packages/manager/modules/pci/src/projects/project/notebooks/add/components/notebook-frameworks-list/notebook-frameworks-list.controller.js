import { NOTEBOOK_FRAMEWORK_INFO } from '../../../notebook.constants';

export default class NotebookFrameworksListController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  getFrameworkInfoLink() {
    return (
      NOTEBOOK_FRAMEWORK_INFO[this.coreConfig.getUser().ovhSubsidiary] ||
      NOTEBOOK_FRAMEWORK_INFO.DEFAULT
    );
  }

  onFrameworkChange(frameworkModel, version) {
    const { framework } = this.notebookModel.selected;
    framework.model = frameworkModel;
    framework.version = version;
  }
}
