import BasePage from '../base';

export default class SummaryPage extends BasePage {
  constructor() {
    super();

    this.mainSection = 'telecomTask:section';
    this.hashUrl = '#!/task';
  }
}
