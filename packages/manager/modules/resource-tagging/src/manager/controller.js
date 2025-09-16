import ovhManagerResourceTaggingService from '../service';
import { TAGS_GUIDE_LINKS } from './constants';

export default class ovhManagerResourceTaggingTagManagerController {
  /* @ngInject */
  constructor($http, coreConfig) {
    this.$http = $http;
    this.tagsGuideLink =
      TAGS_GUIDE_LINKS[coreConfig.getUser().ovhSubsidiary] ||
      TAGS_GUIDE_LINKS.DEFAULT;
  }

  $onInit() {
    this.formattedTags = ovhManagerResourceTaggingService.getFormattedTags(
      this.tags,
    );
  }

  onRowSelect(rows) {
    this.selectedRows = rows;
  }
}
