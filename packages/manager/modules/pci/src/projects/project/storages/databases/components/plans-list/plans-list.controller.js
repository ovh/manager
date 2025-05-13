import capitalize from 'lodash/capitalize';
import { PLANS_WITHOUT_BACKUP } from '../../../../../../components/project/storages/databases/databases.constants';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.capitalize = capitalize;
    this.$translate = $translate;
    this.PLANS_WITHOUT_BACKUP = PLANS_WITHOUT_BACKUP;
  }

  getSortedPlans() {
    return this.plans?.sort((a, b) => b.compare(a));
  }

  getNodesSpecTranslation(plan) {
    return this.$translate.instant(
      plan.minNodes === plan.maxNodes
        ? `pci_database_plans_list_spec_nodes${
            plan.minNodes === 1 ? '_single' : ''
          }`
        : `pci_database_plans_list_spec_nodes_range${
            plan.minNodes === 1 ? '_single_min' : ''
          }`,
      {
        min: plan.minNodes,
        max: plan.maxNodes,
      },
    );
  }

  hasBackup(plan) {
    return !this.PLANS_WITHOUT_BACKUP.includes(plan.name);
  }
}
