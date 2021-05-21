import { NOTEBOOK_RESOURCES } from '../../notebook.constants';

export default class NotebookResourcesController {
  static getPriceIndex(flavorId) {
    return `ai-notebook.${flavorId}.minute.consumption`;
  }

  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;

    this.NOTEBOOK_RESOURCES = NOTEBOOK_RESOURCES;
  }

  $onInit() {
    this.PriceFormatter = new Intl.NumberFormat(
      this.coreConfig.getUserLocale().replace('_', '-'),
      {
        style: 'currency',
        currency: this.coreConfig.getUser().currency.code,
        maximumFractionDigits: 5, // default is 2. But this rounds off the price
      },
    );

    this.selectDefaultFlavor(this.notebookModel.selected.resource.flavorType);
    this.RESOURCES_SCALE_MIN_FLAVOR = 1;
  }

  selectDefaultFlavor(flavorType) {
    this.notebookModel.selected.resource.flavor = this.flavors.find(
      (flavor) => flavor.type === flavorType && flavor.default,
    );

    this.notebookModel.nbResources = 1;
  }

  getPriceForHour(flavorId) {
    if (flavorId) {
      const priceIndex = NotebookResourcesController.getPriceIndex(flavorId);
      return this.prices[priceIndex].price.value * 60;
    }

    return null;
  }

  formatPriceForHour(flavorId) {
    return this.PriceFormatter.format(this.getPriceForHour(flavorId));
  }

  computeTotalPrice(flavorId) {
    const { nbResources } = this.notebookModel;
    return flavorId
      ? this.PriceFormatter.format(this.getPriceForHour(flavorId) * nbResources)
      : '';
  }

  onUsecaseChange(flavorType) {
    this.notebookModel.selected.resource.flavor = null;
    this.notebookModel.selected.resource.flavorType = flavorType;
    this.selectDefaultFlavor(flavorType);
  }
}
