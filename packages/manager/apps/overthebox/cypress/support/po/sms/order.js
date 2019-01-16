import BasePage from '../base';

export default class OrderPage extends BasePage {
  constructor() {
    super();

    this.mainSection = 'otb:order';
    this.hashUrl = '#!/overTheBox/order';
  }
}
