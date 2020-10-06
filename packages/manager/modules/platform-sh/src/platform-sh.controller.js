export default class PlatformShCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, PlatformSh) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.PlatformSh = PlatformSh;
  }

  $onInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('platform-sh');
    this.messageHandler = this.CucCloudMessage.subscribe('platform-sh', {
      onMessage: () => this.refreshMessages(),
    });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  getProjectDetails(projectId) {
    const details = this.PlatformSh.getProjectDetails(projectId);
    return details;
  }

  // getDetailsState(projectId) {
  //   return `platform-sh.details({ projectId: '${projectId}' })`;
  // }
}
