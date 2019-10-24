import map from 'lodash/map';

export default class ModemsController {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    OvhApiXdsl,
    TucToast,
    TucToastError,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.OvhApiXdsl = OvhApiXdsl;
    this.TucToast = TucToast;
    this.TucToastError = TucToastError;
  }

  loadRow({ spare }) {
    return this.OvhApiXdsl
      .Spare()
      .v6()
      .getSpare({ spare })
      .$promise;
  }

  orderNewModem() {
    return this.$state.go('spare.modems.order');
  }

  refresh() {
    this.modems = null;

    // reset cache to force reload
    this.OvhApiXdsl.Spare().v6().resetAllCache();

    return this.OvhApiXdsl.Spare()
      .v6()
      .query()
      .$promise.then((modems) => {
        this.modems = map(modems, spare => ({ spare }));
      });
  }
}
