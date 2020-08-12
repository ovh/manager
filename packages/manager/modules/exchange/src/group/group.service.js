import snakeCase from 'lodash/snakeCase';

import punycode from 'punycode';

export default class Group {
  /* @ngInject */
  constructor($q, OvhHttp) {
    this.services = {
      $q,
      OvhHttp,
    };
  }

  getModels() {
    return this.services.OvhHttp.get('/email/exchange.json', {
      rootPath: 'apiv6',
    }).then((data) => data.models);
  }

  retrievingOptionsToCreateNewGroup(organization, serviceName) {
    const models = this.getModels();
    const options = this.services.OvhHttp.get(
      '/email/exchange/{organization}/service/{exchange}/domain',
      {
        rootPath: 'apiv6',
        urlParams: {
          organization,
          exchange: serviceName,
        },
        params: {
          state: 'ok',
        },
      },
    );

    return this.services.$q.all({ models, options }).then((data) => {
      const availableDepartRestrictions = data.models[
        'email.exchange.MailingListDepartRestrictionEnum'
      ].enum.map((m) => snakeCase(m).toUpperCase());
      const availableDomains = data.options.map((domain) => ({
        name: domain,
        displayName: punycode.toUnicode(domain),
        formattedName: punycode.toUnicode(domain),
      }));

      const availableJoinRestrictions = data.models[
        'email.exchange.MailingListJoinRestrictionEnum'
      ].enum.map((m) => snakeCase(m).toUpperCase());

      return {
        availableDepartRestrictions,
        availableDomains,
        availableJoinRestrictions,
      };
    });
  }

  /**
   * Get managers by group
   */
  retrievingMembersByGroup(organization, serviceName, groupName) {
    return this.services.OvhHttp.get(
      '/sws/exchange/{organization}/{exchange}/groups/{groupName}/members',
      {
        rootPath: '2api',
        clearCache: true,
        urlParams: {
          organization,
          exchange: serviceName,
          groupName,
        },
        params: {
          state: 'ok',
        },
      },
    );
  }

  /**
   * Get managers by group
   */
  retrievingManagersByGroup(
    organization,
    serviceName,
    groupName,
    count = 10,
    offset = 0,
  ) {
    return this.services.OvhHttp.get(
      '/sws/exchange/{organization}/{exchange}/groups/{mailinglist}/managers',
      {
        rootPath: '2api',
        clearCache: true,
        urlParams: {
          organization,
          exchange: serviceName,
          mailinglist: groupName,
        },
        params: {
          count,
          offset,
        },
      },
    );
  }
}
