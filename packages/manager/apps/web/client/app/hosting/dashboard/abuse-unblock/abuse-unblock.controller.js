import { RESOLVE_ANOMALOUS_ACTIVITY_GUIDE_URL } from './abuse-unblock.constants';

export default class HostingAbuseUnblockController {
  /* @ngInject */
  constructor(
    $translate,
    Alerter,
    coreConfig,
    coreURLBuilder,
    Hosting,
    HostingAbuseUnblockService,
    HOSTING_ABUSE_STATE,
  ) {
    this.$translate = $translate;
    this.HostingAbuseUnblockService = HostingAbuseUnblockService;
    this.Alerter = Alerter;
    this.Hosting = Hosting;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.HOSTING_ABUSE_STATE = HOSTING_ABUSE_STATE;
  }

  $onInit() {
    this.isLoading = true;
    this.ongoingTasksHref = this.coreURLBuilder.buildURL(
      'web',
      `#/hosting/${this.serviceName}/task`,
    );
    this.abuseUnblockHref = this.coreURLBuilder.buildURL(
      'web',
      `#/hosting/${this.serviceName}/abuse-unblock`,
    );
    this.Hosting.getAbuseState(this.serviceName)
      .then((abuseState) => {
        const {
          BLOCKED,
          MALWARES,
          MAILSOUT,
          OUTSTATE,
        } = this.HOSTING_ABUSE_STATE;
        const { mailsoutState, outState } = abuseState;
        let key = null;
        if (mailsoutState === BLOCKED && outState === BLOCKED) {
          key = MALWARES;
        } else if (mailsoutState === BLOCKED) {
          key = MAILSOUT;
        } else if (outState === BLOCKED) {
          key = OUTSTATE;
        }
        this.stateMessageKey = `hosting_dashboard_service_abuse_state_modal_blocked_message_${key}`;
        this.stateInfoKey = `hosting_dashboard_service_abuse_state_modal_info_${key}`;
        this.languagesHackedWebsiteUrl =
          RESOLVE_ANOMALOUS_ACTIVITY_GUIDE_URL[
            this.coreConfig.getUser().ovhSubsidiary
          ] || RESOLVE_ANOMALOUS_ACTIVITY_GUIDE_URL.DEFAULT;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  primaryAction() {
    return this.HostingAbuseUnblockService.unblockTcpOut(this.serviceName)
      .then(() =>
        this.goBack(
          this.$translate.instant(
            'hosting_dashboard_service_abuse_state_banner_reinsurance_title',
            {
              href: this.ongoingTasksHref,
            },
          ),
        ),
      )
      .catch(({ data: { message } }) =>
        this.goBack(
          this.$translate.instant(
            'hosting_dashboard_service_abuse_state_unblock_error_message',
            { error: message },
          ),
          'danger',
        ),
      );
  }

  secondaryAction() {
    return this.goBack(
      this.$translate.instant(
        'hosting_dashboard_service_abuse_state_banner_alert_message',
        { href: this.abuseUnblockHref },
      ),
      'warning',
    );
  }
}
