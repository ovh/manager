export default class {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  terminate() {
    this.atInternet.trackClick({
      name: 'autorenew::terminate',
      type: 'action',
      chapter1: 'dedicated',
      chapter2: 'account',
      chapter3: 'billing',
    });

    this.isDeleting = true;
    return this.terminateService()
      .then(() => this.onSuccess())
      .catch((error) => this.onError({ error }));
  }
}
