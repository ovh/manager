import { POSSIBLE_ACTIONS } from './constants';

export default class NutanixDashboardNodeActionMenu {
  /* @ngInject */
  constructor($translate, NutanixNode) {
    this.$translate = $translate;
    this.NutanixNode = NutanixNode;
  }

  $onInit() {
    this.POSSIBLE_ACTIONS = POSSIBLE_ACTIONS;
  }

  loadPossibleActions() {
    this.isLoading = true;
    this.NutanixNode.getNodeDetails(this.serviceName, this.server)
      .then((node) => {
        this.mapPossibleActions(node.possibleActions);
      })
      .catch(() => {
        this.possibleActionsMapped = [];
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  mapPossibleActions(possibleActions) {
    this.possibleActionsMapped = {};
    possibleActions.forEach(({ action, isPossible, reason }) => {
      this.possibleActionsMapped[action] = { isPossible, reason };
    });

    if (this.hasOnlyMinimumNode) {
      this.possibleActionsMapped[POSSIBLE_ACTIONS.TERMINATE].isPossible = false;
      this.possibleActionsMapped[POSSIBLE_ACTIONS.TERMINATE].reason =
        'lower_than_initial_commitment_size';
    }
  }

  getReasonTranslation(reason) {
    if (!reason?.length) return '';

    const reasonTrimed = reason.replace('{{ ', '').replace(' }}', '');

    return this.$translate.instant(
      `nutanix_node_disable_reason_${reasonTrimed}`,
      { nb_nodes_minimal: this.initialCommitmentSize },
    );
  }
}
