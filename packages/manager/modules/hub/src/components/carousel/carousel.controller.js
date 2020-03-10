export default class {
  /* @ngInject */
  constructor(atInternet) {
    this.atInternet = atInternet;
    this.index = 0;
  }

  nextAlert() {
    if (this.index === this.items.length - 1) {
      this.index = 0;
    } else {
      this.index += 1;
    }

    this.atInternet.trackClick({
      name: `${this.trackingPrefix}::alert::action`,
      type: 'action',
    });
  }
}
