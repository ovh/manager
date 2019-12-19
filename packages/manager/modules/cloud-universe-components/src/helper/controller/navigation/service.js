import forEach from 'lodash/forEach';
import keys from 'lodash/keys';

export default class CucControllerNavigationHelper {
  /* @ngInject */
  constructor(
    OvhApiMe,
    CucConfig,
  ) {
    this.OvhApiMe = OvhApiMe;
    this.CucConfig = CucConfig;
  }

  static getUrl(url, params) {
    if (!url) {
      return null;
    }
    let filledUrl = url;
    forEach(keys(params), (key) => {
      filledUrl = filledUrl.replace(`{${key}}`, params[key]);
    });
    return filledUrl;
  }

  getConstant(path) {
    const fallback = this.CucConfig.getRegion() === 'US' ? 'US' : 'GB';

    return this.OvhApiMe.v6().get().$promise
      .then((me) => path[me.ovhSubsidiary] || path[fallback] || path.FR);
  }
}
