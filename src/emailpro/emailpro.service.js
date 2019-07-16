angular
  .module('Module.emailpro.services')
  .service(
    'EmailPro',
    class EmailPro {
      constructor(
        $cacheFactory,
        $location,
        $q,
        $rootScope,
        $stateParams,
        $timeout,
        $translate,

        constants,
        OvhHttp,
      ) {
        this.$cacheFactory = $cacheFactory;
        this.$location = $location;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$stateParams = $stateParams;
        this.$timeout = $timeout;
        this.$translate = $translate;

        this.constants = constants;
        this.OvhHttp = OvhHttp;

        this.tasksCache = $cacheFactory('UNIVERS_WEB_EMAIL_PRO_TASKS');
        this.delegationRightsCache = $cacheFactory('UNIVERS_WEB_EMAIL_PRO_DELEGATION_RIGHTS');
        this.disclaimersCache = $cacheFactory('UNIVERS_WEB_EMAIL_PRO_DISCLAIMERS');
        this.requests = {
          exchangeDetails: null,
        };

        this.exchangeCache = $cacheFactory('UNIVERS_WEB_EMAIL_PRO');
        this.domainsCache = $cacheFactory('UNIVERS_WEB_EMAIL_PRO_DOMAINS');
        this.accountsCache = $cacheFactory('UNIVERS_WEB_EMAIL_PRO_ACCOUNTS');
        this.sharedAccountsCache = $cacheFactory('UNIVERS_WEB_EMAIL_PRO_SHARED_ACCOUNTS');
        this.resourcesCache = $cacheFactory('UNIVERS_WEB_EMAIL_PRO_RESOURCES');
        this.groupsCache = $cacheFactory('UNIVERS_WEB_EMAIL_PRO_GROUPS');
        this.publicFolderCache = $cacheFactory('UNIVERS_WEB_EMAIL_PRO_PUBLIC_FOLDERS');

        this.updateAccountAction = 'UPDATE_ACCOUNT';
        this.changePasswordAction = 'CHANGE_PASSWORD';

        this.noSecurityOption = 'NONE';

        this.accountTypeDedicated = 'DEDICATED';
        this.accountTypeHosted = 'HOSTED';
        this.accountTypeProvider = 'PROVIDER';
        this.nicBill = 'BILLING';
        this.nicAdmin = 'ADMIN';
        this.nicTech = 'TECH';
        this.EmailPro2010Code = 14;
        this.EmailPro2013Code = 15;

        this.stateCreating = 'CREATING';
        this.stateDeleting = 'DELETING';
        this.stateReopening = 'REOPENING';
        this.stateSuspended = 'SUSPENDED';
        this.stateSuspending = 'SUSPENDING';
        this.stateOk = 'OK';
        this.stateTaskDoing = 'TASK_ON_DOING';

        this.aliasMaxLimit = 1000;

        this.events = {
          domainsChanged: 'emailpro.domains.changed',
          accountsChanged: 'emailpro.accounts.changed',
          tasksChanged: 'emailpro.tasks.changed',
          delegationRightsChanged: 'emailpro.delegationRights.changed',
          groupsChanged: 'emailpro.groups.changed',
          disclaimersChanged: 'emailpro.disclaimers.changed',
          externalcontactsChanged: 'emailpro.tabs.externalcontacts.changed',
        };
      }

      resetCache(key) {
        if (key !== undefined) {
          if (this.requests[key] !== undefined) {
            this.requests[key] = null;
          }
          this.exchangeCache.remove(key);
        } else {
          this.exchangeCache.removeAll();
          this.domainsCache.removeAll();
          this.accountsCache.removeAll();
          this.sharedAccountsCache.removeAll();
          this.tasksCache.removeAll();
          this.delegationRightsCache.removeAll();
          this.groupsCache.removeAll();
          this.resourcesCache.removeAll();
          this.publicFolderCache.removeAll();
          this.disclaimersCache.removeAll();
      for (const request in this.requests) { // eslint-disable-line
        if (this.requests.hasOwnProperty(request)) { // eslint-disable-line
              this.requests[request] = null;
            }
          }
        }
      }

      resetDomains() {
        this.domainsCache.removeAll();
        this.$rootScope.$broadcast(this.events.domainsChanged);
      }

      resetAccounts() {
        this.accountsCache.removeAll();
        this.$rootScope.$broadcast(this.events.accountsChanged);
      }

      resetSharedAccounts() {
        this.sharedAccountsCache.removeAll();
        this.$rootScope.$broadcast(this.events.sharedAccountsChanged);
      }

      resetTasks() {
        this.tasksCache.removeAll();
        this.$rootScope.$broadcast(this.events.tasksChanged);
      }

      resetDelegationRights() {
        this.delegationRightsCache.removeAll();
        this.$rootScope.$broadcast(this.events.delegationRightsChanged);
      }

      resetResources() {
        this.resourcesCache.removeAll();
        this.$rootScope.$broadcast(this.events.resourcesChanged);
      }

      resetGroups() {
        this.groupsCache.removeAll();
        this.$rootScope.$broadcast(this.events.groupsChanged);
      }

      resetDisclaimers() {
        this.disclaimersCache.removeAll();
        this.$rootScope.$broadcast(this.events.disclaimersChanged);
      }

      resetPublicFolder() {
        this.publicFolderCache.removeAll();
        this.$rootScope.$broadcast(this.events.publicFoldersChanged);
      }

      resetTabExternalContacts() {
        this.$rootScope.$broadcast(this.events.externalcontactsChanged);
      }

      getSuccessDataOrReject(response) {
        return response.status < 300 ? response.data : this.$q.reject(response);
      }

      /* eslint-disable class-methods-use-this */
      isEmailValid(email) {
        return email && email.match(/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9]{2}(?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/);
      }
      /* eslint-enable class-methods-use-this */

      getSelected(forceRefresh) {
        if (forceRefresh === true) {
          this.resetCache();
        }

        const selectedEmailPro = this.exchangeCache.get('exchange');
        if (selectedEmailPro) {
          return this.$q.when(this.exchangeCache.get('exchange'));
        }

        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}', {
              rootPath: '2api',
              urlParams: {
                exchange: this.$stateParams.productId,
              },
              params: {
                isMXPlan,
              },
            }))
          .then((result) => {
            this.exchangeCache.put('exchange', result);

            return result;
          });
      }

      getModels() {
        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .get(`/${baseAPIPath}.json`, {
              rootPath: 'apiv6',
            }))
          .then(data => data.models);
      }

      getEmailProServer(organization, name) {
        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .get(`/${baseAPIPath}/{exchangeService}/server`, {
              rootPath: 'apiv6',
              urlParams: {
                exchangeService: name,
              },
            }))
          .then(EmailPro.getSuccessDataOrReject);
      }

      /**
       * Return the last 2 days task list for the selected exchange
       */
      getTasks(serviceName, pageSize, offset, domainName) {
        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => {
            if(isMXPlan) {
              return this.$q.all([
                this.getRedirectionTasks(domainName),
                this.getMailingListTasks(domainName),
                this.getMxTasks(serviceName),
              ]);
            } else {
              return this.getRegularTasks(serviceName, pageSize, offset)
                .then(res => res.list.results);
            }
          });
      }

      getRedirectionTasks(domainName) {
        return this.OvhHttp.get('/email/domain/{domain}/task/redirection', {
            rootPath: 'apiv6',
            urlParams: {
              domain: domainName,
            }
        }).then(ids => {
          const promises = _.map(ids, id => this.getSubTaskDetails(true, domainName, id));
          return this.$q.all(promises);
        });
      }

      getMailingListTasks(domainName) {
        return this.OvhHttp.get('/email/domain/{domain}/task/mailinglist', {
            rootPath: 'apiv6',
            urlParams: {
              domain: domainName,
            }
          }).then(ids => {
            const promises = _.map(ids, id => this.getSubTaskDetails(false, domainName, id));
            return this.$q.all(promises);
          });
      }

      getSubTaskDetails(redirection, domainName, taskId) {
        var url = '/email/domain/{domain}/task/mailinglist/{id}';
        if(redirection) {
          url = '/email/domain/{domain}/task/redirection/{id}';
        }
        return this.OvhHttp.get(url, {
          rootPath: 'apiv6',
          urlParams: {
            domain: domainName,
            id: taskId,
          }
        }).then(res => {
          res.todoDate = res.date;
          res.finishDate = res.date;
          return res;
        })
      }

      getMxTasks(serviceName) {
        return this.OvhHttp
          .get('/sws/emailpro/{exchange}/tasks', {
            rootPath: '2api',
            urlParams: {
              exchange: serviceName,
            },
            params: {
              isMXPlan: true,
            },
          }).then(res => res.list.results);
      }

      getRegularTasks(serviceName, pageSize, offset) {
        return this.OvhHttp
          .get('/sws/emailpro/{exchange}/tasks', {
            rootPath: '2api',
            urlParams: {
              exchange: serviceName,
            },
            params: {
              count: pageSize || 10,
              offset: offset || 0,
            },
          }).then(res => res.list.results);
      }

      /**
       * Data needed for quota availability
       */
      getCapabilities(serviceName, accountEmailAddress) {
        return this.gettingBaseAPIPath()
        .then(baseAPIPath => this.OvhHttp
          .get(`/${baseAPIPath}/{exchange}/account/{accountEmailAddress}/capabilities`, {
            rootPath: 'apiv6',
            urlParams: {
              exchange: serviceName,
              accountEmailAddress,
            },
          }));
      }
      /**
       * Return paginated exchange accounts list
       * @param pageSize - the size of page([10, 20, 40])
       * @param offset - page index
       * @param search - filter over primaryEmail value
       * @param configurableOnly - Integer value: "0" to get all, "1" to filter out dummy accounts
       *                           and creating/deleting ones
       */
      getAccounts(pageSize, offset, search, configurableOnly, type, timeout) {
        return this.getSelected()
          .then(exchange => this.getAccountsForEmailPro(
            exchange,
            this.accountsCache,
            pageSize,
            offset,
            search,
            configurableOnly,
            type,
            timeout,
          ));
      }

      /**
       * Return paginated accounts list for the specified exchange.
       * @param exchange - an object describing exchange service we want the accounts of.
       *                   Use this.getSelected() for the currently selected exchange service
       * @param cache - the cache to use.
       *                If getting for the selected exchange, use this.accountsCache.
       * @param pageSizeParam - the size of page([10, 20, 40])
       * @param offsetParam - page index
       * @param searchParam - filter over primaryEmail value
       * @param configurableOnlyParam - Integer value: "0" to get all, "1" to filter
       *                                out dummy accounts and creating/deleting ones
       */
      getAccountsForEmailPro (exchange, cache, pageSizeParam, offsetParam, // eslint-disable-line
        searchParam, configurableOnlyParam, typeParam, timeout) {
        const pageSize = pageSizeParam !== undefined ? pageSizeParam : 10;
        const offset = offsetParam || 0;
        const search = searchParam || undefined;
        const configurableOnly = configurableOnlyParam || 0;
        const type = typeParam || '';

        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/accounts', {
              rootPath: '2api',
              urlParams: {
                exchange: exchange.domain,
              },
              params: {
                count: pageSize,
                offset,
                search,
                configurableOnly,
                typeLicence: type,
                isMXPlan,
              },
              timeout,
            }));
      }

      /**
       * Return paginated exchange accounts list
       * @param serviceName - Name of the service
       * @param pageSizeParam - the size of page([10, 20, 40])
       * @param offsetParam - page index
       * @param searchParam - filter over primaryEmail value
       * @param configurableOnlyParam - Integer value: "0" to get all, "1" to filter out
       *                                dummy accounts and creating/deleting ones
       */
      getAccountsAndContacts(serviceName, pageSizeParam, offsetParam,
        searchParam, configurableOnlyParam) {
        const pageSize = pageSizeParam !== undefined ? pageSizeParam : 10;
        const offset = offsetParam || 0;
        const search = searchParam || undefined;
        const configurableOnly = configurableOnlyParam || 0;

        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/accounts/contacts', {
              rootPath: '2api',
              urlParams: {
                exchange: serviceName,
              },
              params: {
                count: pageSize,
                offset,
                search,
                configurableOnly,
                isMXPlan,
              },
            }));
      }

      /**
       * Data necessary for new account creation
       */
      getNewAccountOptions(serviceName) {
        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/accounts/options', {
              rootPath: '2api',
              urlParams: {
                exchange: serviceName,
              },
              params: {
                isMXPlan,
              },
            }));
      }

      addEmailProAccount(serviceName, accountToAdd) {
        // Format from play to api
        const data = angular.copy(accountToAdd);
        data.license = _.camelCase(data.accountLicense);
        delete data.accountLicense;
        data.outlookLicense = _.camelCase(data.outlook);
        delete data.outlook;
        data.SAMAccountName = _.camelCase(data.samaccountName);
        delete data.samaccountName;
        delete data.passwordConfirmation;
        data.displayName = data.displayName ? data.displayName.trim() : '';

        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .post(`/${baseAPIPath}/{exchange}/account`, {
              rootPath: 'apiv6',
              urlParams: {
                exchange: serviceName,
              },
              data,
            }))
          .then((result) => {
            this.resetAccounts();
            this.resetTasks();
            return result;
          });
      }

      getOrderList(serviceName) {
        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/accounts/orders', {
              rootPath: '2api',
              urlParams: {
                exchange: serviceName,
              },
              params: {
                isMXPlan,
              },
            }));
      }

      orderAccounts(serviceName, accountsToAdd) {
        // From play to apiv6
        const data = angular.copy(accountsToAdd);
        data.number = data.accountsNumber;
        delete data.accountsNumber;
        const { duration } = data;
        delete data.duration;
        delete data.accountLicense;

        return this.OvhHttp
          .post('/order/email/pro/{exchange}/account/{duration}', {
            rootPath: 'apiv6',
            urlParams: {
              exchange: serviceName,
              duration,
            },
            data,
          })
          .then((result) => {
            this.resetAccounts();
            this.resetTasks();
            return result;
          });
      }

      updatePassword(baseAPIPath, serviceName, accountEmailAddress, password, index = 0) {
        if (index > 10) {
          return this.$q.reject({
            message: this.$translate.instant('emailpro_ACTION_update_account_timeout', { accountEmailAddress }),
            type: 'error',
          });
        }

        return this.OvhHttp
          .post(`/${baseAPIPath}/{exchange}/account/{primaryEmailAddress}/changePassword`, {
            rootPath: 'apiv6',
            urlParams: {
              exchange: serviceName,
              primaryEmailAddress: accountEmailAddress,
            },
            data: {
              password,
            },
          })
          .catch(() => this.$timeout(1000)
            .then(() => this.updatePassword(
              baseAPIPath,
              serviceName,
              accountEmailAddress,
              password,
              index + 1,
            )));
      }

      updateAccount(serviceName, account) {
        const accountToUpdate = angular.copy(account);
        accountToUpdate.outlookLicense = accountToUpdate.outlook;
        delete accountToUpdate.outlook;
        accountToUpdate.deleteOutlookAtExpiration = accountToUpdate.deleteOutlook;
        delete accountToUpdate.deleteOutlook;

        accountToUpdate.displayName = account.displayName ? account.displayName.trim() : undefined;
        const { password } = accountToUpdate;
        delete accountToUpdate.password;
        if (accountToUpdate.accountLicense) {
          accountToUpdate.accountLicense = _.camelCase(accountToUpdate.accountLicense);
        }

        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .put(`/${baseAPIPath}/{exchange}/account/{primaryEmailAddress}`, {
              rootPath: 'apiv6',
              urlParams: {
                exchange: serviceName,
                primaryEmailAddress: account.primaryEmailAddress,
              },
              data: accountToUpdate,
            })
            .then(() => (_.isEmpty(password)
              ? this.$q.when()
              : this.updatePassword(
                baseAPIPath,
                serviceName,
                `${accountToUpdate.login}@${account.domain}`,
                password,
              )
            )))
          .finally(() => {
            this.resetAccounts();
            this.resetTasks();
          });
      }

      updateRenew(serviceName, accounts) {
        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .put('/sws/emailpro/{exchange}/accounts/renew', {
              rootPath: '2api',
              urlParams: {
                exchange: serviceName,
              },
              data: {
                modelList: accounts,
                isMXPlan,
              },
            }));
      }

      /**
       * Delete account
       */
      removeAccount(serviceName, primaryEmail) {
        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .delete(`/${baseAPIPath}/{exchange}/account/{primaryEmailAddress}`, {
              rootPath: 'apiv6',
              urlParams: {
                exchange: serviceName,
                primaryEmailAddress: primaryEmail,
              },
            }))
          .then((data) => {
            this.resetAccounts();
            this.resetTasks();
            return data;
          });
      }

      /**
       * Get EmailPro accounts delegation rights
       */
      getAccountDelegationRight(serviceName, account, pageSizeParam,
        offsetParam, searchParam) {
        const pageSize = pageSizeParam !== undefined ? pageSizeParam : 10;
        const offset = offsetParam || 0;
        const search = searchParam || undefined;

        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/accounts/{account}/rights', {
              rootPath: '2api',
              urlParams: {
                exchange: serviceName,
                account,
              },
              params: {
                count: pageSize,
                offset,
                search,
                isMXPlan,
              },
            }));
      }

      /**
   * Set EmailPro accounts delegation rights
   */
      updateAccountDelegationRights(serviceName, model) {
        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .post('/sws/emailpro/{exchange}/accounts/{account}/rights-update', {
              rootPath: '2api',
              urlParams: {
                exchange: serviceName,
                account: model.account,
              },
              data: {
                sendRights: model.sendRights,
                fullAccessRights: model.fullAccessRights,
                sendOnBehalfRights: model.sendOnBehalfToRights,
                isMXPlan,
              },
            }))
          .then((response) => {
            this.resetDelegationRights();
            this.resetTasks();

            return response;
          });
      }

      /**
   * Get EmailPro accounts aliases
   */
      getAliases(serviceName, account, pageSizeParam, offsetParam) {
        const pageSize = pageSizeParam !== undefined ? pageSizeParam : 10;
        const offset = offsetParam || 0;

        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/accounts/{account}/alias', {
              rootPath: '2api',
              urlParams: {
                exchange: serviceName,
                account,
              },
              params: {
                count: pageSize,
                offset,
                isMXPlan,
              },
            }));
      }

      /**
   * Data necessary for new alias creation
   */
      getNewAliasOptions(serviceName, emailParam, type) {
        const email = emailParam || null;

        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/aliasOptions', {
              rootPath: '2api',
              urlParams: {
                exchange: serviceName,
              },
              params: {
                emailAddress: email,
                subType: type,
                isMXPlan,
              },
            }))
          .then((data) => {
            this.resetCache();
            return data;
          });
      }

      /**
   * Add an account alias
   */
      addAlias(serviceName, account, aliasModel) {
        const completeAlias = `${aliasModel.alias}@${aliasModel.domain.name}`;

        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .post(`/${baseAPIPath}/{exchange}/account/{primaryEmailAddress}/alias`, {
              rootPath: 'apiv6',
              urlParams: {
                exchange: serviceName,
                primaryEmailAddress: account,
              },
              data: {
                alias: completeAlias,
              },
            }))
          .then((data) => {
            this.resetAccounts();
            this.resetTasks();
            _.set(data, 'displayName', completeAlias);
            return data;
          });
      }

      /**
   * Delete an account alias
   */
      deleteAlias(serviceName, account, alias) {
        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .delete(`/${baseAPIPath}/{exchange}/account/{primaryEmailAddress}/alias/{alias}`, {
              rootPath: 'apiv6',
              urlParams: {
                exchange: serviceName,
                primaryEmailAddress: account,
                alias,
              },
            }))
          .then((data) => {
            this.resetAccounts();
            this.resetTasks();
            _.set(data, 'displayName', alias);
            return data;
          });
      }

      /**
   * Get groups this EmailPro account belongs to
   */
      getGroups(serviceName, pageSizeParam, offsetParam, searchParam) {
        const pageSize = pageSizeParam !== undefined ? pageSizeParam : 10;
        const offset = offsetParam || 0;
        const search = searchParam || undefined;

        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/groups', {
              rootPath: '2api',
              clearCache: true,
              urlParams: {
                exchange: serviceName,
              },
              params: {
                count: pageSize,
                offset,
                search,
                isMXPlan,
              },
            }));
      }

      /**
   * Get EmailPro mailing list delegation rights
   */
      getMailingListDelegationRights(serviceName, mailinglist,
        pageSizeParam, offsetParam, searchParam) {
        const pageSize = pageSizeParam !== undefined ? pageSizeParam : 10;
        const offset = offsetParam || 0;
        const search = searchParam || undefined;

        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/groups/{mailinglist}/rights', {
              rootPath: '2api',
              clearCache: true,
              urlParams: {
                exchange: serviceName,
                mailinglist,
              },
              params: {
                count: pageSize,
                offset,
                search,
                isMXPlan,
              },
            }));
      }

      /**
   * Set EmailPro mailing list delegation rights
   */
      updateMailingListDelegationRights(serviceName, model) {
        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .put('/sws/emailpro/{exchange}/groups/{mailinglist}/rights-update', {
              rootPath: '2api',
              clearCache: true,
              urlParams: {
                exchange: serviceName,
                mailinglist: model.account,
              },
              data: {
                sendRights: model.sendRights,
                sendOnBehalfRights: model.sendOnBehalfToRights,
                isMXPlan,
              },
            }))
          .then((response) => {
            this.resetDelegationRights();
            this.resetTasks();
            return response;
          });
      }

      /**
   * Delete an EmailPro mailing list (group)
   */
      deleteGroup(serviceName, groupName) {
        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .delete(`/${baseAPIPath}/{exchange}/mailingList/{mailingListAddress}`, {
              rootPath: 'apiv6',
              urlParams: {
                exchange: serviceName,
                mailingListAddress: groupName,
              },
            }))
          .then((data) => {
            this.resetGroups();
            this.resetTasks();
            return data;
          });
      }

      /**
   * Data options for new group creation
   */
      getNewGroupOptions(serviceName) {
        return this.$q
          .all({
            models: this.getModels(),
            options: this.gettingBaseAPIPath()
              .then(baseAPIPath => this.OvhHttp
                .get(`/${baseAPIPath}/{exchange}/domain`, {
                  rootPath: 'apiv6',
                  urlParams: {
                    exchange: serviceName,
                  },
                  params: {
                    state: 'ok',
                  },
                })),
          })
          .then(data => ({
            availableDepartRestrictions: data.models['email.exchange.MailingListDepartRestrictionEnum'].enum.map(m => _.snakeCase(m).toUpperCase()),
            availableDomains: data.options.map(domain => ({
              name: domain,
              displayName: punycode.toUnicode(domain),
              formattedName: punycode.toUnicode(domain),
            })),
            availableJoinRestrictions: data.models['email.exchange.MailingListJoinRestrictionEnum'].enum.map(m => _.snakeCase(m).toUpperCase()),
          }));
      }

      /**
   * Get accounts by group
   */
      getAccountsByGroup(serviceName, groupName, pageSizeParam,
        offsetParam, searchParam) {
        const pageSize = pageSizeParam !== undefined ? pageSizeParam : 10;
        const offset = offsetParam || 0;
        const search = searchParam || undefined;

        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/groups/{mailinglist}/accounts', {
              rootPath: '2api',
              clearCache: true,
              urlParams: {
                exchange: serviceName,
                mailinglist: groupName,
              },
              params: {
                count: pageSize,
                offset,
                search,
                isMXPlan,
              },
            }));
      }

      retrievingAssociatedDomainName(serviceName) {
        return this.OvhHttp
          .get(`/email/mxplan/${serviceName}/domain`, {
            rootPath: 'apiv6',
          })
          .then(([associatedDomainName]) => associatedDomainName);
      }

      /**
   * Get managers by group
   */
      getManagersByGroup(serviceName, groupName, pageSizeParam,
        offsetParam, searchParam) {
        const pageSize = pageSizeParam !== undefined ? pageSizeParam : 10;
        const offset = offsetParam || 0;
        const search = searchParam || undefined;

        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/groups/{mailinglist}/managers', {
              rootPath: '2api',
              clearCache: true,
              urlParams: {
                exchange: serviceName,
                mailinglist: groupName,
              },
              params: {
                count: pageSize,
                offset,
                search,
                isMXPlan,
              },
            }));
      }

      /**
   * Get managers by group
   */
      getMembersByGroup(serviceName, groupName, pageSizeParam,
        offsetParam, searchParam) {
        const pageSize = pageSizeParam !== undefined ? pageSizeParam : 10;
        const offset = offsetParam || 0;
        const search = searchParam || undefined;

        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/groups/{mailinglist}/members', {
              rootPath: '2api',
              clearCache: true,
              urlParams: {
                exchange: serviceName,
                mailinglist: groupName,
              },
              params: {
                count: pageSize,
                offset,
                search,
                isMXPlan,
              },
            }));
      }

      /**
   * Remove an EmailPro group manager
   */
      removeManager(serviceName, groupName, accountId) {
        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .delete(`/${baseAPIPath}/{exchange}/mailingList/{mailingListAddress}/manager/account/{managerAccountId}`, {
              rootPath: 'apiv6',
              urlParams: {
                exchange: serviceName,
                mailingListAddress: groupName,
                managerAccountId: accountId,
              },
            }))
          .then((data) => {
            this.resetGroups();
            this.resetTasks();
            return data;
          });
      }

      /**
   * Remove an EmailPro group member
   */
      removeMember(serviceName, groupName, accountId, type) {
        return this.gettingBaseAPIPath()
          .then((baseAPIPath) => {
            let url = `/${baseAPIPath}/{exchange}/mailingList/{mailingListAddress}/member`;

            switch (type) {
              case 'ACCOUNT':
                url += '/account/{accountId}';
                break;
              case 'CONTACT':
                url += '/contact/{accountId}';
                break;
              default:
            }

            return this.OvhHttp
              .delete(url, {
                rootPath: 'apiv6',
                urlParams: {
                  exchange: serviceName,
                  mailingListAddress: groupName,
                  accountId,
                },
              })
              .then((data) => {
                this.resetGroups();
                this.resetTasks();
                return data;
              });
          });
      }

      /**
   * Get group aliases
   */
      getGroupAliasList(serviceName, groupName, pageSizeParam, offsetParam) {
        const pageSize = pageSizeParam !== undefined ? pageSizeParam : 10;
        const offset = offsetParam || 0;

        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/group/{group}/alias', {
              rootPath: '2api',
              urlParams: {
                exchange: serviceName,
                mailingListAddress: groupName,
                group: groupName,
              },
              params: {
                count: pageSize,
                offset,
                isMXPlan,
              },
            }));
      }

      /**
   * Add a group alias
   */
      addGroupAlias(serviceName, groupName, aliasModel) {
        const completeAlias = `${aliasModel.alias}@${aliasModel.domain.name}`;
        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .post(`/${baseAPIPath}/{exchange}/mailingList/{mailingListAddress}/alias`, {
              rootPath: 'apiv6',
              urlParams: {
                exchange: serviceName,
                mailingListAddress: groupName,
              },
              data: {
                alias: completeAlias,
              },
            }))
          .then((data) => {
            this.resetGroups();
            this.resetTasks();
            return data;
          });
      }

      /**
   * Delete a group alias
   */
      deleteGroupAlias(serviceName, groupName, alias) {
        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .delete(`/${baseAPIPath}/{exchange}/mailingList/{mailingListAddress}/alias/{alias}`, {
              rootPath: 'apiv6',
              urlParams: {
                exchange: serviceName,
                mailingListAddress: groupName,
                alias,
              },
            }))
          .then((data) => {
            this.resetGroups();
            this.resetTasks();
            return data;
          });
      }

      /**
   * Return disclaimers list for a given EmailPro service
   */
      getDisclaimers(serviceName, pageSizeParam, offsetParam) {
        const pageSize = pageSizeParam || 10;
        const offset = offsetParam || 0;

        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/disclaimers', {
              rootPath: '2api',
              urlParams: {
                exchange: serviceName,
              },
              params: {
                count: pageSize,
                offset,
                isMXPlan,
              },
            }));
      }

      /**
   * Return new disclaimer options
   */
      getNewDisclaimerOptions(serviceName) {
        return this.gettingIsServiceMXPlan()
          .then(isMXPlan => this.OvhHttp
            .get('/sws/emailpro/{exchange}/disclaimers/new/options', {
              rootPath: '2api',
              urlParams: {
                exchange: serviceName,
              },
              params: {
                isMXPlan,
              },
            }));
      }

      /**
   * Return update disclaimer options
   */
      getUpdateDisclaimerOptions() {
        return this.$q.when({
          availableDomains: [],
          availableAttributes: [
            'City',
            'Country',
            'Department',
            'DisplayName',
            'Email',
            'FaxNumber',
            'FirstName',
            'HomePhoneNumber',
            'Initials',
            'LastName',
            'MobileNumber',
            'Office',
            'PhoneNumber',
            'Street',
            'ZipCode',
          ],
        });
      }

      /**
   * Save an EmailPro disclaimer
   */
      saveDisclaimer(serviceName, model) {
        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .post(`/${baseAPIPath}/{exchange}/domain/{domainName}/disclaimer`, {
              rootPath: 'apiv6',
              urlParams: {
                exchange: serviceName,
                domainName: model.domain,
              },
              data: {
                content: model.content,
                outsideOnly: model.externalEmailsOnly,
              },
            }))
          .then((data) => {
            this.resetDisclaimers();
            this.resetTasks();
            return data;
          });
      }

      /**
   * Save an EmailPro disclaimer
   */
      updateDisclaimer(serviceName, model) {
        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .put(`/${baseAPIPath}/{exchange}/domain/{domainName}/disclaimer`, {
              rootPath: 'apiv6',
              urlParams: {
                exchange: serviceName,
                domainName: model.domain,
              },
              data: {
                content: model.content,
                outsideOnly: model.externalEmailsOnly,
              },
            }))
          .then((data) => {
            this.resetDisclaimers();
            this.resetTasks();
            return data;
          });
      }

      /**
   * Delete an EmailPro mailing list (group)
   */
      deleteDisclaimer(serviceName, domain) {
        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .delete(`/${baseAPIPath}/{exchange}/domain/{domainName}/disclaimer`, {
              rootPath: 'apiv6',
              urlParams: {
                exchange: serviceName,
                domainName: domain,
              },
            }))
          .then((data) => {
            this.resetDisclaimers();
            this.resetTasks();
            return data;
          });
      }

      /**
   * Get exchange license history
   */
      getEmailProLicenseHistory(serviceName, period) {
        let fromDate = moment();
        switch (period) {
          case 'LASTWEEK':
            fromDate = moment().subtract(1, 'weeks');
            break;
          case 'LASTMONTH':
            fromDate = moment().subtract(1, 'months');
            break;
          case 'LAST3MONTHS':
            fromDate = moment().subtract(3, 'months');
            break;
          case 'LASTYEAR':
            fromDate = moment().subtract(1, 'year');
            break;
          default:
        }

        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .get(`/${baseAPIPath}/{exchange}/license`, {
              rootPath: 'apiv6',
              urlParams: {
                exchange: serviceName,
              },
              params: {
                fromDate: fromDate.toDate(),
                toDate: new Date(),
              },
            }))
          .then((data) => {
            const series = [];
            const outlookSerie = {
              name: 'outlook',
              data: [],
            };

            data.forEach((d) => {
              outlookSerie.data.push({
                value: d.outlookQuantity,
                time: moment(d.date),
              });
            });

            outlookSerie.max = _.max(_.map(outlookSerie.data, 'value'));
            series.push(outlookSerie);

            ['basic', 'entreprise', 'standard'].forEach((currentLicense) => {
              data.forEach((d) => {
                const time = moment(d.date);
                let license = _.find(series, { name: currentLicense });
                let exists = true;
                if (!license) {
                  license = {
                    name: currentLicense,
                    typeee: currentLicense,
                    max: 0,
                    data: [],
                  };
                  exists = false;
                }

                d.accountLicense.forEach((accountLicense) => {
                  if (accountLicense.license === currentLicense) {
                    license.data.push({
                      value: accountLicense.licenseQuantity,
                      time,
                    });
                  }
                });

                license.max = _.max(_.map(license.data, 'value'));

                if (license.max > 0 && !exists) {
                  series.push(license);
                }
              });
            });

            const stats = {
              periods: ['LASTWEEK', 'LASTMONTH', 'LAST3MONTHS', 'LASTYEAR'],
              series,
            };

            return stats;
          });
      }

      /**
   * Update EmailPro resiliation conditions
   */
      updateDeleteAtExpiration(serviceName, renewType) {
        return this.gettingIsServiceMXPlan()
          .then((isMXPlan) => {
            Object.assign(renewType, { isMXPlan });

            return this.OvhHttp
              .put('/sws/emailpro/{exchange}/deleteAtExpiration', {
                rootPath: '2api',
                urlParams: {
                  exchange: serviceName,
                },
                data: renewType,
              });
          })
          .then((response) => {
            this.exchangeCache.removeAll();
            this.$rootScope.$broadcast('emailpro.dashboard.refresh');
            this.resetAccounts();
            this.resetTasks();

            return response;
          });
      }

      prepareForCsv(serviceName, opts, offset, timeout) {
        const queue = [];
        const self = this;

        return this.getAccounts(
          serviceName,
          opts.count,
          offset,
          opts.search,
          false,
          opts.filter,
          timeout,
        )
          .then((accounts) => {
            angular.forEach(accounts.list.results, (account) => {
              if (account.aliases > 0) {
                _.set(account, 'aliases', []);
                queue.push(self
                  .getAliases(
                    serviceName,
                    account.primaryEmailAddress,
                    self.aliasMaxLimit,
                  )
                  .then((aliases) => {
                    angular.forEach(aliases.list.results, (alias) => {
                      account.aliases.push(alias.displayName);
                    });
                  }));
              } else {
                _.set(account, 'aliases', []);
              }
            });

            return this.$q
              .all(queue)
              .then(() => ({
                accounts: accounts.list.results,
                headers: _.keys(accounts.list.results[0]),
              }))
              .catch(() => null);
          })
          .catch(() => null);
      }

      getAccountIds(opts) {
        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .get(`/${baseAPIPath}/{exchangeService}/account`, {
              rootPath: 'apiv6',
              urlParams: {
                exchangeService: opts.exchangeService,
              },
              params: opts.params,
            }));
      }

      getAccount(opts) {
        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .get(`/${baseAPIPath}/{exchangeService}/account/{primaryEmailAddress}`, {
              rootPath: 'apiv6',
              urlParams: {
                exchangeService: opts.exchangeService,
                primaryEmailAddress: opts.primaryEmailAddress,
              },
            }));
      }

      getAliasIds(opts) {
        return this.gettingBaseAPIPath()
          .then(baseAPIPath => this.OvhHttp
            .get(`/${baseAPIPath}/{exchangeService}/account/{primaryEmailAddress}/alias`, {
              rootPath: 'apiv6',
              urlParams: {
                exchangeService: opts.exchangeService,
                primaryEmailAddress: opts.primaryEmailAddress,
              },
              params: opts.params,
            }));
      }

      /* eslint-disable class-methods-use-this */
      getLocalizedPrice(ovhSubsidiary, price, currencyCode) {
        return price.toLocaleString(ovhSubsidiary, { style: 'currency', currency: currencyCode });
      }
      /* eslint-enable class-methods-use-this */

      gettingIsServiceMXPlan() {
        return this.OvhHttp
          .get(
            `/email/pro/${this.$stateParams.productId}/billingMigrated`,
            {
              rootPath: 'apiv6',
            },
          )
          .then(() => false)
          .catch(() => true);
      }

      gettingBaseAPIPath() {
        return this.gettingIsServiceMXPlan()
          .then(serviceIsMXPlan => `email/${serviceIsMXPlan ? 'mxplan' : 'pro'}`);
      }
    },
  );
