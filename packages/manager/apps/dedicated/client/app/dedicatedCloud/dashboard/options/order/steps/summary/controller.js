export default class DedicatedCloudservicePackSmsActivation {
  /* @ngInject */
  constructor(
    $q,
    $state,
    OvhApiOrder,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.OvhApiOrder = OvhApiOrder;
  }

  $onInit() {
    this.currentService = this.stepper.memorizedStateParams.currentService;
    this.servicePackToOrder = this.stepper.memorizedStateParams.servicePackToOrder;

    if (this.servicePackToOrder == null) {
      return this.stepper.exit();
    }

    return this.placeOrder();
  }
}
