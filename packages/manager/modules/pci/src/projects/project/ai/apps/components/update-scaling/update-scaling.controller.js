import get from 'lodash/get';

import {
  AUTOMATIC_SCALING_RESOURCE_TYPES,
  APP_SCALING_SETTINGS,
} from '../../add/add.constants';

import { APP_SCALING_INFO } from '../../app.constants';

export default class UpdateScalingCtrl {
  /* @ngInject */
  constructor(coreConfig, $translate, AppService) {
    this.$translate = $translate;
    this.AppService = AppService;
    this.user = coreConfig.getUser();
  }

  $onInit() {
    this.isUpdating = false;

    // bind settings
    this.AUTOMATIC_SCALING_RESOURCE_TYPES = Object.values(
      AUTOMATIC_SCALING_RESOURCE_TYPES,
    );
    this.APP_SCALING_SETTINGS = APP_SCALING_SETTINGS;

    // create model
    const { scalingStrategy } = this.app.spec;
    this.autoscaling = !!scalingStrategy.automatic;
    this.fixedStrategyModel = {
      replicas:
        scalingStrategy?.fixed?.replicas ||
        APP_SCALING_SETTINGS.FIXED.DEFAULT_REPLICAS,
    };
    this.automaticStrategyModel = {
      averageUsageTarget:
        scalingStrategy?.automatic?.averageUsageTarget ||
        APP_SCALING_SETTINGS.AUTOMATIC.DEFAULT_THRESHOLD,
      replicasMax:
        scalingStrategy?.automatic?.replicasMax ||
        APP_SCALING_SETTINGS.AUTOMATIC.DEFAULT_MAX_REPLICAS,
      replicasMin:
        scalingStrategy?.automatic?.replicasMin ||
        APP_SCALING_SETTINGS.AUTOMATIC.DEFAULT_MIN_REPLICAS,
      resourceType:
        scalingStrategy?.automatic?.averageUsageTarget ||
        APP_SCALING_SETTINGS.AUTOMATIC.DEFAULT_RESOURCE,
    };

    // compute prices
    const resourcePrice = this.AppService.getPrice(
      this.prices,
      this.app.spec.resources.flavor,
    );
    this.resourcePriceTax = resourcePrice.tax * 60;
    this.resourcePriceInUcents = resourcePrice.priceInUcents * 60;

    this.nbResources =
      this.app.spec.resources.cpu + this.app.spec.resources.gpu;
  }

  get price() {
    const replicas = this.autoscaling
      ? this.automaticStrategyModel.replicasMin
      : this.fixedStrategyModel.replicas;
    return this.resourcePriceInUcents * this.nbResources * replicas;
  }

  get tax() {
    const replicas = this.autoscaling
      ? this.automaticStrategyModel.replicasMin
      : this.fixedStrategyModel.replicas;
    return this.resourcePriceTax * this.nbResources * replicas;
  }

  getScalingInfoLink() {
    return (
      APP_SCALING_INFO[this.user.ovhSubsidiary] || APP_SCALING_INFO.DEFAULT
    );
  }

  getStrategyModel() {
    const model = {};
    if (this.autoscaling) {
      model.automatic = this.automaticStrategyModel;
    } else {
      model.fixed = this.fixedStrategyModel;
    }
    return model;
  }

  updateAppScaling() {
    this.trackApps(`${this.trackingPrefix}::update_app_scaling_confirm`);
    this.isUpdating = true;
    const strategyModel = this.getStrategyModel();
    return this.AppService.updateScalingStrategy(
      this.projectId,
      this.app.id,
      strategyModel,
    )
      .then(() =>
        this.goBack(
          this.$translate.instant('pci_app_update_app_scaling_success'),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('pci_app_update_app_scaling_error', {
            appName: this.app.name,
            message: get(error, 'data.message'),
          }),
          'error',
        ),
      );
  }

  cancel() {
    this.trackApps(`${this.trackingPrefix}::update_app_scaling_cancel`);
    this.goBack();
  }
}
