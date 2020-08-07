import get from 'lodash/get';

export default class {
  /* @ngInject */
  constructor($translate, Alerter, CucCloudMessage, DedicatedServerInterfacesService) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.CucCloudMessage = CucCloudMessage;
    this.InterfaceService = DedicatedServerInterfacesService;
  }

  $onInit() {
    console.log('init');
    this.loadMessages();
    this.loading = true;
    this.taskPolling.promise
      .catch((error) =>
        this.Alerter.error(
          this.$translate.instant('dedicated_server_interfaces_task_error', {
            errorMessage: get(error, 'comment'),
          }),
        ),
      )
      .finally(() => {
        this.loading = false;
      });
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(
      'app.dedicated.server.interfaces',
    );
    this.messageHandler = this.CucCloudMessage.subscribe(
      'app.dedicated.server.interfaces',
      { onMessage: () => this.refreshMessages() },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }
}
