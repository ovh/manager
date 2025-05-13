import { PLANS_WITHOUT_BACKUP } from '../../../../../components/project/storages/databases/databases.constants';

export default class DatabasesDashboardCtrl {
  /* @ngInject */
  constructor(CHANGELOG) {
    this.PLANS_WITHOUT_BACKUP = PLANS_WITHOUT_BACKUP;
    this.CHANGELOG = CHANGELOG;
  }
}
