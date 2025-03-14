export default class ovhManagerResourceTaggingService {
  static getFormattedTags(tags) {
    return Object.keys(tags).map((key) => ({
      key,
      value: tags[key],
      displayName: `${key}:${tags[key]}`,
    }));
  }
}
