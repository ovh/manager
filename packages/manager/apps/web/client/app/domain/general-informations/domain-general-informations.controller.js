import find from 'lodash/find';
import flattenDeep from 'lodash/flattenDeep';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import last from 'lodash/last';
import map from 'lodash/map';
import maxBy from 'lodash/maxBy';
import reduce from 'lodash/reduce';
import some from 'lodash/some';

import {
  DNSSEC_STATUS,
  OWNER_CHANGE_URL,
  PRODUCT_TYPE,
  PROTECTION_TYPES,
} from './general-information.constants';

export default class DomainTabGeneralInformationsCtrl {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $scope,
    $state,
    $stateParams,
    $translate,
    Alerter,
    constants,
    dnsAvailableOptions,
    Domain,
    enableWebhostingLink,
    Hosting,
    HostingDomain,
    isStart10mAvailable,
    OvhApiDomainRules,
    OvhApiScreenshot,
    RedirectionService,
    User,
    WucAllDom,
    DOMAIN,
    goToDnsAnycast,
    CORE_MANAGER_URLS,
  ) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucAllDom = WucAllDom;
    this.dnsAvailableOptions = dnsAvailableOptions;
    this.Domain = Domain;
    this.enableWebhostingLink = enableWebhostingLink;
    this.Hosting = Hosting;
    this.HostingDomain = HostingDomain;
    this.isStart10mAvailable = isStart10mAvailable;
    this.OvhApiDomainRules = OvhApiDomainRules;
    this.OvhApiScreenshot = OvhApiScreenshot.Aapi();
    this.RedirectionService = RedirectionService;
    this.User = User;
    this.constants = constants;
    this.DOMAIN = DOMAIN;
    this.goToDnsAnycast = goToDnsAnycast;
    this.CORE_MANAGER_URLS = CORE_MANAGER_URLS;
  }

  $onInit() {
    this.domain = this.$scope.ctrlDomain.domain;
    this.domainInfos = this.$scope.ctrlDomain.domainInfos;
    this.allDom = this.$scope.ctrlDomain.allDom;
    this.allDomInfos = this.$scope.ctrlDomain.allDomInfos;
    this.associatedHostings = this.$scope.ctrlDomain.associatedHostings;
    this.orderedHosting = this.$scope.ctrlDomain.orderedHosting;
    this.displayFreeHosting = false;
    this.domainUnlockRegistry = this.constants.DOMAIN.domainUnlockRegistry[
      last(this.domain.displayName.split('.')).toUpperCase()
    ];
    this.goToWebhostingOrder = this.$scope.ctrlDomain.goToWebhostingOrder;
    this.hasAssociatedHostings = false;
    this.hasStart10mOffer = false;
    this.isAllDom = this.$rootScope.currentSectionInformation === 'all_dom';
    this.isUK = last(this.domain.name.split('.')).toUpperCase() === 'UK';
    this.options = {};
    this.zoneActivationLink = this.$state.href('.zoneActivate');
    this.displayAllSubdomains = false;

    this.loading = {
      allDom: false,
      associatedHosting: false,
      dnsStatus: false,
      hosting: false,
      screenshot: false,
      domainInfos: this.$scope.ctrlDomain.loading.domainInfos,
      changeOwner: false,
      whoIs: false,
      options: false,
    };
    this.initActions();
    this.dnsStatus = {
      isOk: null,
      isHosted: null,
      refreshAlert: false,
    };
    this.vm = {
      protection: {
        isUnavailable: false,
        enabled:
          this.domain.protection.toLowerCase() === PROTECTION_TYPES.LOCKED,
      },
      dnssec: {
        isUnavailable: false,
        enabled:
          this.domain.dnssecStatus.toLowerCase() === DNSSEC_STATUS.ENABLE,
      },
      hosting: {
        web: {
          sites: [],
          selected: {
            info: {},
          },
        },
      },
    };

    forEach(
      [
        'transfertLock.get.done',
        'dnssec.get.done',
        'domain.refreshData.done',
        'domain.protection.lock.error',
        'domain.protection.unlock.error',
        'domain.dnssec.lock.unlock.error',
      ],
      (event) => {
        this.$scope.$on(event, () => {
          this.domain = this.$scope.ctrlDomain.domain;
          this.updateVmStatus();
        });
      },
    );

    this.$scope.$on('domain.protection.lock.cancel', () => {
      this.vm.protection.enabled = false;
      this.isSwitchingProtectionStatus = false;
    });
    this.$scope.$on('domain.protection.unlock.cancel', () => {
      this.vm.protection.enabled = true;
      this.isSwitchingProtectionStatus = false;
    });
    this.$scope.$on('domain.dnssec.lock.unlock.cancel', () => {
      this.vm.dnssec.enabled = !this.vm.dnssec.enabled;
      this.isSwitchingDnssecStatus = false;
    });
    this.$scope.$on('Domain.Options.Delete', () =>
      this.getAllOptionDetails(this.domain.name),
    );

    if (!this.domain.isExpired) {
      this.getScreenshoot(this.domain.name);
    }
    this.User.getUrlOf('start10mMarket').then((start10mMarket) => {
      this.start10MarketUrl = start10mMarket;
    });

    this.updateVmStatus();
    this.getAllNameServer(this.domain.name);
    this.getHostingInfos(this.domain.name);
    this.getAssociatedHostingsSubdomains();
    this.getAllOptionDetails(this.domain.name);
    this.updateOwnerUrl = this.getUpdateOwnerUrl(this.domain);

    this.getRules();

    if (this.isAllDom) {
      this.getAllDomInfos(this.$stateParams.allDom);
    }
  }

  initActions() {
    const contactManagementUrl = this.RedirectionService.getURL(
      'contactManagement',
      {
        serviceName: this.domain.name,
        category: PRODUCT_TYPE,
      },
    );
    this.actions = {
      manageContact: {
        text: this.$translate.instant('common_manage_contacts'),
        href: contactManagementUrl,
      },
      changeOwner: {
        text: this.$translate.instant('core_change_owner'),
        href: '',
      },
      manageAutorenew: {
        text: this.$translate.instant('common_manage'),
        href: `#/billing/autoRenew?searchText=${this.domain.name}&selectedType=DOMAIN`,
      },
      manageAlldom: {
        href: `#/billing/autoRenew?searchText=${this.allDom}&selectedType=ALL_DOM`,
      },
    };
    this.loading.changeOwner = true;
    if (isObject(this.domain.whoisOwner)) {
      return this.$q
        .all({
          domainOrderTradeUrl: this.User.getUrlOf('domainOrderTrade'),
          orderServiceOption: this.Domain.getOrderServiceOption(
            this.domain.name,
          ),
        })
        .then(({ domainOrderTradeUrl, orderServiceOption }) => {
          if (find(orderServiceOption, (opt) => opt.family === 'trade')) {
            this.actions.changeOwner.href = domainOrderTradeUrl.replace(
              '{domain}',
              this.domain.name,
            );
          }
        })
        .catch(() => {
          this.Alerter.error(
            this.$translate.instant('domain_configuration_fetch_fail'),
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading.changeOwner = false;
        });
    }

    const changeOwnerClassic = !includes(
      this.Domain.extensionsChangeOwnerByOrder,
      last(this.domain.name.split('.')),
    );

    return this.User.getUrlOf(
      changeOwnerClassic ? 'changeOwner' : 'domainOrderChange',
    )
      .then((changeOwnerUrl) => {
        if (changeOwnerClassic) {
          this.actions.changeOwner.href = changeOwnerUrl;
        } else {
          this.actions.changeOwner.href = `${changeOwnerUrl}?domain=${this.domain.name}`;
        }
      })
      .catch(() => {
        this.Alerter.error(
          this.$translate.instant('domain_configuration_fetch_fail'),
          this.$scope.alerts.main,
        );
      })
      .finally(() => {
        this.loading.changeOwner = false;
      });
  }

  getAllDomInfos(serviceName) {
    this.loading.allDom = true;
    this.WucAllDom.getAllDom(serviceName)
      .then((allDom) => {
        this.allDom = allDom;
        this.$q
          .all({
            allDomDomains: this.WucAllDom.getDomains(serviceName),
            domains: this.Domain.getDomains(),
          })
          .then(({ allDomDomains, domains }) => {
            this.allDomDomains = map(allDomDomains, (domain) => ({
              name: domain,
              isIncluded: domains.indexOf(domain) !== -1,
            }));
          })
          .catch((err) =>
            this.Alerter.alertFromSWS(
              this.$translate.instant('domain_tab_GLUE_table_error'),
              err,
              this.$scope.alerts.page,
            ),
          )
          .finally(() => {
            this.loading.allDom = false;
          });
      })
      .catch((err) => {
        this.loading.allDom = false;
        this.Alerter.alertFromSWS(
          this.$translate.instant('domain_tab_GLUE_table_error'),
          err,
          this.$scope.alerts.page,
        );
      });
  }

  getHostingInfos(serviceName) {
    this.loading.hosting = true;
    return this.$q
      .all({
        sites: this.Hosting.getHostings(),
        hostingInfo: this.Hosting.getSelected(serviceName),
      })
      .then(({ sites, hostingInfo }) => {
        this.vm.hosting.web.sites = sites;
        this.vm.hosting.web.selected.info = hostingInfo;
        this.hasStart10mOffer =
          hostingInfo.offer ===
          this.constants.HOSTING.OFFERS.START_10_M.TYPE_VALUE;
        this.displayFreeHosting = isEmpty(sites) || this.hasStart10mOffer;
      })
      .finally(() => {
        this.loading.hosting = false;
      });
  }

  getAllNameServer(serviceName) {
    this.loading.dnsStatus = true;
    return this.Domain.getAllNameServer(serviceName)
      .then((nameServers) => {
        this.nameServers = nameServers;
        return this.$q.all(
          map(nameServers, (nameServer) =>
            this.Domain.getNameServerStatus(serviceName, nameServer.id),
          ),
        );
      })
      .then((nameServersStatus) => {
        if (!isEmpty(nameServersStatus)) {
          this.dnsStatus.isOk = !some(nameServersStatus, { state: 'ko' });
          this.dnsStatus.isHosted = !some(nameServersStatus, {
            type: 'external',
          });

          const lastUpdated = maxBy(nameServersStatus, (nameServer) =>
            new Date(nameServer.usedSince).getTime(),
          );
          this.dnsStatus.refreshAlert =
            moment().diff(lastUpdated.usedSince, 'days') <= 2;
        }
      })
      .finally(() => {
        this.loading.dnsStatus = false;
      });
  }

  getAssociatedHostingsSubdomains() {
    this.loading.associatedHosting = true;
    this.subdomainsAndMultisites = [];

    this.hasAssociatedHostings = this.associatedHostings.length > 0;
    const domainRegExp = new RegExp(this.domain.name);

    return this.$q
      .all(
        this.associatedHostings.map((hosting) =>
          this.HostingDomain.getAttachedDomains(hosting, {
            returnErrorKey: '',
          }),
        ),
      )
      .then((allAssociatedHosting) => flattenDeep(allAssociatedHosting))
      .then((allAssociatedHosting) => {
        if (isArray(allAssociatedHosting) && !isEmpty(allAssociatedHosting)) {
          this.hasSubdomainsOrMultisites = true;

          // I would say I should get the first item only,
          // but the api returns an array, so I assume there can be multiple attached domains.
          this.subdomainsAndMultisites = map(
            Array.from(
              new Set(
                allAssociatedHosting.filter((hosting) =>
                  domainRegExp.test(hosting),
                ),
              ),
            ),
            (item) => ({
              name: item,
              url: `#/configuration/hosting/${item}`,
            }),
          );

          this.firstSubdomainsAndMultisites = this.subdomainsAndMultisites.slice(
            0,
            10,
          );
        }
      })
      .catch((err) => {
        if (err.status !== 404) {
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_configuration_web_hosting_fail'),
            get(err, 'data'),
            this.$scope.alerts.page,
          );
        }
      })
      .finally(() => {
        this.loading.associatedHosting = false;
      });
  }

  getAllOptionDetails(serviceName) {
    this.loading.options = true;
    return this.Domain.getOptions(serviceName)
      .then((options) =>
        this.$q.all(
          map(options, (option) =>
            this.Domain.getOption(serviceName, option).then((optionDetail) => ({
              ...optionDetail,
              optionActivated:
                optionDetail.state === this.DOMAIN.DOMAIN_OPTION_STATUS.ACTIVE,
            })),
          ),
        ),
      )
      .then((options) => {
        this.options = reduce(
          options,
          (transformedOptions, option) => ({
            ...transformedOptions,
            [option.option]: option,
          }),
          {},
        );
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('domain_configuration_web_hosting_fail'),
          get(err, 'data'),
          this.$scope.alerts.page,
        ),
      )
      .finally(() => {
        this.loading.options = false;
      });
  }

  getScreenshoot(serviceName) {
    this.loading.screenshot = true;
    return this.OvhApiScreenshot.get({ url: serviceName })
      .$promise.then((screenshot) => {
        this.screenshot = screenshot;
      })
      .finally(() => {
        this.loading.screenshot = false;
      });
  }

  updateVmStatus() {
    this.isSwitchingProtectionStatus = false;
    this.isSwitchingDnssecStatus = false;
    this.updateVmDnssecStatus();
    this.updateVmProtectionStatus();
  }

  updateVmDnssecStatus() {
    this.vm.dnssec.enabled = [
      DNSSEC_STATUS.ENABLED,
      DNSSEC_STATUS.ENABLE_IN_PROGRESS,
    ].includes(this.domain.dnssecStatus.toLowerCase());

    this.vm.dnssec.isUnavailable = [
      DNSSEC_STATUS.DISABLE_IN_PROGRESS,
      DNSSEC_STATUS.ENABLE_IN_PROGRESS,
    ].includes(this.domain.dnssecStatus.toLowerCase());
  }

  updateVmProtectionStatus() {
    this.vm.protection.enabled = [
      PROTECTION_TYPES.LOCKING,
      PROTECTION_TYPES.LOCKED,
    ].includes(this.domain.protection.toLowerCase());

    this.vm.protection.isUnavailable = [
      PROTECTION_TYPES.LOCKING,
      PROTECTION_TYPES.UNLOCKING,
      PROTECTION_TYPES.UNAVAILABLE,
    ].includes(this.domain.protection.toLowerCase());
  }

  getUpdateOwnerUrl(domain) {
    const ownerUrlInfo = { target: '', error: '' };
    if (has(domain, 'name') && has(domain, 'whoisOwner.id')) {
      ownerUrlInfo.target = `${this.CORE_MANAGER_URLS.dedicated}/${OWNER_CHANGE_URL}${domain.name}/${domain.whoisOwner.id}`;
    } else if (!has(domain, 'name')) {
      ownerUrlInfo.error = this.$translate.instant(
        'domain_tab_REDIRECTION_add_step4_server_cname_error',
      );
    } else {
      ownerUrlInfo.error =
        domain.whoisOwner !== this.DOMAIN.WHOIS_STATUS.PENDING &&
        domain.whoisOwner !== this.DOMAIN.WHOIS_STATUS.INVALID_CONTACT &&
        this.$translate.instant('domain_dashboard_whois_error');
    }

    if (ownerUrlInfo.error) {
      this.Alerter.error(ownerUrlInfo.error, this.$scope.alerts.tabs);
    }

    return ownerUrlInfo;
  }

  getRules() {
    this.loading.whoIs = true;
    return this.$q
      .all({
        obfuscationRules: this.OvhApiDomainRules.EmailsObfuscation()
          .v6()
          .query({
            serviceName: this.domain.name,
          }).$promise,
        optinRules: this.OvhApiDomainRules.Optin()
          .v6()
          .query({
            serviceName: this.domain.name,
          }).$promise,
      })
      .then(({ obfuscationRules, optinRules }) => {
        this.isWhoisOptinAllowed = !isEmpty(optinRules);
        this.canObfuscateEmails = !isEmpty(obfuscationRules);
      })
      .catch(() =>
        this.Alerter.error(
          this.$translate.instant('domain_dashboard_whois_error'),
        ),
      )
      .finally(() => {
        this.loading.whoIs = false;
      });
  }

  // Actions --------------------------------------------
  goToDnsManagement() {
    this.$scope.setAction('dns/management/domain-dns-management', {
      domain: this.domain,
      nameServers: this.nameServers,
      dnsStatus: this.dnsStatus,
    });
  }

  switchTheStateOfProtection() {
    this.isSwitchingProtectionStatus = true;
    if (this.vm.protection.enabled) {
      this.$scope.setAction('lock/disable/domain-lock-disable', this.domain);
    } else {
      this.$scope.setAction('lock/enable/domain-lock-enable', this.domain);
    }
  }

  switchDnssecStatus() {
    this.isSwitchingDnssecStatus = true;
    this.$scope.setAction('dns/sec/domain-dns-sec', this.domain);
  }

  // Utilities ------------------------------------------

  static parseType(type) {
    return type.replace(/\+/g, '-');
  }
}

angular
  .module('App')
  .controller(
    'DomainTabGeneralInformationsCtrl',
    DomainTabGeneralInformationsCtrl,
  );
