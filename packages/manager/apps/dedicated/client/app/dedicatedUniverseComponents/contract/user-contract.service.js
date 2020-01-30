export default class {
  constructor($q, OvhHttp) {
    'ngInject';

    this.$q = $q;
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
    return this.OvhHttp.get('/me/agreements', {
      rootPath: 'apiv6',
      params: {
        agreed: 'todo',
      },
    }).then((agreements) => {
      const promises = agreements.map((agreementId) =>
        this.getAgreementsDetail(agreementId),
      );
      return this.$q.all(promises);
    });
  }

  getAgreementsDetail(agreementId) {
    return this.$q
      .all({
        contract: this.getContract(agreementId),
        agreement: this.getAgreement(agreementId),
      })
      .then((data) => ({
        id: agreementId,
        code: data.contract.name,
        pdf: data.contract.pdf,
        text: data.contract.text,
        contractId: data.agreement.contractId,
      }));
  }

  getContract(agreementId) {
    return this.OvhHttp.get(`/me/agreements/${agreementId}/contract`, {
      rootPath: 'apiv6',
    });
  }

  getAgreement(agreementId) {
    return this.OvhHttp.get(`/me/agreements/${agreementId}`, {
      rootPath: 'apiv6',
    });
  }
}
