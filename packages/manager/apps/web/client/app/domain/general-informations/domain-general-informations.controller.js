import find from 'lodash/find';
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
import set from 'lodash/set';
import some from 'lodash/some';

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
    Domain,
    Hosting,
    HostingDomain,
    OvhApiDomainRules,
    OvhApiScreenshot,
    User,
    WucAllDom,
    DOMAIN,
  ) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.WucAllDom = WucAllDom;
    this.Domain = Domain;
    this.Hosting = Hosting;
    this.HostingDomain = HostingDomain;
    this.OvhApiDomainRules = OvhApiDomainRules;
    this.OvhApiScreenshot = OvhApiScreenshot.Aapi();
    this.User = User;
    this.constants = constants;
    this.DOMAIN = DOMAIN;
  }

  $onInit() {
    this.domain = this.$scope.ctrlDomain.domain;
    this.domainInfos = this.$scope.ctrlDomain.domainInfos;
    this.allDom = this.$scope.ctrlDomain.allDom;
    this.allDomInfos = this.$scope.ctrlDomain.allDomInfos;
    this.displayFreeHosting = false;
    this.domainUnlockRegistry = this.constants.DOMAIN.domainUnlockRegistry[
      last(this.domain.displayName.split('.')).toUpperCase()
    ];
    this.goToWebhostingOrder = this.$scope.ctrlDomain.goToWebhostingOrder;
    this.hasHostingAssociate = false;
    this.hasStart10mOffer = false;
    this.isAllDom = this.$rootScope.currentSectionInformation === 'all_dom';
    this.isUK = last(this.domain.name.split('.')).toUpperCase() === 'UK';
    this.options = {};
    this.zoneActivationLink = this.$state.href('.zoneActivate');

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
      protection: { uiSwitch: {} },
      dnssec: { uiSwitch: {} },
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
          this.setSwitchStates();
        });
      },
    );
    this.$scope.$on('domain.protection.lock.cancel', () => {
      this.vm.protection.uiSwitch.checked = false;
    });
    this.$scope.$on('domain.protection.unlock.cancel', () => {
      this.vm.protection.uiSwitch.checked = true;
    });
    this.$scope.$on('domain.dnssec.lock.unlock.cancel', () => {
      this.vm.dnssec.uiSwitch.checked = !this.vm.dnssec.uiSwitch.checked;
    });
    this.$scope.$on('Domain.Options.Delete', () => this.getAllOptionDetails(this.domain.name));

    if (!this.domain.isExpired) {
      this.getScreenshoot(this.domain.name);
    }
    this.User.getUrlOf('start10mMarket').then((start10mMarket) => {
      this.start10MarketUrl = start10mMarket;
    });

    this.setSwitchStates();
    this.getAllNameServer(this.domain.name);
    this.getHostingInfos(this.domain.name);
    this.getAssociatedHosting(this.domain.name);
    this.getAllOptionDetails(this.domain.name);
    this.updateOwnerUrl = this.getUpdateOwnerUrl(this.domain);

    this.getRules();

    if (this.isAllDom) {
      this.getAllDomInfos(this.$stateParams.allDom);
    }
  }

  initActions() {
    this.actions = {
      manageContact: {
        text: this.$translate.instant('common_manage_contacts'),
        href: `#/useraccount/contacts?tab=SERVICES&serviceName=${
          this.domain.name
        }&category=DOMAIN`,
        isAvailable: () => true,
      },
      changeOwner: {
        text: this.$translate.instant('core_change_owner'),
        href: '',
        isAvailable: () => true,
      },
      manageAutorenew: {
        text: this.$translate.instant('common_manage'),
        href: `#/billing/autoRenew?searchText=${
          this.domain.name
        }&selectedType=DOMAIN`,
        isAvailable: () => true,
      },
      manageAlldom: {
        href: `#/billing/autoRenew?searchText=${
          this.allDom
        }&selectedType=ALL_DOM`,
      },
    };
    this.loading.changeOwner = true;
    if (isObject(this.domain.whoisOwner)) {
      return this.$q
        .all({
          domainOrderTradeUrl: this.User.getUrlOf('domainOrderTrade'),
          orderServiceOption: this.Domain.getOrderServiceOption(this.domain.name),
        })
        .then(({ domainOrderTradeUrl, orderServiceOption }) => {
          if (find(orderServiceOption, opt => opt.family === 'trade')) {
            this.actions.changeOwner.href = domainOrderTradeUrl.replace(
              '{domain}',
              this.domain.name,
            );
          }
        }).catch(() => {
          this.Alerter.error(
            this.$translate.instant('domain_configuration_fetch_fail'),
            this.$scope.alerts.main,
          );
        })
        .finally(() => { this.loading.changeOwner = false; });
    }

    const changeOwnerClassic = !includes(
      this.Domain.extensionsChangeOwnerByOrder,
      last(this.domain.name.split('.')),
    );

    return this.User.getUrlOf(changeOwnerClassic ? 'changeOwner' : 'domainOrderChange')
      .then((changeOwnerUrl) => {
        if (changeOwnerClassic) {
          this.actions.changeOwner.href = changeOwnerUrl;
        } else {
          this.actions.changeOwner.href = `${changeOwnerUrl}?domain=${
            this.domain.name
          }`;
        }
      }).catch(() => {
        this.Alerter.error(
          this.$translate.instant('domain_configuration_fetch_fail'),
          this.$scope.alerts.main,
        );
      }).finally(() => { this.loading.changeOwner = false; });
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
            this.allDomDomains = map(allDomDomains, domain => ({
              name: domain,
              isIncluded: domains.indexOf(domain) !== -1,
            }));
          })
          .catch(err => this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_GLUE_table_error'),
            err,
            this.$scope.alerts.page,
          ))
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
        this.hasStart10mOffer = hostingInfo.offer
            === this.constants.HOSTING.OFFERS.START_10_M.TYPE_VALUE;
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
        return this.$q.all(map(
          nameServers,
          nameServer => this.Domain.getNameServerStatus(serviceName, nameServer.id),
        ));
      })
      .then((nameServersStatus) => {
        if (!isEmpty(nameServersStatus)) {
          this.dnsStatus.isOk = !some(nameServersStatus, { state: 'ko' });
          this.dnsStatus.isHosted = !some(nameServersStatus, {
            type: 'external',
          });

          const lastUpdated = maxBy(
            nameServersStatus,
            nameServer => new Date(nameServer.usedSince).getTime(),
          );
          this.dnsStatus.refreshAlert = moment().diff(lastUpdated.usedSince, 'days') <= 2;
        }
      })
      .finally(() => {
        this.loading.dnsStatus = false;
      });
  }

  getAssociatedHosting(serviceName) {
    this.loading.associatedHosting = true;
    this.hostingAssociated = [];
    return this.HostingDomain.getAttachedDomains(serviceName, {
      returnErrorKey: '',
    })
      .then((response) => {
        if (isArray(response) && !isEmpty(response)) {
          this.hasHostingAssociate = true;

          // I would say I should get the first item only,
          // but the api returns an array, so I assume there can be multiple attached domains.
          this.hostingAssociated = map(response, item => ({
            name: item,
            url: `#/configuration/hosting/${item}`,
          }));
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
      .then(options => this.$q.all(
        map(options, option => this.Domain.getOption(serviceName, option)
          .then(optionDetail => Object.assign({}, optionDetail,
            { optionActivated: optionDetail.state === this.DOMAIN.DOMAIN_OPTION_STATUS.ACTIVE }))),
      ))
      .then((options) => {
        this.options = reduce(options, (transformedOptions, option) => ({
          ...transformedOptions,
          [option.option]: option,
        }), {});
      })
      .catch(err => this.Alerter.alertFromSWS(
        this.$translate.instant('domain_configuration_web_hosting_fail'),
        get(err, 'data'),
        this.$scope.alerts.page,
      ))
      .finally(() => {
        this.loading.options = false;
      });
  }

  getScreenshoot(serviceName) {
    this.loading.screenshot = true;
    return this.OvhApiScreenshot.get({ url: serviceName })
      .$promise
      .then((screenshot) => {
        this.screenshot = screenshot;
      })
      .finally(() => {
        this.loading.screenshot = false;
      });
  }

  setSwitchStates() {
    this.vm.protection.uiSwitch.checked = this.domain.protection === 'locked'
        || this.domain.protection === 'locking';
    this.vm.protection.uiSwitch.pending = /ing$/i.test(this.domain.protection);
    this.vm.protection.uiSwitch.disabled = /ing$/i.test(this.domain.protection)
        || this.domain.protection === 'unavailable';

    this.vm.dnssec.uiSwitch.checked = /enable/i.test(this.domain.dnssecStatus);
    this.vm.dnssec.uiSwitch.pending = /progress/i.test(this.domain.dnssecStatus);
    this.vm.dnssec.uiSwitch.disabled = this.vm.dnssec.uiSwitch.pending;
  }

  getUpdateOwnerUrl(domain) {
    const ownerUrlInfo = { target: '', error: '' };
    if (has(domain, 'name') && has(domain, 'whoisOwner.id')) {
      ownerUrlInfo.target = `#/useraccount/contact/${domain.name}/${domain.whoisOwner.id}`;
    } else if (!has(domain, 'name')) {
      ownerUrlInfo.error = this.$translate.instant('domain_tab_REDIRECTION_add_step4_server_cname_error');
    } else {
      switch (domain.whoisOwner) {
        case this.DOMAIN.WHOIS_STATUS.PENDING:
          ownerUrlInfo.error = this.$translate.instant('domain_dashboard_whois_pending');
          break;
        case this.DOMAIN.WHOIS_STATUS.INVALID_CONTACT:
          ownerUrlInfo.error = this.$translate.instant('domain_dashboard_whois_invalid_contact');
          break;
        default:
          ownerUrlInfo.error = this.$translate.instant('domain_dashboard_whois_error');
      }
    }

    if (ownerUrlInfo.error) {
      this.Alerter.error(ownerUrlInfo.error, this.$scope.alerts.page);
    }

    return ownerUrlInfo;
  }

  getRules() {
    this.loading.whoIs = true;
    return this.$q.all({
      obfuscationRules: this.OvhApiDomainRules.EmailsObfuscation().v6().query({
        serviceName: this.domain.name,
      }).$promise,
      optinRules: this.OvhApiDomainRules.Optin().v6().query({
        serviceName: this.domain.name,
      }).$promise,
    })
      .then(({ obfuscationRules, optinRules }) => {
        this.isWhoisOptinAllowed = !isEmpty(optinRules);
        this.canObfuscateEmails = !isEmpty(obfuscationRules);
      })
      .catch(() => this.Alerter.error(this.$translate.instant('domain_dashboard_whois_error')))
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

  showWebHostingOrderWithStartOffer() {
    const domain = angular.copy(this.domain);
    set(
      domain,
      'selected.offer',
      this.constants.HOSTING.OFFERS.START_10_M.LIST_VALUE,
    );
    this.$scope.setAction(
      'webhosting-enable/domain-enable-web-hosting',
      domain,
    );
  }

  switchTheStateOfProtection() {
    if (this.vm.protection.uiSwitch.checked) {
      this.$scope.setAction('lock/enable/domain-lock-enable', this.domain);
    } else {
      this.$scope.setAction('lock/disable/domain-lock-disable', this.domain);
    }
  }

  // Utilities ------------------------------------------

  static parseType(type) {
    return type.replace(/\+/g, '-');
  }
}

angular.module('App').controller(
  'DomainTabGeneralInformationsCtrl', DomainTabGeneralInformationsCtrl,
);
