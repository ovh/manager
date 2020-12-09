import filter from 'lodash/filter';
import includes from 'lodash/includes';

export default class VpsReinstallService {
  /* @ngInject */
  constructor($http, $q, $translate, CucCloudMessage, OvhApiMe) {
    this.$http = $http;
    this.$q = $q;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiMe = OvhApiMe;
  }

  getSshKeys() {
    return this.OvhApiMe.SshKey().v6().query().$promise;
  }

  getPackages(image) {
    return this.$http
      .get(`/distribution/image/vps/${image}`)
      .then((response) => response.data.packages)
      .catch((err) => this.$q.reject(err));
  }

  static filterKernel(packages) {
    return filter(
      packages,
      (pkg) => !includes((pkg.name + pkg.alias).toLowerCase(), 'kernel'),
    );
  }

  getPackagesFiltered(image) {
    this.$http
      .get(`/distribution/image/vps/${image}`)
      .then((response) => {
        const { packages } = response.data;
        filter(packages, (pkg) => {
          if (!includes((pkg.name + pkg.alias).toLowerCase(), 'kernel')) {
            packages.push(pkg);
          }
        });
        return packages;
      })
      .catch((err) => this.$q.reject(err));
  }
}
