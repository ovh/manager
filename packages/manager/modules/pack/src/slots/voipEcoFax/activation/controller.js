import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { ECOFAX_URL } from './constants';

export default class {
  /* @ngInject */
  constructor(
    $stateParams,
    OvhApiPackXdsl,
    OvhApiPackXdslVoipEcofax,
  ) {
    this.$stateParams = $stateParams;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.OvhApiPackXdslVoipEcofax = OvhApiPackXdslVoipEcofax;

    this.ecoFaxUrl = ECOFAX_URL;
  }

  $onInit() {
    this.packId = this.$stateParams.packName;

    if (isEmpty(this.packId)) {
      this.error = {
        key: 'fax_activation_total_error',
      };
    } else {
      return this.OvhApiPackXdsl
        .v6()
        .getServices({ packId: this.packId }, (data) => {
          this.loading = false;
          this.serviceData = find(data, { name: 'voipEcoFax' });
          this.error = null;
        }, (err) => {
          this.loading = false;
          this.message = null;
          this.error = {
            key: `error_${err.status}`,
            data: err.data,
          };
        });
    }
    return this;
  }

  activateFax() {
    this.loading = true;
    this.error = null;

    return this.OvhApiPackXdslVoipEcofax
      .v6()
      .save({ packId: this.packId }, null, () => {
        this.loading = false;
        this.serviceData.available -= 1;
        this.serviceData.inCreation += 1;
        this.message = 'fax_activation_widget_success';
      }, (err) => {
        this.loading = false;
        this.message = null;
        this.error = {
          key: `error_${err.status}`,
          data: err.data,
        };
      });
  }
}
