import { POSSIBLE_ACTIONS } from './constants';
import { MIN_NODES_BY_CLUSTER } from '../../../constants';

export default class NutanixDashboardNodeActionMenu {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.mapPossibleActions();
    this.POSSIBLE_ACTIONS = POSSIBLE_ACTIONS;
  }

  mapPossibleActions() {
    this.possibleActionsMapped = {};
    this.possibleActions.forEach(({ action, isPossible, reason }) => {
      this.possibleActionsMapped[action] = { isPossible, reason };
    });
  }

  getReasonTranslation(reason) {
    if (!reason?.length) return '';

    const reasonTrimed = reason.replace('{{ ', '').replace(' }}', '');

    return this.$translate.instant(
      `nutanix_node_disable_reason_${reasonTrimed}`,
      { nb_nodes_minimal: MIN_NODES_BY_CLUSTER },
    );
  }
}
