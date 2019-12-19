{
  class DedicatedServerOVHTasks {
    constructor(
      $http,
      constants,
    ) {
      this.$http = $http;

      this.constants = constants;
    }

    fetchingTasks() {
      return this.$http
        .get(`${this.constants.aapiRootPath}working-status/dedicated_server`, {
          params: {
            affiliated: true,
            active: true,
          },
        })
        .then((resp) => resp.data);
    }
  }

  angular
    .module('App')
    .service('dedicatedServerOVHTasks', DedicatedServerOVHTasks);
}
