import map from 'lodash/map';

export default class ModemsController {
  /* @ngInject */
  constructor(
    OvhApiXdsl,
  ) {
    this.OvhApiXdsl = OvhApiXdsl;
  }

  loadRow({ spare }) {
    return this.OvhApiXdsl
      .Spare()
      .v6()
      .getSpare({ spare })
      .$promise;
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
