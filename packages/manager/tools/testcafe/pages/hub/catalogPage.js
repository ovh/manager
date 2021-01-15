import { Selector, t } from 'testcafe';
import ManagerParentPage from '../common/managerParent';

export default class CatalogPage extends ManagerParentPage {
  constructor() {
    super({
      currentPageNameInUrl: 'catalog',
      elementDisplayedOnPage: 'catalog-title',
    });
  }

  static async accessToOrder(productName) {
    const orderLink = Selector(`[data-navi-id="${productName}-order]`);
    await t.expect(orderLink.visible).ok();
    await t.click(orderLink);
  }
}
