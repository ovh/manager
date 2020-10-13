import get from 'lodash/get';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import 'moment';

export default class ExchangeTabInformationCtrl {
  /* @ngInject */
  constructor(
    $rootScope,
    $scope,
    exchangeServiceInfrastructure,
    Exchange,
    EXCHANGE_CONFIG,
    exchangeVersion,
    messaging,
    navigation,
    $translate,
    User,
  ) {
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.exchangeServiceInfrastructure = exchangeServiceInfrastructure;
    this.exchangeService = Exchange;
    this.EXCHANGE_CONFIG = EXCHANGE_CONFIG;
    this.exchangeVersion = exchangeVersion;
    this.messaging = messaging;
    this.navigation = navigation;
    this.$translate = $translate;
    this.User = User;
  }

  $onInit() {
    this.exchange = this.exchangeService.value;
    this.shouldDisplaySSLRenewValue = false;
    this.hasSSLTask = false;
    this.loading = {
      sharePoint: false,
      sslButton: false,
    };
    this.worldPart = this.$rootScope.worldPart;
    this.$scope.$on(this.exchangeService.events.sslRenewAsked, () => {
      this.hasSSLTask = true;
      this.setMessageSSL();
    });

    this.getGuides();
    this.getSharePoint();
    this.retrievingDVCEmails();
    this.loadATooltip();
    this.loadAaaaTooltip();
    this.loadPtrTooltip();
    this.loadPtrv6Tooltip();
    this.loadATooltip();
  }

  getGuides() {
    return this.User.getUser()
      .then((data) => {
        try {
          this.displayGuides = this.EXCHANGE_CONFIG.URLS.GUIDES.DOCS_HOME[
            data.ovhSubsidiary
          ];
        } catch (exception) {
          this.displayGuides = null;
        }
      })
      .catch(() => {
        this.displayGuides = null;
      });
  }

  getSharePoint() {
    this.loading.sharePoint = true;
    return this.exchangeService
      .getSharepointService(this.exchange)
      .then((sharePoint) => {
        this.sharepoint = sharePoint;
      })
      .finally(() => {
        this.loading.sharePoint = false;
      });
  }

  retrievingDVCEmails() {
    this.loading.sslButton = true;
    return this.exchangeService
      .retrievingDVCEmails(this.exchange.organization, this.exchange.domain)
      .catch((err) => {
        const message = get(err, 'message', err);
        if (isString(message) && /pending task/i.test(message)) {
          this.hasSSLTask = true;
        }
      })
      .finally(() => {
        this.shouldDisplaySSLRenew();
        this.setMessageSSL();
        this.loading.sslButton = false;
      });
  }

  sslRenew() {
    if (this.exchange.sslRenewAvailable) {
      this.navigation.setAction('exchange/information/ssl/service-ssl-renew');
    }
  }

  displayRenewDate() {
    return (
      this.exchange.expiration &&
      this.exchangeVersion.isAfter(2010) &&
      (this.exchangeServiceInfrastructure.isDedicated() ||
        this.exchangeServiceInfrastructure.isDedicatedCluster())
    );
  }

  shouldDisplayMigration2016() {
    const isHostedAccount = this.exchangeServiceInfrastructure.isHosted();
    const isNicAdmin = includes(this.exchange.nicType, 'ADMIN');
    const isNicBilling = includes(this.exchange.nicType, 'BILLING');

    return (
      this.exchangeVersion.isVersion(2013) &&
      isHostedAccount &&
      (isNicAdmin || isNicBilling)
    );
  }

  shouldDisplayDiagnostic() {
    return this.exchangeVersion.isAfter(2010);
  }

  shouldDisplaySSLRenew() {
    const now = moment();
    const sslExpirationDate = moment(this.exchange.sslExpirationDate);
    const aMonthBeforeSSLExpirationDate = moment(
      this.exchange.sslExpirationDate,
    ).subtract(1, 'months');
    const isAlreadyExpired = now.isAfter(sslExpirationDate);
    const canRenewBeforeExpiration = now.isAfter(aMonthBeforeSSLExpirationDate);

    const isDedicatedAccount =
      this.exchangeServiceInfrastructure.isDedicated() ||
      this.exchangeServiceInfrastructure.isDedicatedCluster();
    const is2010DedicatedOrProvider =
      this.exchangeVersion.isVersion(2010) &&
      !this.exchangeServiceInfrastructure.isHosted();

    this.shouldDisplaySSLRenewValue =
      (isDedicatedAccount || is2010DedicatedOrProvider) &&
      (canRenewBeforeExpiration || isAlreadyExpired);
  }

