import get from 'lodash/get';

angular.module('App').controller(
  'DedicatedServerRendezVousCtrl',
  class DedicatedServerRendezVousCtrl {
    constructor($q, $state, $stateParams, ovhUserPref) {
      this.$q = $q;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.ovhUserPref = ovhUserPref;
      this.stopBother = false;
      this.serversRendezVousToStopBother = [];
    }

    $onInit() {
      return this.ovhUserPref
        .getValue('SERVER_RENDEZVOUS_STOP_BOTHER')
        .then((data) => {
          this.serversRendezVousToStopBother = data;
        })
        .catch((err) => {
          if (get(err, 'status') === 404) {
            this.serversRendezVousToStopBother = [];
          }
        });
    }

    setStopBother() {
      if (this.stopBother) {
        this.serversRendezVousToStopBother.push(this.$stateParams.productId);
        return this.ovhUserPref.assign(
          'SERVER_RENDEZVOUS_STOP_BOTHER',
          this.serversRendezVousToStopBother,
        );
      }
      return this.$q.when(true);
    }

    onDismiss() {
      this.setStopBother().finally(() => {
        this.$state.go('^');
      });
    }
  },
);
