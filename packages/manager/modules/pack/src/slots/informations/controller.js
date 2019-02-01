import head from 'lodash/head';
import moment from 'moment';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    OvhApiPackXdsl,
    OvhApiXdsl,
    TucToast,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.OvhApiXdsl = OvhApiXdsl;
    this.TucToast = TucToast;
  }

  getResiliationFollowUp() {
    return this.OvhApiPackXdsl
      .v6()
      .resiliationFollowUp({
        packName: this.pack.packName,
      })
      .$promise
      .catch(err => (err.status === 404 ? this.$q.when(null) : this.$q.reject(err)));
  }

  getIsResiliationCancellable() {
    return this.OvhApiPackXdsl
      .Resiliation()
      .v6()
      .canCancelResiliation({
        packName: this.pack.packName,
      }, null)
      .$promise
      .then(result => result.value);
  }

  getAssociatedLine() {
    return this.OvhApiPackXdsl
      .Access()
      .v6()
      .getServices({
        packId: this.pack.packName,
      })
      .$promise
      .then(access => this.OvhApiXdsl
        .Lines()
        .v6()
        .query({
          xdslId: head(access),
        })
        .$promise
        .then(lines => head(lines)));
  }

  $onInit() {
    this.loading = true;

    return this.$q
      .all({
        followUp: this.getResiliationFollowUp(),
        cancellable: this.getIsResiliationCancellable(),
        associatedLine: this.getAssociatedLine(),
      })
      .then(({ followUp, cancellable, associatedLine }) => {
        this.resiliationFollowUp = followUp;
        this.isCancellable = cancellable;
        this.associatedLine = associatedLine;
        this.isEngaged = moment(this.pack.informations.engagedUpTo).isAfter(moment());
      })
      .catch((err) => {
        if (err.status !== 460 && err.status !== 403) {
          this.TucToast.error([
            this.$translate.instant('pack_xdsl_oops_an_error_is_occured'),
            err.data ? err.data.message : '',
          ].join(' '));
        }
        return this.$q.reject(err);
      }).finally(() => {
        this.loading = false;
      });
  }
}
