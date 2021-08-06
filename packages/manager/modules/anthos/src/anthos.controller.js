export default class AnthosTenantsCtrl {
  /* @ngInject */
  constructor(AnthosTenantsService) {
    this.AnthosTenantsService = AnthosTenantsService;
    this.versionPrefix = 'APM';
  }

  $onInit() {
    this.guides = this.AnthosTenantsService.getGuides(this.user.ovhSubsidiary);
  }
}
