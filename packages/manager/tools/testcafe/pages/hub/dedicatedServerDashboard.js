import { Selector } from 'testcafe';
import ManagerParentPage from '../common/managerParent';

export default class ServersListDashboard extends ManagerParentPage {
  constructor() {
    super({ currentPageNameInUrl: '/#/dedicated_server' });
    this.tableListItems = Selector('[data-navi-id="DEDICATED_SERVER-list"]');
  }
}
