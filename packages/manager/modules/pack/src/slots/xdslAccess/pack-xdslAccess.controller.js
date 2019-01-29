import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor(
    $q,
    OvhApiPackXdslAccess,
    OvhApiXdslLines,
  ) {
    this.$q = $q;
    this.OvhApiPackXdslAccess = OvhApiPackXdslAccess;
    this.OvhApiXdslLines = OvhApiXdslLines;
  }

  $onInit() {
    this.loading = true;

    // Get service link to this access from current Pack Xdsl
    return this.OvhApiPackXdslAccess
      .Aapi()
      .query({
        packId: this.pack.packName,
      })
      .$promise
      .then((services) => {
        const serviceLines = _.map(
          services,
          service => this.OvhApiXdslLines
            .v6()
            .query({
              xdslId: service.accessName,
            })
            .$promise
            .then(lines => ({ ...service, lines })),
        );

        this.$q.all(serviceLines)
          .then((results) => {
            this.services = results;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      () => {
        this.loading = false;
      });
  }
}
