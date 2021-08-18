import { NOTEBOOK_AUTOMATION_INFO } from '../../../notebook.constants';

export default class NotebookReviewController {
  /* @ngInject */
  constructor(coreConfig, ovhManagerRegionService) {
    this.coreConfig = coreConfig;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.PriceFormatter = new Intl.NumberFormat(
      this.coreConfig.getUserLocale().replace('_', '-'),
      {
        style: 'currency',
        currency: this.coreConfig.getUser().currency.code,
        maximumFractionDigits: 2,
      },
    );
  }

  $onInit() {
    this.notebookObject = this.convertNotebookModel(this.notebookModel);
  }

  static getPriceIndex(flavorId) {
    return `ai-notebook.${flavorId}.minute.consumption`;
  }

  getPriceForHour(flavorId) {
    if (flavorId) {
      const priceIndex = NotebookReviewController.getPriceIndex(flavorId);
      return this.prices[priceIndex].price.value * 60;
    }

    return null;
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
    const regionInfo = this.ovhManagerRegionService.getRegion(region.name);

    return `${regionInfo.country} - ${regionInfo.macroRegion.text} (${region.name})`;
  }

  getPriceInfo(flavorId) {
    const { nbResources } = this.notebookModel;
    return flavorId
      ? this.PriceFormatter.format(this.getPriceForHour(flavorId) * nbResources)
      : '';
  }

  getResourceInfo() {
    const { selected, nbResources } = this.notebookModel;
    return `${selected.resource.flavor.id} - x${nbResources}`;
  }

  getAutomationInfoLink() {
    return (
      NOTEBOOK_AUTOMATION_INFO[this.coreConfig.getUser().ovhSubsidiary] ||
      NOTEBOOK_AUTOMATION_INFO.DEFAULT
    );
  }
}
