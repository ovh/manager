import ovhManagerResourceTaggingService from '../service';

export default class ovhManagerResourceTaggingTagManagerController {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.formattedTags = ovhManagerResourceTaggingService.getFormattedTags(
      this.tags,
    );
  }
}
