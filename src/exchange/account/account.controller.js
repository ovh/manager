angular.module('Module.exchange.controllers').controller(
  'exchangeAccountCtlr',
  class ExchangeAccountCtlr {
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

      this.$scope.$on(
        this.exchangeAccount.EVENTS.CHANGE_STATE,
        (events, args) => this.changeState(args),
      );
    }

    changeState({ stateName, args }) {
      function getDefaultState() {
        return _(this.STATES)
          .chain()
          .keys()
          .find(key => this.STATES[key].isDefault)
          .value();
      }

      const formattedStateName = `${stateName}`.toUpperCase();
      const matchingState = _(this.STATES).get(formattedStateName, getDefaultState.call(this));

      this.currentStateName = matchingState.name;
      this.stateArgs = args;
    }
  },
);
