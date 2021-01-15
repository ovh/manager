import ManagerParentPage from '../common/managerParent';

export default class OrdersList extends ManagerParentPage {
  constructor() {
    super({ currentPageNameInUrl: 'billing/orders' });
  }
}
