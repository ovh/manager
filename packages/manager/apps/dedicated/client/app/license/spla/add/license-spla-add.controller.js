export default class LicenseSplaAddCtrl {
  /* @ngInject */
  constructor($state, $translate, Alerter, License) {
    this.$state = $state;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.License = License;
  }

  $onInit() {
    this.options = {
      availableServers: null,
      availableTypes: null,
    };

    this.selected = {
      serial: null,
      type: null,
      server: null,
    };
  }

  endAction(alert, message) {
    this.$state.go('^').then(() => {
      this.Alerter.alertFromSWS(alert, message);
    });
  }

  addSpla() {
    return this.License.splaAdd(this.selected.server, {
      serialNumber: this.selected.serial,
      type: this.selected.type,
    })
      .then(() => {
        this.endAction(
          this.$translate.instant('license_spla_add_success'),
          true,
        );
      })
      .catch(({ data }) => {
        this.endAction(this.$translate.instant('license_spla_add_fail'), data);
      });
  }

  load() {
    return this.License.splaAddAvailableServers()
      .then((data) => {
        this.options = data;
      })
      .catch(({ data }) => {
        this.endAction(
          this.$translate.instant('license_spla_add_step1_loading_error'),
          data,
        );
      });
  }

  loadTypes() {
    this.options.availableTypes = null;
    this.selected.type = null;
    return this.License.splaAddAvailableTypes(this.selected.server)
      .then((data) => {
        angular.extend(this.options, data);
      })
      .catch(({ data }) => {
        this.endAction(
          this.$translate.instant('license_spla_add_step1_loading_error'),
          data,
        );
      });
  }
}
