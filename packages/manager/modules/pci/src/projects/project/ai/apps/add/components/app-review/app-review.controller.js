import { IS_BETA } from '../../../app.constants';
import { APP_PARTNER_PRESET_LICENCING } from '../../add.constants';

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
    this.getPrices();
    this.appSpecs = this.convertModelToSpecs(this.appModel);
  }

  getPrices() {
    // Find multiplier
    const { nbResources } = this.appModel.resource;
    const replicas = this.appModel.scalingStrategy.autoscaling
      ? this.appModel.scalingStrategy.automatic.replicasMin
      : this.appModel.scalingStrategy.fixed.replicas;
    const multiplier = nbResources * replicas * 60;

    // Compute resouces price
    const resourcePrice = this.AppService.getPrice(
      this.prices,
      this.appModel.resource.flavor.id,
    );
    this.resourcePriceTax = resourcePrice.tax * multiplier;
    this.resourcePriceInUcents = resourcePrice.priceInUcents * multiplier;

    // Compute partner price
    if (!this.appModel.image.isCustom) {
      const { preset } = this.appModel.image;
      let multiplierPartner = 1;
      switch (preset.licensing) {
        case APP_PARTNER_PRESET_LICENCING.PER_APP:
          multiplierPartner *= 60;
          break;
        case APP_PARTNER_PRESET_LICENCING.PER_RESOURCE:
          multiplierPartner *= 60 * nbResources * replicas;
          break;
        case APP_PARTNER_PRESET_LICENCING.PER_REPLICA:
          multiplierPartner *= 60 * replicas;
          break;
        case APP_PARTNER_PRESET_LICENCING.FREE:
          multiplierPartner *= 0;
          break;
        default:
          break;
      }
      const partnerPrice = this.AppService.getPartnerPrice(
        this.prices,
        preset.partnerId,
        preset.id,
        this.appModel.resource.flavorType,
      );
      this.partnerPriceTax = partnerPrice.tax * multiplierPartner;
      this.partnerPriceInUcents =
        partnerPrice.priceInUcents * multiplierPartner;
    } else {
      this.partnerPriceTax = 0;
      this.partnerPriceInUcents = 0;
    }
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

  getImageInfo() {
    const { image } = this.appModel;
    return image.isCustom
      ? image.customImageName
      : `${image.preset.partnerId}/${image.preset.id}:${image.preset.selectedVersion}`;
  }
}
