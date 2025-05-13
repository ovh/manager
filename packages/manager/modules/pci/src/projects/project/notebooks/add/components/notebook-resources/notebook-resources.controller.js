import { NOTEBOOK_RESOURCES } from '../../notebook.constants';
import {
  NOTEBOOK_MULTIPLY_SIGN,
  NOTEBOOK_MINUTES_IN_HOUR,
} from '../../../notebook.constants';

const RESOURCES_SCALE_MIN_FLAVOR = 1;

export default class NotebookResourcesController {
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
        maximumFractionDigits: 2,
      },
    );

    this.selectDefaultFlavor(this.notebookModel.selected.resource.flavorType);
    this.RESOURCES_SCALE_MIN_FLAVOR = RESOURCES_SCALE_MIN_FLAVOR;
  }

  static getPriceIndex(flavorId) {
    return `ai-notebook.${flavorId}.minute.consumption`;
  }

  selectDefaultFlavor(flavorType) {
    this.notebookModel.selected.resource.flavor = this.flavors.find(
      (flavor) => flavor.type === flavorType && flavor.default,
    );

    this.notebookModel.nbResources = 1;
  }

  getGPUDescription(flavor) {
    return `${this.notebookModel.nbResources} ${NOTEBOOK_MULTIPLY_SIGN} ${flavor.description}`;
  }

  getPriceForHour(flavorId) {
    if (flavorId) {
      const priceIndex = NotebookResourcesController.getPriceIndex(flavorId);
      return (
        this.notebookModel.nbResources *
        this.prices[priceIndex].price.value *
        NOTEBOOK_MINUTES_IN_HOUR
      );
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

  onFlavorChange(flavor) {
    if (
      !this.notebookModel.nbResources ||
      this.notebookModel.nbResources > flavor.max
    ) {
      this.notebookModel.nbResources = flavor.max;
    }
  }

  getFlavorPriceWithResources(flavor) {
    const priceIndex = NotebookResourcesController.getPriceIndex(flavor.id);
    const flavorPricing = this.prices[priceIndex];
    return (
      this.notebookModel.nbResources *
      flavorPricing.priceInUcents *
      NOTEBOOK_MINUTES_IN_HOUR
    );
  }

  getFlavorPriceTaxWithResources(flavor) {
    const priceIndex = NotebookResourcesController.getPriceIndex(flavor.id);
    const flavorPricing = this.prices[priceIndex];
    return (
      this.notebookModel.nbResources *
      flavorPricing.tax *
      NOTEBOOK_MINUTES_IN_HOUR
    );
  }
}