  setMessageSSL() {
    const now = moment();
    const sslExpirationDate = moment(this.exchange.sslExpirationDate);
    const aMonthBeforeSSLExpirationDate = moment(
      this.exchange.sslExpirationDate,
    ).subtract(1, 'months');

    if (this.hasSSLTask) {
      this.messageSSL = this.$translate.instant(
        'exchange_action_renew_ssl_info',
      );
    } else if (now.isAfter(sslExpirationDate)) {
      this.messageSSL = this.$translate.instant(
        'exchange_action_renew_ssl_info_expired',
      );
    } else if (now.isAfter(aMonthBeforeSSLExpirationDate)) {
      this.messageSSL = this.$translate.instant(
        'exchange_action_renew_ssl_info_next',
        {
          t0: sslExpirationDate.format('L'),
        },
      );
    } else {
      this.messageSSL = null;
    }
  }

  displayOrderDiskSpace() {
    return (
      this.exchangeVersion.isVersion(2010) &&
      this.exchangeServiceInfrastructure.isProvider()
    );
  }

  orderDiskSpace() {
    if (this.displayOrderDiskSpace()) {
      this.navigation.setAction(
        'exchange/information/disk/service-disk-order-space',
      );
    }
  }

  loadATooltip() {
    const ipv4 = get(this.exchange, 'serverDiagnostic.ip', '');
    if (
      !isEmpty(ipv4) &&
      get(this.exchange, 'serverDiagnostic.isAValid', false)
    ) {
      this.exchange.serverDiagnostic.aTooltip = this.$translate.instant(
        'exchange_dashboard_diag_a_tooltip_ok',
      );
    } else {
      this.exchange.serverDiagnostic.aTooltip = this.$translate.instant(
        'exchange_dashboard_diag_a_tooltip_error',
        {
          t0: this.exchange.hostname,
          t1: ipv4,
        },
      );
    }
  }

  loadAaaaTooltip() {
    const ipv6 = get(this.exchange, 'serverDiagnostic.ipV6', '');
    if (
      !isEmpty(ipv6) &&
      get(this.exchange, 'serverDiagnostic.isAaaaValid', false)
    ) {
      this.exchange.serverDiagnostic.aaaaTooltip = this.$translate.instant(
        'exchange_dashboard_diag_aaaa_tooltip_ok',
      );
    } else {
      this.exchange.serverDiagnostic.aaaaTooltip = this.$translate.instant(
        'exchange_dashboard_diag_aaaa_tooltip_error',
        {
          t0: this.exchange.hostname,
          t1: ipv6,
        },
      );
    }
  }

  loadPtrTooltip() {
    if (get(this.exchange, 'serverDiagnostic.isPtrValid', false)) {
      this.exchange.serverDiagnostic.ptrTooltip = this.$translate.instant(
        'exchange_dashboard_diag_ptr_tooltip_ok',
      );
    } else {
      this.exchange.serverDiagnostic.ptrTooltip = this.$translate.instant(
        'exchange_dashboard_diag_ptr_tooltip_error',
      );
    }
  }

  loadPtrv6Tooltip() {
    if (get(this.exchange, 'serverDiagnostic.isPtrV6Valid', false)) {
      this.exchange.serverDiagnostic.ptrv6Tooltip = this.$translate.instant(
        'exchange_dashboard_diag_ptrv6_tooltip_ok',
      );
    } else {
      this.exchange.serverDiagnostic.ptrv6Tooltip = this.$translate.instant(
        'exchange_dashboard_diag_ptrv6_tooltip_error',
      );
    }
  }

  getFormattedDiskUsage() {
    return `${this.exchange.currentDiskUsage.value} ${this.$translate.instant(
      `unit_size_${this.exchange.currentDiskUsage.unit}`,
    )} / ${this.exchange.totalDiskSize.value} ${this.$translate.instant(
      `unit_size_${this.exchange.totalDiskSize.unit}`,
    )}`;
  }
}
