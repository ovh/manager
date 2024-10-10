import { NOTIFICATION_TYPE } from './constants';

export default class NotificationsController {
  /* @ngInject */
  constructor(coreConfig) {
    this.incident = undefined;
    this.maintenances = [];

    this.dateTimeFormat = new Intl.DateTimeFormat(
      coreConfig.getUserLocale().replace('_', '-'),
      {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      },
    );
  }

  $onInit() {
    // If there is incident, display the incident with the earlier date time
    this.incident = this.notifications
      .filter(
        (notification) => notification.type === NOTIFICATION_TYPE.INCIDENT,
      )
      .reduce((earliestIncident, currentIncident) => {
        const currentIncidentFormatted = {
          ...currentIncident,
          startDateFormatted: this.dateTimeFormat.format(
            new Date(currentIncident.startDate),
          ),
        };

        if (!earliestIncident) {
          return currentIncidentFormatted;
        }

        if (currentIncident.startDate < earliestIncident.startDate) {
          return currentIncidentFormatted;
        }

        return earliestIncident;
      }, null);

    // Sort all maintenances with the earlier start date time first
    this.maintenances = this.notifications
      .filter(
        (notification) => notification.type === NOTIFICATION_TYPE.MAINTENANCE,
      )
      .sort(
        (maintenanceA, maintenanceB) =>
          new Date(maintenanceA.startDate) - new Date(maintenanceB.startDate),
      )
      .map((maintenance) => ({
        ...maintenance,
        startDateFormatted: this.dateTimeFormat.format(
          new Date(maintenance.startDate),
        ),
        endDateFormatted: this.dateTimeFormat.format(
          new Date(maintenance.endDate),
        ),
      }));
  }
}
