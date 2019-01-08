import BasePage from '../base';

export default class VoicemailConfigurationPage extends BasePage {
  constructor(serviceId) {
    super();
    this.serviceId = serviceId;

    this.mainSection = 'freefax.voicemail-configuration:section';
    this.hashUrl = `#!/freefax/${this.serviceId}/voicemail`;
  }

  goBack() {
    this.getE2E('freefax.voicemail-configuration:navigation:back')
      .click();
  }
}
