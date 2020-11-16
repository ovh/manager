export default class {
  /* @ngInject */
  constructor(OvhHttp) {
    this.OvhHttp = OvhHttp;
  }

  getAvailableMailingLists() {
    return this.OvhHttp.get('/me/mailingList/availableLists', {
      rootPath: 'apiv6',
    });
  }

  postMailingList(email, mailingList) {
    return this.OvhHttp.post('/me/mailingList/subscribe', {
      rootPath: 'apiv6',
      data: {
        email,
        mailingList,
      },
    });
  }
}
