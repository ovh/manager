import camelCase from 'lodash/camelCase';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import set from 'lodash/set';

import punycode from 'punycode';

export default class ExchangeExternalContacts {
  /* @ngInject */
  constructor(wucExchange, OvhHttp) {
    this.services = { wucExchange, OvhHttp };
  }

  isAccountValid(account) {
    const accountIsEmpty = account == null;
    const emailIsValid =
      !isEmpty(account.externalEmailAddress) &&
      this.services.wucExchange.constructor.isEmailValid(
        account.externalEmailAddress,
      );
    const displayNameIsValid =
      !isEmpty(account.displayName) && account.displayName.length <= 255;

    return !accountIsEmpty && emailIsValid && displayNameIsValid;
  }

  removingContact(organization, serviceName, contactId) {
    return this.services.OvhHttp.delete(
      '/email/exchange/{organization}/service/{exchange}/externalContact/{externalEmailAddress}',
      {
        rootPath: 'apiv6',
        urlParams: {
          organization,
          exchange: serviceName,
          externalEmailAddress: contactId,
        },
      },
    ).then((data) => {
      this.services.wucExchange.resetTabExternalContacts();
      return data;
    });
  }

  modifyingContact(organization, serviceName, contactId, modifiedContact) {
    set(modifiedContact, 'state', camelCase(modifiedContact.state));

    return this.services.OvhHttp.put(
      '/email/exchange/{organization}/service/{exchange}/externalContact/{externalEmailAddress}',
      {
        rootPath: 'apiv6',
        urlParams: {
          organization,
          exchange: serviceName,
          externalEmailAddress: contactId,
        },
        data: modifiedContact,
      },
    ).then((data) => {
      this.services.wucExchange.resetTabExternalContacts();
      return data;
    });
  }

  addingContact(organization, serviceName, newContact) {
    return this.services.OvhHttp.post(
      '/email/exchange/{organization}/service/{exchange}/externalContact',
      {
        rootPath: 'apiv6',
        urlParams: {
          organization,
          exchange: serviceName,
        },
        data: newContact,
      },
    ).then((data) => {
      this.services.wucExchange.resetTabExternalContacts();
      return data;
    });
  }

  gettingContacts(organization, serviceName, count, offset, filter) {
    const params = {
      count,
      offset,
      search: filter != null ? filter : null,
    };

    return this.services.OvhHttp.get(
      '/sws/exchange/{organization}/{exchange}/externalContacts',
      {
        rootPath: '2api',
        urlParams: {
          organization,
          exchange: serviceName,
        },
        params,
      },
    );
  }

  gettingContactOptions(organization, serviceName) {
    return this.services.OvhHttp.get(
      '/email/exchange/{organization}/service/{exchange}/domain',
      {
        rootPath: 'apiv6',
        urlParams: {
          organization,
          exchange: serviceName,
        },
        params: {
          main: true,
          state: 'ok',
        },
      },
    ).then((data) =>
      data.map((datum) => ({
        name: datum,
        displayName: punycode.toUnicode(datum),
        formattedName: punycode.toUnicode(datum),
      })),
    );
  }

  prepareForCsv(organization, serviceName, opts, offset) {
    return this.gettingContacts(
      organization,
      serviceName,
      opts.count,
      offset,
      opts.filter,
    ).then((accounts) => {
      return {
        accounts: accounts.data,
        headers: keys(accounts.data[0]),
      };
    });
  }
}
