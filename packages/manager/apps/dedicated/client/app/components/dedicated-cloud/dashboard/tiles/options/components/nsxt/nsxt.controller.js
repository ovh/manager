import set from 'lodash/set';

export default class OptionsNsxtCtrl {
  /* @ngInject */
  constructor($q, optionsNsxtService) {
    this.$q = $q;
    this.optionsNsxtService = optionsNsxtService;
  }

  $onInit() {
    this.loading = true;
    this.optionsNsxtService
      .getOptionNsxt(this.currentService.name)
      .then((optionNsxt) => {
        this.optionNsxt = optionNsxt;
        if (this.optionNsxt.state === 'enabled') {
          this.$q
            .all(
              this.optionNsxt.datacentersState
                .filter((datacenter) => datacenter.state === 'enabled')
                .map((datacenter) =>
                  this.optionsNsxtService
                    .dataCenterName(this.currentService.name, datacenter.id)
                    .then((value) => {
                      set(datacenter, 'name', value);
                    }),
                ),
            )
            .then(() => {
              this.loading = false;
            });
        } else {
          this.loading = false;
        }
      });
  }
}
