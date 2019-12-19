import get from 'lodash/get';

angular.module('App')
  .controller('DedicatedServerInterventionCtrl', class DedicatedServerInterventionCtrl {
    constructor($stateParams, $translate, Alerter, Server) {
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Server = Server;
    }

    $onInit() {
      this.isLoading = false;
    }

    loadInterventions({ offset, pageSize }) {
      this.isLoading = true;

      return this.Server
        .getInterventions(this.$stateParams.productId, pageSize, offset)
        .then((interventions) => ({
          data: get(interventions, 'list.results'),
          meta: {
            totalCount: interventions.count,
          },
        }))
        .catch((err) => {
          this.Alerter.alertFromSWS(this.$translate.instant('server_configuration_intervention_error'), err, 'server_tab_interventions_alert');
          return {
            data: [],
            meta: {
              totalCount: 0,
            },
          };
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  });
