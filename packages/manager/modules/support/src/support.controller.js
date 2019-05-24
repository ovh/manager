export default class {
  /* @ngInject */
  constructor(
    $transitions,
  ) {
    this.$transitions = $transitions;
  }

  $onInit() {
    const transitionCriteria = {
      from: 'support.**',
    };

    this.$transitions.onStart(transitionCriteria, () => {
      this.isLoading = true;
    });

    this.$transitions.onSuccess(transitionCriteria, () => {
      this.isLoading = false;
    });
  }
}
