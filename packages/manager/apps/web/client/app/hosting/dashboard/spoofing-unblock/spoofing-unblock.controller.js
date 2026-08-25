import {
  EMAIL_SENDING_GUIDE_URL,
  SPOOFING_LATER_STORAGE_PREFIX,
} from './spoofing-unblock.constants';

export default class HostingSpoofingUnblockController {
  /* @ngInject */
  constructor(
    $translate,
    coreConfig,
    coreURLBuilder,
    Hosting,
    HostingSpoofingUnblockService,
  ) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.Hosting = Hosting;
    this.HostingSpoofingUnblockService = HostingSpoofingUnblockService;
  }

  $onInit() {
    this.isLoading = true;
    this.actionCheckbox = false;
    this.senderDomains = [];
    this.spoofingUnblockHref = this.coreURLBuilder.buildURL(
      'web',
      `#/hosting/${this.serviceName}/spoofing-unblock`,
    );
    this.guideUrl =
      EMAIL_SENDING_GUIDE_URL[this.coreConfig.getUser().ovhSubsidiary] ||
      EMAIL_SENDING_GUIDE_URL.DEFAULT;
    this.Hosting.getSpoofing(this.serviceName)
      .then((spoofing) => {
        this.senderDomains = (spoofing || []).map(
          (entry) => entry.senderDomain,
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  primaryAction() {
    this.isLoading = true;
    return this.HostingSpoofingUnblockService.deleteSpoofing(
      this.serviceName,
      this.senderDomains,
    )
      .then(() => {
        localStorage.removeItem(
          `${SPOOFING_LATER_STORAGE_PREFIX}${this.serviceName}`,
        );
        return this.goBack(
          this.$translate.instant(
            'hosting_dashboard_spoofing_modal_resolve_success',
          ),
        );
      })
      .catch(({ data: { message } = {} }) =>
        this.goBack(
          this.$translate.instant('hosting_dashboard_spoofing_modal_error', {
            error: message,
          }),
          'danger',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }

  secondaryAction() {
    localStorage.setItem(
      `${SPOOFING_LATER_STORAGE_PREFIX}${this.serviceName}`,
      '1',
    );
    return this.goBack(
      this.$translate.instant(
        'hosting_dashboard_spoofing_banner_alert_message',
        { href: this.spoofingUnblockHref },
      ),
      'warning',
    );
  }
}
