import { OVHCLOUD_TAGS, OVHCLOUD_TAG_TYPES } from './constants';

export default class ovhManagerResourceTaggingService {
  /* @ngInject */
  constructor(Apiv2Service, $q) {
    this.Apiv2Service = Apiv2Service;
    this.$q = $q;
  }

  static getFormattedTags(tags) {
    if (!tags) return [];
    return Object.keys(tags)
      .filter((key) => key !== 'ovh')
      .map((key) => ({
        key,
        value: tags[key],
        displayName: `${key}:${tags[key]}`,
        type: ovhManagerResourceTaggingService.isDefaultTag(key, tags[key])
          ? OVHCLOUD_TAG_TYPES.OVHCLOUD
          : OVHCLOUD_TAG_TYPES.CUSTOM,
      }));
  }

  static isDefaultTag(key, value) {
    const defaultKey = OVHCLOUD_TAGS.find((tag) => tag.key === key);
    if (!defaultKey) return false;
    return !!defaultKey.values.find((val) => val === value);
  }

  assignTag(resourceUrn, key, value) {
    return this.Apiv2Service.httpApiv2({
      method: 'post',
      url: `/engine/api/v2/iam/resource/${resourceUrn}/tag`,
      data: {
        key,
        value,
      },
    });
  }

  getAllUserTags() {
    return this.getAllUserResources().then((allResources) => {
      const resourcesWithTags = allResources.filter(
        (resource) => !!resource.tags,
      );
      const allTags = [];
      resourcesWithTags.forEach((resource) => {
        Object.keys(resource.tags).forEach((key) => {
          if (key.startsWith('ovh:')) return;
          const alreadyExistingKeyIndex = allTags.findIndex(
            (tag) => tag.key === key,
          );
          if (alreadyExistingKeyIndex !== -1) {
            allTags[alreadyExistingKeyIndex].values = [
              ...new Set([
                ...allTags[alreadyExistingKeyIndex].values,
                resource.tags[key],
              ]),
            ];
          } else {
            allTags.push({
              key,
              values: [resource.tags[key]],
            });
          }
        });
      });
      return allTags;
    });
  }

  getAllUserResources() {
    const deferred = this.$q.defer();
    const allResources = [];
    this.Apiv2Service.httpApiv2({
      method: 'get',
      url: `/engine/api/v2/iam/resource`,
      headers: {
        'x-pagination-size': 5000,
      },
    }).then(({ data, headers }) => {
      this.getNextUserResources(deferred, allResources, data, headers);
    });
    return deferred.promise;
  }

  getNextUserResources(deferred, allResources, data, headers) {
    const newAllResources = [...allResources, ...data];

    const cursor = headers('x-pagination-cursor-next');
    if (!cursor) {
      deferred.resolve(newAllResources);
      return;
    }

    this.Apiv2Service.httpApiv2({
      method: 'get',
      url: `/engine/api/v2/iam/resource`,
      headers: {
        'X-Pagination-Cursor': cursor,
        'x-pagination-size': 5000,
      },
    }).then(({ data: nextData, headers: nextHeaders }) => {
      this.getNextUserResources(
        deferred,
        newAllResources,
        nextData,
        nextHeaders,
      );
    });
  }
}
