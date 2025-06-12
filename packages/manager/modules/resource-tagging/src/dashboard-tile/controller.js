import OvhManagerResourceTaggingService from '../service';
import { LABELS } from './constants';

export default class ovhManagerResourceTaggingDashboardTileController {
  /* @ngInject */
  constructor() {
    this.loading = true;
    this.LABELS = LABELS;
  }

  $onInit() {
    this.formattedTags = OvhManagerResourceTaggingService.getFormattedTags(
      this.tags,
    );
    this.loading = false;
  }
}
