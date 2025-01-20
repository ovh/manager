import {
  CONTROLLER_NAME as DISPLAY_TAG_POPUP_CONTROLLER,
  TEMPLATE_CACHE_KEY as DISPLAY_TAG_POPUP_TEMPLATE,
} from '../../display-tags/display-tags.constants';

export default class ServersCtrl {
  /* @ngInject */
  constructor($uibModal) {
    this.$uibModal = $uibModal;
  }

  getTags(tags) {
    if (tags) {
      this.tags = Object.keys(tags)
        .filter((key) => !key.startsWith('ovh:'))
        .map((key) => `${key}:${tags[key]}`);
    }
    return this.tags;
  }

  goToTagsModal(iamDetails) {
    this.server_name = iamDetails.displayName;
    this.server_tags = this.getTags(iamDetails.tags);
    this.$uibModal.open({
      templateUrl: DISPLAY_TAG_POPUP_TEMPLATE,
      controller: DISPLAY_TAG_POPUP_CONTROLLER,
      controllerAs: '$ctrl',
      resolve: {
        hasDefaultMeansOfPayment: () => this.hasDefaultMeansOfPayment,
        itemName: () => this.servicePackToOrder?.displayName,
        itemRef: () => this.servicePackToOrder?.name,
        serverName: () => this.server_name,
        serverTags: () => this.server_tags,
      },
    });
  }
}
