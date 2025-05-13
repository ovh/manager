export default class {
  $onInit() {
    if (this.model.receivers) {
      this.receivers = this.receivers.map((receiver) => ({
        ...receiver,
        isSelected: this.model.receivers.some(
          ({ slotId }) => slotId === receiver.slotId,
        ),
      }));
    }
  }

  confirmSelection() {
    this.model.receivers = this.receivers.filter(
      ({ isSelected }) => isSelected,
    );
    return this.goBack();
  }

  static hasSelectedReceivers(receivers) {
    return receivers.some(({ isSelected }) => isSelected);
  }
}
