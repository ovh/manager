import punycode from 'punycode';
import logo from './logo.png';
import {
  PREDEFINED_SUBDOMAIN,
  MULTI_PART_TLDS,
  MIGRATE_DOMAIN_TO_OVHCLOUD_GUIDE,
} from './private-config-funnel.constants';

export default class ExchangePrivateConfigFunnelController {
  /* @ngInject */
  constructor(
    $q,
    $timeout,
    $translate,
    Alerter,
    ExchangePrivateConfigFunnelService,
    WucValidator,
    coreConfig,
    wucExchange,
  ) {
    this.$q = $q;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.ExchangePrivateConfigFunnelService = ExchangePrivateConfigFunnelService;
    this.WucValidator = WucValidator;
    this.wucExchange = wucExchange;
    this.logo = logo;
    this.PREDEFINED_SUBDOMAIN = PREDEFINED_SUBDOMAIN;
    this.migrateDomaineGuideUrl =
      MIGRATE_DOMAIN_TO_OVHCLOUD_GUIDE[coreConfig.getUser().ovhSubsidiary] ||
      MIGRATE_DOMAIN_TO_OVHCLOUD_GUIDE.DEFAULT;
  }

  $onInit() {
    this.cnamePolling = null;
    this.loading = true;
    this.ExchangePrivateConfigFunnelService.getZones().then((zones) => {
      this.zones = zones.map((zone) => punycode.toUnicode(zone));
      this.checkStep();
      this.loading = false;
    });
  }

  $onDestroy() {
    this.$timeout.cancel(this.cnamePolling);
  }

  checkStep() {
    if (!this.exchange.hostname) {
      this.step = 1;
    } else if (this.exchange.cnameDcvRecord) {
      this.getCnamePool();
      this.step = 3;
    } else if (
      !this.isOVHZone(
        this.constructor.extractDomainFromHostname(this.exchange.hostname),
      ) &&
      !this.exchange.sslExpirationDate
    ) {
      this.getCnamePool();
      this.step = 2;
    } else {
      this.goToDashboard();
    }
  }

  checkDomain() {
    this.isValidDomain =
      this.domain && this.WucValidator.isValidDomain(this.domain);
    if (this.isValidDomain) {
      this.isOvhDomain = this.isOVHZone(this.domain);
      this.isIdnDomainName =
        punycode.toASCII(this.domain) !== punycode.toUnicode(this.domain);
    } else {
      this.isOvhDomain = false;
      this.isIdnDomainName = false;
    }
  }

  isOVHZone(domain) {
    return this.zones.some((zone) => punycode.toUnicode(zone) === domain);
  }

  checkSubdomain() {
    this.isValidSubDomain =
      this.subdomain && this.WucValidator.isValidSubDomain(this.subdomain);
  }

  static extractDomainFromHostname(hostname) {
    /**
     * Extract the domain part from a hostname.
     *
     * @param {string} hostname - The full hostname string (e.g., 'www.example.com')
     * @returns {string} The domain part (e.g., 'example.com')
     */

    const parts = hostname.split('.');

    if (parts.length >= 3) {
      // Check if the last two parts form a known multi-part TLD
      const lastTwo = parts.slice(-2).join('.');
      if (MULTI_PART_TLDS.includes(lastTwo)) {
        return parts.slice(-3).join('.');
      }
    }
    return parts.slice(-2).join('.');
  }

  getCnamePool() {
    return this.wucExchange
      .getExchangeDetails(this.organization, this.productId)
      .then((exchange) => {
        if (!exchange.sslExpirationDate) {
          this.cnamePolling = this.$timeout(
            () => this.getCnamePool(this.billingAccount, this.serviceName),
            5000,
          );
        } else if (exchange.sslExpirationDate) {
          this.goToDashboard();
        }
        if (exchange.cnameDcvRecord) {
          this.exchange = exchange;
          this.step = 3;
        }
      });
  }

  submitChangeHostname() {
    this.isOpenValidationModal = false;
    this.isSubmitting = true;
    this.ExchangePrivateConfigFunnelService.postChangeHostname(
      this.organization,
      this.productId,
      {
        hostname: `${this.subdomain}.${this.domain}`,
        useDnsAssist: this.isOvhDomain,
        useCname: !this.isOvhDomain,
      },
    )
      .then(() => {
        if (this.isOvhDomain) {
          this.goToDashboard();
        } else {
          this.getCnamePool();
          this.step = 2;
        }
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant('exchange_private_config_error_message', {
            error: error.data?.message,
          }),
        );
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }
}
