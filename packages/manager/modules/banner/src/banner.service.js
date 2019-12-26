export default class BannerService {
  /* @ngInject */
  constructor(OvhApiBanner) {
    this.OvhApiBanner = OvhApiBanner;
  }

  getBanner(locale) {
    return this.OvhApiBanner.Aapi().query({
      locale,
    }).$promise;
  }
}
