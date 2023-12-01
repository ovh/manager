export default class UpgradeTask {
  constructor({
    comment,
    doneDate,
    function: type,
    lastUpdate,
    needSchedule,
    note,
    plannedIntervention,
    startDate,
    status,
    taskId,
    ticketReference,
  }) {
    const components = note
      ? note.split(',').map((component) => component.trim())
      : [];
    Object.assign(this, {
      comment,
      components,
      doneDate,
      lastUpdate,
      needSchedule,
      note,
      plannedIntervention,
      startDate,
      status,
      taskId,
      ticketReference,
      type,
    });
  }

  get scheduledTimeSlot() {
    return this.plannedIntervention?.wantedStartDate;
  }

  isTaskInitialized() {
    return !!this.components.length;
  }

  isComponentIncluded(componentType) {
    return this.components.includes(componentType);
  }

  isUpgradeScheduled(componentType) {
    return this.isComponentIncluded(componentType) && !this.needSchedule;
  }

  shouldScheduleUpgrade(componentType) {
    return this.isComponentIncluded(componentType) && this.needSchedule;
  }
}
