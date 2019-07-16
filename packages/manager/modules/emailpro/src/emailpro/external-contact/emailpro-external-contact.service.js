angular
  .module('Module.emailpro.services')
  .service(
    'EmailProExternalContacts',
    function EmailProExternalContacts(EmailPro, OvhHttp) {
      this.isAccountValid = function isAccountValid(account) {
        if (!account || !EmailPro.isEmailValid(account.externalEmailAddress)) {
          return false;
        } if (account.firstName && account.firstName.length > 64) {
          return false;
        } if (account.lastName && account.lastName.length > 64) {
          return false;
        } if (!account.displayName || account.displayName.length === 0) {
          return false;
        } if (account.displayName && account.displayName.length > 255) {
          return false;
        }
        return true;
      };

      this.removeContact = function removeContact(organization, serviceName, contactId) {
        return EmailPro.gettingBaseAPIPath()
          .then(baseAPIPath => OvhHttp.delete(`/${baseAPIPath}/{exchange}/externalContact/{externalEmailAddress}`, {
            rootPath: 'apiv6',
            urlParams: {
              organization,
              exchange: serviceName,
              externalEmailAddress: contactId,
            },
          }))
          .then((data) => {
            EmailPro.resetTabExternalContacts();
            return data;
          });
      };

      this.modifyContact = function modifyContact(
        organization,
        serviceName,
        contactId,
        modifiedContact,
      ) {
        _.set(modifiedContact, 'state', _.camelCase(modifiedContact.state));

        return EmailPro.gettingBaseAPIPath()
          .then(baseAPIPath => OvhHttp.put(`/${baseAPIPath}/{exchange}/externalContact/{externalEmailAddress}`, {
            rootPath: 'apiv6',
            urlParams: {
              organization,
              exchange: serviceName,
              externalEmailAddress: contactId,
            },
            data: modifiedContact,
          }))
          .then((data) => {
            EmailPro.resetTabExternalContacts();
            return data;
          });
      };

      this.addContact = function addContact(organization, serviceName, newContact) {
        return EmailPro.gettingBaseAPIPath()
          .then(baseAPIPath => OvhHttp.post(`/${baseAPIPath}/{exchange}/externalContact`, {
            rootPath: 'apiv6',
            urlParams: {
              organization,
              exchange: serviceName,
            },
            data: newContact,
          }))
          .then((data) => {
            EmailPro.resetTabExternalContacts();
            return data;
          });
      };

      this.getContacts = function getContacts(organization, serviceName, count, offset, filter) {
        const params = {
          count,
          offset,
        };

        if (filter) {
          params.search = filter;
        }

        return EmailPro.gettingIsServiceMXPlan()
          .then((isMXPlan) => {
            Object.assign(params, { isMXPlan });
            return OvhHttp.get('/sws/emailpro/{exchange}/externalContacts', {
              rootPath: '2api',
              urlParams: {
                organization,
                exchange: serviceName,
              },
              params,
            });
          });
      };

      this.getContactOptions = function getContactOptions(organization, serviceName) {
        return EmailPro.gettingBaseAPIPath()
          .then(baseAPIPath => OvhHttp.get(`/${baseAPIPath}/{exchange}/domain`, {
            rootPath: 'apiv6',
            urlParams: {
              organization,
              exchange: serviceName,
            },
            params: {
              main: true,
              state: 'ok',
            },
          }))
          .then(data => data.map(d => ({
            name: d,
            displayName: punycode.toUnicode(d),
            formattedName: punycode.toUnicode(d),
          })));
      };
    },
  );
