import { OVHCLOUD_TAG_TYPES } from './constants';

export default class ovhManagerResourceTaggingService {
  static getFormattedTags(tags) {
    if (!tags) return [];
    return Object.keys(tags).map((key) => ({
      key,
      value: tags[key],
      displayName: `${key}:${tags[key]}`,
      type: OVHCLOUD_TAG_TYPES.CUSTOM,
    }));
  }
}
