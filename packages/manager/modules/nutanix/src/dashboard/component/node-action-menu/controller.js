import { POSSIBLE_ACTIONS } from './constants';

export default class NutanixDashboardNodeActionMenu {
  /* ngInject */
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
    if (!reason || reason.lenght === 0) return '';

    const reasonTrimed = reason.replace('{{ ', '').replace(' }}', '');

    return this.$translate.instant(
      `nutanix_node_disable_reason_${reasonTrimed}`,
    );
  }
}

// Une tâche de démarrage est déjà en cours sur ce serveur
// Une tâche d'extinction est déjà en cours sur ce serveur
// Une tâche d'installation est déjà en cours sur le noeud
// Une tâche d'installation doit être effectuée d'abord
// Vous devez préalablement éteindre le serveur avant de lancer la désinstallation
