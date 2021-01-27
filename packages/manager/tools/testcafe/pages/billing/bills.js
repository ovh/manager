import ManagerParentPage from '../common/managerParent';

export default class BillsList extends ManagerParentPage {
  constructor() {
    super({ currentPageNameInUrl: 'billing/history' });
  }
}
