import ovhManagerResourceTaggingService from '../service';

export default class ovhManagerResourceTaggingListModalController {
  $onInit() {
    this.init();
  }

  onReset() {
    this.init();
  }

  init() {
    this.search = '';
    this.filteredTags = ovhManagerResourceTaggingService.getFormattedTags(
      this.tags,
    );
  }

  onSearch(value) {
    this.filteredTags = this.filteredTags.filter(
      (tag) => tag.displayName.indexOf(value) !== -1,
    );
  }
}
