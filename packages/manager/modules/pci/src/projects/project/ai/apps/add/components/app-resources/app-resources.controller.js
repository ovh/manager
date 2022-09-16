import { map, uniq } from 'lodash';

import {
  AUTOMATIC_SCALING_RESOURCE_TYPES,
  APP_SCALING_SETTINGS,
} from '../../add.constants';

import { APP_SCALING_INFO } from '../../../app.constants';

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
  }

  filterType() {
    return (item) => {
      if (this.appModel.preset?.flavorTypes) {
        return this.appModel.preset.flavorTypes.includes(item);
      }
      return true;
    };
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
    this.resourcePriceTax = resourcePrice.tax * 60;
    this.resourcePriceInUcents = resourcePrice.priceInUcents * 60;

    if (this.appModel.preset?.partner) {
      const partnerPrice = this.AppService.getPartnerPrice(
        this.prices,
        this.appModel.preset.partner.id,
        this.appModel.preset.partner.flavor,
        this.appModel.resource.flavorType,
      );
      this.partnerPriceTax = partnerPrice.tax * 60;
      this.partnerPriceInUcents = partnerPrice.priceInUcents * 60;
    } else {
      this.partnerPriceTax = 0;
      this.partnerPriceInUcents = 0;
    }
  }

  onUsecaseChange(flavorType) {
    this.appModel.resource.flavor = null;
    this.appModel.resource.flavorType = flavorType;
    this.selectDefaultFlavor(flavorType);
  }

  getScalingInfoLink() {
    return (
      APP_SCALING_INFO[this.user.ovhSubsidiary] || APP_SCALING_INFO.DEFAULT
    );
  }

  get price() {
    const replicas = this.appModel.scalingStrategy.autoscaling
      ? this.appModel.scalingStrategy.automatic.replicasMin
      : this.appModel.scalingStrategy.fixed.replicas;
    return (
      (this.resourcePriceInUcents + this.partnerPriceInUcents) *
      this.appModel.resource.nbResources *
      replicas
    );
  }

  get tax() {
    const replicas = this.appModel.scalingStrategy.autoscaling
      ? this.appModel.scalingStrategy.automatic.replicasMin
      : this.appModel.scalingStrategy.fixed.replicas;
    return (
      (this.resourcePriceTax + this.partnerPriceTax) *
      this.appModel.resource.nbResources *
      replicas
    );
  }
}
