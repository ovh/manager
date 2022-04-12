export default class SupportTicketBannerController {
  /* @ngInject */
  constructor(coreConfig, coreURLBuilder) {
    this.supportTicketLink = coreConfig.isRegion(['EU', 'CA'])
      ? coreURLBuilder.buildURL('dedicated', '#/support/tickets/new')
      : '';
  }
}
