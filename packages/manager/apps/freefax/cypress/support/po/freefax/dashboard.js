import BasePage from '../base';
import NotificationsPage from './notifications';
import VoicemailConfigurationPage from './voicemailConfiguration';

export default class DashboardPage extends BasePage {
  constructor(serviceId) {
    super();

    this.serviceId = serviceId;

    this.mainSection = 'freefax:section';
    this.hashUrl = `#!/freefax/${this.serviceId}`;
  }

  navigateToNotifications() {
    this.getE2E('freefax:navigation:notifications')
      .click();

    return new NotificationsPage(this.serviceId);
  }

  navigateToVoiceMailConfiguration() {
    this.getE2E('freefax:navigation:voicemailConfiguration')
      .click();
    return new VoicemailConfigurationPage(this.serviceId);
  }
}
