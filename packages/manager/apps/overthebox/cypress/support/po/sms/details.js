import BasePage from '../base';

export default class DetailsPage extends BasePage {
  constructor(serviceId) {
    super();

    this.serviceId = serviceId;

    this.mainSection = 'otb:section';
    this.hashUrl = `#!/overTheBox/${this.serviceId}/details`;
  }
}
