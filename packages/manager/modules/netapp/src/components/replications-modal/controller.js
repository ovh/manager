export default class ReplicationsModalCtrl {
  constructor($state) {
    this.$state = $state;
    this.onLoad = false;
  }

  primaryAction() {
    this.onLoad = true;
    this.onPrimaryClick().finally(() => {
      this.onLoad = false;
    });
  }

  goToReplications() {
    this.$state.go('netapp.dashboard.replications');
  }
}
