import { NOTEBOOK_AUTOMATION_INFO } from '../../../notebook.constants';

export default class NotebookReviewController {
  /* @ngInject */
  constructor(coreConfig, CucRegionService) {
    this.coreConfig = coreConfig;
    this.CucRegionService = CucRegionService;
  }

  $onInit() {
    this.notebookObject = this.convertNotebookModel(this.notebookModel);
  }

  getEditorInfo() {
    const { editor } = this.notebookModel.selected;
    return `${editor.name}`;
  }

  getFrameworkInfo() {
    const { framework } = this.notebookModel.selected;
    return `${framework.model.name} - ${framework.version.version}`;
  }

  getRegionInfo() {
    const { region } = this.notebookModel.selected;
    const regionInfo = this.CucRegionService.getRegion(region.name);

    return `${regionInfo.country} - ${regionInfo.macroRegion.text} (${region.name})`;
  }

  getResourceInfo() {
    const { resource } = this.notebookModel.selected;
    return `${resource.flavor.id} - x${resource.flavor.resourcesPerUnit.cpu}`;
  }

  getAutomationInfoLink() {
    return (
      NOTEBOOK_AUTOMATION_INFO[this.coreConfig.getUser().ovhSubsidiary] ||
      NOTEBOOK_AUTOMATION_INFO.DEFAULT
    );
  }
}
