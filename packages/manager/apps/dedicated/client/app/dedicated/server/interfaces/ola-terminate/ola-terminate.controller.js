export default class {
  /* @ngInject */
  constructor(DedicatedServerInterfacesService) {
    this.InterfaceService = DedicatedServerInterfacesService;
  }

  terminate() {
    this.loading = true;
    this.atTrack('terminate_ola');
    return this.InterfaceService.terminateOla(this.serverName)
      .then(() => {
        this.goBack();
      })
      .catch((error) => {
        this.goBack().then(() =>
          this.alertError('server_error_ola_terminate', error.data),
        );
      });
  }
}
