import difference from 'lodash/difference';
import remove from 'lodash/remove';

export default class {
  /* @ngInject */
  constructor($q, $scope, $translate, IpDashboardReverse, Validator) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.IpDashboardReverse = IpDashboardReverse;
    this.Validator = Validator;
  }

  $onInit() {
    this.$scope.goBack = this.goBack.bind(this);

    this.$scope.model = {
      reverses: angular.copy(this.ipBlock.reverseDelegations) || [],
      currentReverse: '',
    };

    this.$scope.errors = {
      INVALID_DNS: false,
      ALREADY_EXISTS: false,
    };

    // -- Step1
    this.$scope.addReverse = () => {
      if (this.$scope.model.reverses.length < 2) {
        if (
          ~this.$scope.model.reverses.indexOf(this.$scope.model.currentReverse)
        ) {
          this.$scope.errors.ALREADY_EXISTS = true;
        } else {
          this.$scope.errors.ALREADY_EXISTS = false;
          if (
            this.Validator.isValidDomain(
              this.$scope.model.currentReverse.replace(/\.$/, ''),
            ) &&
            /\.$/.test(this.$scope.model.currentReverse)
          ) {
            this.$scope.model.reverses.push(this.$scope.model.currentReverse);
            this.$scope.model.currentReverse = '';
            this.$scope.errors.INVALID_DNS = false;
          } else {
            this.$scope.errors.INVALID_DNS = true;
          }
        }
      }
    };

    this.$scope.deleteReverse = (reverse) => {
      remove(
        this.$scope.model.reverses,
        (delegatedReverse) => reverse === delegatedReverse,
      );
    };

    // -- Step2
    this.$scope.loadStep2 = () => {
      this.$scope.reversesToAdd = difference(
        this.$scope.model.reverses,
        this.ipBlock.reverseDelegations,
      );
      this.$scope.reversesToDelete = difference(
        this.ipBlock.reverseDelegations,
        this.$scope.model.reverses,
      );
    };

    this.$scope.isValid = () => {
      this.$scope.reversesToAdd = difference(
        this.$scope.model.reverses,
        this.ipBlock.reverseDelegations,
      );
      this.$scope.reversesToDelete = difference(
        this.ipBlock.reverseDelegations,
        this.$scope.model.reverses,
      );

      return (
        (this.$scope.reversesToAdd.length ||
          this.$scope.reversesToDelete.length) &&
        (this.$scope.model.reverses.length ||
          this.ipBlock.reverseDelegations.length) &&
        this.$scope.model.reverses.filter(
          (reverse) =>
            !this.Validator.isValidDomain(reverse.replace(/\.$/, '')),
        ).length === 0
      );
    };

    this.$scope.addIpv6ReverseDelegation = () => {
      const queueToDelete = this.$scope.reversesToDelete.map((reverse) =>
        this.IpDashboardReverse.deleteDelegation(this.ipBlock.ipBlock, reverse),
      );

      this.$q
        .all(queueToDelete)
        .then(() => {
          const queueToAdd = this.$scope.reversesToAdd.map((reverse) =>
            this.IpDashboardReverse.setDelegation(
              this.ipBlock.ipBlock,
              reverse,
            ),
          );

          if (queueToAdd.length) {
            return this.$q
              .all(queueToAdd)
              .then(() =>
                this.goBack(
                  {
                    message: {
                      text: this.$translate.instant(
                        'ip_table_manage_delegation_ipv6block_success',
                      ),
                      data: 'OK',
                    },
                  },
                  { reload: true },
                ),
              )
              .catch((err) =>
                this.goBack({
                  message: {
                    text: this.$translate.instant(
                      'ip_table_manage_delegation_ipv6block_err',
                    ),
                    data: {
                      ...err,
                      type: 'ERROR',
                    },
                  },
                }),
              );
          }

          return this.goBack(
            {
              message: {
                text: this.$translate.instant(
                  'ip_table_manage_delegation_ipv6block_success',
                ),
                data: 'OK',
              },
            },
            { reload: true },
          );
        })
        .catch((err) =>
          this.goBack({
            message: {
              text: this.$translate.instant(
                'ip_table_manage_delegation_ipv6block_err',
              ),
              data: {
                ...err,
                type: 'ERROR',
              },
            },
          }),
        );
    };
  }
}
