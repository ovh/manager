import find from 'lodash/find';

export default class CucUrlHelper {
  static findUrl(item, type) {
    const urlObj = find(item.urls, (url) => url.type === type);
    return urlObj && urlObj.address ? urlObj.address : '';
  }
}
