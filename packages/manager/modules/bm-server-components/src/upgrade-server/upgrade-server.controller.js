import moment from 'moment';

import {
  COMPOSITE_UPGRADE,
  MIN_INTERVENTION_GAP,
  UPGRADE_MODE,
  DEFAULT_INTERVAL,
  SUPPORT_TICKET_ID_URL,
} from './upgrade-server.constants';

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
      minDate: moment()
        .add(MIN_INTERVENTION_GAP, 'days')
        .format('YYYY-MM-DD'),
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

  hasRenewPeriod() {
    return this.renewPeriod !== DEFAULT_INTERVAL;
  }

  onInterventionDateChange([selectedDate]) {
    if (!selectedDate) return;
    if (selectedDate === this.interventionData.selectedDate) return;
    this.loadingTimeSlots = true;
    let periodStart = moment(selectedDate).subtract(1, 'days');
    periodStart = (periodStart.isBefore(this.interventionData.minDate)
      ? moment(this.interventionData.minDate)
      : periodStart
    ).format('YYYY-MM-DD');
    const periodEnd = moment(selectedDate)
      .add(1, 'days')
      .format('YYYY-MM-DD');
    this.$http
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
    const upgradePlanServiceId =
      this.selectedUpgradeOption.serviceId || this.optionId;
    return this.$http
      .post(
        `/services/${upgradePlanServiceId}/upgrade/${this.selectedUpgradeOption.planCode}/execute`,
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
          } rel='noopener' target="_top">${this.$translate.instant(
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
        const supportTicketLink = SUPPORT_TICKET_ID_URL.replace('{ticketId}');
        this.goBack(
          `${this.$translate.instant(
            'dedicated_server_dashboard_upgrade_intervention_success_message',
          )} <a rel="noopener" target="_blank" href="${supportTicketLink}">${this.$translate.instant(
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
