import { APP_MULTIPLY_SIGN, APP_VOLUME_TYPE } from '../../app.constants';

export default class {
  /* @ngInject */
  constructor(
    $filter,
    $translate,
    coreURLBuilder,
    CucCloudMessage,
    AppService,
  ) {
    this.$filter = $filter;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.AppService = AppService;

    this.APP_VOLUME_TYPE = APP_VOLUME_TYPE;
    this.APP_MULTIPLY_SIGN = APP_MULTIPLY_SIGN;
    this.billingUrl = coreURLBuilder.buildURL('dedicated', '#/billing/history');
  }

  $onInit() {
    this.messageContainer =
      'pci.projects.project.ai.apps.dashboard.general-information';
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe(this.messageContainer);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainer,
      {
        onMessage: () => this.refreshMessages(),
      },
    );
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getCpuRamInfo() {
    return `${this.$filter('cucBytes')(
      this.flavor.resourcesPerUnit.memory,
      0,
      false,
      'B',
    )} RAM (CPU)`;
  }

  getGpuRamInfo() {
    return this.flavor.gpuInformation
      ? `${this.app.gpu} ${this.APP_MULTIPLY_SIGN} ${this.$filter('cucBytes')(
          this.flavor.gpuInformation.gpuMemory,
          0,
          false,
          'B',
        )} RAM (GPU)`
      : null;
  }

  onGraphDashboardClick() {
    this.trackApps('dashboard::access_graph_dashboard');
  }

  onDeleteAppClick() {
    this.trackApps('dashboard::delete_app');
    return this.goToDeleteApp();
  }

  onGenerateTokenClick() {
    this.trackApps('dashboard::generate_token');
    return this.goToGenerateToken();
  }
}
