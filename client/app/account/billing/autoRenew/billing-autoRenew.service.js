angular.module('Billing.services').service('BillingAutoRenew', [
  '$q',
  'OvhApiEmailExchange',
  'OvhHttp',
  function ($q, OvhApiEmailExchange, OvhHttp) {
    const AUTORENEW_CONTRACT_CA = 1752;
    const AUTORENEW_CONTRACT_WE = 1754;
    const AUTORENEW_CONTRACT_WS = 1755;
    const AUTORENEW_CONTRACT_QC = 1753;

    const nicRenewUrl = '/me/autorenew';
    const self = this;

    this.getAutorenewContractIds = () => [
      AUTORENEW_CONTRACT_CA,
      AUTORENEW_CONTRACT_WE,
      AUTORENEW_CONTRACT_WS,
      AUTORENEW_CONTRACT_QC,
    ];

    this.events = {
      AUTORENEW_CHANGED: 'billing.autorenew.changed',
    };

    /**
       * Get paginated auto renew list
       */
    this.getServices = (count, offset, search, type, renew, renewal, order, nicBilling) => OvhHttp.get('/billing/autorenew/services', {
      rootPath: '2api',
      params: {
        count,
        offset,
        search,
        type,
        renew,
        renewal,
        order,
        nicBilling,
      },
    });

    /**
       * Get services types
       */
    this.getServicesTypes = () => $q.when([
      'ALL_DOM',
      'CAAS_CONTAINERS',
      'CDN_DEDICATED',
      'CDN_WEBSITE',
      'CDN_WEBSTORAGE',
      'CLUSTER_HADOOP',
      'DBAAS_QUEUE',
      'DEDICATED_CEPH',
      'DEDICATED_NAS',
      'DEDICATED_NASHA',
      'DEDICATED_SERVER',
      'DEDICATED_HOUSING',
      'DEDICATED_CLOUD',
      'DESKAAS',
      'DOMAIN',
      'EMAIL_DOMAIN',
      'EMAIL_PRO',
      'HORIZONVIEW',
      'HOSTING_PRIVATE_DATABASE',
      'HOSTING_RESELLER',
      'HOSTING_WEB',
      'IP_LOADBALANCING',
      'IP_LOADBALANCER',
      'LICENCE_CLOUD_LINUX',
      'LICENCE_CPANEL',
      'LICENCE_DIRECT_ADMIN',
      'LICENCE_PLESK',
      'LICENCE_VIRTUOZZO',
      'LICENCE_WINDOWS',
      'LICENCE_WORKLIGHT',
      'LICENCE_OFFICE',
      'LICENCE_SQL_SERVER',
      'OVER_THE_BOX',
      'PAAS_DATABASE',
      'PAAS_MONITORING',
      'DBAAS_TIMESERIES',
      'DBAAS_LOGS',
      'ROUTER',
      'SAAS_CSP2',
      'TELEPHONY',
      'VPS',
      'XDSL',
      'EXCHANGE',
      'MIS',
      'SSL_GATEWAY',
      'METRICS',
      'VEEAM_CLOUD_CONNECT',
      'VEEAM_ENTERPRISE',
      'SHAREPOINT',
      'VIP',
    ]);

    /**
       * update service list
       */
    this.updateServices = updateList => OvhHttp.put('/sws/billing/autorenew/services/update', {
      rootPath: '2api',
      data: {
        updateList,
      },
    }).then((result) => {
      if (result.state === 'OK') {
        return result;
      }
      _.set(result, 'state', 'ERROR');
      return $q.reject(result);
    });

    this.getAutorenew = () => OvhHttp.get(nicRenewUrl, {
      rootPath: 'apiv6',
    });

    this.putAutorenew = renewParam => OvhHttp.put(nicRenewUrl, {
      rootPath: 'apiv6',
      data: renewParam,
      broadcast: self.events.AUTORENEW_CHANGED,
    });

    this.enableAutorenew = renewDay => OvhHttp.post(nicRenewUrl, {
      rootPath: 'apiv6',
      data: {
        renewDay,
      },
    });

    this.disableAutoRenewForDomains = () => OvhHttp.post('/me/manualDomainPayment', {
      rootPath: 'apiv6',
    });

    this.terminateHosting = serviceName => OvhHttp.post('/hosting/web/{hosting}/terminate', {
      rootPath: 'apiv6',
      urlParams: {
        hosting: serviceName,
      },
    });

    this.terminateEmail = serviceName => OvhHttp.post('/email/domain/{domain}/terminate', {
      rootPath: 'apiv6',
      urlParams: {
        domain: serviceName,
      },
    });

    this.terminateHostingPrivateDatabase = serviceName => OvhHttp.post('/hosting/privateDatabase/{serviceName}/terminate', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });

    this.getEmailInfos = serviceName => OvhHttp.get('/email/domain/{domain}', {
      rootPath: 'apiv6',
      urlParams: {
        domain: serviceName,
      },
    });

    this.getUserCertificates = () => OvhHttp.get('/me/certificates', {
      rootPath: 'apiv6',
    });

    this.getExchangeService = (organization, exchange) => (
      OvhApiEmailExchange.service().Aapi().get({
        organization,
        exchange,
      }).$promise
    );
  },
]);
