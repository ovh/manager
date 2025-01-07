import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';

export default class {
  /* @ngInject */
  /**
   * Constructor
   * @param $http
   * @param $q
   * @param OvhHttp
   */
  constructor($http, $q, OvhHttp, Poller) {
    this.$http = $http;
    this.$q = $q;
    this.OvhHttp = OvhHttp;
    this.Poller = Poller;

    this.cache = {
      emails: 'UNIVERS_WEB_EMAILS',
      models: 'UNIVERS_WEB_EMAILS_MODELS',
      accounts: 'UNIVERS_WEB_EMAILS_ACCOUNTS',
      acl: 'UNIVERS_WEB_EMAILS_ACL',
      dnsFilter: 'UNIVERS_WEB_DNS_FILTER',
      dnsMxRecords: 'UNIVERS_WEB_DNS_MX_RECORDS',
      works: 'UNIVERS_WEB_EMAILS_WORKS',
      delegation: 'UNIVERS_WEB_EMAILS_DELEGATION',
      delegated: 'UNIVERS_WEB_EMAILS_DELEGATED',
    };
  }

  /**
   * Get emails models
   */
  getModels() {
    return this.OvhHttp.get('/email/domain.json', {
      rootPath: 'apiv6',
      cache: this.cache.models,
    });
  }

  /**
   * Obtain all domains
   */
  getDomains() {
    return this.OvhHttp.get('/email/domain', {
      rootPath: 'apiv6',
      cache: this.cache.emails,
    });
  }

