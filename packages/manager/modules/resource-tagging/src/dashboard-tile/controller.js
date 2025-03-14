import OvhManagerResourceTaggingService from '../service';

export default class ovhManagerResourceTaggingDashboardTileController {
  /* @ngInject */
  constructor() {
    this.loading = true;
  }

  $onInit() {
    this.formattedTags = OvhManagerResourceTaggingService.getFormattedTags(
      this.tags,
    );
    this.loading = false;
  }
}
