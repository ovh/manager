export default class PciConnectorInputController {
  $onInit() {
    this.display = ['string', 'int64', 'int32', 'int16', 'boolean'].includes(
      this.data.type,
    );
  }
}
