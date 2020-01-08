export default class exchangeHeaderService {
  /* @ngInject */
  constructor(OvhHttp) {
    this.OvhHttp = OvhHttp;
  }

  updateServiceDisplayName(organizationName, exchangeService, displayName) {
    return this.OvhHttp.put(
      `/email/exchange/${organizationName}/service/${exchangeService}`,
      {
        rootPath: 'apiv6',
        data: {
          displayName,
        },
      },
    );
  }
}
