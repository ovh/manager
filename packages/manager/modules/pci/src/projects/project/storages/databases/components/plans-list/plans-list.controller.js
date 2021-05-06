import capitalize from 'lodash/capitalize';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.capitalize = capitalize;
    this.$translate = $translate;
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
}
