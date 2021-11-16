import capitalize from 'lodash/capitalize';

export default class {
  /* @ngInject */
  constructor($translate, CucCloudMessage, ovhManagerRegionService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhManagerRegionService = ovhManagerRegionService;

    this.capitalize = capitalize;
  }

  $onInit() {
    this.loadMessages();
    this.trackApps('table', 'page');
    this.pollAppStatus();
  }

  $onDestroy() {
    this.stopPollingAppStatus();
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

  createApp() {
    this.trackApps('table::create_app');
    this.goToAddApp();
  }

  goToAppDetails(app) {
    this.trackApps('table::options_menu::details');
    this.goToApp(app);
  }

  deleteApp(app) {
    this.trackApps('table::options_menu::delete_app');
    this.goToDeleteApp(app);
  }

  onGuideLinkClick(guideName) {
    this.trackApps(`'table::guide::${guideName}`);
  }

  onAppStartClick(appId) {
    this.trackApps('table::options_menu::start_app');
    return this.startApp(appId);
  }

  onAppStopClick(appId) {
    this.trackApps('table::options_menu::pause_app');
    return this.stopApp(appId);
  }
}
