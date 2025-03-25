import { OVHCLOUD_TAGS, OVHCLOUD_TAG_TYPES } from './constants';

export default class ovhManagerResourceTaggingService {
  /* @ngInject */
  constructor(Apiv2Service, $q) {
    this.Apiv2Service = Apiv2Service;
    this.$q = $q;
  }

  /**
   * get tag list with format {key:value, key2:value2} as param
   * Transform it to [{key: key, value: value, displayName: key:value, type: custom|ovhcloud},...]
   * @param {*} tags
   * @returns Array of formatted tag list
   */
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

  /**
   * Check if given key and value are inside hard coded default ovhcloud tags
   * @param {*} key
   * @param {*} value
   * @returns true if its a default ovhcloud tag
   */
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

  /**
   * Get all unique tags formatted like this [{key: 'key', values: ['value1', 'value2', ..]}]
   * 1 - Get all user iam resources
   * 2 - Keep only resources with iam tags defined
   * 3 - Create user tags Array :
   * Tags array is implemented with default hard coded tags. (cannot be empty)
   * Then for each user resource, check if key already exist on tags array.
   *    If not, create a new tag object and push it to the tags array
   *    If key already exist, concat the new value in the array of values linked to this key.
   *    Flatten the values to keep only unique values using a Set
   * @returns Array of tags
   */
  getAllUserTags() {
    return this.getAllUserResources().then((allResources) => {
      const resourcesWithTags = allResources.filter(
        (resource) => !!resource.tags,
      );
      const allTags = OVHCLOUD_TAGS;
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

  /**
   * Get user iam resources. loop until response don't have next cursor
   * @returns all user iam resources
   */
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

  /**
   * To use with getAllUserResources.
   * Loop in case of next cursor, and concat response
   * @param {*} deferred
   * @param {*} allResources
   * @param {*} data
   * @param {*} headers
   * @returns void
   */
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
