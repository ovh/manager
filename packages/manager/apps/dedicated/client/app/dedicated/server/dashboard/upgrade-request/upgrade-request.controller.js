import get from 'lodash/get';
import { buildURL } from '@ovh-ux/ufrontend/url-builder';
import { ISSUE_TYPE_ID } from './upgrade.constants';

export default class DedicatedUpgradeController {
  /* @ngInject */
  constructor($translate, OvhApiSupport, atInternet, Alerter) {
    this.$translate = $translate;
    this.OvhApiSupport = OvhApiSupport;
    this.atInternet = atInternet;
    this.Alerter = Alerter;
  }

  $onInit() {
    this.isLoading = false;
  }

  cancel() {
    this.atInternet.trackClick({
      name: `dedicated::dedicated::server::dashboard::upgrade::${this.selectedUpgrade}::cancel`,
      type: 'action',
    });
    this.goBack();
  }

  upgrade() {
    this.isLoading = true;

    this.atInternet.trackClick({
      name: `dedicated::dedicated::server::dashboard::upgrade::${this.selectedUpgrade}::confirm`,
      type: 'action',
    });

    return this.OvhApiSupport.v6()
      .createTickets({
        issueTypeId: ISSUE_TYPE_ID,
        serviceName: this.serverName,
        subject: this.$translate.instant(
          'dedicated_server_dashboard_upgrade_ticket_subject',
        ),
        body: this.issueTypeDescription,
      })
      .$promise.then(({ ticketId }) => {
        this.Alerter.success(
          this.$translate.instant(
            `dedicated_server_dashboard_upgrade_success_message_${this.selectedUpgrade}`,
            {
              ticketUrl: buildURL('dedicated', '#/support/tickets/:ticketId', {
                ticketId,
              }),
            },
          ),
          'server_dashboard_alert',
        );
        this.goBack();
      })
      .catch((err) => {
        this.Alerter.error(
          this.$translate.instant(
            'dedicated_server_dashboard_upgrade_error_message',
            {
              message: get(err, 'data.message', null),
            },
          ),
          'server_dashboard_alert',
        );
        this.goBack();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
