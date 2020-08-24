export default class {
  /* @ngInject */
  constructor($q, $http, OvhHttp) {
    this.$q = $q;
    this.$http = $http;
    this.OvhHttp = OvhHttp;
  }

  getAgreementsToValidate(predicate) {
    return this.getTodoAgreements().then((contracts) =>
      contracts.filter(predicate),
    );
  }

  acceptAgreements(agreements) {
    const promises = agreements.map((agreement) =>
      this.acceptAgreement(agreement),
    );
    return this.$q.all(promises);
  }

  acceptAgreement(agreement) {
    return this.OvhHttp.post(`/me/agreements/${agreement.id}/accept`, {
      rootPath: 'apiv6',
    });
  }

  getTodoAgreements() {
    return this.$http
      .get('/sws/agreements', {
        serviceType: 'aapi',
        params: {
          count: 0,
          offset: 0,
          agreed: 'todo',
        },
      })
      .then((res) => {
        return res.data.list.results;
      });
  }
}
