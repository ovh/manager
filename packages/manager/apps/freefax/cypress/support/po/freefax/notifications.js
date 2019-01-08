import BasePage from '../base';

export default class NotificationsPage extends BasePage {
  constructor(serviceId) {
    super();

    this.serviceId = serviceId;

    this.mainSection = 'freefax.notifications:section';
    this.hashUrl = `#!/freefax/${this.serviceId}/notifications`;
  }

  goBack() {
    this.getE2E('freefax.notifications:navigation:back')
      .click();
  }
}
