import { map, uniq } from 'lodash';

import {
  AUTOMATIC_SCALING_RESOURCE_TYPES,
  APP_SCALING_SETTINGS,
  NUMBER_OF_MINUTES_IN_ONE_HOUR,
} from '../../add.constants';

import { APP_SCALING_INFO, IS_BETA } from '../../../app.constants';

const RESOURCES_SCALE_MIN_FLAVOR = 1;

export default class AppResourcesController {
  /* @ngInject */
  constructor(coreConfig, AppService) {
    this.AppService = AppService;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.selectDefaultFlavor(this.appModel.resource.flavorType);
    this.flavorTypes = uniq(map(this.flavors, 'type'));
    this.RESOURCES_SCALE_MIN_FLAVOR = RESOURCES_SCALE_MIN_FLAVOR;
    this.AUTOMATIC_SCALING_RESOURCE_TYPES = Object.values(
      AUTOMATIC_SCALING_RESOURCE_TYPES,
    );
    this.APP_SCALING_SETTINGS = APP_SCALING_SETTINGS;
    this.IS_BETA = IS_BETA;
  }

  selectDefaultFlavor(flavorType) {
    this.appModel.resource.flavor = this.flavors.find(
      (flavor) => flavor.type === flavorType && flavor.default,
    );

    this.appModel.resource.nbResources = 1;

    const resourcePrice = this.AppService.getPrice(
      this.prices,
      this.appModel.resource.flavor.id,
    );
    this.resourcePriceTax = resourcePrice.tax * NUMBER_OF_MINUTES_IN_ONE_HOUR;
    this.resourcePriceInUcents =
      resourcePrice.priceInUcents * NUMBER_OF_MINUTES_IN_ONE_HOUR;
  }

  onUsecaseChange(flavorType) {
    this.appModel.resource.flavor = null;
    this.appModel.resource.flavorType = flavorType;
    this.selectDefaultFlavor(flavorType);
  }

  onFlavorChange(flavor) {
    if (
      !this.appModel.resource.nbResources ||
      this.appModel.resource.nbResources > flavor.max
    ) {
      this.appModel.resource.nbResources = flavor.max;
    }
  }

  getScalingInfoLink() {
    return (
      APP_SCALING_INFO[this.user.ovhSubsidiary] || APP_SCALING_INFO.DEFAULT
    );
  }

  getFlavorPrice(flavor) {
    return this.AppService.getPrice(this.prices, flavor.id);
  }

  computeTotalPrice(resourcePrice) {
    const replicas = this.appModel.scalingStrategy.autoscaling
      ? this.appModel.scalingStrategy.automatic.replicasMin
      : this.appModel.scalingStrategy.fixed.replicas;
    return resourcePrice * this.appModel.resource.nbResources * replicas;
  }

  getResourcePriceWithResources(flavor) {
    return (
      this.getFlavorPrice(flavor).priceInUcents *
      this.appModel.resource.nbResources *
      NUMBER_OF_MINUTES_IN_ONE_HOUR
    );
  }

  getResourceTaxWithResources(flavor) {
    return (
      this.getFlavorPrice(flavor).tax *
      this.appModel.resource.nbResources *
      NUMBER_OF_MINUTES_IN_ONE_HOUR
    );
  }

  get price() {
    return this.computeTotalPrice(
      this.getFlavorPrice(this.appModel.resource.flavor).priceInUcents *
        NUMBER_OF_MINUTES_IN_ONE_HOUR,
    );
  }

  get tax() {
    return this.computeTotalPrice(
      this.getFlavorPrice(this.appModel.resource.flavor).tax *
        NUMBER_OF_MINUTES_IN_ONE_HOUR,
    );
  }
}
