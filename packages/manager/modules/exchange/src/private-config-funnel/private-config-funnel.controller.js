import punycode from 'punycode';
import logo from './logo.png'
import { PREDEFINED_SUBDOMAIN } from './private-config-funnel.constants';

export default class ExchangePrivateConfigFunnelController {
  /* @ngInject */
  constructor($q, $translate, Alerter, ExchangePrivateConfigFunnelService, WucValidator) {
    this.$q = $q;
    this.$translate = $translate;
    this.ExchangePrivateConfigFunnelService = ExchangePrivateConfigFunnelService;
    this.WucValidator = WucValidator;
    this.Alerter = Alerter;
    this.logo = logo;
    this.PREDEFINED_SUBDOMAIN = PREDEFINED_SUBDOMAIN;
  }

  $onInit() {
    this.loading = true;
    this.ExchangePrivateConfigFunnelService.getZones()
      .then((zones) => {
        this.zones = zones.map((zone) => punycode.toUnicode(zone));
        this.loading = false;
      })
  }

  checkDomain() {
    this.isValidDomain = this.domain && this.WucValidator.isValidDomain(this.domain);
    if (this.isValidDomain) {
      this.isOvhDomain = this.zones.some((zone) => punycode.toUnicode(zone) === this.domain);
      this.isIdnDomainName =
        punycode.toASCII(this.domain) !== punycode.toUnicode(this.domain);
    } else {
      this.isOvhDomain = false;
      this.isIdnDomainName = false;
    }
  }

  checkSubdomain() {
    this.isValidSubDomain = this.subdomain && this.WucValidator.isValidSubDomain(this.subdomain);
  }

  submitChangeHostname() {
    this.isOpenValidationModal = false;
    this.isSubmitting = true;
    this.ExchangePrivateConfigFunnelService.postChangeHostname(this.organization, this.productId, {
      hostname: `${this.subdomain}.${this.domain}`,
      useDnsAssist: this.isOvhDomain,
      useCname: !this.isOvhDomain,
    }).then(() => {
      //@todo in next ticket
    }).catch((error) => {
      this.Alerter.error(
        this.$translate.instant('exchange_private_config_error_message', { error: error.data?.message }),
      );
    }).finally(() => {
      this.isSubmitting = false;
    })
  }
}
