import { OVHCLOUD_TAGS, OVHCLOUD_TAG_TYPES } from './constants';

export default class ovhManagerResourceTaggingService {
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
}
