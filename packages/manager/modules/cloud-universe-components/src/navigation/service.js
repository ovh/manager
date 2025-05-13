import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import last from 'lodash/last';

export default class CucCloudNavigation {
  /* @ngInject */
  constructor($transitions, $state, $stateParams) {
    this.$state = $state;
    this.$stateParams = $stateParams;

    this.rootElement = undefined;

    $transitions.onSuccess({}, (transition) => {
      const toState = transition.to();
      const toParams = transition.params();
      const fromState = transition.from();
      const fromParams = transition.params('from');
      const correspondingState = find(
        this.history,
        (elem) =>
          elem.state === toState.name && isEqual(elem.stateParams, toParams),
      );

      if (correspondingState) {
        while (last(this.history) !== correspondingState) {
          this.history.pop();
        }
        this.history.pop();
      } else {
        const element = {
          state: fromState.name,
          stateParams: fromParams,
          sref: this.constructor.getSref({ state: fromState.name }, fromParams),
        };
        this.history.push(element);
      }
    });
  }

  $onInit() {
    this.init();
  }

  init(rootElement) {
    this.history = [];
    this.rootElement = undefined;
    if (rootElement) {
      this.rootElement = rootElement;
    }
  }

  getPreviousState() {
    const previousState = last(this.history) || this.rootElement;
    previousState.go = () =>
      this.$state.go(previousState.state, previousState.stateParams);
    return previousState;
  }

  findInHistory(stateToFind) {
    return find(
      this.history,
      (state) =>
        state.state === stateToFind.state &&
        isEqual(state.stateParams, stateToFind.stateParams),
    );
  }

  static getSref(element, params) {
    return `${element.state}(${JSON.stringify(params)})`;
  }
}
