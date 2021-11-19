export default class AppReviewController {
  /* @ngInject */
  constructor(coreConfig, ovhManagerRegionService, AppService, $translate) {
    this.user = coreConfig.getUser();
    this.AppService = AppService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.$translate = $translate;
  }

  $onInit() {
    const { nbResources } = this.appModel.resource;
    const { replicas } = this.appModel;

    const multiplier = nbResources * replicas * 60;

    const resourcePrice = this.AppService.getPrice(
      this.prices,
      this.appModel.resource.flavor.id,
    );
    this.resourcePriceTax = resourcePrice.tax * multiplier;
    this.resourcePriceInUcents = resourcePrice.priceInUcents * multiplier;

    if (this.appModel.preset.partner) {
      const partnerPrice = this.AppService.getPartnerPrice(
        this.prices,
        this.appModel.preset.partner.id,
        this.appModel.preset.partner.flavor,
        this.appModel.resource.flavorType,
      );
      this.partnerPriceTax = partnerPrice.tax * multiplier;
      this.partnerPriceInUcents = partnerPrice.priceInUcents * multiplier;
    } else {
      this.partnerPriceTax = 0;
      this.partnerPriceInUcents = 0;
    }
  }

  getLicencePartner() {
    return this.$translate.instant('pci_app_add_review_price_partner', {
      partner: this.appModel.preset.partner.name,
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
