export default class AdvicesCtrl {
  /* @ngInject */
  constructor($q, atInternet) {
    this.$q = $q;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.advicesAvailable = false;
    this.loadAdvices();
  }

  loadAdvices() {
    this.$q.resolve(this.advices).then((advices) => {
      if (advices && advices.length > 0) {
        this.advicesAvailable = true;
        this.advices = advices;
      }
    });
  }

  onClick(advice) {
    if (advice.tag) {
      this.atInternet.trackClick({
        name: advice.tag,
        type: 'action',
      });
    }

    if (typeof this.onAdviceClick === 'function') {
      this.onAdviceClick({ advice });
    }
  }
}
