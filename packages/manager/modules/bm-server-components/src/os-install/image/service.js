export default class BmServerComponentsOsInstallImageService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  startInstall(serviceName, data) {
    return this.$http.post(
      `/dedicated/server/${serviceName}/bringYourOwnImage`,
      data,
    );
  }
}
