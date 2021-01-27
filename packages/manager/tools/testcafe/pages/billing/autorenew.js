import { t } from 'testcafe';
import ManagerParentPage from '../common/managerParent';
import { getPageUrl } from '../../utils/helpers';

export default class AutoRenew extends ManagerParentPage {
  constructor() {
    super({ currentPageNameInUrl: 'billing/autorenew' });
  }

  static async confirmRenewUrlWithProductParameter(product) {
    const currentPage = await getPageUrl();
    await t.expect(currentPage).contains(`?searchText=${product}`);
  }
}
