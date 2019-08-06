export default class {
  constructor(
    $translate,
    $window,
    coreConfig,
    OvhApiCloud,
    CucCloudMessage,
    PCI_REDIRECT_URLS,
  ) {
    this.$translate = $translate;
    this.$window = $window;
    this.coreConfig = coreConfig;
    this.OvhApiCloud = OvhApiCloud;
    this.CucCloudMessage = CucCloudMessage;
    this.PCI_REDIRECT_URLS = PCI_REDIRECT_URLS;
  }

  $onInit() {
    this.model = {
      owner: this.projectInfo.contactAdmin,
      billing: this.projectInfo.contactBilling,
      isAdmin: this.user.nichandle === this.projectInfo.contactAdmin,
    };
    this.loadMessages();
  }

  loadMessages() {
    this.CucCloudMessage.unSubscribe('pci.projects.project.contacts');
    this.messageHandler = this.CucCloudMessage.subscribe('pci.projects.project.contacts', { onMessage: () => this.refreshMessages() });
  }

  refreshMessages() {
    this.messages = this.messageHandler.getMessages();
  }

  canChangeContacts() {
    return this.PCI_REDIRECT_URLS[this.coreConfig.getRegion()].contacts;
  }

  openContacts() {
    if (this.canChangeContacts()) {
      let redirectUrl = this.PCI_REDIRECT_URLS[this.coreConfig.getRegion()].contacts;
      redirectUrl = redirectUrl.replace('{serviceName}', this.projectId);
      this.$window.open(redirectUrl, '_blank');
    }
  }

  getContact(account) {
    return this.OvhApiCloud.Project().Acl().v6().get({
      serviceName: this.projectId,
      accountId: account.accountId,
    }).$promise;
  }
}
