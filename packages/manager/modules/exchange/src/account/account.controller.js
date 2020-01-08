import find from 'lodash/find';
import keys from 'lodash/keys';
import get from 'lodash/get';

export default class ExchangeAccountCtlr {
  /* @ngInject */
  constructor($scope, exchangeAccount, messaging) {
    this.$scope = $scope;

    this.exchangeAccount = exchangeAccount;
    this.messaging = messaging;

    this.STATES = {
      HIDE: {
        name: 'home',
        isDefault: true,
      },
      ALIAS: {
        name: 'alias',
      },
      ADD: {
        name: 'add',
      },
    };
  }

  $onInit() {
    this.currentStateName = 'home';

    this.$scope.$on(this.exchangeAccount.EVENTS.CHANGE_STATE, (events, args) =>
      this.changeState(args),
    );
  }

  changeState({ stateName, args }) {
    function getDefaultState() {
      return find(keys(this.STATES), (key) => this.STATES[key].isDefault);
    }

    const formattedStateName = `${stateName}`.toUpperCase();
    const matchingState = get(
      this.STATES,
      formattedStateName,
      getDefaultState.call(this),
    );

    this.currentStateName = matchingState.name;
    this.stateArgs = args;
  }
}
