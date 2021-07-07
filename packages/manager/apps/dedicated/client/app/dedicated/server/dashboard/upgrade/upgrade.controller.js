import 'moment';

import {
  COMPOSITE_UPGRADE,
  MIN_INTERVENTION_GAP,
  UPGRADE_MODE,
} from './upgrade.constants';

export default class {
  /* @ngInject */
  constructor($http, $translate, $window, Alerter, coreURLBuilder) {
    this.$http = $http;
    this.$window = $window;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.coreURLBuilder = coreURLBuilder;

    this.UPGRADE_MODE = UPGRADE_MODE;
  }

  $onInit() {
    this.interventionData = {
      backupDone: false,
      selectedDate: null,
      selectedSlot: null,
      timeSlots: [],
    };
    this.upgradeStarted = this.upgradeMode !== this.UPGRADE_MODE.ORDER;
    this.upgradeScheduled = this.upgradeMode === this.UPGRADE_MODE.NONE;
    if (this.upgradeStarted) {
      this.currentStep = 1;
    }
    if (this.upgradeScheduled) {
      this.currentStep = 2;
    }
    if (this.upgradeStarted) {
      this.upgradeType =
        this.upgradeTask.components.length > 1
          ? COMPOSITE_UPGRADE
          : this.upgradeTask.components[0];
    }
  }

  onInterventionDateChange([selectedDate]) {
    this.loadingTimeSlots = true;
    let periodStart = moment(selectedDate).subtract(1, 'days');
    periodStart = (periodStart.isBefore(this.interventionData.minDate)
      ? moment(this.interventionData.minDate)
      : periodStart
    ).format('YYYY-MM-DD');
    const periodEnd = moment(selectedDate)
      .add(1, 'days')
      .format('YYYY-MM-DD');
    return this.$http
      .get(
        `/dedicated/server/${this.serverName}/task/${this.upgradeTask.taskId}/availableTimeslots`,
        {
          params: {
            periodStart,
            periodEnd,
          },
        },
      )
      .then(({ data: timeslots }) => {
        this.interventionData.timeSlots = timeslots
          .filter(
            (slot) => moment(slot.startDate).date() === selectedDate.getDate(),
          )
          .map((slot) => ({
            ...slot,
            slotName: moment(slot.startDate).format('HH:mm'),
          }));
        this.interventionData.selectedSlot =
          this.interventionData.timeSlots.length > 0
            ? this.interventionData.timeSlots[0]
            : null;
      })
      .catch(() => {
        this.interventionData.timeSlots = [];
      })
      .finally(() => {
        this.loadingTimeSlots = false;
      });
  }

  orderOption() {
    this.orderInProgress = true;
    const renewDetails = this.getRenewDetails(this.selectedUpgradeOption);
    return this.$http
      .post(
        `/services/${this.optionId}/upgrade/${this.selectedUpgradeOption.planCode}/execute`,
        {
          duration: renewDetails.duration,
          pricingMode: renewDetails.pricingMode,
          quantity: 1,
        },
      )
      .then(({ data: order }) => {
        this.$window.open(order.order.url, '_blank', 'noopener');
        this.goBack(
          `${this.$translate.instant(
            'dedicated_server_dashboard_upgrade_order_success',
          )} <a href=${
            order.order.url
          } rel='noopener'>${this.$translate.instant(
            'dedicated_server_dashboard_upgrade_order_success_validate',
          )}</a>`,
        );
      })
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant(
            'dedicated_server_dashboard_upgrade_order_error',
            {
              message: error.data.message,
            },
          ),
          'server_dashboard_alert',
        );
        this.currentStep -= 1;
      })
      .finally(() => {
        this.orderInProgress = false;
      });
  }

  prepareInterventionData() {
    this.interventionData.minDate = moment()
      .add(MIN_INTERVENTION_GAP, 'days')
      .toISOString();
  }

  scheduleIntervention() {
    this.schedulingInProgress = true;
    return this.$http
      .post(
        `/dedicated/server/${this.serverName}/task/${this.upgradeTask.taskId}/schedule`,
        {
          hasPerformedBackup: true,
          wantedBeginingDate: this.interventionData.selectedSlot.startDate,
        },
      )
      .then(() => {
        const supportTicketLink = this.coreURLBuilder.buildURL(
          'dedicated',
          '#/support/tickets/:ticketId',
          {
            ticketId: this.upgradeTask.ticketReference,
          },
        );
        this.goBack(
          `${this.$translate.instant(
            'dedicated_server_dashboard_upgrade_intervention_success_message',
          )} <a rel="noopener" href="${supportTicketLink}">${this.$translate.instant(
            'dedicated_server_dashboard_upgrade_intervention_success_message_ticket',
          )}</a>`,
        );
      })
      .catch((error) => {
        this.goBack(
          this.$translate.instant(
            'dedicated_server_dashboard_upgrade_intervention_error',
            {
              message: error.data?.message || error.data,
            },
          ),
          'ERROR',
        );
      })
      .finally(() => {
        this.schedulingInProgress = false;
      });
  }
}
