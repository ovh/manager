import { IS_BETA } from '../../../app.constants';

export default class AppReviewController {
  /* @ngInject */
  constructor(coreConfig, ovhManagerRegionService, AppService, $translate) {
    this.user = coreConfig.getUser();
    this.AppService = AppService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.$translate = $translate;
  }

  $onInit() {
    this.IS_BETA = IS_BETA;
    const { nbResources } = this.appModel.resource;
    const replicas = this.appModel.scalingStrategy.autoscaling
      ? this.appModel.scalingStrategy.automatic.replicasMin
      : this.appModel.scalingStrategy.fixed.replicas;

    const multiplier = nbResources * replicas * 60;

    const resourcePrice = this.AppService.getPrice(
      this.prices,
      this.appModel.resource.flavor.id,
    );
    this.resourcePriceTax = resourcePrice.tax * multiplier;
    this.resourcePriceInUcents = resourcePrice.priceInUcents * multiplier;

    if (!this.appModel.image.isCustom) {
      const { preset } = this.appModel.image;
      const partnerPrice = this.AppService.getPartnerPrice(
        this.prices,
        preset.partnerId,
        preset.id,
        this.appModel.resource.flavorType,
      );
      let multiplierPartner = 60; // convert price from min to hour
      if (preset.licensing === 'per-resource') {
        multiplierPartner *= nbResources;
      }
      if (preset.licensing === 'per-replica') {
        multiplierPartner *= replicas;
      }
      this.partnerPriceTax = partnerPrice.tax * multiplierPartner;
      this.partnerPriceInUcents =
        partnerPrice.priceInUcents * multiplierPartner;
    } else {
      this.partnerPriceTax = 0;
      this.partnerPriceInUcents = 0;
    }

    this.appSpecs = this.convertModelToSpecs(this.appModel);
  }

  getLicencePartner() {
    return this.$translate.instant('pci_app_add_review_price_partner', {
      partner: this.appModel.image.preset.partnerName,
    });
  }

  getRegionInfo() {
    const { region } = this.appModel;
    const regionInfo = this.ovhManagerRegionService.getRegion(region.name);
    return `${regionInfo.country} - ${regionInfo.macroRegion.text} (${region.name})`;
  }

  getPriceInfo(flavorId) {
    const { resource } = this.appModel;
    return this.AppService.computeTotalPrice(
      this.prices,
      flavorId,
      resource.nbResources,
    );
  }

  getResourceInfo() {
    const { resource } = this.appModel;
    return `${resource.flavor.id} - x${resource.nbResources}`;
  }
}
