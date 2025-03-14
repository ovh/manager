export default class ovhManagerResourceTaggingService {
  static getFormattedTags(tags) {
    if (!tags) return [];
    return Object.keys(tags).map((key) => ({
      key,
      value: tags[key],
      displayName: `${key}:${tags[key]}`,
    }));
  }
}