  /**
   * Obtain domain informations
   * @param {string} serviceName
   */
  getDomain(serviceName) {
    return this.OvhHttp.get(`/email/domain/${serviceName}`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Obtain recommended DNS records
   * @param {string} serviceName
   */
  getRecommendedDNSRecords(serviceName) {
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/recommendedDNSRecords`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Obtain serviceInfos
   * @param {string} serviceName
   */
  getServiceInfos(serviceName) {
    return this.OvhHttp.get(`/email/domain/${serviceName}/serviceInfos`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Obtain a list of available emails account
   * @param {string} serviceName
   * @param {object} opts
   */
  getEmails(serviceName, opts) {
    return this.OvhHttp.get(`/email/domain/${serviceName}/account`, {
      rootPath: 'apiv6',
      params: {
        accountName: opts.accountName,
      },
      clearCache: opts.forceRefresh,
    });
  }

  /**
   * Obtain a selected email account
   * @param {string} serviceName
   * @param {string} accountName
   */
  getEmail(serviceName, accountName) {
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/account/${accountName}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Get summary of this domain
   * @param {string} serviceName
   */
  getSummary(serviceName) {
    return this.OvhHttp.get(`/email/domain/${serviceName}/summary`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Obtain a list of current emails account tasks
   * @param {string} serviceName
   * @param {string} accountName
   */
  getEmailTasks(serviceName, accountName) {
    return this.OvhHttp.get(`/email/domain/${serviceName}/task/account`, {
      rootPath: 'apiv6',
      params: {
        name: accountName,
      },
    });
  }

  /**
   * Obtain space used by an email account
   * @param {string} serviceName
   * @param {string} accountName
   */
  getEmailUsage(serviceName, accountName) {
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/account/${accountName}/usage`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Update usage account information
   * @param {string} serviceName
   * @param {string} accountName
   */
  updateUsage(serviceName, accountName) {
    return this.OvhHttp.post(
      `/email/domain/${serviceName}/account/${accountName}/updateUsage`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Obtain dns filter
   * @param {string} serviceName
   */
  getDnsFilter(serviceName) {
    return this.OvhHttp.get(`/email/domain/${serviceName}/dnsMXFilter`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Set DNS filter
   * @param {string} serviceName
   * @param {object} data
   */
  setDnsFilter(serviceName, data) {
    return this.OvhHttp.post(`/email/domain/${serviceName}/changeDnsMXFilter`, {
      rootPath: 'apiv6',
      data,
      broadcast: 'domain.dashboard.refresh',
    });
  }

  /**
   * Obtain MX records
   * @param {string} serviceName
   */
  getMxRecords(serviceName) {
    return this.OvhHttp.get(`/email/domain/${serviceName}/dnsMXRecords`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Obtain quota
   * @param {string} serviceName
   */
  getQuotas(serviceName) {
    return this.OvhHttp.get(`/email/domain/${serviceName}/quota`, {
      rootPath: 'apiv6',
      cache: this.cache.quota,
    });
  }

  /**
   * Create a new account
   * @param {string} serviceName
   * @param {object} data
   */
  createAccount(serviceName, data) {
    return this.OvhHttp.post(`/email/domain/${serviceName}/account`, {
      rootPath: 'apiv6',
      data,
      broadcast: 'hosting.tabs.emails.refresh',
    });
  }

  /**
   * Update an account
   * @param {string} serviceName
   * @param {string} accountName
   * @param {object} data
   */
  updateAccount(serviceName, accountName, data) {
    return this.OvhHttp.put(
      `/email/domain/${serviceName}/account/${accountName}`,
      {
        rootPath: 'apiv6',
        data,
        broadcast: 'hosting.tabs.emails.refresh',
      },
    );
  }

  /**
   * Change password
   * @param {string} serviceName
   * @param {string} accountName
   * @param {object} data
   */
  changePasswordAccount(serviceName, accountName, data) {
    return this.OvhHttp.post(
      `/email/domain/${serviceName}/account/${accountName}/changePassword`,
      {
        rootPath: 'apiv6',
        data,
      },
    );
  }

  /**
   * Remove an account
   * @param {string} serviceName
   * @param {string} accountName
   */
  deleteAccount(serviceName, accountName) {
    return this.OvhHttp.delete(
      `/email/domain/${serviceName}/account/${accountName}`,
      {
        rootPath: 'apiv6',
        broadcast: 'hosting.tabs.emails.refresh',
      },
    );
  }

  /**
   * Obtain a list of available filters
   * @param {string} serviceName
   * @param {string} accountName
   */
  getFilters(serviceName, accountName) {
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/account/${accountName}/filter`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Get filter details
   * @param {string} serviceName
   * @param {string} accountName
   * @param {string} name
   */
  getFilter(serviceName, accountName, name) {
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/account/${accountName}/filter/${window.encodeURIComponent(
        name,
      )}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Create filter
   * @param {string} serviceName
   * @param {string} accountName
   * @param {object} filter
   * @param rules
   */
  createFilter(serviceName, accountName, filter, rules) {
    return this.OvhHttp.post(
      `/email/domain/${serviceName}/account/${accountName}/filter`,
      {
        rootPath: 'apiv6',
        data: filter,
        broadcast: 'hosting.tabs.emails.filters.refresh',
      },
    ).then(() =>
      this.createRules(serviceName, accountName, filter.name, rules),
    );
  }

  /**
   * Update filter
   * @param {string} serviceName
   * @param {string} accountName
   * @param {object} filter
   * @param rules
   */
  updateFilter(serviceName, accountName, filter, rules) {
    return this.deleteFilter(serviceName, accountName, filter.name).then(() =>
      this.createFilter(serviceName, accountName, filter, rules),
    );
  }

  /**
   * Delete filter
   * @param {string} serviceName
   * @param {string} accountName
   * @param {string} filterName
   */
  deleteFilter(serviceName, accountName, filterName) {
    return this.OvhHttp.delete(
      `/email/domain/${serviceName}/account/${accountName}/filter/${encodeURI(
        filterName,
      )}`,
      {
        rootPath: 'apiv6',
        broadcast: 'hosting.tabs.emails.filters.refresh',
      },
    );
  }

  /**
   * Active or deactive a filter
   * @param {string} serviceName
   * @param {string} accountName
   * @param {string} filterName
   * @param {object} data
   */
  changeFilterActivity(serviceName, accountName, filterName, data) {
    return this.OvhHttp.post(
      `/email/domain/${serviceName}/account/${accountName}/filter/${encodeURI(
        filterName,
      )}/changeActivity`,
      {
        rootPath: 'apiv6',
        data,
        broadcast: 'hosting.tabs.emails.filters.refresh',
      },
    );
  }

  /**
   * Change filter priority
   * @param {string} serviceName
   * @param {string} accountName
   * @param {string} filterName
   * @param {object} data
   */
  changeFilterPriority(serviceName, accountName, filterName, data) {
    return this.OvhHttp.post(
      `/email/domain/${serviceName}/account/${accountName}/filter/${encodeURI(
        filterName,
      )}/changePriority`,
      {
        rootPath: 'apiv6',
        data,
        broadcast: 'hosting.tabs.emails.filters.refresh',
      },
    );
  }

  /**
   * Create single rule
   * @param {string} serviceName
   * @param {string} accountName
   * @param {string} filterName
   * @param {object} data
   */
  createRule(serviceName, accountName, filterName, data) {
    return this.OvhHttp.post(
      `/email/domain/${serviceName}/account/${accountName}/filter/${encodeURI(
        filterName,
      )}/rule`,
      {
        rootPath: 'apiv6',
        data,
      },
    );
  }

  /**
   * Associated rules
   * @param {string} serviceName
   * @param {string} accountName
   * @param {string} filterName
   * @param rules
   */
  createRules(serviceName, accountName, filterName, rules) {
    return this.$q.all(
      rules.map((rule) =>
        this.createRule(serviceName, accountName, filterName, rule),
      ),
    );
  }

  /**
   * Get rules
   * @param {string} serviceName
   * @param {string} accountName
   * @param {string} filterName
   * @returns {Promise}
   */
  getRules(serviceName, accountName, filterName) {
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/account/${accountName}/filter/${encodeURI(
        filterName,
      )}/rule`,
      {
        rootPath: 'apiv6',
      },
    )
      .then((rulesId) =>
        this.$q.all(
          rulesId.map((id) =>
            this.getRule(serviceName, accountName, filterName, id),
          ),
        ),
      )
      .catch(() => []);
  }

  /**
   * Get rule by id
   * @param {string} serviceName
   * @param {string} accountName
   * @param {string} filterName
   * @param {string} id
   */
  getRule(serviceName, accountName, filterName, id) {
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/account/${accountName}/filter/${encodeURI(
        filterName,
      )}/rule/${id}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Delete all rules
   * @param {string} serviceName
   * @param {string} accountName
   * @param {string} filterName
   * @param rulesId
   * @returns {Promise}
   */
  deleteRules(serviceName, accountName, filterName, rulesId) {
    return this.$q
      .all(
        rulesId.map((id) =>
          this.deleteRule(serviceName, accountName, filterName, id),
        ),
      )
      .catch((data) => data);
  }

  /**
   * Delete single rule
   * @param {string} serviceName
   * @param {string} accountName
   * @param {string} filterName
   * @param {string} id
   */
  deleteRule(serviceName, accountName, filterName, id) {
    return this.OvhHttp.delete(
      `/email/domain/${serviceName}/account/${accountName}/filter/${encodeURI(
        filterName,
      )}/rule/${id}`,
      {
        rootPath: 'apiv6',
        broadcast: 'hosting.tabs.emails.filters.refresh',
      },
    );
  }

  /**
   * Obtain a list of available redirects
   * @param {string} serviceName
   * @param from
   */
  getRedirections(serviceName, from) {
    return this.OvhHttp.get(`/email/domain/${serviceName}/redirection`, {
      rootPath: 'apiv6',
      params: {
        from,
      },
    });
  }

  /**
   * Get redirection by id
   * @param {string} serviceName
   * @param {string} id
   */
  getRedirection(serviceName, id) {
    return this.OvhHttp.get(`/email/domain/${serviceName}/redirection/${id}`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Create redirection
   * @param {string} serviceName
   * @param {object} data
   */
  createRedirection(serviceName, data) {
    return this.OvhHttp.post(`/email/domain/${serviceName}/redirection`, {
      rootPath: 'apiv6',
      data,
      broadcast: 'hosting.tabs.emails.redirections.refresh',
    });
  }

  /**
   * Update redirection
   * @param {string} serviceName
   * @param {object} opts
   */
  updateRedirection(serviceName, opts) {
    return this.OvhHttp.post(
      `/email/domain/${serviceName}/redirection/${opts.id}/changeRedirection`,
      {
        rootPath: 'apiv6',
        data: opts.data,
        broadcast: 'hosting.tabs.emails.redirections.refresh',
      },
    );
  }

  /**
   * Delete redirection
   * @param {string} serviceName
   * @param {string} id
   */
  deleteRedirection(serviceName, id) {
    return this.OvhHttp.delete(
      `/email/domain/${serviceName}/redirection/${id}`,
      {
        rootPath: 'apiv6',
        broadcast: 'hosting.tabs.emails.redirections.refresh',
      },
    );
  }

  /**
   * Obtain a list of availables responders
   * @param {string} serviceName
   */
  getResponders(serviceName) {
    return this.OvhHttp.get(`/email/domain/${serviceName}/responder`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Get responder details
   * @param {string} serviceName
   * @param {string} accountName
   */
  getResponder(serviceName, accountName) {
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/responder/${accountName}`,
      {
        rootPath: 'apiv6',
      },
    ).catch((err) => ({ account: accountName, err }));
  }

  /**
   * Create responder
   * @param {string} serviceName
   * @param {object} data
   */
  createResponder(serviceName, data) {
    return this.OvhHttp.post(`/email/domain/${serviceName}/responder`, {
      rootPath: 'apiv6',
      data,
      broadcast: 'hosting.tabs.emails.responders.refresh',
    });
  }

  /**
   * Update responder
   * @param {string} serviceName
   * @param {string} accountName
   * @param {object} data
   */
  updateResponder(serviceName, accountName, data) {
    return this.OvhHttp.put(
      `/email/domain/${serviceName}/responder/${accountName}`,
      {
        rootPath: 'apiv6',
        data,
        broadcast: 'hosting.tabs.emails.responders.refresh',
      },
    );
  }

  /**
   * Delete responder
   * @param {string} serviceName
   * @param {string} accountName
   */
  deleteResponder(serviceName, accountName) {
    return this.OvhHttp.delete(
      `/email/domain/${serviceName}/responder/${accountName}`,
      {
        rootPath: 'apiv6',
        broadcast: 'hosting.tabs.emails.responders.refresh',
      },
    );
  }

  /**
   * Get responder ongoing tasks
   * @param {string} serviceName
   * @param {string} account
   */
  getResponderTasks(serviceName, account) {
    return this.OvhHttp.get(`/email/domain/${serviceName}/task/responder`, {
      rootPath: 'apiv6',
      params: {
        account,
      },
    });
  }

  /**
   * Poll responder tasks
   * @param {string} serviceName
   * @param {string} account
   */
  pollResponderTasks(serviceName, account) {
    return this.Poller.poll(
      `/email/domain/${serviceName}/task/responder`,
      {
        account,
      },
      {
        namespace: 'email.domain.email.responder',
        successRule: {
          state: (task) => !task,
        },
      },
    );
  }

  /**
   * Kill responder tasks polling
   */
  killPollResponderTasks() {
    this.Poller.kill({ namespace: 'email.domain.email.responder' });
  }

  /**
   * Obtain list of available ACL
   * @param {string} serviceName
   * @param {boolean} forceRefresh
   */
  getAcls(serviceName, forceRefresh) {
    return this.OvhHttp.get(`/email/domain/${serviceName}/acl`, {
      rootPath: 'apiv6',
      cache: this.cache.acl,
      clearAllCache: forceRefresh,
    });
  }

  /**
   * Create ACL
   * @param {string} serviceName
   * @param accountId
   */
  createAcl(serviceName, accountId) {
    return this.OvhHttp.post(`/email/domain/${serviceName}/acl`, {
      rootPath: 'apiv6',
      data: {
        accountId,
      },
      clearAllCache: this.cache.acl,
      broadcast: 'hosting.tabs.emails.acls.refresh',
    });
  }

  /**
   * Get ACL
   * @param {string} serviceName
   * @param {string} accountId
   */
  getAcl(serviceName, accountId) {
    return this.OvhHttp.get(`/email/domain/${serviceName}/acl/${accountId}`, {
      rootPath: 'apiv6',
    });
  }

  /**
   * Delete ACL
   * @param {string} serviceName
   * @param {string} accountId
   */
  deleteAcl(serviceName, accountId) {
    return this.OvhHttp.delete(
      `/email/domain/${serviceName}/acl/${accountId}`,
      {
        rootPath: 'apiv6',
        clearAllCache: this.cache.acl,
        broadcast: 'hosting.tabs.emails.acls.refresh',
      },
    );
  }

  /**
   * Get tasks
   * @param {string} serviceName
   * @returns {Promise}
   */
  getAllTaskIds(serviceName) {
    const actions = [
      'account',
      'filter',
      'mailinglist',
      'redirection',
      'responder',
    ];

    return this.$q.all(
      actions.map((action) =>
        this.OvhHttp.get(`/email/domain/${serviceName}/task/${action}`, {
          rootPath: 'apiv6',
        })
          .then((data) => ({
            action,
            ids: data,
          }))
          .catch((err) => this.$q.reject(err)),
      ),
    );
  }

  /**
   * Get task
   * @param {string} serviceName
   * @param {object} opts
   */
  getTask(serviceName, opts) {
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/task/${opts.action}/${opts.id}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Get delegation
   * @param {string} serviceName
   * @param {string} accountName
   */
  getDelegationList(serviceName, accountName) {
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/account/${accountName}/delegation`,
      {
        rootPath: 'apiv6',
        cache: this.cache.delegation,
      },
    );
  }

  /**
   * Get unique delegation
   * @param {string} serviceName
   * @param {string} accountName
   * @param {string} accountId
   */
  getDelegation(serviceName, accountName, accountId) {
    return this.OvhHttp.get(
      `/email/domain/${serviceName}/account/${accountName}/delegation/${accountId}`,
      {
        rootPath: 'apiv6',
        cache: this.cache.delegation,
      },
    );
  }

  /**
   * Add delegation
   * @param {string} serviceName
   * @param {string} accountName
   * @param {string} accountId
   */
  addDelegation(serviceName, accountName, accountId) {
    return this.OvhHttp.post(
      `/email/domain/${serviceName}/account/${accountName}/delegation`,
      {
        rootPath: 'apiv6',
        data: {
          accountId,
        },
        clearAllCache: this.cache.delegation,
        broadcast: 'hosting.tabs.emails.delegation.refresh',
      },
    );
  }

  /**
   * Remove delegation
   * @param {string} serviceName
   * @param {string} accountName
   * @param {string} accountId
   */
  removeDelegation(serviceName, accountName, accountId) {
    return this.OvhHttp.delete(
      `/email/domain/${serviceName}/account/${accountName}/delegation/${accountId}`,
      {
        rootPath: 'apiv6',
        clearAllCache: this.cache.delegation,
        broadcast: 'hosting.tabs.emails.delegation.refresh',
      },
    );
  }

  /**
   * Obtain Emails delegation
   * @param {string|null} domain
   * @param {string|null} accountName
   */
  getDelegatedEmails(domain, accountName) {
    return this.OvhHttp.get('/email/domain/delegatedAccount', {
      rootPath: 'apiv6',
      params: {
        accountName,
        domain,
      },
    });
  }

  /**
   * Obtain delegated account from email
   * @param {string} email
   */
  getDelegatedEmail(email) {
    return this.OvhHttp.get(`/email/domain/delegatedAccount/${email}`, {
      rootPath: 'apiv6',
      cache: this.cache.delegated,
    });
  }

  /**
   * Update delegated account
   * @param {string} email
   * @param data
   */
  updateDelegatedAccount(email, data) {
    return this.OvhHttp.put(`/email/domain/delegatedAccount/${email}`, {
      rootPath: 'apiv6',
      data,
      broadcast: 'hosting.tabs.emails.delegate.refresh',
      clearAllCache: this.cache.delegated,
    });
  }

  /**
   * Change delegated account password
   * @param {string} email
   * @param {object} data
   */
  changePasswordDelegatedAccount(email, data) {
    return this.OvhHttp.post(
      `/email/domain/delegatedAccount/${email}/changePassword`,
      {
        rootPath: 'apiv6',
        data,
        clearAllCache: this.cache.delegated,
      },
    );
  }

  /**
   * Update delegated account usage
   * @param {string} email
   */
  updateDelegatedUsage(email) {
    return this.OvhHttp.post(
      `/email/domain/delegatedAccount/${email}/updateUsage`,
      {
        rootPath: 'apiv6',
        clearAllCache: this.cache.delegated,
      },
    );
  }

  /**
   * Get delegated account usage
   * @param {string} email
   */
  getEmailDelegatedUsage(email) {
    return this.OvhHttp.post(`/email/domain/delegatedAccount/${email}/usage`, {
      rootPath: 'apiv6',
      clearAllCache: this.cache.delegated,
    });
  }

  /**
   * Obtain a list of available delegated account filters
   * @param {string} accountName
   */
  getDelegatedFilters(accountName) {
    return this.OvhHttp.get(
      `/email/domain/delegatedAccount/${accountName}/filter`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Get delegated account filter details
   * @param {string} accountName
   * @param {string} filterName
   */
  getDelegatedFilter(accountName, filterName) {
    return this.OvhHttp.get(
      `/email/domain/delegatedAccount/${accountName}/filter/${encodeURI(
        filterName,
      )}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Create delegated account filter
   * @param {string} accountName
   * @param filter
   * @param rules
   * @returns {Promise}
   */
  createDelegatedFilter(accountName, filter, rules) {
    return this.OvhHttp.post(
      `/email/domain/delegatedAccount/${accountName}/filter`,
      {
        rootPath: 'apiv6',
        data: filter,
        broadcast: 'hosting.tabs.emails.delegatedFilters.refresh',
      },
    ).then(() => this.createDelegatedRules(accountName, filter.name, rules));
  }

  /**
   * Update delegated account filter
   * @param {string} accountName
   * @param filter
   * @param rules
   * @returns {Promise}
   */
  updateDelegatedFilter(accountName, filter, rules) {
    return this.deleteDelegatedFilter(accountName, filter.name).then(() =>
      this.createDelegatedFilter(accountName, filter, rules),
    );
  }

  /**
   * Delete delegated account filter
   * @param {string} accountName
   * @param {string} filterName
   */
  deleteDelegatedFilter(accountName, filterName) {
    return this.OvhHttp.delete(
      `/email/domain/delegatedAccount/${accountName}/filter/${encodeURI(
        filterName,
      )}`,
      {
        rootPath: 'apiv6',
        broadcast: 'hosting.tabs.emails.delegatedFilters.refresh',
      },
    );
  }

  /**
   * Active or deactive a delegated account filter
   * @param {string} accountName
   * @param {string} filterName
   * @param data
   */
  changeDelegatedFilterActivity(accountName, filterName, data) {
    return this.OvhHttp.post(
      `/email/domain/delegatedAccount/${accountName}/filter/${encodeURI(
        filterName,
      )}/changeActivity`,
      {
        rootPath: 'apiv6',
        data,
        broadcast: 'hosting.tabs.emails.delegatedFilters.refresh',
      },
    );
  }

  /**
   * Change delegated account filter priority
   * @param {string} accountName
   * @param {string} filterName
   * @param data
   */
  changeDelegatedFilterPriority(accountName, filterName, data) {
    return this.OvhHttp.post(
      `/email/domain/delegatedAccount/${accountName}/filter/${encodeURI(
        filterName,
      )}/changePriority`,
      {
        rootPath: 'apiv6',
        data,
        broadcast: 'hosting.tabs.emails.delegatedFilters.refresh',
      },
    );
  }

  /**
   * Create delegated account rule
   * @param {string} accountName
   * @param {string} filterName
   * @param data
   */
  createDelegatedRule(accountName, filterName, data) {
    return this.OvhHttp.post(
      `/email/domain/delegatedAccount/${accountName}/filter/${encodeURI(
        filterName,
      )}/rule`,
      {
        rootPath: 'apiv6',
        data,
      },
    );
  }

  /**
   * Create delegated account associated rules
   * @param {string} accountName
   * @param {string} filterName
   * @param {array} rules
   * @returns {Promise}
   */
  createDelegatedRules(accountName, filterName, rules) {
    return this.$q.all(
      rules.map((rule) =>
        this.OvhHttp.post(
          `/email/domain/delegatedAccount/${accountName}/filter/${encodeURI(
            filterName,
          )}/rule`,
          {
            rootPath: 'apiv6',
            data: {
              operand: rule.operand,
              value: rule.value,
              header: rule.header,
            },
          },
        ),
      ),
    );
  }

  /**
   * Get all rules from delegated account
   * @param {string} accountName
   * @param {string} filterName
   * @returns {Promise}
   */
  getDelegatedRules(accountName, filterName) {
    return this.OvhHttp.get(
      `/email/domain/delegatedAccount/${accountName}/filter/${encodeURI(
        filterName,
      )}/rule`,
      {
        rootPath: 'apiv6',
      },
    )
      .then((rulesId) =>
        this.$q.all(
          rulesId.map((id) =>
            this.getDelegatedRule(accountName, filterName, id),
          ),
        ),
      )
      .catch(() => []);
  }

  /**
   * Get rule from delegated account
   * @param {string} accountName
   * @param {string} filterName
   * @param {string} id
   */
  getDelegatedRule(accountName, filterName, id) {
    return this.OvhHttp.get(
      `/email/domain/delegatedAccount/${accountName}/filter/${encodeURI(
        filterName,
      )}/rule/${id}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Delete all rules form delegated account
   * @param {string} accountName
   * @param {string} filterName
   * @param {array} rulesId
   */
  deleteDelegatedRules(accountName, filterName, rulesId) {
    return this.$q.all(
      rulesId.map((id) =>
        this.deleteDelegatedRule(accountName, filterName, id),
      ),
    );
  }

  /**
   * Delete rule from delegated account
   * @param {string} accountName
   * @param {string} filterName
   * @param {string} id
   */
  deleteDelegatedRule(accountName, filterName, id) {
    return this.OvhHttp.delete(
      `/email/domain/delegatedAccount/${accountName}/filter/${encodeURI(
        filterName,
      )}/rule/${id}`,
      {
        rootPath: 'apiv6',
        broadcast: 'hosting.tabs.emails.delegatedFilters.refresh',
      },
    );
  }

  /**
   * Get a delegated responder
   * @param {string} email
   */
  getDelegatedResponder(email) {
    return this.OvhHttp.get(
      `/email/domain/delegatedAccount/${email}/responder`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Create responder
   * @param {string} email
   * @param {object} data
   */
  createDelegatedResponder(email, data) {
    return this.OvhHttp.post(
      `/email/domain/delegatedAccount/${email}/responder`,
      {
        rootPath: 'apiv6',
        data,
        broadcast: 'hosting.tabs.delegate.responders.refresh',
      },
    );
  }

  /**
   * Update responder
   * @param {string} email
   * @param {object} data
   */
  updateDelegatedResponder(email, data) {
    return this.OvhHttp.put(
      `/email/domain/delegatedAccount/${email}/responder`,
      {
        rootPath: 'apiv6',
        data,
        broadcast: 'hosting.tabs.delegate.responders.refresh',
      },
    );
  }

  /**
   * Delete responder
   * @param {string} email
   */
  deleteDelegatedResponder(email) {
    return this.OvhHttp.delete(
      `/email/domain/delegatedAccount/${email}/responder`,
      {
        rootPath: 'apiv6',
        broadcast: 'hosting.tabs.delegate.responders.refresh',
      },
    );
  }

  /**
   * Obtain a list of available services
   * @param {string} domain
   * @param {string} accountName
   * @param {string} type
   */
  getDestinationServices(domain, accountName, type) {
    return this.OvhHttp.get(
      `/email/domain/${domain}/account/${accountName}/migrate`,
      {
        rootPath: 'apiv6',
        params: { type },
      },
    );
  }

  /**
   * Get migration service details
   * @param {string} domain
   * @param {string} accountName
   * @param {string} destinationServiceName
   */
  getDestinationService(domain, accountName, destinationServiceName) {
    return this.OvhHttp.get(
      `/email/domain/${domain}/account/${accountName}/migrate/${destinationServiceName}`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Obtain a list of email address available for migration
   * @param {string} domain
   * @param {string} accountName
   * @param {string} destinationServiceName
   */
  getDestinationEmailAddresses(domain, accountName, destinationServiceName) {
    return this.OvhHttp.get(
      `/email/domain/${domain}/account/${accountName}/migrate/${destinationServiceName}/destinationEmailAddress`,
      {
        rootPath: 'apiv6',
      },
    );
  }

  /**
   * Check if it's possible to migrate
   * @param {string} domain
   * @param {string} accountName
   * @param {string} destinationServiceName
   * @param {string} destinationEmailAddress
   */
  checkMigrate(
    domain,
    accountName,
    destinationServiceName,
    destinationEmailAddress,
  ) {
    return this.OvhHttp.get(
      `/email/domain/${domain}/account/${accountName}/migrate/${destinationServiceName}/destinationEmailAddress/${destinationEmailAddress}/checkMigrate`,
      {
        rootPath: 'apiv6',
      },
    ).then((data) => {
      // error codes are returned in success
      if (isArray(data.error) && !isEmpty(data.error)) {
        throw data.error;
      }

      return data;
    });
  }

  /**
   * Migrate account to destination account
   * @param {string} domain
   * @param {string} accountName
   * @param {string} destinationServiceName
   * @param {string} destinationEmailAddress
   * @param {password} password
   */
  migrateAccountToDestinationAccount(
    domain,
    accountName,
    destinationServiceName,
    destinationEmailAddress,
    password,
  ) {
    return this.OvhHttp.post(
      `/email/domain/${domain}/account/${accountName}/migrate/${destinationServiceName}/destinationEmailAddress/${destinationEmailAddress}/migrate`,
      {
        rootPath: 'apiv6',
        data: { password },
      },
    );
  }

  /**
   * Get dkim informations
   * @param {string} domain
   */
  getDkim(domain) {
    return this.$http
      .get(`/email/domain/${domain}/dkim`)
      .then(({ data }) => data);
  }

  /**
   * Enable dkim
   * @param {string} domain
   */
  enableDkim(domain) {
    return this.$http
      .put(`/email/domain/${domain}/dkim/enable`)
      .then(({ data }) => data);
  }

  /**
   * Disable dkim
   * @param {string} domain
   */
  disableDkim(domain) {
    return this.$http
      .put(`/email/domain/${domain}/dkim/disable`)
      .then(({ data }) => data);
  }
}
