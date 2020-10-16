import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    $translate,
    Alerter,
    DedicatedServerInterfacesService,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.InterfaceService = DedicatedServerInterfacesService;
  }

  $onInit() {
    this.InterfaceService.waitTasks(this.serverName)
      .then(() => {
        this.goToInterfaces();
      })
      .catch((error) =>
        this.Alerter.error(
          this.$translate.instant('dedicated_server_interfaces_task_error', {
            errorMessage: get(error, 'comment'),
          }),
        ),
      );
  }
}
