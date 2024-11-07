import { OVHCLOUD_TAG_TYPES } from './constants';

export default class BmServerComponentsTagsController {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.loading = false;
    this.tags = Object.entries(this.server.iam?.tags)
      .filter(([key]) => !key.startsWith('ovh:')) // ignore this tag which is a identifier for cluster node servers
      .map(([key, value]) => {
        return {
          tag: { key, value },
          tagType: OVHCLOUD_TAG_TYPES.CUSTOM, // @Todo tagType should be based on api response
        };
      });
  }
}
